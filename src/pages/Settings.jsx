// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../components/Card';
import Button from '../components/Button';
import Tabs from '../components/Tabs';
import Table from '../components/Table';
import Badge from '../components/Badge';
import Pagination from '../components/Pagination';
import ToggleSwitch from '../components/ToggleSwitch';
import Slider from '../components/Slider';
import Checkbox from '../components/Checkbox';
import ColorPicker from '../components/ColorPicker';
import Input from '../components/Input';
import Modal from '../components/Modal';
import theme from '../theme';

import { updateProfile, updateDisplay, updateNotifications, updateRule } from '../store/settingsSlice';
import { getUserSettings, updateUserSettings } from '../services/supabaseService';

export default function Settings() {
    const dispatch = useDispatch();
    
    // 1. DYNAMIC USER SESSION FROM REDUX
    const currentUser = useSelector((state) => state.auth?.currentUser);
    const currentUserId = currentUser?.auditorId || currentUser?.id;

    const settings = useSelector((state) => state.settings);
    const { profile, display, notifs, rules } = settings;

    const [leftTab, setLeftTab] = useState('general');
    const [centerTab, setCenterTab] = useState('analytical');
    const [pwdModal, setPwdModal] = useState(false);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // 2. Sync logged-in user profile & fetch their specific settings
    useEffect(() => {
        async function loadSettings() {
            setLoading(true);

            // Sync user details from Auth state first
            if (currentUser) {
                dispatch(updateProfile({
                    name: currentUser.fullName || currentUser.name || 'Auditor',
                    email: currentUser.email || '',
                    role: currentUser.role || 'Auditor'
                }));
            }

            if (currentUserId) {
                const savedData = await getUserSettings(currentUserId);
                if (savedData) {
                    if (savedData.theme_prefs) {
                        dispatch(updateDisplay(savedData.theme_prefs));
                    }
                    if (savedData.rule_sensitivity) {
                        const { profile: savedProfile, notifs: savedNotifs } = savedData.rule_sensitivity;
                        if (savedProfile) dispatch(updateProfile(savedProfile));
                        if (savedNotifs) dispatch(updateNotifications(savedNotifs));
                    }
                }
            }
            setLoading(false);
        }
        loadSettings();
    }, [dispatch, currentUserId, currentUser]);

    // 3. Helper to sync updates to Supabase database per User ID
    const saveToSupabase = async (updatedDisplay, updatedProfile, updatedNotifs, updatedRules) => {
        if (!currentUserId) return;
        setSaving(true);
        const ruleSensitivityPayload = {
            profile: updatedProfile || profile,
            notifs: updatedNotifs || notifs,
            rules: updatedRules || rules
        };
        const themePrefsPayload = updatedDisplay || display;

        await updateUserSettings(currentUserId, ruleSensitivityPayload, themePrefsPayload);
        setSaving(false);
    };

    // Password change states
    const [currentPwd, setCurrentPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const isPasswordValid = currentPwd.trim() !== '' && newPwd.trim() !== '' && confirmPwd.trim() !== '' && newPwd === confirmPwd;

    const handleUpdateRule = (id, key, val) => {
        dispatch(updateRule({ id, key, val }));
        const updatedRules = rules.map(r => r.id === id ? { ...r, [key]: val } : r);
        saveToSupabase(display, profile, notifs, updatedRules);
    };

    const paginatedRules = rules.slice((page - 1) * 4, page * 4);

    const getRiskBadge = (riskLevel) => {
        if (riskLevel === 'High' || riskLevel === 'Critical') return <Badge variant="critical">Critical</Badge>;
        if (riskLevel === 'Medium') return <Badge variant="flagged">High</Badge>;
        return <Badge variant="suggested">Medium</Badge>;
    };

    const columns = [
        { header: 'Rule ID', accessor: 'id', type: 'link', className: 'w-[75px]' },
        { header: 'Type', accessor: 'type', className: 'w-[85px]' },
        {
            header: 'Description',
            accessor: 'desc',
            className: 'w-[160px] max-w-[160px] whitespace-normal break-words',
            render: t => <span style={{ fontSize: `${display.font * 0.85}px` }} className="text-gray-300 leading-snug block w-[150px] whitespace-normal break-words">{t}</span>
        },
        {
            header: 'Sensitivity', accessor: 'level', className: 'w-[100px]', render: (l, row) => (
                <div className="flex flex-col gap-1 min-w-[75px]">
                    <span style={{ fontSize: `${display.font * 0.85}px` }}>{l}</span>
                    <div style={{ accentColor: display.color }}>
                        <Slider min={0} max={100} value={row.val} onChange={v => handleUpdateRule(row.id, 'val', v)} />
                    </div>
                </div>
            )
        },
        { header: 'Associated Risk', accessor: 'riskLevel', className: 'w-[95px]', render: (l) => getRiskBadge(l) },
        { header: 'Last Updated', accessor: 'date', className: 'w-[90px]', render: d => <span className="text-gray-400 font-mono" style={{ fontSize: `${display.font * 0.85}px` }}>{d}</span> },
        {
            header: 'Status', accessor: 'active', className: 'w-[70px]', render: (st, row) => (
                <div className="flex justify-end items-center gap-1.5">
                    <span className="text-gray-300" style={{ fontSize: `${display.font * 0.85}px` }}>{st ? 'On' : 'Off'}</span>
                    <div style={{ accentColor: display.color }}>
                        <ToggleSwitch size="sm" checked={st} onChange={v => handleUpdateRule(row.id, 'active', v)} />
                    </div>
                </div>
            )
        }
    ];

    if (loading) {
        return <div className="p-6 text-white bg-slate-900 min-h-screen">Loading platform settings...</div>;
    }

    const displayName = profile.name || currentUser?.fullName || currentUser?.name || 'Auditor';
    const displayRole = profile.role || currentUser?.role || 'Senior Auditor';

    return (
        <div
            className="p-4 md:p-5 pb-16 flex flex-col gap-3 w-full min-h-screen box-border"
            style={{
                backgroundColor: display.dark ? theme.colors.bg : '#f8fafc',
                color: display.dark ? theme.colors.textPrimary : '#0f172a',
                fontFamily: theme.fonts.sans,
                fontSize: `${display.font}px`
            }} >

            {/* Dynamic Header */}
            <div className="flex flex-col items-start self-start w-full mb-1">
                <div className="flex justify-between items-center w-full">
                    <h1 className="font-bold tracking-tight m-0 p-0 leading-tight" style={{ fontSize: '1.4rem', color: display.dark ? '#ffffff' : '#0f172a' }}>
                        Platform Settings & Configurations
                    </h1>
                    {saving && <span className="text-xs text-blue-400 animate-pulse">Syncing with Supabase...</span>}
                </div>
                <p className="font-normal mt-1 mb-0" style={{ fontSize: '0.85rem', color: display.dark ? '#94a3b8' : '#475569' }}>
                    Logged in: {displayName} ({displayRole})
                </p>
            </div>

            {/* Main 3-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start w-full">
                {/* COLUMN 1 */}
                <div className="lg:col-span-3 flex flex-col gap-2.5">
                    <div style={{ accentColor: display.color, fontSize: `${display.font}px` }}>
                        <Tabs tabs={[{ id: 'general', label: 'General' }, { id: 'security', label: 'Security & Access' }]} activeTab={leftTab} onChange={setLeftTab} variant="line" />
                    </div>
                    <Card title="User Profile" padding="8px 6px">
                        <div className="flex flex-col gap-1.5" style={{ fontSize: `${display.font}px` }}>
                            <Input
                                label="Name"
                                value={displayName}
                                onChange={e => {
                                    const updated = { ...profile, name: e.target.value };
                                    dispatch(updateProfile({ name: e.target.value }));
                                    saveToSupabase(display, updated, notifs, rules);
                                }}
                            />
                            <div className="flex flex-col gap-0.5">
                                <label className="text-gray-400 font-semibold uppercase" style={{ fontSize: `${display.font * 0.75}px` }}>Role</label>
                                <div className="flex items-center justify-between bg-surface border border-gray-700 rounded-md px-2.5 py-1 text-gray-300" style={{ fontSize: `${display.font}px` }}>
                                    <span>{displayRole}</span>
                                    <span className="text-gray-500 italic" style={{ fontSize: `${display.font * 0.75}px` }}>uneditable</span>
                                </div>
                            </div>
                            <Input
                                label="Email"
                                type="email"
                                value={profile.email || currentUser?.email || ''}
                                onChange={e => {
                                    const updated = { ...profile, email: e.target.value };
                                    dispatch(updateProfile({ email: e.target.value }));
                                    saveToSupabase(display, updated, notifs, rules);
                                }}
                            />
                            <div className="pt-0.5">
                                <div style={{ backgroundColor: display.color }}>
                                    <Button variant="primary" style={{ backgroundColor: display.color, borderColor: display.color, fontSize: `${display.font}px` }} onClick={() => setPwdModal(true)}>Change Password</Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Platform Display" padding="8px 6px">
                        <div className="flex flex-col gap-2" style={{ accentColor: display.color, fontSize: `${display.font}px` }}>
                            <ToggleSwitch
                                label="Dark Mode"
                                checked={display.dark}
                                onChange={v => {
                                    const updated = { ...display, dark: v };
                                    dispatch(updateDisplay({ dark: v }));
                                    saveToSupabase(updated, profile, notifs, rules);
                                }}
                            />
                            <ColorPicker
                                label="Primary Accent Color"
                                value={display.color}
                                onChange={v => {
                                    const updated = { ...display, color: v };
                                    dispatch(updateDisplay({ color: v }));
                                    saveToSupabase(updated, profile, notifs, rules);
                                }}
                            />
                            <Slider
                                label="Font Size"
                                min={12}
                                max={20}
                                value={display.font}
                                onChange={v => {
                                    const updated = { ...display, font: v };
                                    dispatch(updateDisplay({ font: v }));
                                    saveToSupabase(updated, profile, notifs, rules);
                                }}
                            />
                        </div>
                    </Card>

                    <Card title="Notification Settings" padding="8px 6px">
                        <div className="flex flex-col gap-1.5" style={{ accentColor: display.color, fontSize: `${display.font}px` }}>
                            <Checkbox
                                id="nc"
                                label="New Case Alerts"
                                checked={notifs.cases}
                                onChange={v => {
                                    const updated = { ...notifs, cases: v };
                                    dispatch(updateNotifications({ cases: v }));
                                    saveToSupabase(display, profile, updated, rules);
                                }}
                            />
                            <Checkbox
                                id="ca"
                                label="Critical Anomaly Alerts"
                                checked={notifs.critical}
                                onChange={v => {
                                    const updated = { ...notifs, critical: v };
                                    dispatch(updateNotifications({ critical: v }));
                                    saveToSupabase(display, profile, updated, rules);
                                }}
                            />
                            <Checkbox
                                id="rms"
                                label="Rule Match Suggestions"
                                checked={notifs.suggestions}
                                onChange={v => {
                                    const updated = { ...notifs, suggestions: v };
                                    dispatch(updateNotifications({ suggestions: v }));
                                    saveToSupabase(display, profile, updated, rules);
                                }}
                            />
                            <div className="flex items-center gap-3 mt-0.5 pl-0.5">
                                <Checkbox
                                    id="em"
                                    label="Email"
                                    checked={notifs.email}
                                    onChange={v => {
                                        const updated = { ...notifs, email: v };
                                        dispatch(updateNotifications({ email: v }));
                                        saveToSupabase(display, profile, updated, rules);
                                    }}
                                />
                                <Checkbox
                                    id="ia"
                                    label="In-app"
                                    checked={notifs.inApp}
                                    onChange={v => {
                                        const updated = { ...notifs, inApp: v };
                                        dispatch(updateNotifications({ inApp: v }));
                                        saveToSupabase(display, profile, updated, rules);
                                    }}
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* COLUMN 2 */}
                <div className="lg:col-span-6 flex flex-col gap-2.5">
                    <div style={{ accentColor: display.color, fontSize: `${display.font}px` }}>
                        <Tabs tabs={[{ id: 'analytical', label: 'Analytical Rules' }, { id: 'logs', label: 'System Logs' }]} activeTab={centerTab} onChange={setCenterTab} variant="line" />
                    </div>
                    <Card title="Analytical Rule Management" padding="12px">
                        <div className="flex flex-col justify-between" style={{ minHeight: '448px', fontSize: `${display.font}px` }}>
                            <Table columns={columns} data={paginatedRules} emptyText="No rules found" />
                        </div>
                    </Card>
                </div>

                {/* COLUMN 3 */}
                <div className="lg:col-span-3 flex flex-col gap-2.5">
                    <Card title="System Configuration Summary" padding="9px">
                        <div className="flex flex-col gap-2" style={{ fontSize: `${display.font}px` }}>
                            <div className="flex justify-between"><span className="text-gray-400">Configured Rules:</span><span className="font-semibold" style={{ color: display.color }}>{rules.length}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Active Rules:</span><span className="font-semibold" style={{ color: display.color }}>{rules.filter(r => r.active).length}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">User Accounts:</span><span className="font-semibold" style={{ color: display.color }}>1 (Active)</span></div>
                        </div>
                    </Card>

                    <Card title="System Audit Trail" padding="9px">
                        <div className="flex flex-col justify-between" style={{ minHeight: '94px', fontSize: `${display.font}px` }}>
                            <ul className="flex flex-col gap-1 text-gray-400" style={{ fontSize: `${display.font * 0.85}px` }}>
                                <li>User {displayName} session active</li>
                                <li>Platform loaded successfully</li>
                            </ul>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Pagination */}
            <div className="fixed bottom-0 left-0 right-0 z-50 px-4 md:px-5 py-2.5 flex justify-between items-center text-gray-400 border-t border-gray-800 shadow-lg" style={{ backgroundColor: display.dark ? theme.colors.bg : '#ffffff', fontSize: `${display.font}px` }}>
                <span>1-2 next</span>
                <Pagination currentPage={page} totalPages={2} onPageChange={setPage} itemsPerPage={4} totalItems={rules.length} />
            </div>

            {/* Password Modal */}
            <Modal isOpen={pwdModal} onClose={() => { setPwdModal(false); setCurrentPwd(''); setNewPwd(''); setConfirmPwd(''); }} title="Change Account Password" width="420px">
                <form onSubmit={e => {
                    e.preventDefault();
                    if (isPasswordValid) {
                        setPwdModal(false);
                        setCurrentPwd('');
                        setNewPwd('');
                        setConfirmPwd('');
                        alert('Password updated successfully!');
                    }
                }} className="flex flex-col gap-2" style={{ accentColor: display.color, fontSize: `${display.font}px` }}>
                    <Input label="Current Password" type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} required />
                    <Input label="New Password" type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} required />
                    <Input label="Confirm New Password" type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} required />
                    <div className="flex justify-end gap-2.5 mt-3">
                        <Button type="button" variant="secondary" style={{ fontSize: `${display.font}px` }} onClick={() => { setPwdModal(false); setCurrentPwd(''); setNewPwd(''); setConfirmPwd(''); }}>Cancel</Button>
                        <Button type="submit" variant="primary" disabled={!isPasswordValid} className={!isPasswordValid ? 'opacity-50 cursor-not-allowed' : ''} style={{ backgroundColor: display.color, borderColor: display.color, fontSize: `${display.font}px` }}>Update Password</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}