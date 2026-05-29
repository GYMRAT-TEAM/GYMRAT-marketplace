import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GymRatBadge from '../Common/GymRatBadge';
import './AdminLayout.css';
import logoImg from '../Assets/logo.png';

const CORE_MODULES = [
  {
    category: 'OVERVIEW',
    items: [
      { title: 'Dashboard', id: 'dashboard', path: '/admin', icon: '', badge: null },
      { title: 'Analytics', id: 'analytics_main', path: '/admin/analytics', icon: '', badge: null }
    ]
  },
  {
    category: 'MANAGEMENT',
    items: [
      {
        title: 'Users',
        id: 'users',
        icon: '',
        badge: 24,
        links: [
          { label: 'All Users', path: '/admin/users' },
          { label: 'KYC Verification', path: '/admin/users/kyc' },
          { label: 'Roles & Permissions', path: '/admin/users/roles' }
        ]
      },
      {
        title: 'Products',
        id: 'products',
        icon: '',
        badge: null,
        links: [
          { label: 'All Listings', path: '/admin/products' },
          { label: 'Categories & Tags', path: '/admin/products/categories' },
          { label: 'Bulk Moderation', path: '/admin/products/bulk' }
        ]
      },
      {
        title: 'Orders',
        id: 'orders',
        icon: '',
        badge: 7,
        links: [
          { label: 'All Orders', path: '/admin/orders' },
          { label: 'Disputes & Refunds', path: '/admin/orders/disputes' },
          { label: 'Shipping', path: '/admin/orders/shipping' }
        ]
      },
      {
        title: 'Payments',
        id: 'finance',
        icon: '',
        badge: null,
        links: [
          { label: 'Transactions', path: '/admin/finance/transactions' },
          { label: 'Seller Payouts', path: '/admin/finance/payouts' },
          { label: 'Fees Config', path: '/admin/finance/fees' }
        ]
      }
    ]
  },
  {
    category: 'COMPLIANCE',
    items: [
      {
        title: 'KYC Verify',
        id: 'kyc_verify',
        icon: '',
        badge: 3,
        links: [
          { label: 'Pending Reviews', path: '/admin/moderation/reviews' },
          { label: 'Spam & Fraud', path: '/admin/moderation/spam' }
        ]
      },
      { title: 'Fraud & Risk', id: 'fraud', path: '/admin/fraud', icon: '', badge: null },
      { title: 'Disputes', id: 'disputes_main', path: '/admin/disputes', icon: '', badge: null }
    ]
  },
  {
    category: 'PLATFORM',
    items: [
      {
        title: 'SEO Settings',
        id: 'settings',
        icon: '',
        badge: null,
        links: [
          { label: 'Platform Settings', path: '/admin/settings/platform' },
          { label: 'Shipping Zones', path: '/admin/settings/shipping' },
          { label: 'SEO', path: '/admin/settings/seo' }
        ]
      }
    ]
  }
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openSections, setOpenSections] = useState({ users: true });

  // Redirect if not business/VIP or not logged in
  if (!user || (user.plan === 'Free' && user.role !== 'super_admin')) {
    return (
      <div className="admin-unauthorized">
        <h2>Access Denied</h2>
        <p>You need a VIP or Business plan to access the Admin Panel.</p>
        <button onClick={() => navigate('/')}>Return to Home</button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSection = (id) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar custom-scrollbar">
        <div className="admin-sidebar-header" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="admin-header-brand">
            <img src={logoImg} alt="GymRat" className="admin-sidebar-logo" />
            <div className="admin-brand-text">
              <div className="admin-logo-main">GYMRAT</div>

              <div className="admin-logo-sub">MARKETPLACE</div>
            </div>
          </div>
          <div className="admin-sidebar-subtitle">ADMIN PANEL</div>
        </div>

        <div className="admin-sidebar-nav">
          {CORE_MODULES.map(group => (
            <div key={group.category} className="nav-group">
              <div className="nav-group-title">{group.category}</div>

              {group.items.map(item => (
                <div key={item.id} className="accordion-section">
                  {item.links ? (
                    <>
                      <button
                        className={`accordion-header ${openSections[item.id] ? 'open' : ''}`}
                        onClick={() => toggleSection(item.id)}
                      >
                        <div className="accordion-title">
                          {item.title}
                        </div>
                        <div className="accordion-end">
                          {item.badge && <span className="nav-badge">{item.badge}</span>}
                          <span className="accordion-chevron">›</span>
                        </div>
                      </button>

                      <div className={`accordion-body ${openSections[item.id] ? 'expanded' : ''}`}>
                        {item.links.map(link => (
                          <button
                            key={link.path}
                            className={`accordion-link ${location.pathname === link.path ? 'active' : ''}`}
                            onClick={() => navigate(link.path)}
                          >
                            {link.label}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <button
                      className={`admin-nav-item single-link ${location.pathname === item.path ? 'active' : ''}`}
                      onClick={() => navigate(item.path)}
                    >
                      <div className="accordion-title">
                        {item.title}
                      </div>
                      {item.badge && <span className="nav-badge special">{item.badge}</span>}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>Log Out</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-header">
          <div className="admin-header-search">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="admin-header-profile">
            <div className="admin-profile-info">
              <div className="admin-name-wrapper">
                <span className="admin-profile-name">{user.email.split('@')[0] || 'Admin User'}</span>
                {(user.role === 'super_admin' || user.plan === 'VIP' || user.plan === 'Business') && (
                  <GymRatBadge 
                    size={16} 
                    className="admin-name-badge" 
                    variant={user.role === 'super_admin' ? "superadmin" : "premium"}
                  />
                )}
              </div>
              <span className="admin-profile-role">{user.role === 'super_admin' ? 'Super Admin' : `${user.plan} Admin`}</span>
            </div>
            <div className="admin-profile-avatar">
              {user.email.charAt(0).toUpperCase() || 'A'}
              {(user.role === 'super_admin' || user.plan === 'VIP' || user.plan === 'Business') && (
                <GymRatBadge 
                  size={14} 
                  className="admin-avatar-badge" 
                  variant={user.role === 'super_admin' ? "superadmin" : "premium"}
                />
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content-scroll custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
