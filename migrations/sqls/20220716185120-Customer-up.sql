/* Replace with your SQL commands */
CREATE TABLE Customer(Customer_id SERIAL PRIMARY KEY,Customer_Email VARCHAR,Cus_First_Name text,Cus_Last_Name VARCHAR(15),Customer_Password text,Role_id BIGINT REFERENCES Roles(Role_id));

