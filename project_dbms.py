# project_dbms.py - Complete Hospital Management System Backend
from datetime import date, time
from fastapi import FastAPI, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, datetime, time
from decimal import Decimal
import mysql.connector
from mysql.connector import Error
from contextlib import contextmanager



DB_CONFIG = {
    "host": "localhost",
    "database": "hospital_db",
    "user": "root",
    "password": "arpi@1503", 
    "port": 3306
}

app= FastAPI(
    title="Hospital Management System",
    description="Complete Hospital Management System API with MySQL Backend",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@contextmanager
def get_db_connection():
    """Database connection context manager"""
    conn = mysql.connector.connect(**DB_CONFIG)
    try:
        yield conn
        conn.commit()
    except Error as e:
        print(e)
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()

def dict_cursor(cursor, data):
    """Convert cursor result to dictionary"""
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in data]


# Patient Models
class PatientCreate(BaseModel):
    patient_fname: str = Field(..., max_length=20)
    patient_lname: str = Field(..., max_length=20)
    phone: str = Field(..., max_length=12)
    blood_type: str = Field(..., max_length=5)
    email: Optional[EmailStr] = None
    gender: Optional[str] = Field(None, max_length=10)
    condition: Optional[str] = Field(None, max_length=30)
    admission_date: Optional[date] = None
    discharge_date: Optional[date] = None

class PatientUpdate(BaseModel):
    patient_fname: Optional[str] = Field(None, max_length=20)
    patient_lname: Optional[str] = Field(None, max_length=20)
    phone: Optional[str] = Field(None, max_length=12)
    blood_type: Optional[str] = Field(None, max_length=5)
    email: Optional[EmailStr] = None
    gender: Optional[str] = Field(None, max_length=10)
    condition: Optional[str] = Field(None, max_length=30)
    admission_date: Optional[date] = None
    discharge_date: Optional[date] = None

# Department Models
class DepartmentCreate(BaseModel):
    dept_head: str = Field(..., max_length=20)
    dept_name: str = Field(..., max_length=15)
    emp_count: Optional[int] = 0

class DepartmentUpdate(BaseModel):
    dept_head: Optional[str] = Field(None, max_length=20)
    dept_name: Optional[str] = Field(None, max_length=15)
    emp_count: Optional[int] = None

# Staff Models
class StaffCreate(BaseModel):
    emp_fname: str = Field(..., max_length=20)
    emp_lname: str = Field(..., max_length=20)
    date_joining: Optional[date] = None
    date_separation: Optional[date] = None
    emp_type: str = Field(..., max_length=15)
    email: Optional[EmailStr] = None
    address: str = Field(..., max_length=50)
    dept_id: int
    ssn: int

class StaffUpdate(BaseModel):
    emp_fname: Optional[str] = Field(None, max_length=20)
    emp_lname: Optional[str] = Field(None, max_length=20)
    date_joining: Optional[date] = None
    date_separation: Optional[date] = None
    emp_type: Optional[str] = Field(None, max_length=15)
    email: Optional[EmailStr] = None
    address: Optional[str] = Field(None, max_length=50)
    dept_id: Optional[int] = None

# Doctor Models
class DoctorCreate(BaseModel):
    qualifications: str = Field(..., max_length=15)
    emp_id: int
    specialization: str = Field(..., max_length=20)
    dept_id: int

class DoctorUpdate(BaseModel):
    qualifications: Optional[str] = Field(None, max_length=15)
    specialization: Optional[str] = Field(None, max_length=20)
    dept_id: Optional[int] = None

# Nurse Models
class NurseCreate(BaseModel):
    patient_id: int
    emp_id: int
    dept_id: int

class NurseUpdate(BaseModel):
    patient_id: Optional[int] = None
    dept_id: Optional[int] = None

# Emergency Contact Models
class EmergencyContactCreate(BaseModel):
    contact_name: str = Field(..., max_length=20)
    phone: str = Field(..., max_length=12)
    relation: str = Field(..., max_length=20)
    patient_id: int

class EmergencyContactUpdate(BaseModel):
    contact_name: Optional[str] = Field(None, max_length=20)
    phone: Optional[str] = Field(None, max_length=12)
    relation: Optional[str] = Field(None, max_length=20)

# Payroll Models
class PayrollCreate(BaseModel):
    account_no: str = Field(..., max_length=25)
    salary: Decimal = Field(..., max_digits=10, decimal_places=2)
    bonus: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    emp_id: int
    iban: Optional[str] = Field(None, max_length=25)

