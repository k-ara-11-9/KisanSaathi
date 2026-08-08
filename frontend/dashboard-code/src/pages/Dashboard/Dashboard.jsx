import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import QuickActions from '../../components/dashboard/QuickActions';
import StatsCards, { HealthRing } from '../../components/dashboard/StatsCards';
import { SproutMonitoringCard } from '../../components/dashboard/RecentActivity';
import RecentActivity from '../../components/dashboard/RecentActivity';
import { HealthTrackingCard } from '../../components/dashboard/NotificationWidget';
import NotificationWidget from '../../components/dashboard/NotificationWidget';
import AreaPredictionCard from '../../components/dashboard/AreaPredictionCard';
// import { useFetch } from '../../hooks/useFetch';
// import { getDashboardSummary } from '../../services/api';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  // Replace with: const { data, loading } = useFetch(() => getDashboardSummary());
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <Loader block label="Loading your farm overview..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-heading">
        <div className="eyebrow">Smart Agriculture Platform</div>
        <h1>Grow with AI Farming Tech</h1>
      </div>

      {/* Quick action tiles → Disease Detection / Recommendation / Mandi / Chat */}
      <div style={{ marginBottom: 20 }}>
        <QuickActions />
      </div>

      {/* Quick metric tiles: leaf samples, soil moisture, chlorophyll level */}
      <div style={{ marginBottom: 20 }}>
        <StatsCards />
      </div>

      <div className="dash-grid">
        {/* Left column: Sprout Monitoring (chart + plant sections) */}
        <div className="col-5">
          <SproutMonitoringCard />
        </div>

        {/* Middle column: Health score ring + area prediction scan */}
        <div className="col-4">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Card title="Crop Health Score">
              <HealthRing score={80} />
            </Card>
            <AreaPredictionCard status="Checking..." good />
          </div>
        </div>

        {/* Right column: Health Tracking + Notifications */}
        <div className="col-3">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <HealthTrackingCard />
          </div>
        </div>
      </div>

      <div className="dash-grid" style={{ marginTop: 20 }}>
        <div className="col-6">
          <RecentActivity />
        </div>
        <div className="col-6">
          <NotificationWidget />
        </div>
      </div>
    </DashboardLayout>
  );
}
