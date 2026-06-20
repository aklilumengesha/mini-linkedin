const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const { v4: uuidv4 } = require("uuid");

// Helper function to convert snake_case to camelCase
const toCamelCase = (obj) => {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (typeof obj !== "object") return obj;

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = toCamelCase(obj[key]);
    return acc;
  }, {});
};

// Helper function to convert camelCase to snake_case
const toSnakeCase = (obj) => {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (typeof obj !== "object") return obj;

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    acc[snakeKey] = toSnakeCase(obj[key]);
    return acc;
  }, {});
};

// Get all posts or posts by user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    let query = supabase
      .from("posts")
      .select(`
        *,
        post_media (*),
        post_likes (id, user_id, user_name, created_at),
        post_comments (id, content, author_id, author_name, author_avatar, created_at, updated_at),
        post_shares (id, user_id, user_name, created_at)
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    if (userId) {
      query = query.eq("author_id", userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching posts:", error);
      return res.status(500).json({ message: "Failed to fetch posts" });
    }

    // Transform data to match frontend expectations
    const transformedPosts = (data || []).map((post) => ({
      _id: post.id,
      postId: post.post_id,
      content: post.content,
      authorId: post.author_id,
      authorName: post.author_name,
      media: (post.post_media || []).map((m) => ({
        type: m.type,
        url: m.url,
        name: m.name,
        publicId: m.public_id,
        size: m.size,
        resourceType: m.resource_type,
      })),
      likes: (post.post_likes || []).map((l) => ({
        userId: l.user_id,
        userName: l.user_name,
        timestamp: l.created_at,
      })),
      comments: (post.post_comments || []).map((c) => ({
        _id: c.id,
        content: c.content,
        authorId: c.author_id,
        authorName: c.author_name,
        authorAvatar: c.author_avatar,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      })),
      shares: (post.post_shares || []).map((s) => ({
        userId: s.user_id,
        userName: s.user_name,
        timestamp: s.created_at,
      })),
      likeCount: post.like_count || 0,
      commentCount: post.comment_count || 0,
      shareCount: post.share_count || 0,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    }));

    res.json(transformedPosts);
  } catch (error) {
    console.error("Error in posts GET:", error);
    res.status(500).json({ message: error.message });
  }
});

// Search posts by content
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const searchQuery = q.trim();

    // Search posts by content (case-insensitive using ilike)
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        post_media (*),
        post_likes (id, user_id, user_name, created_at),
        post_comments (id, content, author_id, author_name, author_avatar, created_at, updated_at),
        post_shares (id, user_id, user_name, created_at)
      `)
      .ilike("content", `%${searchQuery}%`)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error searching posts:", error);
      return res.status(500).json({ message: "Failed to search posts" });
    }

    // Transform data to match frontend expectations
    const transformedPosts = (data || []).map((post) => ({
      _id: post.id,
      postId: post.post_id,
      content: post.content,
      authorId: post.author_id,
      authorName: post.author_name,
      media: (post.post_media || []).map((m) => ({
        type: m.type,
        url: m.url,
        name: m.name,
        publicId: m.public_id,
        size: m.size,
        resourceType: m.resource_type,
      })),
      likes: (post.post_likes || []).map((l) => ({
        userId: l.user_id,
        userName: l.user_name,
        timestamp: l.created_at,
      })),
      comments: (post.post_comments || []).map((c) => ({
        _id: c.id,
        content: c.content,
        authorId: c.author_id,
        authorName: c.author_name,
        authorAvatar: c.author_avatar,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      })),
      shares: (post.post_shares || []).map((s) => ({
        userId: s.user_id,
        userName: s.user_name,
        timestamp: s.created_at,
      })),
      likeCount: post.like_count || 0,
      commentCount: post.comment_count || 0,
      shareCount: post.share_count || 0,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    }));

    res.json(transformedPosts);
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).json({ message: "Failed to search posts" });
  }
});

