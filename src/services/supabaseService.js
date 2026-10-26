// // src/services/supabaseService.js
import { supabase } from '../supabaseClient';

export async function signUpUser({ email, password, name, role }) {
    const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { name, role } },
    });
    if (error) throw error;

    if (data.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
            id: data.user.id,
            email: data.user.email,
            name,
            role,
        }, { onConflict: 'id' });
        if (profileError) throw profileError;
    }
    return data;
}

export async function signInUser(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
    });
    if (error) throw error;
    return data;
}

// ==========================================
// 1. CASES MANAGEMENT
// ==========================================

// Fetch all cases ordered by newest first
export async function getCases() {
    const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching cases:', error.message);
        return [];
    }
    return data;
}

// Create a new case record
export async function createCase(newCase) {
    const { data, error } = await supabase
        .from('cases')
        .insert([newCase])
        .select();

    if (error) {
        console.error('Error creating case:', error.message);
        return null;
    }
    return data[0];
}

// ==========================================
// 2. PROFILES MANAGEMENT
// ==========================================

// Fetch a user's profile by ID
export async function getUserProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error.message);
        return null;
    }
    return data;
}

// Fetch user profile by email or ID for login
export async function getProfileByIdOrEmail(identifier) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`email.eq.${identifier},id.eq.${identifier}`)
        .maybeSingle();

    if (error) {
        console.error('Error fetching profile for login:', error.message);
        return null;
    }
    return data;
}

// Create a new user profile upon signup
export async function createUserProfile(profileData) {
    const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select();

    if (error) {
        console.error('Error creating profile in Supabase:', error.message);
        return null;
    }
    return data[0];
}

// Update user profile in Supabase
export async function updateProfile(userId, profileData) {
    const { data, error } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            ...profileData
        })
        .select();

    if (error) {
        console.error('Error updating profile:', error.message);
        return null;
    }
    return data[0];
}

// ==========================================
// 3. SETTINGS MANAGEMENT
// ==========================================

// Fetch user settings by user_id
export async function getUserSettings(userId) {
    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

    if (error) {
        console.error('Error fetching settings:', error.message);
        return null;
    }
    return data;
}

// Save or update user settings (Upsert)
export async function updateUserSettings(userId, ruleSensitivity, themePrefs) {
    const { data, error } = await supabase
        .from('settings')
        .upsert({
            user_id: userId,
            rule_sensitivity: ruleSensitivity,
            theme_prefs: themePrefs
        }, { onConflict: 'user_id' })
        .select();

    if (error) {
        console.error('Error updating settings:', error.message);
        return null;
    }
    return data[0];
}

// ==========================================
// 4. GRAPH NODES & EDGES (TEAMMATE WORK)
// ==========================================

export async function fetchNodes() {
    const { data, error } = await supabase.from('nodes').select('*');
    if (error) {
        console.error('Error fetching nodes:', error.message);
        return [];
    }
    return data;
}

export async function fetchEdges() {
    const { data, error } = await supabase.from('edges').select('*');
    if (error) {
        console.error('Error fetching edges:', error.message);
        return [];
    }
    return data;
}
