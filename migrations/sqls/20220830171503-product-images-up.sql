/* Replace with your SQL commands */
CREATE TABLE product_images (image_id SERIAL PRIMARY KEY, image_name varchar, image_byte bytea, product_id bigint REFERENCES product(product_id));