// Get single post by postId
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        post_media (*),
        post_likes (id, user_id, user_name, created_at),
        post_comments (id, content, author_id, author_name, author_avatar, created_at, updated_at),
        post_shares (id, user_id, user_name, created_at)
      `)
      .eq("post_id", postId)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Transform data to match frontend expectations
    const transformedPost = {
      _id: data.id,
      postId: data.post_id,
      content: data.content,
      authorId: data.author_id,
      authorName: data.author_name,
      media: (data.post_media || []).map((m) => ({
        type: m.type,
        url: m.url,
        name: m.name,
        publicId: m.public_id,
        size: m.size,
        resourceType: m.resource_type,
      })),
      likes: (data.post_likes || []).map((l) => ({
        userId: l.user_id,
        userName: l.user_name,
        timestamp: l.created_at,
      })),
      comments: (data.post_comments || []).map((c) => ({
        _id: c.id,
        content: c.content,
        authorId: c.author_id,
        authorName: c.author_name,
        authorAvatar: c.author_avatar,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      })),
      shares: (data.post_shares || []).map((s) => ({
        userId: s.user_id,
        userName: s.user_name,
        timestamp: s.created_at,
      })),
      likeCount: data.like_count || 0,
      commentCount: data.comment_count || 0,
      shareCount: data.share_count || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    res.json(transformedPost);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Failed to fetch post" });
  }
});

// Create a new post
router.post("/", async (req, res) => {
  try {
    const { content, authorId, authorName, media } = req.body;

    if (!content || !authorId || !authorName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Generate unique postId
    const postId = uuidv4();

    // Insert post
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert({
        post_id: postId,
        content: content.trim(),
        author_id: authorId,
        author_name: authorName,
        like_count: 0,
        comment_count: 0,
        share_count: 0,
      })
      .select()
      .single();

    if (postError) {
      console.error("Error creating post:", postError);
      return res.status(400).json({ message: "Failed to create post" });
    }

    // Insert media if provided
    let mediaData = [];
    if (media && Array.isArray(media) && media.length > 0) {
      const mediaRecords = media.map((m) => ({
        post_id: postData.id,
        type: m.type,
        url: m.url,
        name: m.name,
        public_id: m.publicId || null,
        size: m.size || null,
        resource_type: m.resourceType || null,
      }));

      const { data: insertedMedia, error: mediaError } = await supabase
        .from("post_media")
        .insert(mediaRecords)
        .select();

      if (mediaError) {
        console.error("Error inserting media:", mediaError);
      } else {
        mediaData = insertedMedia || [];
      }
    }

    // Transform response to match frontend expectations
    const transformedPost = {
      _id: postData.id,
      postId: postData.post_id,
      content: postData.content,
      authorId: postData.author_id,
      authorName: postData.author_name,
      media: mediaData.map((m) => ({
        type: m.type,
        url: m.url,
        name: m.name,
        publicId: m.public_id,
        size: m.size,
        resourceType: m.resource_type,
      })),
      likes: [],
      comments: [],
      shares: [],
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      createdAt: postData.created_at,
      updatedAt: postData.updated_at,
    };

    res.status(201).json(transformedPost);
  } catch (error) {
    console.error("Error in post creation:", error);
    res.status(400).json({ message: error.message });
  }
});

// Like/Unlike post
router.post("/:postId/like", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, userName } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({ message: "Missing user information" });
    }

    // Get post by post_id
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id, post_id, like_count")
      .eq("post_id", postId)
      .single();

    if (postError || !post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user already liked the post
    const { data: existingLike, error: likeCheckError } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", post.id)
      .eq("user_id", userId)
      .maybeSingle();

    if (likeCheckError) {
      console.error("Error checking like:", likeCheckError);
      return res.status(500).json({ message: "Failed to check like status" });
    }

    let liked = false;
    let newLikeCount = post.like_count || 0;

    if (existingLike) {
      // Unlike the post
      const { error: deleteError } = await supabase
        .from("post_likes")
        .delete()
        .eq("id", existingLike.id);

      if (deleteError) {
        console.error("Error deleting like:", deleteError);
        return res.status(500).json({ message: "Failed to unlike post" });
      }

      newLikeCount = Math.max(0, newLikeCount - 1);
      liked = false;
    } else {
      // Like the post
      const { error: insertError } = await supabase
        .from("post_likes")
        .insert({
          post_id: post.id,
          user_id: userId,
          user_name: userName,
        });

      if (insertError) {
        console.error("Error inserting like:", insertError);
        return res.status(500).json({ message: "Failed to like post" });
      }

      newLikeCount += 1;
      liked = true;
    }

    // Update like count
    const { error: updateError } = await supabase
      .from("posts")
      .update({ like_count: newLikeCount })
      .eq("id", post.id);

    if (updateError) {
      console.error("Error updating like count:", updateError);
    }

    // Get all likes for this post
    const { data: allLikes } = await supabase
      .from("post_likes")
      .select("user_id, user_name, created_at")
      .eq("post_id", post.id);

    const transformedLikes = (allLikes || []).map((l) => ({
      userId: l.user_id,
      userName: l.user_name,
      timestamp: l.created_at,
    }));

    res.json({
      liked,
      likeCount: newLikeCount,
      likes: transformedLikes,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Failed to toggle like" });
  }
});

// Add comment to post
router.post("/:postId/comment", async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, authorId, authorName, authorAvatar } = req.body;

    if (!content || !authorId || !authorName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get post by post_id
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id, post_id, comment_count")
      .eq("post_id", postId)
      .single();

    if (postError || !post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Insert comment
    const { data: newComment, error: commentError } = await supabase
      .from("post_comments")
      .insert({
        post_id: post.id,
        content: content.trim(),
        author_id: authorId,
        author_name: authorName,
        author_avatar: authorAvatar || null,
      })
      .select()
      .single();

    if (commentError) {
      console.error("Error adding comment:", commentError);
      return res.status(500).json({ message: "Failed to add comment" });
    }

    // Update comment count
    const newCommentCount = (post.comment_count || 0) + 1;
    const { error: updateError } = await supabase
      .from("posts")
      .update({ comment_count: newCommentCount })
      .eq("id", post.id);

    if (updateError) {
      console.error("Error updating comment count:", updateError);
    }

    // Transform response
    const transformedComment = {
      _id: newComment.id,
      content: newComment.content,
      authorId: newComment.author_id,
      authorName: newComment.author_name,
      authorAvatar: newComment.author_avatar,
      createdAt: newComment.created_at,
      updatedAt: newComment.updated_at,
    };

    res.status(201).json({
      comment: transformedComment,
      commentCount: newCommentCount,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
});

// Delete comment
router.delete("/:postId/comment/:commentId", async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req.body;

    // Get post by post_id
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id, post_id, comment_count, author_id")
      .eq("post_id", postId)
      .single();

    if (postError || !post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Get comment
    const { data: comment, error: commentError } = await supabase
      .from("post_comments")
      .select("id, author_id")
      .eq("id", commentId)
      .eq("post_id", post.id)
      .single();

    if (commentError || !comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user owns the comment or the post
    if (comment.author_id !== userId && post.author_id !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    // Delete comment
    const { error: deleteError } = await supabase
      .from("post_comments")
      .delete()
      .eq("id", commentId);

    if (deleteError) {
      console.error("Error deleting comment:", deleteError);
      return res.status(500).json({ message: "Failed to delete comment" });
    }

    // Update comment count
    const newCommentCount = Math.max(0, (post.comment_count || 0) - 1);
    const { error: updateError } = await supabase
      .from("posts")
      .update({ comment_count: newCommentCount })
      .eq("id", post.id);

    if (updateError) {
      console.error("Error updating comment count:", updateError);
    }

    res.json({ commentCount: newCommentCount });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
});

// Share post
router.post("/:postId/share", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, userName } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({ message: "Missing user information" });
    }

    // Get post by post_id
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id, post_id, share_count")
      .eq("post_id", postId)
      .single();

    if (postError || !post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user already shared the post
    const { data: existingShare } = await supabase
      .from("post_shares")
      .select("id")
      .eq("post_id", post.id)
      .eq("user_id", userId)
      .maybeSingle();

    let newShareCount = post.share_count || 0;

    if (!existingShare) {
      // Add share
      const { error: insertError } = await supabase
        .from("post_shares")
        .insert({
          post_id: post.id,
          user_id: userId,
          user_name: userName,
        });

      if (insertError) {
        console.error("Error inserting share:", insertError);
        return res.status(500).json({ message: "Failed to share post" });
      }

      newShareCount += 1;

      // Update share count
      const { error: updateError } = await supabase
        .from("posts")
        .update({ share_count: newShareCount })
        .eq("id", post.id);

      if (updateError) {
        console.error("Error updating share count:", updateError);
      }
    }

    // Generate shareable URL
    const shareUrl = `${req.protocol}://${req.get("host")}/post/${postId}`;

    res.json({
      shared: true,
      shareCount: newShareCount,
      shareUrl,
    });
  } catch (error) {
    console.error("Error sharing post:", error);
    res.status(500).json({ message: "Failed to share post" });
  }
});