class PayrollUpdate(BaseModel):
    salary: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    bonus: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    iban: Optional[str] = Field(None, max_length=25)

# Lab Screening Models
class LabScreeningCreate(BaseModel):
    patient_id: int
    technician_id: int
    doctor_id: int
    test_cost: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    date: date

class LabScreeningUpdate(BaseModel):
    test_cost: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    date: Optional[datetime] = None

# Insurance Models
class InsuranceCreate(BaseModel):
    policy_number: str = Field(..., max_length=20)
    patient_id: int
    ins_code: str = Field(..., max_length=20)
    end_date: Optional[str] = Field(None, max_length=10)
    provider: Optional[str] = Field(None, max_length=20)
    plan: Optional[str] = Field(None, max_length=20)
    co_pay: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    coverage: Optional[str] = Field(None, max_length=20)
    maternity: Optional[bool] = False
    dental: Optional[bool] = False
    optical: Optional[bool] = False

class InsuranceUpdate(BaseModel):
    ins_code: Optional[str] = Field(None, max_length=20)
    end_date: Optional[str] = Field(None, max_length=10)
    provider: Optional[str] = Field(None, max_length=20)
    plan: Optional[str] = Field(None, max_length=20)
    co_pay: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    coverage: Optional[str] = Field(None, max_length=20)
    maternity: Optional[bool] = None
    dental: Optional[bool] = None
    optical: Optional[bool] = None

# Medicine Models
class MedicineCreate(BaseModel):
    m_name: str = Field(..., max_length=20)
    m_quantity: int
    m_cost: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)

class MedicineUpdate(BaseModel):
    m_name: Optional[str] = Field(None, max_length=20)
    m_quantity: Optional[int] = None
    m_cost: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)

# Prescription Models
class PrescriptionCreate(BaseModel):
    patient_id: int
    medicine_id: int
    date: Optional[datetime] = None
    dosage: Optional[int] = None
    doctor_id: int

class PrescriptionUpdate(BaseModel):
    date: Optional[datetime] = None
    dosage: Optional[int] = None

# Medical History Models
class MedicalHistoryCreate(BaseModel):
    patient_id: int
    allergies: Optional[str] = Field(None, max_length=50)
    pre_conditions: Optional[str] = Field(None, max_length=50)

class MedicalHistoryUpdate(BaseModel):
    allergies: Optional[str] = Field(None, max_length=50)
    pre_conditions: Optional[str] = Field(None, max_length=50)

# Appointment Models
class AppointmentCreate(BaseModel):
    scheduled_on: datetime
    date: date
    time: time
    doctor_id: int
    patient_id: int

class AppointmentUpdate(BaseModel):
    scheduled_on: Optional[datetime] = None
    date: Optional[datetime] = None
    time: Optional[datetime] = None





# Room Models
class RoomCreate(BaseModel):
    room_type: str = Field(..., max_length=50)
    patient_id: int
    room_cost: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)

class RoomUpdate(BaseModel):
    room_type: Optional[str] = Field(None, max_length=50)
    patient_id: Optional[int] = None
    room_cost: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)

# Bill Models
class BillCreate(BaseModel):
    date: Optional[datetime] = None
    room_cost: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    test_cost: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    other_charges: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    m_cost: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    total: Decimal = Field(..., max_digits=10, decimal_places=2)
    patient_id: int
    remaining_balance: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    policy_number: str = Field(..., max_length=20)

class BillUpdate(BaseModel):
    room_cost: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    test_cost: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    other_charges: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    m_cost: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    total: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    remaining_balance: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)



@app.post("/patients", status_code=status.HTTP_201_CREATED)
def create_patient(patient: PatientCreate):
    """Create a new patient"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Patient (Patient_FName, Patient_LName, Phone, Blood_Type,
            Email, Gender, Condition_, Admission_Date, Discharge_Date)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            patient.patient_fname, patient.patient_lname, patient.phone,
            patient.blood_type, patient.email, patient.gender,
            patient.condition, patient.admission_date, patient.discharge_date
        ))
        patient_id = cursor.lastrowid
        cursor.close()
    return {"message": "Patient created successfully", "patient_id": patient_id}

@app.get("/patients")
def get_all_patients(skip: int = 0, limit: int = 100):
    """Get all patients with pagination"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM Patient
            ORDER BY Patient_ID
            LIMIT %s OFFSET %s
        """, (limit, skip))
        results = cursor.fetchall()
        patients = dict_cursor(cursor, results)
        cursor.close()
    return {"patients": patients, "count": len(patients)}

@app.get("/patients/{patient_id}")
def get_patient(patient_id: int):
    """Get a specific patient by ID"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Patient WHERE Patient_ID = %s", (patient_id,))
        result = cursor.fetchone()
        if not result:
            cursor.close()
            raise HTTPException(status_code=404, detail="Patient not found")
        patient = dict_cursor(cursor, [result])[0]
        cursor.close()
    return patient

