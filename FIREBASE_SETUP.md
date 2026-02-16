# Firebase Authentication Setup Guide

## ⚠️ IMPORTANT: You need to enable Authentication in Firebase Console

### Steps to Enable Firebase Authentication:

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Create or select your project

2. **Enable Authentication**
   - In the left sidebar, click "Authentication"
   - Click "Get started" button
   - Go to "Sign-in method" tab

3. **Enable Email/Password Provider**
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

4. **Get Your Configuration**
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Copy your Firebase configuration
   - Update `src/lib/firebase.js` with your values

### Current Status:
✅ Firebase config structure is ready
❌ **You need to add your Firebase credentials**
❌ **You need to enable Authentication in Firebase Console**

### After enabling Authentication:
1. Try signing up again
2. The error should be resolved
3. You should be able to create accounts and login

### Testing:
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill in your details
4. Submit the form
5. Should work without errors

If you still get errors after enabling Authentication, check:
- Make sure Email/Password provider is enabled
- Verify your Firebase configuration is correct
- Check that you're using the correct API key
