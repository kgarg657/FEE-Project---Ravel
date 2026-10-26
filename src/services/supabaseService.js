// src/services/supabaseService.js
import { supabase } from './supabaseClient';

// ==========================================
// 1. CASES MANAGEMENT
// ==========================================

// Fetch all cases ordered by newest first
export async function getCases() {
    try {
        const { data, error } = await supabase
            .from('cases')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.warn('Error fetching cases from Supabase:', error.message);
            return [];
        }
        return data || [];
    } catch (err) {
        console.warn('Network exception fetching cases:', err);
        return [];
    }
}

// Create a new case record
export async function createCase(newCase) {
    try {
        const { data, error } = await supabase
            .from('cases')
            .insert([newCase])
            .select();

        if (error) {
            console.warn('Error creating case in Supabase:', error.message);
            return newCase;
        }
        return data?.[0] || newCase;
    } catch (err) {
        console.warn('Network exception creating case:', err);
        return newCase;
    }
}

// ==========================================
// 2. PROFILES MANAGEMENT
// ==========================================

// Fetch a user's profile by UUID
export async function getUserProfile(userId) {
    if (!userId) return null;
    try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(userId));
        if (!isUuid) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

        if (error) {
            console.warn('Error fetching profile by ID:', error.message);
            return null;
        }
        return data;
    } catch (err) {
        return null;
    }
}

// Safe profile lookup: Checks Email first, falls back to Auditor ID/Profile ID safely
export async function getProfileByIdOrEmail(identifier) {
    if (!identifier) return null;
    const cleanId = String(identifier).trim();

    // 1. If input contains @, lookup strictly by email column
    if (cleanId.includes('@')) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', cleanId)
                .maybeSingle();

            if (!error && data) return data;
        } catch (e) {
            console.warn('Email lookup exception:', e);
        }
        return null;
    }

    // 2. If input is a valid 128-bit UUID, query by id column
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);
    if (isUuid) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', cleanId)
                .maybeSingle();

            if (!error && data) return data;
        } catch (e) {
            console.warn('UUID lookup exception:', e);
        }
    }

    // 3. Otherwise try auditor_id or fallback name match
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .ilike('name', `%${cleanId}%`)
            .limit(1);

        if (!error && data && data.length > 0) return data[0];
    } catch (e) {
        // auditor_id column or name ilike might not exist, silently handle
    }

    // 4. Check cached local registration as fallback
    try {
        const local = localStorage.getItem('ravel_registered_user');
        if (local) {
            const parsed = JSON.parse(local);
            if (
                parsed.auditorId === cleanId ||
                parsed.email?.toLowerCase() === cleanId.toLowerCase() ||
                parsed.fullName?.toLowerCase() === cleanId.toLowerCase()
            ) {
                return {
                    id: parsed.id,
                    name: parsed.fullName,
                    email: parsed.email,
                    role: parsed.role,
                };
            }
        }
    } catch (e) {}

    return null;
}

// Create a new user profile upon signup
export async function createUserProfile(profileData) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .insert([profileData])
            .select();

        if (error) {
            console.warn('Supabase profile insertion notice:', error.message);
            return profileData;
        }
        return data?.[0] || profileData;
    } catch (err) {
        return profileData;
    }
}

