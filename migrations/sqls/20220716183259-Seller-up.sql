/* Replace with your SQL commands */
CREATE TABLE Seller(Seller_id SERIAL PRIMARY KEY,Seller_Email VARCHAR(15),Seller_Password text,Shop_Name VARCHAR(30),Role_id BIGINT REFERENCES Roles(Role_id));