@app.put("/patients/{patient_id}")
def update_patient(patient_id: int, patient: PatientUpdate):
    """Update patient information"""
    update_fields = []
    values = []
    field_mapping = {
        'patient_fname': 'Patient_FName',
        'patient_lname': 'Patient_LName',
        'phone': 'Phone',
        'blood_type': 'Blood_Type',
        'email': 'Email',
        'gender': 'Gender',
        'condition': 'Condition_',
        'admission_date': 'Admission_Date',
        'discharge_date': 'Discharge_Date'
    }
    
    for field, value in patient.model_dump(exclude_unset=True).items():
        if value is not None:
            db_field = field_mapping.get(field, field)
            update_fields.append(f"{db_field} = %s")
            values.append(value)
    
    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    values.append(patient_id)
    with get_db_connection() as conn:
        cursor = conn.cursor()
        query = f"UPDATE Patient SET {', '.join(update_fields)} WHERE Patient_ID = %s",(value)
        cursor.execute(query, values)
        if cursor.rowcount == 0:
            cursor.close()
            raise HTTPException(status_code=404, detail="Patient not found")
        cursor.close()
    return {"message": "Patient updated successfully"}

@app.delete("/patients/{patient_id}")
def delete_patient(patient_id: int):
    """Delete a patient"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Patient WHERE Patient_ID = %s", (patient_id,))
        if cursor.rowcount == 0:
            cursor.close()
            raise HTTPException(status_code=404, detail="Patient not found")
        cursor.close()
    return {"message": "Patient deleted successfully"}



@app.post("/departments", status_code=status.HTTP_201_CREATED)
def create_department(department: DepartmentCreate):
    """Create a new department"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Department (Dept_Head, Dept_Name, Emp_Count)
            VALUES (%s, %s, %s)
        """, (department.dept_head, department.dept_name, department.emp_count))
        dept_id = cursor.lastrowid
        cursor.close()
    return {"message": "Department created successfully", "dept_id": dept_id}

@app.get("/departments")
def get_all_departments():
    """Get all departments"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Department ORDER BY Dept_ID")
        results = cursor.fetchall()
        departments = dict_cursor(cursor, results)
        cursor.close()
    return {"departments": departments, "count": len(departments)}

@app.get("/departments/{dept_id}")
def get_department(dept_id: int):
    """Get a specific department by ID"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Department WHERE Dept_ID = %s", (dept_id,))
        result = cursor.fetchone()
        if not result:
            cursor.close()
            raise HTTPException(status_code=404, detail="Department not found")
        department = dict_cursor(cursor, [result])[0]
        cursor.close()
    return department

@app.put("/departments/{dept_id}")
def update_department(dept_id: int, department: DepartmentUpdate):
    """Update department information"""
    update_fields = []
    values = []
    field_mapping = {
        'dept_head': 'Dept_Head',
        'dept_name': 'Dept_Name',
        'emp_count': 'Emp_Count'
    }
    
    for field, value in department.model_dump(exclude_unset=True).items():
        if value is not None:
            db_field = field_mapping.get(field, field)
            update_fields.append(f"{db_field} = %s")
            values.append(value)
    
    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    values.append(dept_id)
    with get_db_connection() as conn:
        cursor = conn.cursor()
        query = f"UPDATE Department SET {', '.join(update_fields)} WHERE Dept_ID = %s"
        cursor.execute(query, values)
        if cursor.rowcount == 0:
            cursor.close()
            raise HTTPException(status_code=404, detail="Department not found")
        cursor.close()
    return {"message": "Department updated successfully"}

@app.delete("/departments/{dept_id}")
def delete_department(dept_id: int):
    """Delete a department"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Department WHERE Dept_ID = %s", (dept_id,))
        if cursor.rowcount == 0:
            cursor.close()
            raise HTTPException(status_code=404, detail="Department not found")
        cursor.close()
    return {"message": "Department deleted successfully"}


