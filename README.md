# Hospital Management System
(by Arpit Banait)

📌 Overview

A full-stack Hospital Management System with:

Backend (Python + FastAPI + SQLAlchemy)

Frontend (custom UI in separate folder)

SQL database + ER diagram

Complete CRUD operations for patients, doctors & appointments

📂 Project Structure

```bash
Hospital_management_system/
│── hospital_management_system/        # Backend
│     ├── project_dbms.py
│     ├── alembic.ini
│     ├── ...
│── hospital-frontend-dbms/            # Frontend
│     ├── ...
│── README.md
```

🛠️ Prerequisites
```bash
Python 3.x
pip
Node.js & npm
MySQL / PostgreSQL (any SQL database)
(Optional) Virtual environment
```
🚀 Backend Setup (FastAPI)
1️⃣ Clone the repository
```bash
git clone https://github.com/Arpitbanait/Hospital_management_system.git
cd Hospital_management_system/hospital_management_system
```
2️⃣ Create a virtual environment (recommended)

Windows:
```bash
python -m venv venv
venv\Scripts\activate
```

Linux/Mac:
```bash
python3 -m venv venv
source venv/bin/activate
```
3️⃣ Install backend dependencies

```bash
pip install -r requirements.txt
```

(If requirements.txt is missing, install FastAPI manually:)
```bash
pip install fastapi uvicorn sqlalchemy alembic python-multipart
```
4️⃣ Set up the database

Create a database (example for MySQL):

```bash
mysql -u root -p
CREATE DATABASE hospital_db;
```

Update DB credentials inside your backend config file (like project_dbms.py).

5️⃣ Run database migrations (if Alembic is configured)
```bash
alembic upgrade head
```
6️⃣ Start the backend server

```bash
uvicorn main:app --reload
```

If your app file is named differently:

```bash
uvicorn project_dbms:app --reload
```

Backend will run on:

```bash
http://localhost:8000
```

🎨 Frontend Setup
1️⃣ Go to frontend folder

```bash
cd ../hospital-frontend-dbms
```

2️⃣ Install dependencies\

```bash
npm install
```

3️⃣ Start frontend

```bash
npm start
```

Frontend starts at:

```bash
http://localhost:3000
```

Make sure the frontend API base URL points to:

```bash
http://localhost:8000
```

🧪 API Usage (Sample Endpoints)
Get all patients

```bash
GET /patients
```


Add new doctor

```bash
POST /doctors
```

Update an appointment

```bash
PUT /appointments/{id}
```

Delete a patient

```bash
DELETE /patients/{id}
```

🤝 Contributing
# Create new branch

```bash
git checkout -b feature/my-feature
```


# Commit changes

```bash
git commit -m "Added new feature"
```

# Push branch

```bash
git push origin feature/my-feature
```
