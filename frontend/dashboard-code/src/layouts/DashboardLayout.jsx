import React from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import '../styles/dashboard.css';

export default function DashboardLayout({ children }) {
  return (
    <div className="dash-shell">
      <Sidebar />
      <main className="dash-main">
        <Navbar />
        {children}
      </main>
    </div>
  );
}
