// src/pages/Medicines.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Package, DollarSign } from 'lucide-react';
import { medicineAPI } from '../services/api';

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await medicineAPI.getAll();
      setMedicines(response.data.medicines || []);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await medicineAPI.delete(id);
        fetchMedicines();
      } catch (error) {
        console.error('Error deleting medicine:', error);
        alert('Error deleting medicine');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingMedicine) {
        await medicineAPI.update(editingMedicine.Medicine_ID, formData);
      } else {
        await medicineAPI.create(formData);
      }
      setShowModal(false);
      setEditingMedicine(null);
      fetchMedicines();
    } catch (error) {
      console.error('Error saving medicine:', error);
      alert('Error saving medicine');
    }
  };

  const filteredMedicines = medicines.filter(medicine =>
    medicine.M_Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading medicines...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Medicines</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} />
          Add Medicine
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
          placeholder="Search medicines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
          style={{ paddingLeft: '40px' }}
        />
      </div>

      {/* Medicines Table */}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Medicine Name</th>
              <th>Quantity</th>
              <th>Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map((medicine) => (
              <tr key={medicine.Medicine_ID}>
                <td>{medicine.Medicine_ID}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Package size={16} color="var(--primary)" />
                    {medicine.M_Name}
                  </div>
                </td>
                <td>
                  <span style={{
                    background: medicine.M_Quantity > 10 ? '#dcfce7' : '#fef3c7',
                    color: medicine.M_Quantity > 10 ? '#166534' : '#92400e',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {medicine.M_Quantity} units
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <DollarSign size={14} color="var(--success)" />
                    {medicine.M_Cost ? Number(medicine.M_Cost).toFixed(2) : '0.00'}
                  </div>
                </td>
                <td>
                  <div className="actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setEditingMedicine(medicine);
                        setShowModal(true);
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(medicine.Medicine_ID)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMedicines.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-light)' }}>
            No medicines found
          </p>
        )}
      </div>

      {/* Medicine Modal */}
      {showModal && (
        <MedicineModal
          medicine={editingMedicine}
          onClose={() => {
            setShowModal(false);
            setEditingMedicine(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

const MedicineModal = ({ medicine, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    m_name: medicine?.M_Name || '',
    m_quantity: medicine?.M_Quantity || 0,
    m_cost: medicine?.M_Cost || 0
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
            {medicine ? 'Edit Medicine' : 'Add New Medicine'}
          </h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Medicine Name *</label>
            <input
              type="text"
              name="m_name"
              value={formData.m_name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Quantity *</label>
              <input
                type="number"
                name="m_quantity"
                value={formData.m_quantity}
                onChange={handleChange}
                className="form-input"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cost per Unit ($)</label>
              <input
                type="number"
                name="m_cost"
                value={formData.m_cost}
                onChange={handleChange}
                className="form-input"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {medicine ? 'Update' : 'Create'} Medicine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Medicines;