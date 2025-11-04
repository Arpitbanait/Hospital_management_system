from database import engine
from sqlalchemy import text

def drop_all_tables():
    with engine.connect() as conn:
        # Disable foreign key checks
        conn.execute(text('SET FOREIGN_KEY_CHECKS = 0'))
        
        # Get all tables
        result = conn.execute(text('SHOW TABLES'))
        tables = [row[0] for row in result]
        
        # Drop each table
        for table in tables:
            conn.execute(text(f'DROP TABLE IF EXISTS `{table}`'))
        
        # Re-enable foreign key checks
        conn.execute(text('SET FOREIGN_KEY_CHECKS = 1'))
        conn.commit()

if __name__ == '__main__':
    drop_all_tables()