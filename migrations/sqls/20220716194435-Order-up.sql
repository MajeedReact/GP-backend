/* Replace with your SQL commands */
CREATE TABLE Orders(Order_Id SERIAL PRIMARY KEY,order_status VARCHAR(15),order_date varchar,order_auth varchar(6),Customer_Id BIGINT REFERENCES Customer(Customer_Id), Seller_Id BIGINT REFERENCES Seller(Seller_id));
