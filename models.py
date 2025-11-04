from sqlalchemy import (
    Column, Integer, String, Date, DECIMAL, Boolean, ForeignKey, DateTime, Time
)
from sqlalchemy.orm import relationship
from database import Base


# ---------------------------- Department ----------------------------
class Department(Base):
    __tablename__ = "Department"

    Dept_ID = Column(Integer, primary_key=True, index=True, nullable=False)
    Dept_Head = Column(String(20), nullable=False)
    Dept_Name = Column(String(15), nullable=False)
    Emp_Count = Column(Integer)

    # Relationships
    staff = relationship("Staff", back_populates="department")
    doctors = relationship("Doctor", back_populates="department")
    nurses = relationship("Nurse", back_populates="department")


# ---------------------------- Staff ----------------------------
class Staff(Base):
    __tablename__ = "Staff"

    Emp_ID = Column(Integer, primary_key=True, index=True, nullable=False)
    Emp_FName = Column(String(20), nullable=False)
    Emp_LName = Column(String(20), nullable=False)
    Date_Joining = Column(Date)
    Date_Seperation = Column(Date)
    Emp_Type = Column(String(15), nullable=False)
    Email = Column(String(50))
    Address = Column(String(50), nullable=False)
    Dept_ID = Column(Integer, ForeignKey("Department.Dept_ID"), nullable=False)
    SSN = Column(Integer, nullable=False)

    # Relationships
    department = relationship("Department", back_populates="staff")
    payroll = relationship("Payroll", back_populates="staff", cascade="all, delete")
    doctor = relationship("Doctor", back_populates="staff", uselist=False, cascade="all, delete")
    nurse = relationship("Nurse", back_populates="staff", cascade="all, delete")


# ---------------------------- Doctor ----------------------------
class Doctor(Base):
    __tablename__ = "Doctor"

    Doctor_ID = Column(Integer, primary_key=True, index=True, nullable=False)
    Qualifications = Column(String(15), nullable=False)
    Emp_ID = Column(Integer, ForeignKey("Staff.Emp_ID"), nullable=False)
    Specialization = Column(String(20), nullable=False)
    Dept_ID = Column(Integer, ForeignKey("Department.Dept_ID"), nullable=False)

    # Relationships
    staff = relationship("Staff", back_populates="doctor")
    department = relationship("Department", back_populates="doctors")
    lab_screenings = relationship("Lab_Screening", back_populates="doctor")
    prescriptions = relationship("Prescription", back_populates="doctor")
    appointments = relationship("Appointment", back_populates="doctor")


# ---------------------------- Patient ----------------------------
class Patient(Base):
    __tablename__ = "Patient"

    Patient_ID = Column(Integer, primary_key=True, index=True, nullable=False)
    Patient_FName = Column(String(20), nullable=False)
    Patient_LName = Column(String(20), nullable=False)
    Phone = Column(String(12), nullable=False)
    Blood_Type = Column(String(5), nullable=False)
    Email = Column(String(50))
    Gender = Column(String(10))
    Condition_ = Column(String(30))
    Admission_Date = Column(Date)
    Discharge_Date = Column(Date)

    # Relationships
    medical_history = relationship("Medical_History", back_populates="patient", cascade="all, delete")
    emergency_contacts = relationship("Emergency_Contact", back_populates="patient", cascade="all, delete")
    insurance = relationship("Insurance", back_populates="patient", cascade="all, delete")
    bills = relationship("Bill", back_populates="patient", cascade="all, delete")
    rooms = relationship("Room", back_populates="patient", cascade="all, delete")
    lab_screenings = relationship("Lab_Screening", back_populates="patient", cascade="all, delete")
    prescriptions = relationship("Prescription", back_populates="patient", cascade="all, delete")
    appointments = relationship("Appointment", back_populates="patient", cascade="all, delete")
    nurses = relationship("Nurse", back_populates="patient", cascade="all, delete")


# ---------------------------- Nurse ----------------------------
class Nurse(Base):
    __tablename__ = "Nurse"

    Nurse_ID = Column(Integer, primary_key=True, index=True, nullable=False)
    Patient_ID = Column(Integer, ForeignKey("Patient.Patient_ID"), nullable=False)
    Emp_ID = Column(Integer, ForeignKey("Staff.Emp_ID"), nullable=False)
    Dept_ID = Column(Integer, ForeignKey("Department.Dept_ID"), nullable=False)

    # Relationships
    patient = relationship("Patient", back_populates="nurses")
    staff = relationship("Staff", back_populates="nurse")
    department = relationship("Department", back_populates="nurses")


# ---------------------------- Emergency_Contact ----------------------------
class Emergency_Contact(Base):
    __tablename__ = "Emergency_Contact"

    Contact_ID = Column(Integer, primary_key=True, index=True, nullable=False)
    Contact_Name = Column(String(20), nullable=False)
    Phone = Column(String(12), nullable=False)
    Relation = Column(String(20), nullable=False)
    Patient_ID = Column(Integer, ForeignKey("Patient.Patient_ID"), nullable=False)

    # Relationships
    patient = relationship("Patient", back_populates="emergency_contacts")


# ---------------------------- Payroll ----------------------------
class Payroll(Base):
    __tablename__ = "Payroll"

    Account_No = Column(String(25), primary_key=True, index=True, nullable=False)
    Salary = Column(DECIMAL(10, 2), nullable=False)
    Bonus = Column(DECIMAL(10, 2))
    Emp_ID = Column(Integer, ForeignKey("Staff.Emp_ID"), nullable=False)
    IBAN = Column(String(25))

    # Relationships
    staff = relationship("Staff", back_populates="payroll")


