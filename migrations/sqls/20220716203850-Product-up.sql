/* Replace with your SQL commands */
CREATE TABLE Product(Product_Id SERIAL PRIMARY KEY,Product_Name VARCHAR(100),product_thumbnail VARCHAR, Product_Quantity integer,Product_Description text, Tags VARCHAR(15), created_at date not null default CURRENT_DATE, Price FLOAT,lat FLOAT,lan FLOAT,city varchar,neighborhood varchar,Seller_id BIGINT REFERENCES Seller(Seller_id),Category_Id integer REFERENCES Category(Category_Id));

