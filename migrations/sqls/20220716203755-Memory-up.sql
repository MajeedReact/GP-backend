/* Replace with your SQL commands */
CREATE TABLE Memory(Memory_Id SERIAL PRIMARY KEY ,Memory_Name VARCHAR , Memory_Size VARCHAR(15) ,Memory_Speed varchar ,Manufacturer VARCHAR(30));


COPY Memory FROM 'H:\Graduation Project\backend\src\scrapping\memory\memory_scraping.csv' DELIMITER ',';         
-- We have to use absolute path to import CSV into the table
-- Unfortunately relative path does not work!
