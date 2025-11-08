// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Users, Stethoscope, Calendar, DollarSign } from 'lucide-react';
import { analyticsAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    revenue: {},
    patients: {},
    appointments: [],
    departments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [revenue, patients, appointments, departments] = await Promise.all([
        analyticsAPI.getRevenueSummary(),
        analyticsAPI.getPatientStats(),
        analyticsAPI.getAppointmentsToday(),
        analyticsAPI.getDepartmentStats()
      ]);

      setStats({
        revenue: revenue.data,
        patients: patients.data,
        appointments: appointments.data.appointments || [],
        departments: departments.data.departments || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '24px', fontSize: '28px', fontWeight: '700' }}>
        Dashboard
      </h1>

      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: '#dbeafe',
              padding: '12px',
              borderRadius: '8px'
            }}>
              <Users size={24} color="var(--primary)" />
            </div>
            <div>
              <div className="stat-value">
                {stats.patients.total_patients || 0}
              </div>
              <div className="stat-label">Total Patients</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: '#dcfce7',
              padding: '12px',
              borderRadius: '8px'
            }}>
              <Stethoscope size={24} color="var(--success)" />
            </div>
            <div>
              <div className="stat-value">
                {stats.patients.admitted_patients || 0}
              </div>
              <div className="stat-label">Admitted Patients</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: '#fef3c7',
              padding: '12px',
              borderRadius: '8px'
            }}>
              <Calendar size={24} color="var(--warning)" />
            </div>
            <div>
              <div className="stat-value">
                {stats.appointments.length}
              </div>
              <div className="stat-label">Today's Appointments</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: '#f0f9ff',
              padding: '12px',
              borderRadius: '8px'
            }}>
              <DollarSign size={24} color="var(--accent)" />
            </div>
            <div>
              <div className="stat-value">
                ${stats.revenue.total_revenue ? Number(stats.revenue.total_revenue).toLocaleString() : '0'}
              </div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Today's Appointments */}
        <div className="card">
          <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
            Today's Appointments
          </h3>
          {stats.appointments.length > 0 ? (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {stats.appointments.map((appt) => (
                <div key={appt.Appt_ID} style={{
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}>
                  <div style={{ fontWeight: '500' }}>
                    {appt.Patient_FName} {appt.Patient_LName}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-light)' }}>
                    Dr. {appt.Doctor_FName} {appt.Doctor_LName} • {appt.Time}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '20px' }}>
              No appointments today
            </p>
          )}
        </div>

        {/* Department Overview */}
        <div className="card">
          <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
            Departments
          </h3>
          {stats.departments.length > 0 ? (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {stats.departments.map((dept) => (
                <div key={dept.Dept_ID} style={{
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}>
                  <div style={{ fontWeight: '500' }}>{dept.Dept_Name}</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-light)' }}>
                    {dept.doctor_count || 0} Doctors • {dept.nurse_count || 0} Nurses
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '20px' }}>
              No department data
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;