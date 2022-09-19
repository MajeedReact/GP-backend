/* Replace with your SQL commands */
CREATE TABLE Memory(Memory_Id SERIAL PRIMARY KEY ,Memory_Name VARCHAR , Memory_Size VARCHAR(15) ,Memory_Speed varchar ,Manufacturer VARCHAR(30));


COPY Memory FROM 'C:\Users\hp\OneDrive\Desktop\GP-Backend\GP-backend\src\scrapping\mb' DELIMITER ',';         
-- We have to use absolute path to import CSV into the table
-- Unfortunately relative path does not work!