// Get post likes
router.get("/:postId/likes", async (req, res) => {
  try {
    const { postId } = req.params;

    // Get post by post_id
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id")
      .eq("post_id", postId)
      .single();

    if (postError || !post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Get all likes
    const { data: likes, error: likesError } = await supabase
      .from("post_likes")
      .select("user_id, user_name, created_at")
      .eq("post_id", post.id);

    if (likesError) {
      console.error("Error fetching likes:", likesError);
      return res.status(500).json({ message: "Failed to fetch likes" });
    }

    const transformedLikes = (likes || []).map((l) => ({
      userId: l.user_id,
      userName: l.user_name,
      timestamp: l.created_at,
    }));

    res.json(transformedLikes);
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ message: "Failed to fetch likes" });
  }
});

// Get post comments
router.get("/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;

    // Get post by post_id
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id")
      .eq("post_id", postId)
      .single();

    if (postError || !post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Get all comments
    const { data: comments, error: commentsError } = await supabase
      .from("post_comments")
      .select("id, content, author_id, author_name, author_avatar, created_at, updated_at")
      .eq("post_id", post.id)
      .order("created_at", { ascending: true });

    if (commentsError) {
      console.error("Error fetching comments:", commentsError);
      return res.status(500).json({ message: "Failed to fetch comments" });
    }

    const transformedComments = (comments || []).map((c) => ({
      _id: c.id,
      content: c.content,
      authorId: c.author_id,
      authorName: c.author_name,
      authorAvatar: c.author_avatar,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    }));

    res.json(transformedComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

// Update/Edit a post
router.put("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, content } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get post by post_id
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id, post_id, author_id")
      .eq("post_id", postId)
      .single();

    if (postError || !post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user owns the post
    if (post.author_id !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this post" });
    }

    // Update post
    const { data: updatedPost, error: updateError } = await supabase
      .from("posts")
      .update({
        content: content.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", post.id)
      .select(`
        *,
        post_media (*),
        post_likes (id, user_id, user_name, created_at),
        post_comments (id, content, author_id, author_name, author_avatar, created_at, updated_at),
        post_shares (id, user_id, user_name, created_at)
      `)
      .single();

    if (updateError) {
      console.error("Error updating post:", updateError);
      return res.status(500).json({ message: "Failed to update post" });
    }

    // Transform response
    const transformedPost = {
      _id: updatedPost.id,
      postId: updatedPost.post_id,
      content: updatedPost.content,
      authorId: updatedPost.author_id,
      authorName: updatedPost.author_name,
      media: (updatedPost.post_media || []).map((m) => ({
        type: m.type,
        url: m.url,
        name: m.name,
        publicId: m.public_id,
        size: m.size,
        resourceType: m.resource_type,
      })),
      likes: (updatedPost.post_likes || []).map((l) => ({
        userId: l.user_id,
        userName: l.user_name,
        timestamp: l.created_at,
      })),
      comments: (updatedPost.post_comments || []).map((c) => ({
        _id: c.id,
        content: c.content,
        authorId: c.author_id,
        authorName: c.author_name,
        authorAvatar: c.author_avatar,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      })),
      shares: (updatedPost.post_shares || []).map((s) => ({
        userId: s.user_id,
        userName: s.user_name,
        timestamp: s.created_at,
      })),
      likeCount: updatedPost.like_count || 0,
      commentCount: updatedPost.comment_count || 0,
      shareCount: updatedPost.share_count || 0,
      createdAt: updatedPost.created_at,
      updatedAt: updatedPost.updated_at,
    };

    res.json(transformedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Failed to update post" });
  }
});

// Delete a post by postId
router.delete("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Get post by post_id
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id, post_id, author_id")
      .eq("post_id", postId)
      .single();

    if (postError || !post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user owns the post
    if (post.author_id !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    // Delete post (cascading will delete related media, likes, comments, shares)
    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", post.id);

    if (deleteError) {
      console.error("Error deleting post:", deleteError);
      return res.status(500).json({ message: "Failed to delete post" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Failed to delete post" });
  }
});

module.exports = router;