@app.post("/staff", status_code=status.HTTP_201_CREATED)
def create_staff(staff: StaffCreate):
    """Create a new staff member"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Staff (Emp_FName, Emp_LName, Date_Joining, Date_Seperation,
            Emp_Type, Email, Address, Dept_ID, SSN)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            staff.emp_fname, staff.emp_lname, staff.date_joining,
            staff.date_separation, staff.emp_type, staff.email,
            staff.address, staff.dept_id, staff.ssn
        ))
        emp_id = cursor.lastrowid
        cursor.close()
    return {"message": "Staff member created successfully", "emp_id": emp_id}

@app.get("/staff")
def get_all_staff(skip: int = 0, limit: int = 100):
    """Get all staff members with pagination"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT s.*, d.Dept_Name
            FROM Staff s
            JOIN Department d ON s.Dept_ID = d.Dept_ID
            ORDER BY s.Emp_ID
            LIMIT %s OFFSET %s
        """, (limit, skip))
        results = cursor.fetchall()
        staff = dict_cursor(cursor, results)
        cursor.close()
    return {"staff": staff, "count": len(staff)}

@app.get("/staff/{emp_id}")
def get_staff_member(emp_id: int):
    """Get a specific staff member by ID"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT s.*, d.Dept_Name
            FROM Staff s
            JOIN Department d ON s.Dept_ID = d.Dept_ID
            WHERE s.Emp_ID = %s
        """, (emp_id,))
        result = cursor.fetchone()
        if not result:
            cursor.close()
            raise HTTPException(status_code=404, detail="Staff member not found")
        staff = dict_cursor(cursor, [result])[0]
        cursor.close()
    return staff

@app.put("/staff/{emp_id}")
def update_staff(emp_id: int, staff: StaffUpdate):
    """Update staff member information"""
    update_fields = []
    values = []
    field_mapping = {
        'emp_fname': 'Emp_FName',
        'emp_lname': 'Emp_LName',
        'date_joining': 'Date_Joining',
        'date_separation': 'Date_Seperation',
        'emp_type': 'Emp_Type',
        'email': 'Email',
        'address': 'Address',
        'dept_id': 'Dept_ID'
    }
    
    for field, value in staff.model_dump(exclude_unset=True).items():
        if value is not None:
            db_field = field_mapping.get(field, field)
            update_fields.append(f"{db_field} = %s")
            values.append(value)
    
    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    values.append(emp_id)
    with get_db_connection() as conn:
        cursor = conn.cursor()
        query = "UPDATE Staff SET {', '.join(update_fields)} WHERE Emp_ID = %s"
        cursor.execute(query, values)
        if cursor.rowcount == 0:
            cursor.close()
            raise HTTPException(status_code=404, detail="Staff member not found")
        cursor.close()
    return {"message": "Staff member updated successfully"}

@app.delete("/staff/{emp_id}")
def delete_staff(emp_id: int):
    """Delete a staff member"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Staff WHERE Emp_ID = %s", (emp_id,))
        if cursor.rowcount == 0:
            cursor.close()
            raise HTTPException(status_code=404, detail="Staff member not found")
        cursor.close()
    return {"message": "Staff member deleted successfully"}



@app.post("/doctors", status_code=status.HTTP_201_CREATED)
def create_doctor(doctor: DoctorCreate):
    """Create a new doctor"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Doctor (Qualifications, Emp_ID, Specialization, Dept_ID)
            VALUES (%s, %s, %s, %s)
        """, (doctor.qualifications, doctor.emp_id, doctor.specialization, doctor.dept_id))
        doctor_id = cursor.lastrowid
        cursor.close()
    return {"message": "Doctor created successfully", "doctor_id": doctor_id}

@app.get("/doctors")
def get_all_doctors():
    """Get all doctors with their details"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT d.*, s.Emp_FName, s.Emp_LName, s.Email,
            dept.Dept_Name
            FROM Doctor d
            JOIN Staff s ON d.Emp_ID = s.Emp_ID
            JOIN Department dept ON d.Dept_ID = dept.Dept_ID
            ORDER BY d.Doctor_ID
        """)
        results = cursor.fetchall()
        doctors = dict_cursor(cursor, results)
        cursor.close()
    return {"doctors": doctors, "count": len(doctors)}

