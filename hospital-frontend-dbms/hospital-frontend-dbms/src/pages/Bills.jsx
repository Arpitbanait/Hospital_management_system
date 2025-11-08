// src/pages/Bills.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Search, DollarSign, FileText, User } from 'lucide-react';
import { billAPI, patientAPI, insuranceAPI } from '../services/api';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [insurancePolicies, setInsurancePolicies] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingBills, setLoadingBills] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      fetchPatientBills(selectedPatient);
      fetchPatientInsurance(selectedPatient);
    } else {
      // clear data and stop any "bills" loading indicator
      setBills([]);
      setInsurancePolicies([]);
      setLoadingBills(false);
    }
  }, [selectedPatient]);

  const fetchPatients = async () => {
    setLoadingPatients(true);
    try {
      const response = await patientAPI.getAll(0, 1000);
      setPatients(response.data.patients || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  };

  const fetchPatientBills = async (patientId) => {
    setLoadingBills(true);
    try {
      const response = await billAPI.getByPatientId(patientId);
      setBills(response.data.bills || []);
    } catch (error) {
      console.error('Error fetching bills:', error);
      setBills([]);
    } finally {
      setLoadingBills(false);
    }
  };

  const fetchPatientInsurance = async (patientId) => {
    try {
      const response = await insuranceAPI.getByPatientId(patientId);
      setInsurancePolicies(response.data.insurance || []);
    } catch (error) {
      console.error('Error fetching insurance:', error);
      setInsurancePolicies([]);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await billAPI.create(formData);
      setShowModal(false);
      if (selectedPatient) {
        fetchPatientBills(selectedPatient);
      }
    } catch (error) {
      console.error('Error creating bill:', error);
      alert('Error creating bill');
    }
  };

  const calculateTotal = (bill) => {
    const roomCost = Number(bill.Room_Cost) || 0;
    const testCost = Number(bill.Test_Cost) || 0;
    const otherCharges = Number(bill.Other_Charges) || 0;
    const medicineCost = Number(bill.M_Cost) || 0;
    return roomCost + testCost + otherCharges + medicineCost;
  };

  // Show patient-loading if patient list is still loading
  if (loadingPatients) {
    return <div className="loading">Loading patients...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Bills</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          disabled={!selectedPatient}
        >
          <Plus size={20} />
          New Bill
        </button>
      </div>

      {/* Patient Selection */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="form-group">
          <label className="form-label">Select Patient</label>
          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="form-input"
          >
            <option value="">Choose a patient...</option>
            {patients.map(patient => (
              <option key={patient.Patient_ID} value={patient.Patient_ID}>
                {patient.Patient_FName} {patient.Patient_LName} - {patient.Phone}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedPatient ? (
        <>
          {/* Insurance Policies */}
          {insurancePolicies.length > 0 && (
            <div className="card" style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
                Insurance Policies
              </h3>
              <div className="grid grid-2">
                {insurancePolicies.map((policy) => (
                  <div key={policy.Policy_Number} style={{
                    padding: '16px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    background: '#f0f9ff'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                      {policy.Provider} - {policy.Plan}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-light)' }}>
                      Policy: {policy.Policy_Number}
                      {policy.Coverage && ` • Coverage: ${policy.Coverage}`}
                      {policy.Co_Pay && ` • Co-pay: $${policy.Co_Pay}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bills List */}
          {loadingBills ? (
            <div className="loading">Loading bills...</div>
          ) : (
            <div className="grid grid-2">
              {bills.map((bill) => {
                const total = calculateTotal(bill);
                const remaining = Number(bill.Remaining_Balance) || 0;
                const paid = total - remaining;

                return (
                  <div key={bill.Bill_ID} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                          Bill #{bill.Bill_ID}
                        </h3>
                        <div style={{ fontSize: '14px', color: 'var(--text-light)' }}>
                          {bill.Date ? new Date(bill.Date).toLocaleDateString() : 'No date'}
                        </div>
                      </div>
                      <span style={{
                        background: remaining === 0 ? '#dcfce7' : '#fef3c7',
                        color: remaining === 0 ? '#166534' : '#92400e',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {remaining === 0 ? 'Paid' : `$${remaining} due`}
                      </span>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', fontSize: '14px', marginBottom: '8px' }}>
                        <span>Room Cost:</span>
                        <span>${Number(bill.Room_Cost || 0).toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', fontSize: '14px', marginBottom: '8px' }}>
                        <span>Test Cost:</span>
                        <span>${Number(bill.Test_Cost || 0).toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', fontSize: '14px', marginBottom: '8px' }}>
                        <span>Medicine Cost:</span>
                        <span>${Number(bill.M_Cost || 0).toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', fontSize: '14px', marginBottom: '8px' }}>
                        <span>Other Charges:</span>
                        <span>${Number(bill.Other_Charges || 0).toFixed(2)}</span>
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        paddingTop: '8px',
                        borderTop: '2px solid var(--border)'
                      }}>
                        <span>Total Amount:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {bill.Policy_Number && (
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--text-light)',
                        padding: '8px',
                        background: '#f8fafc',
                        borderRadius: '6px'
                      }}>
                        Insurance: {bill.Policy_Number}
                        {bill.Provider && ` • ${bill.Provider}`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {bills.length === 0 && !loadingBills && (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <FileText size={48} color="var(--text-light)" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--text-light)', fontSize: '16px', marginBottom: '8px' }}>
                No bills found for this patient
              </p>
              <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
                Create a new bill to get started
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <User size={48} color="var(--text-light)" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-light)', fontSize: '16px' }}>
            Please select a patient to view and create bills
          </p>
        </div>
      )}

      {/* Bill Modal */}
      {showModal && (
        <BillModal
          patientId={selectedPatient}
          insurancePolicies={insurancePolicies}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

const BillModal = ({ patientId, insurancePolicies, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    patient_id: patientId,
    policy_number: '',
    room_cost: '',
    test_cost: '',
    other_charges: '',
    m_cost: '',
    total: '',
    remaining_balance: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });

    // Auto-calculate total if cost fields change
    if (['room_cost', 'test_cost', 'other_charges', 'm_cost'].includes(e.target.name)) {
      const roomCost = Number(formData.room_cost || 0);
      const testCost = Number(formData.test_cost || 0);
      const otherCharges = Number(formData.other_charges || 0);
      const medicineCost = Number(formData.m_cost || 0);
      const total = roomCost + testCost + otherCharges + medicineCost;

      setFormData(prev => ({
        ...prev,
        total: total.toString(),
        remaining_balance: total.toString()
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      room_cost: formData.room_cost ? Number(formData.room_cost) : null,
      test_cost: formData.test_cost ? Number(formData.test_cost) : null,
      other_charges: formData.other_charges ? Number(formData.other_charges) : null,
      m_cost: formData.m_cost ? Number(formData.m_cost) : null,
      total: Number(formData.total),
      remaining_balance: formData.remaining_balance ? Number(formData.remaining_balance) : Number(formData.total),
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString()
    };

    onSubmit(submitData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Create New Bill</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Bill Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {insurancePolicies.length > 0 && (
            <div className="form-group">
              <label className="form-label">Insurance Policy</label>
              <select
                name="policy_number"
                value={formData.policy_number}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">No Insurance</option>
                {insurancePolicies.map(policy => (
                  <option key={policy.Policy_Number} value={policy.Policy_Number}>
                    {policy.Provider} - {policy.Policy_Number}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Room Cost ($)</label>
              <input
                type="number"
                name="room_cost"
                value={formData.room_cost}
                onChange={handleChange}
                className="form-input"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Test Cost ($)</label>
              <input
                type="number"
                name="test_cost"
                value={formData.test_cost}
                onChange={handleChange}
                className="form-input"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Medicine Cost ($)</label>
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

            <div className="form-group">
              <label className="form-label">Other Charges ($)</label>
              <input
                type="number"
                name="other_charges"
                value={formData.other_charges}
                onChange={handleChange}
                className="form-input"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Total Amount ($)</label>
              <input
                type="number"
                name="total"
                value={formData.total}
                onChange={handleChange}
                className="form-input"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Remaining Balance ($)</label>
              <input
                type="number"
                name="remaining_balance"
                value={formData.remaining_balance}
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
              Create Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Bills;
