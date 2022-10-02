/* Replace with your SQL commands */
CREATE TABLE Admins(Admin_id SERIAL PRIMARY KEY,Admin_Name VARCHAR(30) NOT NULL, Role_id BIGINT REFERENCES Roles(Role_Id));