@app.get("/doctors/{doctor_id}")
def get_doctor(doctor_id: int):
    """Get a specific doctor by ID"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT d.*, s.Emp_FName, s.Emp_LName, s.Email,
            dept.Dept_Name
            FROM Doctor d
            JOIN Staff s ON d.Emp_ID = s.Emp_ID
            JOIN Department dept ON d.Dept_ID = dept.Dept_ID
            WHERE d.Doctor_ID = %s
        """, (doctor_id,))
        result = cursor.fetchone()
        if not result:
            cursor.close()
            raise HTTPException(status_code=404, detail="Doctor not found")
        doctor = dict_cursor(cursor, [result])[0]
        cursor.close()
    return doctor

@app.put("/doctors/{doctor_id}")
def update_doctor(doctor_id: int, doctor: DoctorUpdate):
    """Update doctor information"""
    update_fields = []
    values = []
    field_mapping = {
        'qualifications': 'Qualifications',
        'specialization': 'Specialization',
        'dept_id': 'Dept_ID'
    }
    
    for field, value in doctor.model_dump(exclude_unset=True).items():
        if value is not None:
            db_field = field_mapping.get(field, field)
            update_fields.append(f"{db_field} = %s")
            values.append(value)
    
    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    values.append(doctor_id)
    with get_db_connection() as conn:
        cursor = conn.cursor()
        query = "UPDATE Doctor SET {', '.join(update_fields)} WHERE Doctor_ID = %s"
        cursor.execute(query, values)
        if cursor.rowcount == 0:
            cursor.close()
            raise HTTPException(status_code=404, detail="Doctor not found")
        cursor.close()
    return {"message": "Doctor updated successfully"}

@app.delete("/doctors/{doctor_id}")
def delete_doctor(doctor_id: int):
    """Delete a doctor"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Doctor WHERE Doctor_ID = %s", (doctor_id,))
        if cursor.rowcount == 0:
            cursor.close()
            raise HTTPException(status_code=404, detail="Doctor not found")
        cursor.close()
    return {"message": "Doctor deleted successfully"}



@app.post("/appointments", status_code=status.HTTP_201_CREATED)
def create_appointment(appointment: AppointmentCreate):
    """Create a new appointment"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Appointment (Scheduled_On, Date, Time, Doctor_ID, Patient_ID)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            appointment.scheduled_on, appointment.date, appointment.time,
            appointment.doctor_id, appointment.patient_id
        ))
        appt_id = cursor.lastrowid
        cursor.close()
    return {"message": "Appointment created successfully", "appointment_id": appt_id}

@app.get("/appointments")
def get_all_appointments(
    patient_id: Optional[int] = None,
    doctor_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100
):
    """Get all appointments with optional filters"""
    query = """
           SELECT a.*, 
               p.Patient_FName, p.Patient_LName, p.Phone AS Patient_Phone,
               d.Specialization,
               s.Emp_FName AS Doctor_FName, s.Emp_LName AS Doctor_LName
        FROM Appointment a
        JOIN Patient p ON a.Patient_ID = p.Patient_ID
        JOIN Doctor d ON a.Doctor_ID = d.Doctor_ID
        JOIN Staff s ON d.Emp_ID = s.Emp_ID
        WHERE 1=1
    """
    params = []
    
    if patient_id:
        query += " AND a.Patient_ID = %s"
        params.append(patient_id)
    if doctor_id:
        query += " AND a.Doctor_ID = %s"
        params.append(doctor_id)
    
    query += " ORDER BY a.Date DESC, a.Time DESC LIMIT %s OFFSET %s"
    params.extend([limit, skip])
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        results = cursor.fetchall()
        appointments = dict_cursor(cursor, results)
        cursor.close()
    return {"appointments": appointments, "count": len(appointments)}

@app.get("/appointments/{appt_id}")
def get_appointment(appt_id: int):
    """Get a specific appointment by ID"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT a.*, 
            p.Patient_FName, p.Patient_LName,
            d.Specialization,
            s.Emp_FName as Doctor_FName, s.Emp_LName as Doctor_LName
            FROM Appointment a
            JOIN Patient p ON a.Patient_ID = p.Patient_ID
            JOIN Doctor d ON a.Doctor_ID = d.Doctor_ID
            JOIN Staff s ON d.Emp_ID = s.Emp_ID
            WHERE a.Appt_ID = %s
        """, (appt_id,))
        result = cursor.fetchone()
        if not result:
            cursor.close()
            raise HTTPException(status_code=404, detail="Appointment not found")
        appointment = dict_cursor(cursor, [result])[0]
        cursor.close()
    return appointment

