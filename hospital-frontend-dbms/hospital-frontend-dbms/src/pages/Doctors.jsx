// src/pages/Doctors.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, GraduationCap, Building } from 'lucide-react';
import { doctorAPI, departmentAPI, staffAPI } from '../services/api';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
    fetchStaff();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getAll();
      setDoctors(response.data.doctors || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentAPI.getAll();
      setDepartments(response.data.departments || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await staffAPI.getAll();
      setStaff(response.data.staff || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await doctorAPI.delete(id);
        fetchDoctors();
      } catch (error) {
        console.error('Error deleting doctor:', error);
        alert('Error deleting doctor');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingDoctor) {
        await doctorAPI.update(editingDoctor.Doctor_ID, formData);
      } else {
        await doctorAPI.create(formData);
      }
      setShowModal(false);
      setEditingDoctor(null);
      fetchDoctors();
    } catch (error) {
      console.error('Error saving doctor:', error);
      alert('Error saving doctor: ' + (error.response?.data?.detail || error.message));
    }
  };

  if (loading) {
    return <div className="loading">Loading doctors...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Doctors</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} />
          Add Doctor
        </button>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-3">
        {doctors.map((doctor) => (
          <div key={doctor.Doctor_ID} className="card">
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                Dr. {doctor.Emp_FName} {doctor.Emp_LName}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-light)' }}>
                <GraduationCap size={14} />
                {doctor.Qualifications}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                {doctor.Specialization}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-light)' }}>
                <Building size={14} />
                {doctor.Dept_Name}
              </div>
            </div>

            {doctor.Email && (
              <div style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '16px' }}>
                📧 {doctor.Email}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
                onClick={() => {
                  setEditingDoctor(doctor);
                  setShowModal(true);
                }}
              >
                <Edit size={14} />
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                style={{ flex: 1 }}
                onClick={() => handleDelete(doctor.Doctor_ID)}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {doctors.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-light)', fontSize: '16px' }}>
            No doctors found
          </p>
        </div>
      )}

      {/* Doctor Modal */}
      {showModal && (
        <DoctorModal
          doctor={editingDoctor}
          departments={departments}
          staff={staff}
          onClose={() => {
            setShowModal(false);
            setEditingDoctor(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

const DoctorModal = ({ doctor, departments, staff, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    qualifications: doctor?.Qualifications || '',
    emp_id: doctor?.Emp_ID || '',
    specialization: doctor?.Specialization || '',
    dept_id: doctor?.Dept_ID || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors = {};
    if (!formData.qualifications.trim()) newErrors.qualifications = 'Qualifications are required';
    if (!formData.emp_id) newErrors.emp_id = 'Staff member is required';
    if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
    if (!formData.dept_id) newErrors.dept_id = 'Department is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare data for backend - ensure dept_id is number
    const submitData = {
      qualifications: formData.qualifications.trim(),
      emp_id: parseInt(formData.emp_id),
      specialization: formData.specialization.trim(),
      dept_id: parseInt(formData.dept_id)
    };

    console.log('Submitting doctor data:', submitData);
    onSubmit(submitData);
  };

  // Filter staff to show only those who are not already doctors
  const availableStaff = staff.filter(staffMember => {
    // If editing, include the current doctor's staff record
    if (doctor && staffMember.Emp_ID === doctor.Emp_ID) {
      return true;
    }
    // Otherwise, only show staff who are not already doctors
    return !staffMember.isDoctor;
  });

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">
            {doctor ? 'Edit Doctor' : 'Add New Doctor'}
          </h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Staff Member *</label>
            <select
              name="emp_id"
              value={formData.emp_id}
              onChange={handleChange}
              className={`form-input ${errors.emp_id ? 'error' : ''}`}
              required
              disabled={!!doctor} // Disable when editing (emp_id shouldn't change)
            >
              <option value="">Select Staff Member</option>
              {availableStaff.map(staffMember => (
                <option key={staffMember.Emp_ID} value={staffMember.Emp_ID}>
                  {staffMember.Emp_FName} {staffMember.Emp_LName} 
                  {staffMember.Emp_Type && ` - ${staffMember.Emp_Type}`}
                  {staffMember.Dept_Name && ` (${staffMember.Dept_Name})`}
                </option>
              ))}
            </select>
            {errors.emp_id && <span className="error-text">{errors.emp_id}</span>}
            {doctor && (
              <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '4px' }}>
                Staff member cannot be changed for existing doctors
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Qualifications *</label>
            <input
              type="text"
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              className={`form-input ${errors.qualifications ? 'error' : ''}`}
              required
              maxLength="15"
              placeholder="e.g., MD, MBBS, PhD"
            />
            {errors.qualifications && <span className="error-text">{errors.qualifications}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Specialization *</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className={`form-input ${errors.specialization ? 'error' : ''}`}
              required
              maxLength="20"
              placeholder="e.g., Cardiology, Neurology"
            />
            {errors.specialization && <span className="error-text">{errors.specialization}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Department *</label>
            <select
              name="dept_id"
              value={formData.dept_id}
              onChange={handleChange}
              className={`form-input ${errors.dept_id ? 'error' : ''}`}
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.Dept_ID} value={dept.Dept_ID}>
                  {dept.Dept_Name} {dept.Dept_Head && `- Head: ${dept.Dept_Head}`}
                </option>
              ))}
            </select>
            {errors.dept_id && <span className="error-text">{errors.dept_id}</span>}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {doctor ? 'Update' : 'Create'} Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Doctors;