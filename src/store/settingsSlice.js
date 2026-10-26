// src/store/settingsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const getInitialProfile = () => {
    try {
        const raw = localStorage.getItem('ravel_user');
        if (raw) {
            const user = JSON.parse(raw);
            if (user) {
                return {
                    name: user.fullName || user.name || 'J. Doe',
                    role: user.role || 'Senior Auditor',
                    email: user.email || 'J.Doe@ravel.io',
                };
            }
        }
    } catch (e) {
        // ignore
    }
    return { name: 'J. Doe', role: 'Senior Auditor', email: 'J.Doe@ravel.io' };
};

const initialState = {
    profile: getInitialProfile(),
    display: { dark: true, color: '#06b6d4', font: 14 },
    notifs: { cases: false, critical: false, suggestions: false, email: true, inApp: false },
    rules: [
        { id: 'RU_01', type: 'GST Match', desc: 'Match GST registration across employees & vendors.', level: 'High', val: 80, riskLevel: 'Critical', date: '12/07/2026', active: true },
        { id: 'RU_02', type: 'Circular Loop', desc: 'Detect recursive loops in payment approvals (Recursive CTE).', level: 'Medium', val: 50, riskLevel: 'High', date: '10/05/2026', active: true },
        { id: 'RU_03', type: 'Fuzzy Name', desc: 'Use fuzzy logic for near-duplicate entity detection.', level: 'Low', val: 30, riskLevel: 'Medium', date: '12/07/2026', active: true },
        { id: 'RU_04', type: 'Timeline Gaps', desc: 'Find time anomalies between payment and approval.', level: 'Medium', val: 60, riskLevel: 'High', date: '12/06/2026', active: false },
    ],
};

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        updateProfile: (state, action) => {
            state.profile = { ...state.profile, ...action.payload };
        },
        updateDisplay: (state, action) => {
            state.display = { ...state.display, ...action.payload };
        },
        updateNotifications: (state, action) => {
            state.notifs = { ...state.notifs, ...action.payload };
        },
        updateRule: (state, action) => {
            const { id, key, val } = action.payload;
            const rule = state.rules.find(r => r.id === id);
            if (rule) {
                rule[key] = val;
            }
        },
    },
});

export const { updateProfile, updateDisplay, updateNotifications, updateRule } = settingsSlice.actions;
export default settingsSlice.reducer;