@app.put("/appointments/{appt_id}")
def update_appointment(appt_id: int, appointment: AppointmentUpdate):
    """Update appointment information"""
    update_fields = []
    values = []
    field_mapping = {
        'scheduled_on': 'Scheduled_On',
        'date': 'Date',
        'time': 'Time'
    }
    
    for field, value in appointment.model_dump(exclude_unset=True).items():
        if value is not None:
            db_field = field_mapping.get(field, field)
            update_fields.append(f"{db_field} = %s")
            values.append(value)
    
    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    values.append(appt_id)
    with get_db_connection() as conn:
        cursor = conn.cursor()
        query = f"UPDATE Appointment SET {', '.join(update_fields)} WHERE Appt_ID = %s"
        cursor.execute(query, values)
        if cursor.rowcount == 0:
            cursor.close()
            raise HTTPException(status_code=404, detail="Appointment not found")
        cursor.close()
    return {"message": "Appointment updated successfully"}

@app.delete("/appointments/{appt_id}")
def delete_appointment(appt_id: int):
    """Delete an appointment"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Appointment WHERE Appt_ID = %s", (appt_id,))
        if cursor.rowcount == 0:
            cursor.close()
            raise HTTPException(status_code=404, detail="Appointment not found")
        cursor.close()
    return {"message": "Appointment deleted successfully"}



@app.post("/prescriptions", status_code=status.HTTP_201_CREATED)
def create_prescription(prescription: PrescriptionCreate):
    """Create a new prescription"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Prescription (Patient_ID, Medicine_ID, Date, Dosage, Doctor_ID)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            prescription.patient_id, prescription.medicine_id, prescription.date,
            prescription.dosage, prescription.doctor_id
        ))
        prescription_id = cursor.lastrowid
        cursor.close()
    return {"message": "Prescription created successfully", "prescription_id": prescription_id}

@app.get("/prescriptions/patient/{patient_id}")
def get_patient_prescriptions(patient_id: int):
    """Get all prescriptions for a patient"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT p.*, m.M_Name, m.M_Cost,
            s.Emp_FName as Doctor_FName, s.Emp_LName as Doctor_LName,
            d.Specialization
            FROM Prescription p
            JOIN Medicine m ON p.Medicine_ID = m.Medicine_ID
            JOIN Doctor d ON p.Doctor_ID = d.Doctor_ID
            JOIN Staff s ON d.Emp_ID = s.Emp_ID
            WHERE p.Patient_ID = %s
            ORDER BY p.Date DESC
        """, (patient_id,))
        results = cursor.fetchall()
        prescriptions = dict_cursor(cursor, results)
        cursor.close()
    return {"prescriptions": prescriptions, "count": len(prescriptions)}

@app.get("/prescriptions/{prescription_id}")
def get_prescription(prescription_id: int):
    """Get a specific prescription by ID"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT p.*, m.M_Name, m.M_Cost,
            s.Emp_FName as Doctor_FName, s.Emp_LName as Doctor_LName,
            pt.Patient_FName, pt.Patient_LName
            FROM Prescription p
            JOIN Medicine m ON p.Medicine_ID = m.Medicine_ID
            JOIN Doctor d ON p.Doctor_ID = d.Doctor_ID
            JOIN Staff s ON d.Emp_ID = s.Emp_ID
            JOIN Patient pt ON p.Patient_ID = pt.Patient_ID
            WHERE p.Prescription_ID = %s
        """, (prescription_id,))
        result = cursor.fetchone()
        if not result:
            cursor.close()
            raise HTTPException(status_code=404, detail="Prescription not found")
        prescription = dict_cursor(cursor, [result])[0]
        cursor.close()
    return prescription



