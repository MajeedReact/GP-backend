import client from "../database";

export type product = {
  product_id?: number;
  product_name: string;
  product_thumbnail: string;
  product_quantity: number;
  product_description: string;
  tags: string;
  price: number;
  lat: number;
  lan: number;
  city: string;
  neighborhood: string;
  seller_id: number;
  category_id: number;
};

export type product_image = {
  image_id?: number;
  image_name: String;
  image_byte: String;
  product_id: number;
};
export class products {
  async searchProduct(query: string, city: string): Promise<product[]> {
    try {
      const conn = await client.connect();
      const sql =
        "SELECT * FROM product WHERE to_tsvector(product_name) @@ to_tsquery($1) AND to_tsvector(city) @@ to_tsquery($2);";
      const result = await conn.query(sql, [query, city]);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not retrive products: ${err}`);
    }
  }
  async searchProductWithoutCity(query: string): Promise<product[]> {
    try {
      const conn = await client.connect();

      const sql =
        "SELECT * FROM product WHERE to_tsvector(product_name) @@ to_tsquery($1);";
      const result = await conn.query(sql, [query]);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not retrive product: ${err}`);
    }
  }
  async deleteProduct(id: number) {
    try {
      const conn = await client.connect();

      const sql = "DELETE FROM product WHERE product_id = $1";
      const result = await conn.query(sql, [id]);
      //close the connection
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not retrive product: ${err}`);
    }
  }
  async getAllProductsFromSeller(sellerID: number) {
    try {
      const conn = await client.connect();

      const sql = "SELECT * FROM product WHERE seller_id = $1";
      const result = await conn.query(sql, [sellerID]);
      //close the connection
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not retrive product: ${err}`);
    }
  }
  //get all product
  async getAllProducts(): Promise<product[]> {
    try {
      const conn = await client.connect();

      const sql = "SELECT * FROM product";
      const result = await conn.query(sql);
      //close the connection
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not retrive product: ${err}`);
    }
  }
  //get latest 3 products
  async latestProducts(): Promise<product[]> {
    try {
      const conn = await client.connect();

      const sql = "SELECT * FROM product order by created_at DESC LIMIT 3";
      const result = await conn.query(sql);
      //close the connection
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not retrive product: ${err}`);
    }
  }

  //get specific product
  async getProductWithId(product_id: number): Promise<product> {
    try {
      const conn = await client.connect();

      const sql = "SELECT * FROM product WHERE product_id = $1";
      const result = await conn.query(sql, [product_id]);
      //close the connection
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not retrive product_id: ${err}`);
    }
  }

  async recommendedProducts(
    device: number,
    price: number,
    type: string
  ): Promise<product[]> {
    try {
      const conn = await client.connect();
      console.log(type + " from db");

      const sql =
        "SELECT * FROM PRODUCT WHERE category_id = $1 AND PRICE <= $2 AND tags iLike $3 ORDER BY PRICE DESC;";
      const result = await conn.query(sql, [device, price, type]);
      //close the connection
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not retrive products: ${err}`);
    }
  }

  //create product
  async createProduct(p: product): Promise<product> {
    try {
      const conn = await client.connect();

      const sql =
        "INSERT INTO product (product_name, product_quantity, product_description, price, tags, lat, lan, city, neighborhood, seller_id, category_id, product_thumbnail) VALUES ($1, $2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *";
      const result = await conn.query(sql, [
        p.product_name,
        p.product_quantity,
        p.product_description,
        p.price,
        p.tags,
        p.lat,
        p.lan,
        p.city,
        p.neighborhood,
        p.seller_id,
        p.category_id,
        p.product_thumbnail,
      ]);
      //close the connection
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create product: ${err}`);
    }
  }

  async getCities(): Promise<string[]> {
    try {
      const conn = await client.connect();

      const sql = "SELECT DISTINCT CITY FROM PRODUCT";
      const result = await conn.query(sql);
      //close the connection
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not retrive cities: ${err}`);
    }
  }
  //update product
  async updateProductWithoutImage(p: product): Promise<product> {
    try {
      const conn = await client.connect();

      const sql =
        "UPDATE product SET product_name = $1, product_quantity = $2, product_description = $3, price = $4, tags = $5, lat = $6, lan = $7, city = $8, neighborhood = $9, category_id = $10 WHERE product_id = $11";
      const result = await conn.query(sql, [
        p.product_name,
        p.product_quantity,
        p.product_description,
        p.price,
        p.tags,
        p.lat,
        p.lan,
        p.city,
        p.neighborhood,
        p.category_id,
        p.product_id,
      ]);
      //close the connection
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create product: ${err}`);
    }
  }
  async updateProduct(p: product): Promise<product> {
    try {
      const conn = await client.connect();

      const sql =
        "UPDATE product SET product_name = $1, product_quantity = $2, product_description = $3, price = $4, tags = $5, lat = $6, lan = $7, city = $8, neighborhood = $9, category_id = $10, product_thumbnail = $11 WHERE product_id = $12";
      const result = await conn.query(sql, [
        p.product_name,
        p.product_quantity,
        p.product_description,
        p.price,
        p.tags,
        p.lat,
        p.lan,
        p.city,
        p.neighborhood,
        p.category_id,
        p.product_thumbnail,
        p.product_id,
      ]);
      //close the connection
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create product: ${err}`);
    }
  }

  //upate quantity
  async updateQty(id: number, quantity: number): Promise<product> {
    try {
      const conn = await client.connect();

      const sql =
        "UPDATE product SET product_quantity = $1 WHERE product_id = $2";

      const result = await conn.query(sql, [quantity, id]);

      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `An error occured while updating quantity of the product` + error
      );
    }
  }

  //Insert Images as binary or base64
  async insertImage(img: product_image) {
    try {
      const conn = await client.connect();

      const sql =
        "INSERT INTO product_images (image_name, image_byte, product_id) VALUES ($1, $2, $3)";

      const result = await conn.query(sql, [
        img.image_name,
        img.image_byte,
        img.product_id,
      ]);

      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `An error occured while updating quantity of the product` + error
      );
    }
  }
  //delete category, admin use only!
  // async deleteCategory(id: number): Promise<category> {
  //   try {
  //     const conn = await client.connect();

  //     const sql = "DELETE FROM category WHERE category_id = $1";
  //     const result = await conn.query(sql, [id]);
  //     //close the connection
  //     conn.release();

  //     return result.rows[0];
  //   } catch (err) {
  //     throw new Error(`Could not delete category with id ${id}: ${err}`);
  //   }
  // }
}
