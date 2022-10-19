/* Replace with your SQL commands */
CREATE TABLE CPU(CPU_Id SERIAL PRIMARY KEY,CPU_Name VARCHAR(30),cpu_image text, Socket VARCHAR(15),Cores INT,Manufacturer VARCHAR(30), core_clock VARCHAR, boost_clock VARCHAR);

/* IMPORT scrapped cpu data csv file into the table */     
COPY CPU FROM 'H:\GP-backend\src\scrapping\cpu\cpu_scrapping.csv' DELIMITER ',';         

-- We have to use absolute path to import CSV into the table
-- Unfortunately relative path does not work!
