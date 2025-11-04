from sqlalchemy.orm import Session
import models, schemas
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException


#PATIENT
def create_patient(db: Session, patient: schemas.PatientCreate):
    """Create a new patient record"""
    db_patient = models.Patient(**patient.model_dump())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


def get_patients(db: Session, skip: int = 0, limit: int = 100):
    """Fetch all patients"""
    return db.query(models.Patient).offset(skip).limit(limit).all()


def get_patient_by_id(db: Session, patient_id: int):
    """Fetch a patient by ID"""
    return db.query(models.Patient).filter(models.Patient.Patient_ID == patient_id).first()


def update_patient(db: Session, patient_id: int, updated_data: schemas.PatientCreate):
    """Update patient details"""
    patient = db.query(models.Patient).filter(models.Patient.Patient_ID == patient_id).first()
    if patient:
        for key, value in updated_data.model_dump().items():
            setattr(patient, key, value)
        db.commit()
        db.refresh(patient)
    return patient


def delete_patient(db: Session, patient_id: int):
    """Delete a patient record"""
    patient = db.query(models.Patient).filter(models.Patient.Patient_ID == patient_id).first()
    if patient:
        db.delete(patient)
        db.commit()
    return patient



#DOCTOR
def create_doctor(db: Session, doctor: schemas.DoctorCreate):
    db_doctor = models.Doctor(
        Qualifications=doctor.Qualifications,
        Emp_ID=doctor.Emp_ID,
        Specialization=doctor.Specialization,
        Dept_ID=doctor.Dept_ID
    )
    try:
        db.add(db_doctor)
        db.commit()
        db.refresh(db_doctor)
        return db_doctor
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Foreign key constraint failed: {str(e.orig)}")


def get_doctors(db: Session, skip: int = 0, limit: int = 100):
    """Fetch all doctors"""
    return db.query(models.Doctor).offset(skip).limit(limit).all()


def get_doctor_by_id(db: Session, doctor_id: int):
    """Fetch doctor by ID"""
    return db.query(models.Doctor).filter(models.Doctor.Doctor_ID == doctor_id).first()


def update_doctor(db: Session, doctor_id: int, updated_data: schemas.DoctorCreate):
    """Update doctor details"""
    doctor = db.query(models.Doctor).filter(models.Doctor.Doctor_ID == doctor_id).first()
    if doctor:
        for key, value in updated_data.model_dump().items():
            setattr(doctor, key, value)
        db.commit()
        db.refresh(doctor)
    return doctor


def delete_doctor(db: Session, doctor_id: int):
    """Delete doctor record"""
    doctor = db.query(models.Doctor).filter(models.Doctor.Doctor_ID == doctor_id).first()
    if doctor:
        db.delete(doctor)
        db.commit()
    return doctor


# STAFF
def create_staff(db: Session, staff: schemas.StaffCreate):
    """Create a new staff record"""
    db_staff = models.Staff(**staff.model_dump())
    db.add(db_staff)
    db.commit()
    db.refresh(db_staff)
    return db_staff


def get_staffs(db: Session, skip: int = 0, limit: int = 100):
    """Fetch all staff members"""
    return db.query(models.Staff).offset(skip).limit(limit).all()


def get_staff_by_id(db: Session, emp_id: int):
    """Fetch a staff member by ID"""
    return db.query(models.Staff).filter(models.Staff.Emp_ID == emp_id).first()


def update_staff(db: Session, emp_id: int, updated_data: schemas.StaffCreate):
    """Update staff details"""
    staff = db.query(models.Staff).filter(models.Staff.Emp_ID == emp_id).first()
    if staff:
        for key, value in updated_data.model_dump().items():
            setattr(staff, key, value)
        db.commit()
        db.refresh(staff)
    return staff


def delete_staff(db: Session, emp_id: int):
    """Delete a staff record"""
    staff = db.query(models.Staff).filter(models.Staff.Emp_ID == emp_id).first()
    if staff:
        db.delete(staff)
        db.commit()
    return staff



# NURSE
def create_nurse(db: Session, nurse: schemas.NurseCreate):
    """Create a new nurse record"""
    db_nurse = models.Nurse(**nurse.model_dump())
    db.add(db_nurse)
    db.commit()
    db.refresh(db_nurse)
    return db_nurse


def get_nurses(db: Session, skip: int = 0, limit: int = 100):
    """Fetch all nurses"""
    return db.query(models.Nurse).offset(skip).limit(limit).all()


def get_nurse_by_id(db: Session, nurse_id: int):
    """Fetch a nurse by ID"""
    return db.query(models.Nurse).filter(models.Nurse.Nurse_ID == nurse_id).first()


def update_nurse(db: Session, nurse_id: int, updated_data: schemas.NurseCreate):
    """Update nurse details"""
    nurse = db.query(models.Nurse).filter(models.Nurse.Nurse_ID == nurse_id).first()
    if nurse:
        for key, value in updated_data.model_dump().items():
            setattr(nurse, key, value)
        db.commit()
        db.refresh(nurse)
    return nurse


def delete_nurse(db: Session, nurse_id: int):
    """Delete a nurse record"""
    nurse = db.query(models.Nurse).filter(models.Nurse.Nurse_ID == nurse_id).first()
    if nurse:
        db.delete(nurse)
        db.commit()
    return nurse