@app.post("/bills", status_code=status.HTTP_201_CREATED)
def create_bill(bill: BillCreate):
    """Create a new bill"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Bill (Date, Room_Cost, Test_Cost, Other_Charges, M_Cost,
            Total, Patient_ID, Remaining_Balance, Policy_Number)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            bill.date, bill.room_cost, bill.test_cost, bill.other_charges,
            bill.m_cost, bill.total, bill.patient_id, bill.remaining_balance,
            bill.policy_number
        ))
        bill_id = cursor.lastrowid
        cursor.close()
    return {"message": "Bill created successfully", "bill_id": bill_id}

@app.get("/bills/patient/{patient_id}")
def get_patient_bills(patient_id: int):
    """Get all bills for a patient"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT b.*, p.Patient_FName, p.Patient_LName,
            i.Provider, i.Plan, i.Coverage
            FROM Bill b
            JOIN Patient p ON b.Patient_ID = p.Patient_ID
            JOIN Insurance i ON b.Policy_Number = i.Policy_Number
            WHERE b.Patient_ID = %s
            ORDER BY b.Date DESC
        """, (patient_id,))
        results = cursor.fetchall()
        bills = dict_cursor(cursor, results)
        cursor.close()
    return {"bills": bills, "count": len(bills)}

@app.get("/bills/{bill_id}")
def get_bill(bill_id: int):
    """Get a specific bill by ID"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT b.*, p.Patient_FName, p.Patient_LName,
            i.Provider, i.Plan, i.Coverage
            FROM Bill b
            JOIN Patient p ON b.Patient_ID = p.Patient_ID
            JOIN Insurance i ON b.Policy_Number = i.Policy_Number
            WHERE b.Bill_ID = %s
        """, (bill_id,))
        result = cursor.fetchone()
        if not result:
            cursor.close()
            raise HTTPException(status_code=404, detail="Bill not found")
        bill = dict_cursor(cursor, [result])[0]
        cursor.close()
    return bill



@app.post("/medicines", status_code=status.HTTP_201_CREATED)
def create_medicine(medicine: MedicineCreate):
    """Create a new medicine"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Medicine (M_Name, M_Quantity, M_Cost)
            VALUES (%s, %s, %s)
        """, (medicine.m_name, medicine.m_quantity, medicine.m_cost))
        medicine_id = cursor.lastrowid
        cursor.close()
    return {"message": "Medicine created successfully", "medicine_id": medicine_id}

@app.get("/medicines")
def get_all_medicines(skip: int = 0, limit: int = 100):
    """Get all medicines"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM Medicine
            ORDER BY M_Name
            LIMIT %s OFFSET %s
        """, (limit, skip))
        results = cursor.fetchall()
        medicines = dict_cursor(cursor, results)
        cursor.close()
    return {"medicines": medicines, "count": len(medicines)}

@app.get("/medicines/{medicine_id}")
def get_medicine(medicine_id: int):
    """Get a specific medicine by ID"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Medicine WHERE Medicine_ID = %s", (medicine_id,))
        result = cursor.fetchone()
        if not result:
            cursor.close()
            raise HTTPException(status_code=404, detail="Medicine not found")
        medicine = dict_cursor(cursor, [result])[0]
        cursor.close()
    return medicine



