/* Replace with your SQL commands */
CREATE TABLE Motherboard(MB_Id SERIAL PRIMARY KEY ,MB_Name VARCHAR ,Socket VARCHAR,Manufacturer VARCHAR, min_memory_speed varchar);

-- COPY Motherboard FROM 'C:\Users\malna\OneDrive\Desktop\GP-backend\src\scrapping\mb\mb.csv' DELIMITER ',';         
-- We have to use absolute path to import CSV into the table
-- Unfortunately relative path does not work!
