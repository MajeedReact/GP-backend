import client from "../../../database";

export default class dashboardAdmin {
  async getNumberOfCustomerEachMonth() {
    try {
      const conn = await client.connect();

      const sql =
        "SELECT DATE_TRUNC('month',created_at) AS  created_at, COUNT(customer_id) AS count FROM customer GROUP BY DATE_TRUNC('month',created_at)";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(
        "An Error occured while retriving number of customers each month " +
          error
      );
    }
  }

  async numberOfCustomerLast7Days() {
    try {
      const conn = await client.connect();

      const sql =
        "select COUNT(*) from customer where created_at > current_date - interval '7 days'";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(
        "An Error occured while retriving number of customers for the last 7 days " +
          error
      );
    }
  }

  async getNumberOfSellerEachMonth() {
    try {
      const conn = await client.connect();

      const sql =
        "SELECT DATE_TRUNC('month',created_at) AS  created_at, COUNT(seller_id) AS count FROM seller GROUP BY DATE_TRUNC('month',created_at)";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(
        "An Error occured while retriving number of sellers each month " + error
      );
    }
  }

  async numberOfSellerLast7Days() {
    try {
      const conn = await client.connect();

      const sql =
        "select COUNT(*) from seller where created_at > current_date - interval '7 days'";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(
        "An Error occured while retriving number of sellers for the last 7 days " +
          error
      );
    }
  }

  async getNumberOfOrdersEachMonth() {
    try {
      const conn = await client.connect();

      const sql =
        "SELECT DATE_TRUNC('month',created_at) AS  created_at, COUNT(order_id) AS count FROM orders GROUP BY DATE_TRUNC('month',created_at)";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(
        "An Error occured while retriving number of orders each month " + error
      );
    }
  }
  async numberOfOrdersLast7Days() {
    try {
      const conn = await client.connect();

      const sql =
        "select COUNT(*) from orders where created_at > current_date - interval '7 days'";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(
        "An Error occured while retriving number of orders for the last 7 days " +
          error
      );
    }
  }
}
