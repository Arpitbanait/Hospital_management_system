// src/pages/Staff.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Mail, MapPin, Building } from 'lucide-react';
import { staffAPI, departmentAPI } from '../services/api';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStaff();
    fetchDepartments();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await staffAPI.getAll();
      setStaff(response.data.staff || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await staffAPI.delete(id);
        fetchStaff();
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert('Error deleting staff member');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingStaff) {
        await staffAPI.update(editingStaff.Emp_ID, formData);
      } else {
        await staffAPI.create(formData);
      }
      setShowModal(false);
      setEditingStaff(null);
      fetchStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
      alert('Error saving staff member');
    }
  };

  const filteredStaff = staff.filter(staffMember =>
    `${staffMember.Emp_FName} ${staffMember.Emp_LName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffMember.Emp_Type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffMember.Email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading staff...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Staff</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} />
          Add Staff
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <Search size={20} style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-light)'
        }} />
        <input
          type="text"
          placeholder="Search staff..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
          style={{ paddingLeft: '40px' }}
        />
      </div>

      {/* Staff Grid */}
      <div className="grid grid-3">
        {filteredStaff.map((staffMember) => (
          <div key={staffMember.Emp_ID} className="card">
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                {staffMember.Emp_FName} {staffMember.Emp_LName}
              </h3>
              <span style={{
                background: '#dbeafe',
                color: 'var(--primary)',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {staffMember.Emp_Type}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {staffMember.Email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-light)' }}>
                  <Mail size={14} />
                  {staffMember.Email}
                </div>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-light)' }}>
                <Building size={14} />
                {staffMember.Dept_Name}
              </div>

              {staffMember.Address && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-light)' }}>
                  <MapPin size={14} />
                  <span style={{ fontSize: '12px' }}>{staffMember.Address}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
                onClick={() => {
                  setEditingStaff(staffMember);
                  setShowModal(true);
                }}
              >
                <Edit size={14} />
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                style={{ flex: 1 }}
                onClick={() => handleDelete(staffMember.Emp_ID)}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-light)', fontSize: '16px' }}>
            No staff members found
          </p>
        </div>
      )}

      {/* Staff Modal */}
      {showModal && (
        <StaffModal
          staff={editingStaff}
          departments={departments}
          onClose={() => {
            setShowModal(false);
            setEditingStaff(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

const StaffModal = ({ staff, departments, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    emp_fname: staff?.Emp_FName || '',
    emp_lname: staff?.Emp_LName || '',
    date_joining: staff?.Date_Joining || '',
    date_separation: staff?.Date_Seperation || '',
    emp_type: staff?.Emp_Type || '',
    email: staff?.Email || '',
    address: staff?.Address || '',
    dept_id: staff?.Dept_ID || '',
    ssn: staff?.SSN || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">
            {staff ? 'Edit Staff Member' : 'Add New Staff Member'}
          </h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                name="emp_fname"
                value={formData.emp_fname}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                name="emp_lname"
                value={formData.emp_lname}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Employee Type *</label>
              <select
                name="emp_type"
                value={formData.emp_type}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Select Type</option>
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Administrative">Administrative</option>
                <option value="Technical">Technical</option>
                <option value="Support">Support</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">SSN *</label>
              <input
                type="number"
                name="ssn"
                value={formData.ssn}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Joining Date</label>
              <input
                type="date"
                name="date_joining"
                value={formData.date_joining}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Separation Date</label>
              <input
                type="date"
                name="date_separation"
                value={formData.date_separation}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department *</label>
            <select
              name="dept_id"
              value={formData.dept_id}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.Dept_ID} value={dept.Dept_ID}>
                  {dept.Dept_Name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {staff ? 'Update' : 'Create'} Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Staff;