from pydantic import BaseModel
from typing import Optional
from datetime import date, time, datetime
from decimal import Decimal




class PatientBase(BaseModel):
    Patient_FName: str
    Patient_LName: str
    Phone: int
    Blood_Type: str
    Email: Optional[str] = None
    Gender: Optional[str] = None
    Condition_: Optional[str] = None
    Admission_Date: Optional[date] = None
    Discharge_Date: Optional[date] = None

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    Patient_ID: int
    class Config:
        orm_mode = True





class DepartmentBase(BaseModel):
    Dept_Head: str
    Dept_Name: str
    Emp_Count: Optional[int] = None

class DepartmentCreate(DepartmentBase):
    pass

class Department(DepartmentBase):
    Dept_ID: int
    class Config:
        orm_mode = True





class StaffBase(BaseModel):
    Emp_FName: str
    Emp_LName: str
    Date_Joining: Optional[date] = None
    Date_Seperation: Optional[date] = None
    Emp_Type: str
    Email: Optional[str] = None
    Address: str
    Dept_ID: int
    SSN: int

class StaffCreate(StaffBase):
    pass

class Staff(StaffBase):
    Emp_ID: int
    class Config:
        orm_mode = True





class DoctorBase(BaseModel):
    Qualifications: str
    Emp_ID: int
    Specialization: str
    Dept_ID: int

class DoctorCreate(DoctorBase):
    pass

class Doctor(DoctorBase):
    Doctor_ID: int
    class Config:
        orm_mode = True




class NurseBase(BaseModel):
    Patient_ID: int
    Emp_ID: int
    Dept_ID: int

class NurseCreate(NurseBase):
    pass

class Nurse(NurseBase):
    Nurse_ID: int
    class Config:
        orm_mode = True





class EmergencyContactBase(BaseModel):
    Contact_Name: str
    Phone: str
    Relation: str
    Patient_ID: int

class EmergencyContactCreate(EmergencyContactBase):
    pass

class EmergencyContact(EmergencyContactBase):
    Contact_ID: int
    class Config:
        orm_mode = True




class PayrollBase(BaseModel):
    Salary: Decimal
    Bonus: Optional[Decimal] = None
    Emp_ID: int
    IBAN: Optional[str] = None

class PayrollCreate(PayrollBase):
    pass

class Payroll(PayrollBase):
    Account_No: str
    class Config:
        orm_mode = True




class LabScreeningBase(BaseModel):
    Patient_ID: int
    Technician_ID: int
    Doctor_ID: int
    Test_Cost: Optional[Decimal] = None
    Date: date

class LabScreeningCreate(LabScreeningBase):
    pass

class LabScreening(LabScreeningBase):
    Lab_ID: int
    class Config:
        orm_mode = True




class InsuranceBase(BaseModel):
    Patient_ID: int
    Ins_Code: str
    End_Date: Optional[str] = None
    Provider: Optional[str] = None
    Plan: Optional[str] = None
    Co_Pay: Optional[Decimal] = None
    Coverage: Optional[str] = None
    Maternity: Optional[bool] = None
    Dental: Optional[bool] = None
    Optical: Optional[bool] = None

class InsuranceCreate(InsuranceBase):
    pass

class Insurance(InsuranceBase):
    Policy_Number: str
    class Config:
        orm_mode = True





class MedicineBase(BaseModel):
    M_Name: str
    M_Quantity: int
    M_Cost: Optional[Decimal] = None

class MedicineCreate(MedicineBase):
    pass

class Medicine(MedicineBase):
    Medicine_ID: int
    class Config:
        orm_mode = True



class PrescriptionBase(BaseModel):
    Patient_ID: int
    Medicine_ID: int
    Date: Optional[date] = None
    Dosage: Optional[int] = None
    Doctor_ID: int

class PrescriptionCreate(PrescriptionBase):
    pass

class Prescription(PrescriptionBase):
    Prescription_ID: int
    class Config:
        orm_mode = True




class MedicalHistoryBase(BaseModel):
    Patient_ID: int
    Allergies: Optional[str] = None
    Pre_Conditions: Optional[str] = None

class MedicalHistoryCreate(MedicalHistoryBase):
    pass

class MedicalHistory(MedicalHistoryBase):
    Record_ID: int
    class Config:
        orm_mode = True




class AppointmentBase(BaseModel):
    Scheduled_On: datetime
    Date: Optional[date] = None
    Time: Optional[time] = None
    Doctor_ID: int
    Patient_ID: int

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    Appt_ID: int
    class Config:
        orm_mode = True




class RoomBase(BaseModel):
    Room_Type: str
    Patient_ID: int
    Room_Cost: Optional[Decimal] = None

class RoomCreate(RoomBase):
    pass

class Room(RoomBase):
    Room_ID: int
    class Config:
        orm_mode = True




class BillBase(BaseModel):
    Date: Optional[date] = None
    Room_Cost: Optional[Decimal] = None
    Test_Cost: Optional[Decimal] = None
    Other_Charges: Optional[Decimal] = None
    M_Cost: Optional[Decimal] = None
    Total: Optional[Decimal] = None
    Patient_ID: int
    Remaining_Balance: Optional[Decimal] = None
    Policy_Number: str

class BillCreate(BillBase):
    pass

class Bill(BillBase):
    Bill_ID: int
    class Config:
        orm_mode = True
