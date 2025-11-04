from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "mysql+pymysql://root:arpi%401503@localhost/hospital_db"

engine = create_engine(DATABASE_URL, pool_pre_ping=True, connect_args={"connect_timeout": 5})

Sessional = sessionmaker(bind=engine,autoflush=False,autocommit=False)

Base = declarative_base()