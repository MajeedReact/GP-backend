import client from "../database";

export type review = {
  review_id?: number;
  description: String;
  rating: number;
  product_id: number;
  customer_id: number;
};

export class reviewClass {
  async getAllReviewByProductID(product_id: number): Promise<review[]> {
    try {
      const conn = await client.connect();

      //get all reviews from specfic product id by using inner join
      const sql =
        "SELECT * FROM review INNER JOIN product ON product.product_id = $1";

      const result = await conn.query(sql, [product_id]);

      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(`Could not retrive reviews from the server ${error}`);
    }
  }

  async getReviewByID(review_id: number): Promise<review[]> {
    try {
      const conn = await client.connect();

      //get all reviews from specfic product id by using inner join
      const sql = "SELECT * FROM review WHERE review_id = $1";

      const result = await conn.query(sql, [review_id]);

      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(`Could not retrive reviews from the server ${error}`);
    }
  }

  async insertReview(r: review): Promise<review> {
    try {
      const conn = await client.connect();

      const sql =
        "INSERT INTO review (description, rating, product_id, customer_id) VALUES($1, $2, $3, $4)";

      const result = await conn.query(sql, [
        r.description,
        r.rating,
        r.product_id,
        r.customer_id,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error("An error occured while inserting review" + error);
    }
  }

  async checkReview(
    customer_id: number,
    product_id: number
  ): Promise<boolean | undefined> {
    try {
      const conn = await client.connect();
      //check if the user bought
      const sql =
        "SELECT customer_id FROM orders INNER JOIN orders_details ON orders_details.product_id = $1 WHERE customer_id = $2";

      const result = await conn.query(sql, [product_id, customer_id]);

      conn.release();

      if (result.rows.length > 0) {
        return true;
      } else return false;
    } catch (error) {}
  }

  async checkDuplicate(
    customer_id: number,
    product_id: number
  ): Promise<boolean | undefined> {
    try {
      const conn = await client.connect();
      //check if the user already posted a review
      const sql =
        "SELECT * FROM review WHERE customer_id = $1 AND product_id = $2";

      const result = await conn.query(sql, [customer_id, product_id]);

      console.log(result.rows.length);
      conn.release();

      if (result.rows.length > 0) {
        return false;
      } else return true;
    } catch (error) {}
  }
}
