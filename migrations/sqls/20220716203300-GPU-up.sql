/* Replace with your SQL commands */
CREATE TABLE GPU(GPU_Id SERIAL PRIMARY KEY ,GPU_Name varchar, chipset varchar,  memory varchar, core_clock varchar, boost_clock varchar,  Manufacturer VARCHAR(30));


COPY GPU FROM 'C:\Users\hp\OneDrive\Desktop\GP-Backend\GP-backend\src\scrapping\gpu' DELIMITER ',';         
-- We have to use absolute path to import CSV into the table
-- Unfortunately relative path does not work!