# ---------------------------- Lab_Screening ----------------------------
class Lab_Screening(Base):
    __tablename__ = "Lab_Screening"

    Lab_ID = Column(Integer, primary_key=True, index=True, nullable=False)
    Patient_ID = Column(Integer, ForeignKey("Patient.Patient_ID"), nullable=False)
    Technician_ID = Column(Integer, ForeignKey("Staff.Emp_ID"), nullable=False)
    Doctor_ID = Column(Integer, ForeignKey("Doctor.Doctor_ID"), nullable=False)
    Test_Cost = Column(DECIMAL(10, 2))
    Date = Column(Date, nullable=False)

    # Relationships
    patient = relationship("Patient", back_populates="lab_screenings", cascade="all, delete")
    doctor = relationship("Doctor", back_populates="lab_screenings")
    technician = relationship("Staff", foreign_keys=[Technician_ID])


# ---------------------------- Insurance ----------------------------
class Insurance(Base):
    __tablename__ = "Insurance"

    Policy_Number = Column(String(20), primary_key=True, index=True, nullable=False)
    Patient_ID = Column(Integer, ForeignKey("Patient.Patient_ID"), nullable=False)
    Ins_Code = Column(String(20), nullable=False)
    End_Date = Column(String(10))
    Provider = Column(String(20))
    Plan = Column(String(20))
    Co_Pay = Column(DECIMAL(10, 2))
    Coverage = Column(String(20))
    Maternity = Column(Boolean)
    Dental = Column(Boolean)
    Optical = Column(Boolean)

    # Relationships
    patient = relationship("Patient", back_populates="insurance", cascade="all, delete")
    bills = relationship("Bill", back_populates="insurance", cascade="all, delete")


# ---------------------------- Medicine ----------------------------
class Medicine(Base):
    __tablename__ = "Medicine"

    Medicine_ID = Column(Integer, primary_key=True, index=True, nullable=False)
    M_Name = Column(String(20), nullable=False)
    M_Quantity = Column(Integer, nullable=False)
    M_Cost = Column(DECIMAL(10, 2))

    # Relationships
    prescriptions = relationship("Prescription", back_populates="medicine")


# ---------------------------- Prescription ----------------------------
class Prescription(Base):
    __tablename__ = "Prescription"

    Prescription_ID = Column(Integer, primary_key=True, index=True, nullable=False)
    Patient_ID = Column(Integer, ForeignKey("Patient.Patient_ID"), nullable=False)
    Medicine_ID = Column(Integer, ForeignKey("Medicine.Medicine_ID"), nullable=False)
    Date = Column(Date)
    Dosage = Column(Integer)
    Doctor_ID = Column(Integer, ForeignKey("Doctor.Doctor_ID"), nullable=False)

    # Relationships
    patient = relationship("Patient", back_populates="prescriptions")
    doctor = relationship("Doctor", back_populates="prescriptions")
    medicine = relationship("Medicine", back_populates="prescriptions")


# ---------------------------- Medical_History ----------------------------
class Medical_History(Base):
    __tablename__ = "Medical_History"

    Record_ID = Column(Integer, primary_key=True, index=True, nullable=False)
    Patient_ID = Column(Integer, ForeignKey("Patient.Patient_ID"), nullable=False)
    Allergies = Column(String(50))
    Pre_Conditions = Column(String(50))

    # Relationships
    patient = relationship("Patient", back_populates="medical_history")


# ---------------------------- Appointment ----------------------------
class Appointment(Base):
    __tablename__ = "Appointment"

    Appt_ID = Column(Integer, primary_key=True, index=True, nullable=False)
    Scheduled_On = Column(DateTime, nullable=False)
    Date = Column(Date)
    Time = Column(Time)
    Doctor_ID = Column(Integer, ForeignKey("Doctor.Doctor_ID"), nullable=False)
    Patient_ID = Column(Integer, ForeignKey("Patient.Patient_ID"), nullable=False)

    # Relationships
    doctor = relationship("Doctor", back_populates="appointments")
    patient = relationship("Patient", back_populates="appointments")


# ---------------------------- Room ----------------------------
class Room(Base):
    __tablename__ = "Room"

    Room_ID = Column(Integer, primary_key=True, index=True, nullable=False)
    Room_Type = Column(String(50), nullable=False)
    Patient_ID = Column(Integer, ForeignKey("Patient.Patient_ID"), nullable=False)
    Room_Cost = Column(DECIMAL(10, 2))

    # Relationships
    patient = relationship("Patient", back_populates="rooms")


# ---------------------------- Bill ----------------------------
class Bill(Base):
    __tablename__ = "Bill"

    Bill_ID = Column(Integer, primary_key=True, index=True, nullable=False)
    Date = Column(Date)
    Room_Cost = Column(DECIMAL(10, 2))
    Test_Cost = Column(DECIMAL(10, 2))
    Other_Charges = Column(DECIMAL(10, 2))
    M_Cost = Column(DECIMAL(10, 2))
    Total = Column(DECIMAL(10, 2))
    Patient_ID = Column(Integer, ForeignKey("Patient.Patient_ID"), nullable=False)
    Remaining_Balance = Column(DECIMAL(10, 2))
    Policy_Number = Column(String(20), ForeignKey("Insurance.Policy_Number"), nullable=False)

    # Relationships
    patient = relationship("Patient", back_populates="bills")
    insurance = relationship("Insurance", back_populates="bills")
