/* Replace with your SQL commands */
CREATE TABLE Product(Product_Id SERIAL PRIMARY KEY,Product_Name VARCHAR(100),Product_Quantity integer,Product_Description text, Tags VARCHAR(15),Created_at varchar ,Price FLOAT,lat FLOAT,lan FLOAT,city varchar,neighborhood varchar,Seller_id BIGINT REFERENCES Seller(Seller_id),Category_Id integer REFERENCES Category(Category_Id));





-- Product_Image VARCHAR(500),Product_images VARCHAR(500)