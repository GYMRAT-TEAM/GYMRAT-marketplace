import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile, getMyOrders, uploadAvatar as apiUploadAvatar, changePassword as apiChangePassword } from '../services/api';
import logoImg from '../Component/Assets/logo.png';
import './Settings.css';

export default function Settings() {
  const { user, updateUser, logout, isPremium } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', location: '',
  });

  const [passForm, setPassForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '', lastName: user.lastName || '',
        email: user.email || '', phone: user.phone || '',
        address: user.address || '', location: user.location || '',
      });
      if (user.avatar) setAvatarPreview(user.avatar);
    }
  }, [user]);

  useEffect(() => {
    if (location.state?.upgraded) {
      setActiveTab('plan');
      showMessage(`Plan upgraded to ${location.state.planName} successfully!`, 'ok');
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  const loadOrders = () => {
    setOrdersLoading(true);
    getMyOrders()
      .then(res => setOrders(res.data?.orders || res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  };

  useEffect(() => {
    if (activeTab === 'orders' && orders.length === 0) loadOrders();
  }, [activeTab, orders.length]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePassChange = (e) => setPassForm({ ...passForm, [e.target.name]: e.target.value });
  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarUploading(true);
    try {
      const res = await apiUploadAvatar(file);
      updateUser(res.data.user);
      setAvatarPreview(res.data.avatarUrl);
      showMessage('Profile picture updated!', 'ok');
    } catch (err) {
      showMessage(err.response?.data?.message || 'Upload failed.', 'err');
      setAvatarPreview(user?.avatar || null);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(form);
      updateUser(res.data.user);
      showMessage('Profile saved successfully!', 'ok');
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to save profile.', 'err');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      return showMessage('New passwords do not match.', 'err');
    }
    setPassLoading(true);
    try {
      await apiChangePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      showMessage('Password updated successfully!', 'ok');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to update password.', 'err');
    } finally {
      setPassLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    if (text) setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handleUpgradePlan = (planName, price) => {
    navigate('/payment', { state: { plan: { name: `GymRat ${planName} Plan`, price }, upgradeMode: true } });
  };

  const avatarSrc = avatarPreview ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent((form.firstName || 'G') + '+' + (form.lastName || 'R'))}&background=730c1e&color=fff&size=256`;

  const currentPlan = (user?.plan || 'standard').toLowerCase();
  const isAdminOrPremium = (user?.role === 'super_admin' || currentPlan === 'business' || currentPlan === 'vip');

  const GLOBAL_NAV = [
    { label: 'Home', icon: 'ti-home', path: '/' },
    { label: 'Shop', icon: 'ti-shopping-cart', path: '/shop/gym' },
    { label: 'Settings', icon: 'ti-settings', path: '/settings', isActive: true }
  ];

  const SETTINGS_TABS = [
    { key: 'profile', label: 'Profile' },
    { key: 'password', label: 'Password' },
    { key: 'orders', label: 'My Orders' },
    { key: 'plan', label: 'Membership Plan' }
  ];

  // ──────────────────────────────────────────────────
  return (
    <div className="st-page">
      <div className="st-wrap">



        {/* ═══ MAIN PANEL ═══ */}
        <main className="st-main">
          
          {/* Top Header & Tabs */}
          <header className="st-header">
            <div className="st-header-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <div className="st-header-title">
                <h1>Settings</h1>
                <p>Control your profile setup and account preferences</p>
              </div>
              
              <div className="st-header-actions" style={{ display: 'flex', gap: '15px' }}>
                <button className="st-btn-remove" onClick={() => navigate('/')}>Return Home</button>
                <button className="st-btn-upload" onClick={() => { logout(); navigate('/signin'); }}>Sign Out</button>
              </div>
            </div>
            
            <div className="st-tabs" style={{ display: 'flex', justifyContent: 'flex-start', gap: '32px' }}>
              {SETTINGS_TABS.map(tab => (
                <button
                  key={tab.key}
                  className={`st-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </header>

          <div className="st-content">

            {message.text && (
              <div className={`st-alert st-alert-${message.type}`}>{message.text}</div>
            )}

            {/* ══════ PROFILE TAB ══════ */}
            {activeTab === 'profile' && (
              <div className="st-section">

                {/* Photo Card */}
                <div className="st-card st-photo-card">
                  <div className="st-photo-left">
                    <img src={avatarSrc} alt="Avatar" className="st-avatar-img" />
                    <div className="st-photo-info">
                      <h3>Upload a New Photo</h3>
                      <p>JPG, GIF or PNG. Max size 2MB.</p>
                    </div>
                  </div>
                  <div className="st-photo-actions">
                    {avatarPreview && (
                      <button type="button" className="st-btn-remove" onClick={handleRemoveAvatar}>Remove</button>
                    )}
                    <button type="button" className="st-btn-upload" onClick={handleAvatarClick} disabled={avatarUploading}>
                      {avatarUploading ? 'Uploading...' : 'Update'}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                  </div>
                </div>

                {/* Info Form Card */}
                <div className="st-card">
                  <div className="st-form-card-title">Change User Information</div>

                  <form onSubmit={handleSubmit}>
                    <div className="st-form-row">
                      <div className="st-field">
                        <label>First Name *</label>
                        <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" required />
                      </div>
                      <div className="st-field">
                        <label>Last Name *</label>
                        <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" required />
                      </div>
                    </div>

                    <div className="st-form-row">
                      <div className="st-field">
                        <label>Email Address *</label>
                        <input name="email" value={form.email} readOnly style={{ opacity: 0.6 }} />
                      </div>
                      <div className="st-field">
                        <label>Phone Number</label>
                        <input name="phone" value={form.phone} onChange={handleChange} placeholder="+213..." />
                      </div>
                    </div>

                    <div className="st-field st-field-full">
                      <label>Address *</label>
                      <input name="address" value={form.address} onChange={handleChange} placeholder="Street name, building..." required />
                    </div>

                    <div className="st-form-row">
                      <div className="st-field">
                        <label>City / Location</label>
                        <input name="location" value={form.location} onChange={handleChange} placeholder="City, Country" />
                      </div>
                      <div className="st-field">
                        <label>Country</label>
                        <select>
                          <option value="DZ">Algeria</option>
                          <option value="MA">Morocco</option>
                          <option value="TN">Tunisia</option>
                          <option value="US">United States</option>
                          <option value="UK">United Kingdom</option>
                        </select>
                      </div>
                    </div>

                    <div className="st-footer">
                      <button type="submit" className="st-btn-save" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Information'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ══════ PASSWORD TAB ══════ */}
            {activeTab === 'password' && (
              <div className="st-section">

                <div className="st-card st-pw-card">
                  <div>
                    <div className="st-pw-title">Change Password</div>
                    <div className="st-pw-hint">We recommend using a unique password that you don't use anywhere else.</div>
                  </div>

                  <form onSubmit={handlePasswordSubmit} style={{ marginTop: '28px' }}>
                    <div className="st-field st-field-full">
                      <label>Current Password</label>
                      <input type="password" name="currentPassword" value={passForm.currentPassword} onChange={handlePassChange} required />
                    </div>
                    <div className="st-form-row">
                      <div className="st-field">
                        <label>New Password</label>
                        <input type="password" name="newPassword" value={passForm.newPassword} onChange={handlePassChange} required />
                      </div>
                      <div className="st-field">
                        <label>Confirm New Password</label>
                        <input type="password" name="confirmPassword" value={passForm.confirmPassword} onChange={handlePassChange} required />
                      </div>
                    </div>
                    <div className="st-footer">
                      <button type="submit" className="st-btn-save" disabled={passLoading}>
                        {passLoading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ══════ ORDERS TAB ══════ */}
            {activeTab === 'orders' && (
              <div className="st-section">

                {ordersLoading ? (
                  <div className="st-card st-empty-card"><p>Loading your orders...</p></div>
                ) : orders.length === 0 ? (
                  <div className="st-card st-empty-card">
                    <i className="ti ti-package st-empty-icon" />
                    <p>You haven't placed any orders yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {orders.map(order => (
                      <div key={order._id} className="st-card" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <div>
                            <span style={{ fontWeight: 700, fontSize: '13px' }}>
                              #{order._id.slice(-8).toUpperCase()}
                            </span>
                            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <span
                            className={`st-alert st-alert-${order.status === 'confirmed' ? 'ok' : 'err'}`}
                            style={{ padding: '4px 12px', margin: 0, fontSize: '12px', borderRadius: '20px' }}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--muted)' }}>
                          {order.items?.map(i => i.title).join(', ')}
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--red)' }}>
                          {order.totalAmount?.toLocaleString()} DZD
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══════ PLAN TAB ══════ */}
            {activeTab === 'plan' && (
              <div className="st-section">

                <div className="st-card" style={{ borderLeft: `4px solid ${isPremium ? '#e5a020' : 'var(--red)'}` }}>
                  <div className="st-plan-current-label">Your Current Plan</div>
                  <div className="st-plan-name">{currentPlan}</div>
                  <div className="st-plan-date">Active subscription</div>
                  <div className="st-plan-features">
                    <div className="st-plan-feat">Secure account access</div>
                    <div className="st-plan-feat">24/7 basic support</div>
                    {isPremium && <div className="st-plan-feat">Premium marketplace features</div>}
                  </div>
                </div>

                {!isPremium && (
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--hint)', marginBottom: '14px', fontWeight: 700 }}>Available Upgrades</div>
                    <div className="st-form-row">
                      <div className="st-card" onClick={() => handleUpgradePlan('Business', 4990)} style={{ cursor: 'pointer' }}>
                        <div className="st-plan-name" style={{ fontSize: '20px' }}>Business</div>
                        <div style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--muted)' }}>4,990 DZD / mo</div>
                        <button className="st-btn-upload" style={{ width: '100%', justifyContent: 'center' }}>Upgrade</button>
                      </div>
                      <div className="st-card" onClick={() => handleUpgradePlan('VIP', 9990)} style={{ cursor: 'pointer' }}>
                        <div className="st-plan-name" style={{ fontSize: '20px' }}>VIP</div>
                        <div style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--muted)' }}>9,990 DZD / mo</div>
                        <button className="st-btn-upload" style={{ width: '100%', justifyContent: 'center' }}>Upgrade</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </main>

      </div>
    </div>
  );
}