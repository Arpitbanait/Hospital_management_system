// src/pages/Appointments.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Calendar, Clock, User, Stethoscope } from 'lucide-react';
import { appointmentAPI, patientAPI, doctorAPI } from '../services/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [filters, setFilters] = useState({
    patient_id: '',
    doctor_id: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = async (params = {}) => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getAll(params);
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await patientAPI.getAll(0, 1000);
      setPatients(response.data.patients || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.getAll();
      setDoctors(response.data.doctors || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentAPI.delete(id);
        fetchAppointments(filters);
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Error deleting appointment');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingAppointment) {
        await appointmentAPI.update(editingAppointment.Appt_ID, formData);
      } else {
        await appointmentAPI.create(formData);
      }
      setShowModal(false);
      setEditingAppointment(null);
      fetchAppointments(filters);
    } catch (error) {
      console.error('Error saving appointment:', error);
      alert('Error saving appointment');
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchAppointments(newFilters);
  };

  const formatDateTime = (dateStr, timeStr) => {
    const date = new Date(dateStr);
    const time = timeStr ? new Date(`1970-01-01T${timeStr}`) : null;
    
    return {
      date: date.toLocaleDateString(),
      time: time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'
    };
  };

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Appointments</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} />
          New Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Filter by Patient</label>
            <select
              value={filters.patient_id}
              onChange={(e) => handleFilterChange('patient_id', e.target.value)}
              className="form-input"
            >
              <option value="">All Patients</option>
              {patients.map(patient => (
                <option key={patient.Patient_ID} value={patient.Patient_ID}>
                  {patient.Patient_FName} {patient.Patient_LName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Filter by Doctor</label>
            <select
              value={filters.doctor_id}
              onChange={(e) => handleFilterChange('doctor_id', e.target.value)}
              className="form-input"
            >
              <option value="">All Doctors</option>
              {doctors.map(doctor => (
                <option key={doctor.Doctor_ID} value={doctor.Doctor_ID}>
                  Dr. {doctor.Emp_FName} {doctor.Emp_LName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="grid grid-2">
        {appointments.map((appt) => {
          const { date, time } = formatDateTime(appt.Date, appt.Time);
          const scheduledDate = new Date(appt.Scheduled_On).toLocaleDateString();
          
          return (
            <div key={appt.Appt_ID} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                    {appt.Patient_FName} {appt.Patient_LName}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-light)' }}>
                    <Stethoscope size={14} />
                    Dr. {appt.Doctor_FName} {appt.Doctor_LName}
                  </div>
                </div>
                <span style={{
                  background: '#dbeafe',
                  color: 'var(--primary)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {appt.Specialization}
                </span>
              </div>

              <div style={{ display: 'grid', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <Calendar size={14} color="var(--primary)" />
                  <strong>Date:</strong> {date}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <Clock size={14} color="var(--primary)" />
                  <strong>Time:</strong> {time}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                  Scheduled on: {scheduledDate}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setEditingAppointment(appt);
                    setShowModal(true);
                  }}
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => handleDelete(appt.Appt_ID)}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {appointments.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-light)', fontSize: '16px' }}>
            No appointments found
          </p>
        </div>
      )}

      {/* Appointment Modal */}
      {showModal && (
        <AppointmentModal
          appointment={editingAppointment}
          patients={patients}
          doctors={doctors}
          onClose={() => {
            setShowModal(false);
            setEditingAppointment(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

const AppointmentModal = ({ appointment, patients, doctors, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    scheduled_on: appointment?.Scheduled_On ? new Date(appointment.Scheduled_On).toISOString().slice(0, 16) : '',
    date: appointment?.Date || '',
    time: appointment?.Time || '',
    doctor_id: appointment?.Doctor_ID || '',
    patient_id: appointment?.Patient_ID || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert datetime-local to proper format
    const submitData = {
      ...formData,
      scheduled_on: formData.scheduled_on ? new Date(formData.scheduled_on).toISOString() : new Date().toISOString()
    };
    
    onSubmit(submitData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">
            {appointment ? 'Edit Appointment' : 'New Appointment'}
          </h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Patient *</label>
            <select
              name="patient_id"
              value={formData.patient_id}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select Patient</option>
              {patients.map(patient => (
                <option key={patient.Patient_ID} value={patient.Patient_ID}>
                  {patient.Patient_FName} {patient.Patient_LName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Doctor *</label>
            <select
              name="doctor_id"
              value={formData.doctor_id}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.Doctor_ID} value={doctor.Doctor_ID}>
                  Dr. {doctor.Emp_FName} {doctor.Emp_LName} - {doctor.Specialization}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Appointment Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Appointment Time *</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Scheduled On</label>
            <input
              type="datetime-local"
              name="scheduled_on"
              value={formData.scheduled_on}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {appointment ? 'Update' : 'Create'} Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Appointments;
