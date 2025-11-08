// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enhanced error handling in api.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 422) {
      console.error('Validation errors:', error.response.data.detail);
    }
    
    return Promise.reject(error);
  }
);

// Patients
export const patientAPI = {
  getAll: (skip = 0, limit = 100) => 
    api.get(`/patients?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
};

// Departments
export const departmentAPI = {
  getAll: () => api.get('/departments'),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

// Staff
export const staffAPI = {
  getAll: (skip = 0, limit = 100) => 
    api.get(`/staff?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/staff/${id}`),
  create: (data) => api.post('/staff', data),
  update: (id, data) => api.put(`/staff/${id}`, data),
  delete: (id) => api.delete(`/staff/${id}`),
};

// Doctors
export const doctorAPI = {
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post('/doctors', data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
};

// Appointments
export const appointmentAPI = {
  getAll: (params = {}) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
};

// Medicines
export const medicineAPI = {
  getAll: (skip = 0, limit = 100) => 
    api.get(`/medicines?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/medicines/${id}`),
  create: (data) => api.post('/medicines', data),
  update: (id, data) => api.put(`/medicines/${id}`, data),
  delete: (id) => api.delete(`/medicines/${id}`),
};

// Bills
export const billAPI = {
  getByPatientId: (patientId) => api.get(`/bills/patient/${patientId}`),
  getById: (id) => api.get(`/bills/${id}`),
  create: (data) => api.post('/bills', data),
};

// Analytics
export const analyticsAPI = {
  getRevenueSummary: () => api.get('/analytics/revenue-summary'),
  getPatientStats: () => api.get('/analytics/patient-statistics'),
  getAppointmentsToday: () => api.get('/analytics/appointments-today'),
  getDepartmentStats: () => api.get('/analytics/department-stats'),
};
// Insurance
export const insuranceAPI = {
  getByPatientId: (patientId) => api.get(`/insurance/patient/${patientId}`),
  create: (data) => api.post('/insurance', data),
};

// Medical History
export const medicalHistoryAPI = {
  getByPatientId: (patientId) => api.get(`/medical-history/patient/${patientId}`),
  create: (data) => api.post('/medical-history', data),
};

// Emergency Contacts
export const emergencyContactAPI = {
  getByPatientId: (patientId) => api.get(`/emergency-contacts/patient/${patientId}`),
  create: (data) => api.post('/emergency-contacts', data),
};

// Prescriptions
export const prescriptionAPI = {
  getByPatientId: (patientId) => api.get(`/prescriptions/patient/${patientId}`),
  create: (data) => api.post('/prescriptions', data),
};
export default api;