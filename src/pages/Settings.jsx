// src/pages/Settings.jsx
import React, { useState } from 'react';
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

export default function Settings() {
    const [leftTab, setLeftTab] = useState('general');
    const [centerTab, setCenterTab] = useState('analytical');
    const [profile, setProfile] = useState({ name: 'J. Doe', role: 'Senior Auditor', email: 'J.Doe@ravel.io' });
    const [display, setDisplay] = useState({ dark: true, color: '#06b6d4', font: 14 });
    const [notifs, setNotifs] = useState({ cases: false, critical: false, suggestions: false, email: true, inApp: false });
    const [pwdModal, setPwdModal] = useState(false);
    const [page, setPage] = useState(1);
    
    // Password change states for validation
    const [currentPwd, setCurrentPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const isPasswordValid = currentPwd.trim() !== '' && newPwd.trim() !== '' && confirmPwd.trim() !== '' && newPwd === confirmPwd;

    const [rules, setRules] = useState([
        { id: 'RU_01', type: 'GST Match', desc: 'Match GST registration across employees & vendors.', level: 'High', val: 80, risk: <Badge variant="critical">Critical</Badge>, date: '12/07/2026', active: true },
        { id: 'RU_02', type: 'Circular Loop', desc: 'Detect recursive loops in payment approvals (Recursive CTE).', level: 'Medium', val: 50, risk: <Badge variant="flagged">High</Badge>, date: '10/05/2026', active: true },
        { id: 'RU_03', type: 'Fuzzy Name', desc: 'Use fuzzy logic for near-duplicate entity detection.', level: 'Low', val: 30, risk: <Badge variant="suggested">Medium</Badge>, date: '12/07/2026', active: true },
        { id: 'RU_04', type: 'Timeline Gaps', desc: 'Find time anomalies between payment and approval.', level: 'Medium', val: 60, risk: <Badge variant="flagged">High</Badge>, date: '12/06/2026', active: false },
    ]);

    const updateRule = (id, key, val) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, [key]: val } : r));
    };

    const paginatedRules = rules.slice((page - 1) * 4, page * 4);

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
                        <Slider min={0} max={100} value={row.val} onChange={v => updateRule(row.id, 'val', v)} />
                    </div>
                </div>
            )
        },
        { header: 'Associated Risk', accessor: 'risk', className: 'w-[95px]' },
        { header: 'Last Updated', accessor: 'date', className: 'w-[90px]', render: d => <span className="text-gray-400 font-mono" style={{ fontSize: `${display.font * 0.85}px` }}>{d}</span> },
        {
            header: 'Status', accessor: 'active', className: 'w-[70px]', render: (st, row) => (
                <div className="flex justify-end items-center gap-1.5">
                    <span className="text-gray-300" style={{ fontSize: `${display.font * 0.85}px` }}>{st ? 'On' : 'Off'}</span>
                    <div style={{ accentColor: display.color }}>
                        <ToggleSwitch size="sm" checked={st} onChange={v => updateRule(row.id, 'active', v)} />
                    </div>
                </div>
            )
        }
    ];

    return (
        <div
            className="p-4 md:p-5 pb-16 flex flex-col gap-3 w-full min-h-screen select-none box-border"
            style={{
                backgroundColor: display.dark ? theme.colors.bg : '#f8fafc',
                color: display.dark ? theme.colors.textPrimary : '#0f172a',
                fontFamily: theme.fonts.sans,
                fontSize: `${display.font}px`
            }} >
            
            {/* Standard Header Component Aligned with Case Management */}
            <div className="flex flex-col items-start self-start w-full mb-1">
                <h1 className="font-bold tracking-tight m-0 p-0 leading-tight" style={{ fontSize: '1.4rem', color: display.dark ? '#ffffff' : '#0f172a' }}>
                    Platform Settings & Configurations
                </h1>
                <p className="font-normal mt-1 mb-0" style={{ fontSize: '0.85rem', color: display.dark ? '#94a3b8' : '#475569' }}>
                    Logged in: J. Doe (Senior Auditor)
                </p>
            </div>

            {/* Main 3-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start w-full">
                {/* COLUMN 1: Left Navigation & Compact Settings Blocks */}
                <div className="lg:col-span-3 flex flex-col gap-2.5">
                    <div style={{ accentColor: display.color, fontSize: `${display.font}px` }}>
                        <Tabs tabs={[{ id: 'general', label: 'General' }, { id: 'security', label: 'Security & Access' }]} activeTab={leftTab} onChange={setLeftTab} variant="line" />
                    </div>
                    <Card title="User Profile" padding="8px 6px">
                        <div className="flex flex-col gap-1.5" style={{ fontSize: `${display.font}px` }}>
                            <Input label="Name" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                            <div className="flex flex-col gap-0.5">
                                <label className="text-gray-400 font-semibold uppercase" style={{ fontSize: `${display.font * 0.75}px` }}>Role</label>
                                <div className="flex items-center justify-between bg-surface border border-gray-700 rounded-md px-2.5 py-1 text-gray-300" style={{ fontSize: `${display.font}px` }}>
                                    <span>Senior Auditor</span>
                                    <span className="text-gray-500 italic" style={{ fontSize: `${display.font * 0.75}px` }}>uneditable</span>
                                </div>
                            </div>
                            <Input label="Email" type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
                            <div className="pt-0.5">
                                <div style={{ backgroundColor: display.color }}>
                                    <Button variant="primary" style={{ backgroundColor: display.color, borderColor: display.color, fontSize: `${display.font}px` }} onClick={() => setPwdModal(true)}>Change Password</Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Platform Display" padding="8px 6px">
                        <div className="flex flex-col gap-2" style={{ accentColor: display.color, fontSize: `${display.font}px` }}>
                            <ToggleSwitch label="Dark Mode" checked={display.dark} onChange={v => setDisplay({ ...display, dark: v })} />
                            <ColorPicker label="Primary Accent Color" value={display.color} onChange={v => setDisplay({ ...display, color: v })} />
                            <Slider label="Font Size" min={12} max={20} value={display.font} onChange={v => setDisplay({ ...display, font: v })} />
                        </div>
                    </Card>

                    <Card title="Notification Settings" padding="8px 6px">
                        <div className="flex flex-col gap-1.5" style={{ accentColor: display.color, fontSize: `${display.font}px` }}>
                            <Checkbox id="nc" label="New Case Alerts" checked={notifs.cases} onChange={v => setNotifs({ ...notifs, cases: v })} />
                            <Checkbox id="ca" label="Critical Anomaly Alerts" checked={notifs.critical} onChange={v => setNotifs({ ...notifs, critical: v })} />
                            <Checkbox id="rms" label="Rule Match Suggestions" checked={notifs.suggestions} onChange={v => setNotifs({ ...notifs, suggestions: v })} />
                            <div className="flex items-center gap-3 mt-0.5 pl-0.5">
                                <Checkbox id="em" label="Email" checked={notifs.email} onChange={v => setNotifs({ ...notifs, email: v })} />
                                <Checkbox id="ia" label="In-app" checked={notifs.inApp} onChange={v => setNotifs({ ...notifs, inApp: v })} />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* COLUMN 2: Center Analytical Rule Management Table */}
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

                {/* COLUMN 3: Right Summary & Audit Cards */}
                <div className="lg:col-span-3 flex flex-col gap-2.5">
                    <Card title="System Configuration Summary" padding="9px">
                        <div className="flex flex-col gap-2" style={{ fontSize: `${display.font}px` }}>
                            <div className="flex justify-between"><span className="text-gray-400">Configured Rules:</span><span className="font-semibold" style={{ color: display.color }}>25</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Active Rules:</span><span className="font-semibold" style={{ color: display.color }}>18</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">User Accounts:</span><span className="font-semibold" style={{ color: display.color }}>12 (Auditor)</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Audit Logs:</span><span className="font-semibold" style={{ color: display.color }}>1540 (Active)</span></div>
                        </div>
                    </Card>

                    <Card title="Rule Performance Overview" padding="9px">
                        <div className="flex flex-col gap-2" style={{ fontSize: `${display.font}px` }}>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400" style={{ fontSize: `${display.font}px` }}>High-Risk Matches <br /><span style={{ fontSize: `${display.font * 0.75}px` }} className="text-gray-500">(Last 30 days)</span></span>
                                <span className="font-bold" style={{ fontSize: `${display.font * 1.15}px`, color: display.color }}>120</span>
                            </div>
                            <div className="flex justify-between items-center"><span className="text-gray-400">Pending Suggestions</span><span className="font-bold text-amber-500" style={{ fontSize: `${display.font * 1.15}px` }}>45</span></div>
                            <div className="flex justify-between items-center"><span className="text-gray-400">Rule False Positives</span><span className="font-semibold text-white">15</span></div>
                            <div className="flex justify-between items-center mt-1 border-t pt-1.5 border-gray-800">
                                <span className="text-gray-400" style={{ fontSize: `${display.font * 0.85}px` }}>Recent Rule Edits Log</span>
                                <button type="button" className="hover:underline cursor-pointer" style={{ fontSize: `${display.font * 0.85}px`, color: display.color }} onClick={() => alert('Opening audit logs...')}>View Log</button>
                            </div>
                        </div>
                    </Card>

                    <Card title="System Audit Trail" padding="9px">
                        <div className="flex flex-col justify-between" style={{ minHeight: '94px', fontSize: `${display.font}px` }}>
                            <ul className="flex flex-col gap-1 text-gray-400" style={{ fontSize: `${display.font * 0.85}px` }}>
                                <li>User Admin updated RU_01 <br /><span style={{ fontSize: `${display.font * 0.75}px` }} className="text-gray-500">(Sensitivity: High)</span></li>
                                <li>J. Doe changed password</li>
                                <li>New user T. Evans created</li>
                            </ul>
                            <div className="flex items-center gap-1 text-gray-400 justify-end border-t pt-1 mt-1 border-gray-800" style={{ fontSize: `${display.font * 0.85}px` }}>
                                <button type="button" className="px-1 hover:text-white">&lt;</button>
                                <button type="button" className="px-1.5 py-0.5 rounded text-white" style={{ fontSize: `${display.font * 0.75}px`, backgroundColor: display.color }}>1</button>
                                <button type="button" className="px-1.5 hover:text-white">2</button>
                                <button type="button" className="px-1.5 hover:text-white">3</button>
                                <span>16</span>
                                <button type="button" className="px-1 hover:text-white">&gt;</button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Fixed Pagination Section at the Bottom */}
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