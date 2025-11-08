// src/pages/Patients.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { patientAPI } from '../services/api';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getAll();
      setPatients(response.data.patients || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientAPI.delete(id);
        fetchPatients(); // Refresh the list
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert('Error deleting patient');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingPatient) {
        await patientAPI.update(editingPatient.Patient_ID, formData);
      } else {
        await patientAPI.create(formData);
      }
      setShowModal(false);
      setEditingPatient(null);
      fetchPatients();
    } catch (error) {
      console.error('Error saving patient:', error);
      alert('Error saving patient');
    }
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.Patient_FName} ${patient.Patient_LName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.Phone?.includes(searchTerm) ||
    patient.Email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading patients...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Patients</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} />
          Add Patient
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
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
          style={{ paddingLeft: '40px' }}
        />
      </div>

      {/* Patients Table */}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Blood Type</th>
              <th>Condition</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.Patient_ID}>
                <td>{patient.Patient_ID}</td>
                <td>{patient.Patient_FName} {patient.Patient_LName}</td>
                <td>{patient.Phone}</td>
                <td>{patient.Email || '-'}</td>
                <td>{patient.Blood_Type}</td>
                <td>{patient.Condition_ || '-'}</td>
                <td>
                  <div className="actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setEditingPatient(patient);
                        setShowModal(true);
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(patient.Patient_ID)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPatients.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-light)' }}>
            No patients found
          </p>
        )}
      </div>

      {/* Patient Modal */}
      {showModal && (
        <PatientModal
          patient={editingPatient}
          onClose={() => {
            setShowModal(false);
            setEditingPatient(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

// Updated PatientModal component in src/pages/Patients.jsx
const PatientModal = ({ patient, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    patient_fname: patient?.Patient_FName || '',
    patient_lname: patient?.Patient_LName || '',
    phone: patient?.Phone || '',
    blood_type: patient?.Blood_Type || '',
    email: patient?.Email || '',
    gender: patient?.Gender || '',
    condition: patient?.Condition_ || '',
    admission_date: patient?.Admission_Date || '',
    discharge_date: patient?.Discharge_Date || ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors = {};
    if (!formData.patient_fname.trim()) newErrors.patient_fname = 'First name is required';
    if (!formData.patient_lname.trim()) newErrors.patient_lname = 'Last name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.blood_type) newErrors.blood_type = 'Blood type is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare data for backend - convert empty strings to null for optional fields
    const submitData = {
      patient_fname: formData.patient_fname.trim(),
      patient_lname: formData.patient_lname.trim(),
      phone: formData.phone.trim(),
      blood_type: formData.blood_type,
      email: formData.email.trim() || null, // Convert empty string to null
      gender: formData.gender || null,
      condition: formData.condition.trim() || null,
      admission_date: formData.admission_date || null,
      discharge_date: formData.discharge_date || null
    };

    // Log the data being sent for debugging
    console.log('Submitting patient data:', submitData);

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error in form submission:', error);
      if (error.response?.data?.detail) {
        // Handle backend validation errors
        alert(`Error: ${JSON.stringify(error.response.data.detail)}`);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">
            {patient ? 'Edit Patient' : 'Add New Patient'}
          </h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                name="patient_fname"
                value={formData.patient_fname}
                onChange={handleChange}
                className={`form-input ${errors.patient_fname ? 'error' : ''}`}
                required
                maxLength="20"
              />
              {errors.patient_fname && <span className="error-text">{errors.patient_fname}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                name="patient_lname"
                value={formData.patient_lname}
                onChange={handleChange}
                className={`form-input ${errors.patient_lname ? 'error' : ''}`}
                required
                maxLength="20"
              />
              {errors.patient_lname && <span className="error-text">{errors.patient_lname}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`form-input ${errors.phone ? 'error' : ''}`}
              required
              maxLength="12"
              placeholder="e.g., 123-456-7890"
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Blood Type *</label>
              <select
                name="blood_type"
                value={formData.blood_type}
                onChange={handleChange}
                className={`form-input ${errors.blood_type ? 'error' : ''}`}
                required
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              {errors.blood_type && <span className="error-text">{errors.blood_type}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
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
              maxLength="50"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Condition</label>
            <input
              type="text"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="form-input"
              maxLength="30"
              placeholder="e.g., Stable, Critical, etc."
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Admission Date</label>
              <input
                type="date"
                name="admission_date"
                value={formData.admission_date}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Discharge Date</label>
              <input
                type="date"
                name="discharge_date"
                value={formData.discharge_date}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {patient ? 'Update' : 'Create'} Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Patients;