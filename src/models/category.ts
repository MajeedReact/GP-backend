import client from "../database";

export type category = {
  Category_Id?: number;
  Category_Name: string;
};

export class categories {
  async getCatById(id: number): Promise<category> {
    try {
      const conn = await client.connect();

      const sql = "SELECT * FROM category WHERE category_id = $1";
      const result = await conn.query(sql, [id]);
      //close the connection
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not retrive categories: ${err}`);
    }
  }
  //public
  async getAllCategories(): Promise<category[]> {
    try {
      const conn = await client.connect();

      const sql = "SELECT * FROM category";
      const result = await conn.query(sql);
      //close the connection
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not retrive categories: ${err}`);
    }
  }

  async getCategoryByID(category_id: number): Promise<category | null> {
    try {
      const conn = await client.connect();

      const sql = "SELECT * FROM category WHERE category_id = $1";
      const result = await conn.query(sql, [category_id]);
      //close the connection
      conn.release();

      if (result.rows.length) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`Could not retrive category: ${err}`);
    }
  }
  //get specific category and all their posts maybe use join
  async getProductByCategory(category_id: number): Promise<category[]> {
    try {
      const conn = await client.connect();

      const sql = "SELECT * FROM product WHERE category_id = $1";
      const result = await conn.query(sql, [category_id]);
      //close the connection
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not retrive seller: ${err}`);
    }
  }

  //admin use in dashboard
  async createCategory(s: category): Promise<category> {
    try {
      const conn = await client.connect();

      const sql =
        "INSERT INTO category (category_name) VALUES ($1) RETURNING category_name";
      const result = await conn.query(sql, [s.Category_Name]);
      //close the connection
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create category: ${err}`);
    }
  }
  //upate seller

  //delete category, admin use only!
  async deleteCategory(id: number): Promise<category> {
    try {
      const conn = await client.connect();

      const sql = "DELETE FROM category WHERE category_id = $1";
      const result = await conn.query(sql, [id]);
      //close the connection
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete category with id ${id}: ${err}`);
    }
  }
}
