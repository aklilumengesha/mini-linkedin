const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// Test route to verify router is working
router.get("/test", (req, res) => {
  res.json({
    message: "Users router is working!",
    timestamp: new Date().toISOString(),
  });
});

// Get all users (for testing)
router.get("/", async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      message: "Users fetched successfully",
      count: users.length,
      users: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: error.message });
  }
});

// Search users
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const searchQuery = q.trim();

    // Search users by name (case-insensitive using ilike)
    const { data: users, error } = await supabase
      .from('users')
      .select('firebase_uid, name, headline, bio, profile_picture')
      .ilike('name', `%${searchQuery}%`)
      .limit(10);

    if (error) {
      console.error("Error searching users:", error);
      return res.status(500).json({ message: "Failed to search users" });
    }

    // Handle null or undefined results
    if (!users || !Array.isArray(users)) {
      return res.json([]);
    }

    // Transform to match frontend expectations (convert snake_case to camelCase)
    const transformedUsers = users.map(user => ({
      firebaseUid: user.firebase_uid,
      name: user.name,
      headline: user.headline,
      bio: user.bio,
      profilePicture: user.profile_picture
    }));

    res.json(transformedUsers);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Failed to search users" });
  }
});

// Get user profile
router.get("/:firebaseUid", async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', req.params.firebaseUid)
      .maybeSingle(); // Use maybeSingle() instead of single()

    if (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: error.message });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Transform to camelCase for frontend compatibility
    const transformedUser = {
      firebaseUid: user.firebase_uid,
      email: user.email,
      name: user.name,
      bio: user.bio,
      headline: user.headline,
      profilePicture: user.profile_picture,
      isProfileComplete: user.is_profile_complete,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };

    res.json(transformedUser);
  } catch (error) {
    console.error("Error in GET user:", error);
    res.status(500).json({ message: error.message });
  }
});

// Create or update user profile
router.post("/", async (req, res) => {
  try {
    const { firebaseUid, email, name, bio, headline, profilePicture } = req.body;

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', firebaseUid)
      .single();

    let user;

    if (existingUser) {
      // Update existing user
      const { data, error } = await supabase
        .from('users')
        .update({
          name: name || existingUser.name,
          bio: bio !== undefined ? bio : existingUser.bio,
          headline: headline !== undefined ? headline : existingUser.headline,
          profile_picture: profilePicture !== undefined ? profilePicture : existingUser.profile_picture,
          updated_at: new Date().toISOString()
        })
        .eq('firebase_uid', firebaseUid)
        .select()
        .single();

      if (error) throw error;
      user = data;
    } else {
      // Create new user
      const { data, error } = await supabase
        .from('users')
        .insert([{
          firebase_uid: firebaseUid,
          email: email,
          name: name || "",
          bio: bio || "",
          headline: headline || "",
          profile_picture: profilePicture || "",
          is_profile_complete: false
        }])
        .select()
        .single();

      if (error) throw error;
      user = data;
    }

    // Transform to camelCase
    const transformedUser = {
      firebaseUid: user.firebase_uid,
      email: user.email,
      name: user.name,
      bio: user.bio,
      headline: user.headline,
      profilePicture: user.profile_picture,
      isProfileComplete: user.is_profile_complete,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };

    res.status(201).json(transformedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Complete profile endpoint
router.post("/complete-profile", async (req, res) => {
  try {
    const { firebaseUid, name, headline, bio, profilePicture } = req.body;

    if (!name || !headline || !bio || !profilePicture) {
      return res.status(400).json({
        message: "All fields are required: name, headline, bio, and profile picture",
      });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update({
        name,
        headline,
        bio,
        profile_picture: profilePicture,
        is_profile_complete: true,
        updated_at: new Date().toISOString()
      })
      .eq('firebase_uid', firebaseUid)
      .select()
      .single();

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({ message: "User not found" });
    }
    if (error) throw error;

    // Transform to camelCase
    const transformedUser = {
      firebaseUid: user.firebase_uid,
      email: user.email,
      name: user.name,
      bio: user.bio,
      headline: user.headline,
      profilePicture: user.profile_picture,
      isProfileComplete: user.is_profile_complete,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };

    res.json(transformedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user profile
router.put("/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const updates = req.body;

    // Transform camelCase to snake_case for database
    const dbUpdates = {};
    const fieldMap = {
      name: 'name',
      bio: 'bio',
      headline: 'headline',
      profilePicture: 'profile_picture',
      isProfileComplete: 'is_profile_complete'
    };

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined && fieldMap[key]) {
        dbUpdates[fieldMap[key]] = updates[key];
      }
    });

    dbUpdates.updated_at = new Date().toISOString();

    const { data: user, error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('firebase_uid', firebaseUid)
      .select()
      .single();

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({ message: "User not found" });
    }
    if (error) throw error;

    // Transform to camelCase
    const transformedUser = {
      firebaseUid: user.firebase_uid,
      email: user.email,
      name: user.name,
      bio: user.bio,
      headline: user.headline,
      profilePicture: user.profile_picture,
      isProfileComplete: user.is_profile_complete,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };

    res.json(transformedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
