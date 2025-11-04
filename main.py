from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, crud
from database import engine, Sessional


models.Base.metadata.create_all(bind=engine)



app = FastAPI(title="Hospital Management System", version="1.0")



def get_db():
    db = Sessional()
    try:
        yield db
    finally:
        db.close()





@app.post("/patients/", response_model=schemas.Patient)
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    return crud.create_patient(db=db, patient=patient)


@app.get("/patients/", response_model=list[schemas.Patient])
def read_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_patients(db=db, skip=skip, limit=limit)


@app.get("/patients/{patient_id}", response_model=schemas.Patient)
def read_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = crud.get_patient_by_id(db, patient_id)
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient


@app.put("/patients/{patient_id}", response_model=schemas.Patient)
def update_patient(patient_id: int, updated_patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    patient = crud.update_patient(db, patient_id, updated_patient)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@app.delete("/patients/{patient_id}")
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = crud.delete_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {"message": f"Patient with ID {patient_id} deleted successfully."}








@app.post("/doctors/", response_model=schemas.Doctor)
def create_doctor(doctor: schemas.DoctorCreate, db: Session = Depends(get_db)):
    return crud.create_doctor(db=db, doctor=doctor)


@app.get("/doctors/", response_model=list[schemas.Doctor])
def read_doctors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_doctors(db=db, skip=skip, limit=limit)


@app.get("/doctors/{doctor_id}", response_model=schemas.Doctor)
def read_doctor(doctor_id: int, db: Session = Depends(get_db)):
    doctor = crud.get_doctor_by_id(db, doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor


@app.put("/doctors/{doctor_id}", response_model=schemas.Doctor)
def update_doctor(doctor_id: int, updated_doctor: schemas.DoctorCreate, db: Session = Depends(get_db)):
    doctor = crud.update_doctor(db, doctor_id, updated_doctor)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor


@app.delete("/doctors/{doctor_id}")
def delete_doctor(doctor_id: int, db: Session = Depends(get_db)):
    doctor = crud.delete_doctor(db, doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return {"message": f"Doctor with ID {doctor_id} deleted successfully."}








@app.post("/staff/", response_model=schemas.Staff)
def create_staff(staff: schemas.StaffCreate, db: Session = Depends(get_db)):
    return crud.create_staff(db=db, staff=staff)


@app.get("/staff/", response_model=list[schemas.Staff])
def read_staff(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_staffs(db=db, skip=skip, limit=limit)


@app.get("/staff/{emp_id}", response_model=schemas.Staff)
def read_staff_by_id(emp_id: int, db: Session = Depends(get_db)):
    staff = crud.get_staff_by_id(db, emp_id)
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return staff


@app.put("/staff/{emp_id}", response_model=schemas.Staff)
def update_staff(emp_id: int, updated_staff: schemas.StaffCreate, db: Session = Depends(get_db)):
    staff = crud.update_staff(db, emp_id, updated_staff)
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return staff


@app.delete("/staff/{emp_id}")
def delete_staff(emp_id: int, db: Session = Depends(get_db)):
    staff = crud.delete_staff(db, emp_id)
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return {"message": f"Staff with ID {emp_id} deleted successfully."}







@app.post("/nurses/", response_model=schemas.Nurse)
def create_nurse(nurse: schemas.NurseCreate, db: Session = Depends(get_db)):
    return crud.create_nurse(db=db, nurse=nurse)


@app.get("/nurses/", response_model=list[schemas.Nurse])
def read_nurses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_nurses(db=db, skip=skip, limit=limit)


@app.get("/nurses/{nurse_id}", response_model=schemas.Nurse)
def read_nurse_by_id(nurse_id: int, db: Session = Depends(get_db)):
    nurse = crud.get_nurse_by_id(db, nurse_id)
    if not nurse:
        raise HTTPException(status_code=404, detail="Nurse not found")
    return nurse


@app.put("/nurses/{nurse_id}", response_model=schemas.Nurse)
def update_nurse(nurse_id: int, updated_nurse: schemas.NurseCreate, db: Session = Depends(get_db)):
    nurse = crud.update_nurse(db, nurse_id, updated_nurse)
    if not nurse:
        raise HTTPException(status_code=404, detail="Nurse not found")
    return nurse


@app.delete("/nurses/{nurse_id}")
def delete_nurse(nurse_id: int, db: Session = Depends(get_db)):
    nurse = crud.delete_nurse(db, nurse_id)
    if not nurse:
        raise HTTPException(status_code=404, detail="Nurse not found")
    return {"message": f"Nurse with ID {nurse_id} deleted successfully."}



@app.get("/")
def home():
    return {"message": "🏥 Hospital Management System API is running successfully!"}
