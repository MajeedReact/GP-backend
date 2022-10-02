/* Replace with your SQL commands */
CREATE TABLE Customer(Customer_id SERIAL PRIMARY KEY,Customer_Email VARCHAR NOT NULL,Cus_First_Name text NOT NULL,Cus_Last_Name VARCHAR(15) NOT NULL,Customer_Password text, created_at date not null default CURRENT_DATE, Role_id BIGINT REFERENCES Roles(Role_id));

