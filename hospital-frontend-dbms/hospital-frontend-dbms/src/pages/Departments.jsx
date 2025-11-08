// src/pages/Departments.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Crown } from 'lucide-react';
import { departmentAPI } from '../services/api';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentAPI.getAll();
      setDepartments(response.data.departments || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentAPI.delete(id);
        fetchDepartments();
      } catch (error) {
        console.error('Error deleting department:', error);
        alert('Error deleting department');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingDepartment) {
        await departmentAPI.update(editingDepartment.Dept_ID, formData);
      } else {
        await departmentAPI.create(formData);
      }
      setShowModal(false);
      setEditingDepartment(null);
      fetchDepartments();
    } catch (error) {
      console.error('Error saving department:', error);
      alert('Error saving department');
    }
  };

  if (loading) {
    return <div className="loading">Loading departments...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Departments</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} />
          Add Department
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-3">
        {departments.map((dept) => (
          <div key={dept.Dept_ID} className="card">
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                {dept.Dept_Name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-light)' }}>
                <Crown size={14} />
                {dept.Dept_Head}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '14px', color: 'var(--text-light)' }}>
              <Users size={14} />
              {dept.Emp_Count || 0} employees
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
                onClick={() => {
                  setEditingDepartment(dept);
                  setShowModal(true);
                }}
              >
                <Edit size={14} />
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                style={{ flex: 1 }}
                onClick={() => handleDelete(dept.Dept_ID)}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {departments.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-light)', fontSize: '16px' }}>
            No departments found
          </p>
        </div>
      )}

      {/* Department Modal */}
      {showModal && (
        <DepartmentModal
          department={editingDepartment}
          onClose={() => {
            setShowModal(false);
            setEditingDepartment(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

const DepartmentModal = ({ department, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    dept_head: department?.Dept_Head || '',
    dept_name: department?.Dept_Name || '',
    emp_count: department?.Emp_Count || 0
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
            {department ? 'Edit Department' : 'Add New Department'}
          </h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Department Name *</label>
            <input
              type="text"
              name="dept_name"
              value={formData.dept_name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department Head *</label>
            <input
              type="text"
              name="dept_head"
              value={formData.dept_head}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Employee Count</label>
            <input
              type="number"
              name="emp_count"
              value={formData.emp_count}
              onChange={handleChange}
              className="form-input"
              min="0"
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {department ? 'Update' : 'Create'} Department
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Departments;