@app.post("/insurance", status_code=status.HTTP_201_CREATED)
def create_insurance(insurance: InsuranceCreate):
    """Create a new insurance policy"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Insurance (Policy_Number, Patient_ID, Ins_Code, End_Date,
            Provider, Plan, Co_Pay, Coverage, Maternity, Dental, Optical)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            insurance.policy_number, insurance.patient_id, insurance.ins_code,
            insurance.end_date, insurance.provider, insurance.plan, insurance.co_pay,
            insurance.coverage, insurance.maternity, insurance.dental, insurance.optical
        ))
        cursor.close()
    return {"message": "Insurance policy created successfully"}

@app.get("/insurance/patient/{patient_id}")
def get_patient_insurance(patient_id: int):
    """Get insurance for a patient"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT i.*, p.Patient_FName, p.Patient_LName
            FROM Insurance i
            JOIN Patient p ON i.Patient_ID = p.Patient_ID
            WHERE i.Patient_ID = %s
        """, (patient_id,))
        results = cursor.fetchall()
        insurance = dict_cursor(cursor, results)
        cursor.close()
    return {"insurance": insurance, "count": len(insurance)}



@app.get("/analytics/revenue-summary")
def get_revenue_summary():
    """Get total revenue summary"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
            COUNT(*) as total_bills,
            SUM(Total) as total_revenue,
            SUM(Remaining_Balance) as total_outstanding,
            AVG(Total) as average_bill
            FROM Bill
        """)
        result = cursor.fetchone()
        summary = dict_cursor(cursor, [result])[0] if result else {}
        cursor.close()
    return summary

@app.get("/analytics/patient-statistics")
def get_patient_statistics():
    """Get patient statistics"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
            COUNT(*) as total_patients,
            COUNT(CASE WHEN Admission_Date IS NOT NULL AND Discharge_Date IS NULL THEN 1 END) as admitted_patients,
            COUNT(CASE WHEN Gender = 'Male' THEN 1 END) as male_patients,
            COUNT(CASE WHEN Gender = 'Female' THEN 1 END) as female_patients
            FROM Patient
        """)
        result = cursor.fetchone()
        stats = dict_cursor(cursor, [result])[0] if result else {}
        cursor.close()
    return stats

@app.get("/analytics/appointments-today")
def get_appointments_today():
    """Get appointments scheduled for today"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT a.*,
            p.Patient_FName, p.Patient_LName,
            s.Emp_FName as Doctor_FName, s.Emp_LName as Doctor_LName,
            d.Specialization
            FROM Appointment a
            JOIN Patient p ON a.Patient_ID = p.Patient_ID
            JOIN Doctor d ON a.Doctor_ID = d.Doctor_ID
            JOIN Staff s ON d.Emp_ID = s.Emp_ID
            WHERE a.Date = CURDATE()
            ORDER BY a.Time
        """)
        results = cursor.fetchall()
        appointments = dict_cursor(cursor, results)
        cursor.close()
    return {"appointments": appointments, "count": len(appointments)}

@app.get("/analytics/department-stats")
def get_department_statistics():
    """Get department-wise statistics"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
            d.Dept_Name,
            d.Emp_Count,
            COUNT(DISTINCT doc.Doctor_ID) as doctor_count,
            COUNT(DISTINCT n.Nurse_ID) as nurse_count
            FROM Department d
            LEFT JOIN Doctor doc ON d.Dept_ID = doc.Dept_ID
            LEFT JOIN Nurse n ON d.Dept_ID = n.Dept_ID
            GROUP BY d.Dept_ID, d.Dept_Name, d.Emp_Count
        """)
        results = cursor.fetchall()
        stats = dict_cursor(cursor, results)
        cursor.close()
    return {"departments": stats, "count": len(stats)}



@app.post("/medical-history", status_code=status.HTTP_201_CREATED)
def create_medical_history(history: MedicalHistoryCreate):
    """Create medical history record"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Medical_History (Patient_ID, Allergies, Pre_Conditions)
            VALUES (%s, %s, %s)
        """, (history.patient_id, history.allergies, history.pre_conditions))
        record_id = cursor.lastrowid
        cursor.close()
    return {"message": "Medical history created successfully", "record_id": record_id}

@app.get("/medical-history/patient/{patient_id}")
def get_patient_medical_history(patient_id: int):
    """Get medical history for a patient"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT mh.*, p.Patient_FName, p.Patient_LName
            FROM Medical_History mh
            JOIN Patient p ON mh.Patient_ID = p.Patient_ID
            WHERE mh.Patient_ID = %s
        """, (patient_id,))
        results = cursor.fetchall()
        history = dict_cursor(cursor, results)
        cursor.close()
    return {"medical_history": history, "count": len(history)}



@app.post("/emergency-contacts", status_code=status.HTTP_201_CREATED)
def create_emergency_contact(contact: EmergencyContactCreate):
    """Create emergency contact"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Emergency_Contact (Contact_Name, Phone, Relation, Patient_ID)
            VALUES (%s, %s, %s, %s)
        """, (contact.contact_name, contact.phone, contact.relation, contact.patient_id))
        contact_id = cursor.lastrowid
        cursor.close()
    return {"message": "Emergency contact created successfully", "contact_id": contact_id}

@app.get("/emergency-contacts/patient/{patient_id}")
def get_patient_emergency_contacts(patient_id: int):
    """Get emergency contacts for a patient"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT ec.*, p.Patient_FName, p.Patient_LName
            FROM Emergency_Contact ec
            JOIN Patient p ON ec.Patient_ID = p.Patient_ID
            WHERE ec.Patient_ID = %s
        """, (patient_id,))
        results = cursor.fetchall()
        contacts = dict_cursor(cursor, results)
        cursor.close()
    return {"emergency_contacts": contacts, "count": len(contacts)}



@app.get("/")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "Hospital Management System API",
        "version": "1.0.0",
        "documentation": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