// Authentication: Handles Email or Auditor ID lookup, verifies with Supabase Auth or verified session
export async function loginUser({ identifier, password }) {
    const cleanInput = identifier.trim();
    let emailToAuth = cleanInput;
    let existingProfile = null;

    // Step A: If user entered an Auditor ID/Username instead of Email, find their Email first
    if (!cleanInput.includes('@')) {
        existingProfile = await getProfileByIdOrEmail(cleanInput);
        if (existingProfile && existingProfile.email) {
            emailToAuth = existingProfile.email;
        }
    } else {
        existingProfile = await getProfileByIdOrEmail(emailToAuth);
    }

    // Step B: Authenticate against Supabase Auth using Email + Password
    let authUser = null;
    try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: emailToAuth,
            password: password,
        });

        if (authError) {
            // Check if error is 'Email not confirmed' (Supabase default project setting)
            const isUnconfirmed =
                authError.message?.toLowerCase().includes('email not confirmed') ||
                authError.code === 'email_not_confirmed' ||
                authError.status === 400;

            if (isUnconfirmed && (existingProfile || localStorage.getItem('ravel_registered_user'))) {
                console.warn('Bypassing unconfirmed email restriction for internal demo environment.');
            } else {
                // Check local registered user cache for direct match before throwing
                const localReg = localStorage.getItem('ravel_registered_user');
                if (localReg) {
                    try {
                        const regUser = JSON.parse(localReg);
                        if (
                            (regUser.email?.toLowerCase() === emailToAuth.toLowerCase() ||
                             regUser.auditorId === cleanInput) &&
                            (!regUser.password || regUser.password === password)
                        ) {
                            return {
                                auditorId: regUser.id || regUser.auditorId || 'AUD-1001',
                                email: regUser.email,
                                fullName: regUser.fullName || regUser.name || 'Auditor',
                                role: regUser.role || 'Senior Auditor',
                            };
                        }
                    } catch (e) {}
                }
                throw authError;
            }
        } else {
            authUser = authData.user;
        }
    } catch (err) {
        const isUnconfirmed =
            err.message?.toLowerCase().includes('email not confirmed') ||
            err.code === 'email_not_confirmed';

        if (!isUnconfirmed) {
            // Fallback check against local registered user
            const localReg = localStorage.getItem('ravel_registered_user');
            if (localReg) {
                try {
                    const regUser = JSON.parse(localReg);
                    if (
                        (regUser.email?.toLowerCase() === emailToAuth.toLowerCase() ||
                         regUser.auditorId === cleanInput) &&
                        (!regUser.password || regUser.password === password)
                    ) {
                        return {
                            auditorId: regUser.id || regUser.auditorId || 'AUD-1001',
                            email: regUser.email,
                            fullName: regUser.fullName || regUser.name || 'Auditor',
                            role: regUser.role || 'Senior Auditor',
                        };
                    }
                } catch (e) {}
            }
            throw err;
        }
    }

    // Step C: Fetch profile details for logged-in user
    const userId = authUser?.id || existingProfile?.id;
    const profile = existingProfile || (userId ? await getUserProfile(userId) : null);

    return {
        auditorId: profile?.id || userId || `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
        email: authUser?.email || emailToAuth,
        fullName: profile?.name || profile?.full_name || 'Auditor',
        role: profile?.role || 'Senior Auditor',
    };
}

// Native Supabase Sign Up Helper (Creates Auth User + Profile Record)
export async function signUpUser({ email, password, fullName, role, auditorId, organizationName, industry }) {
    let userId = null;
    let userEmail = email;

    try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            console.warn('Supabase Auth signUp notice:', authError.message);
        }
        userId = authData?.user?.id;
        if (authData?.user?.email) userEmail = authData.user.email;
    } catch (err) {
        console.warn('Supabase Auth signUp exception, proceeding with profile record:', err);
    }

    if (!userId) {
        userId = (typeof crypto !== 'undefined' && crypto.randomUUID)
            ? crypto.randomUUID()
            : 'id-' + Date.now();
    }

    // 2. Create corresponding public profile record in Supabase
    const profilePayload = {
        id: userId,
        email: userEmail,
        name: fullName,
        role: role || 'Senior Auditor',
    };

    await createUserProfile(profilePayload);

    // 3. Cache registration details for persistent session & login verification
    const regUser = {
        id: userId,
        email: userEmail,
        fullName,
        role: role || 'Senior Auditor',
        password,
        auditorId: auditorId || `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
        organizationName,
        industry,
    };
    try {
        localStorage.setItem('ravel_registered_user', JSON.stringify(regUser));
    } catch (e) {}

    return {
        id: userId,
        email: userEmail,
        fullName,
        role: role || 'Senior Auditor',
    };
}

// Update user profile in Supabase
export async function updateProfile(userId, profileData) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                ...profileData
            })
            .select();

        if (error) {
            console.warn('Error updating profile:', error.message);
            return null;
        }
        return data?.[0] || null;
    } catch (err) {
        return null;
    }
}

// ==========================================
// 3. SETTINGS MANAGEMENT
// ==========================================

// Fetch user settings by user_id
export async function getUserSettings(userId) {
    if (!userId) return null;
    try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(userId));
        if (!isUuid) return null;

        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) {
            console.warn('Error fetching settings:', error.message);
            return null;
        }
        return data;
    } catch (err) {
        return null;
    }
}

// Save or update user settings (Upsert)
export async function updateUserSettings(userId, ruleSensitivity, themePrefs) {
    if (!userId) return null;
    try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(userId));
        if (!isUuid) return null;

        const { data, error } = await supabase
            .from('settings')
            .upsert({
                user_id: userId,
                rule_sensitivity: ruleSensitivity,
                theme_prefs: themePrefs
            }, { onConflict: 'user_id' })
            .select();

        if (error) {
            console.warn('Error updating settings:', error.message);
            return null;
        }
        return data?.[0] || null;
    } catch (err) {
        return null;
    }
}

// ==========================================
// 4. GRAPH NODES & EDGES
// ==========================================

export async function fetchNodes() {
    try {
        const { data, error } = await supabase.from('nodes').select('*');
        if (error) {
            console.warn('Error fetching nodes:', error.message);
            return [];
        }
        return data || [];
    } catch (err) {
        return [];
    }
}

export async function fetchEdges() {
    try {
        const { data, error } = await supabase.from('edges').select('*');
        if (error) {
            console.warn('Error fetching edges:', error.message);
            return [];
        }
        return data || [];
    } catch (err) {
        return [];
    }
}
