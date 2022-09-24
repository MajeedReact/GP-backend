/* Replace with your SQL commands */
CREATE TABLE Motherboard(MB_Id SERIAL PRIMARY KEY ,MB_Name VARCHAR ,Socket VARCHAR,Manufacturer VARCHAR, min_memory_speed varchar);

COPY Motherboard FROM 'C:\Users\hp\OneDrive\Desktop\GP-Backend\GP-backend\src\scrapping\mb\mb_scraping.json' DELIMITER ',';         
-- We have to use absolute path to import CSV into the table
-- Unfortunately relative path does not work!
