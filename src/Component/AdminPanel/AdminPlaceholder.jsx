import React from 'react';
import { useLocation } from 'react-router-dom';
import './AdminPlaceholder.css';

export default function AdminPlaceholder() {
  const location = useLocation();

  // Parse path like "/admin/user-management/kyc" -> "User Management: Kyc"
  const getPathTitle = (pathname) => {
    const paths = pathname.split('/').filter(p => p !== 'admin' && p !== '');
    if (paths.length === 0) return 'Under Construction';
    
    return paths.map(str => {
      return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }).join(' › ');
  };

  const title = getPathTitle(location.pathname);

  return (
    <div className="admin-placeholder-container">
      <div className="placeholder-content">
        <div className="placeholder-icon"></div>
        <h1 className="placeholder-title">{title}</h1>
        <p className="placeholder-description">
          This module is currently being built. Check back soon for powerful new features and advanced administrative controls.
        </p>
        <div className="placeholder-features">
          <span className="feat-badge">Coming Soon</span>
          <span className="feat-badge">Advanced Controls</span>
          <span className="feat-badge">Live Analytics</span>
        </div>
      </div>
    </div>
  );
}
