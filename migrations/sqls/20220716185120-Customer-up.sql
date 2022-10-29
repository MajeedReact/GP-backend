/* Replace with your SQL commands */
CREATE TABLE Customer(Customer_id SERIAL PRIMARY KEY,Customer_Email VARCHAR NOT NULL,Cus_First_Name text NOT NULL,Cus_Last_Name VARCHAR(15) NOT NULL,Customer_Password text, created_at date not null default CURRENT_DATE, Role_id BIGINT REFERENCES Roles(Role_id));

-- INSERT INTO customer(customer_id, Customer_Email, Cus_First_Name, Cus_Last_Name, Customer_Password, created_at, Role_id) VALUES (0, 'dummy@gmail.com', 'dummy', 'dum', 'dummy123', '2022-10-29', 1);

