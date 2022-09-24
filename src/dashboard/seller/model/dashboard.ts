import client from "../../../database";

export default class dashboardSeller {
  async getAllOrdersBySellerEachMonth(seller_id: number) {
    try {
      const conn = await client.connect();

      const sql =
        "SELECT DATE_TRUNC('month',order_date) AS  order_date, COUNT(order_id) AS count FROM orders WHERE seller_id = $1 GROUP BY DATE_TRUNC('month',order_date)";
      const result = await conn.query(sql, [seller_id]);

      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(
        "An Error occured retriving orders for seller with id " +
          seller_id +
          " " +
          error
      );
    }
  }
}
