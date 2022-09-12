import client from "../database";

export type order = {
  order_id?: number;
  order_status: string;
  customer_id: number;
  order_date: string;
};

export type order_details = {
  order_details_id?: number;
  order_id: number;
  seller_id: number;
  product_id: number;
  qty: number;
};

export class orders {
  async getAllOrders(): Promise<order[]> {
    try {
      const conn = await client.connect();

      const sql = "SELECT * FROM orders";

      const result = await conn.query(sql);

      conn.release;

      return result.rows;
    } catch (error) {
      throw new Error(`Could not retrive orders ${error}`);
    }
  }

  //get order details using order id update this later
  async getOrderWithId(id: number): Promise<order> {
    try {
      const conn = await client.connect();

      const sql = "SELECT * FROM orders_details WHERE order_id = $1";

      const result = await conn.query(sql, [id]);

      conn.release;

      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not retrive order with id ${id} ${error}`);
    }
  }

  // TODO get all order details for specific order
  async getOrderDetails(id: number): Promise<order_details[]> {
    try {
      const conn = await client.connect();

      const sql = "SELECT * FROM orders_details WHERE order_id = $1";

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(
        "An Error occured while retriving order with id" + id + " " + error
      );
    }
  }

  //get customer id from order and compare it with the customer id from the token to ensure they are the same
  async orderCheck(customer_id: number, order_id: number): Promise<boolean> {
    try {
      const conn = await client.connect();

      const sql =
        "SELECT customer_id FROM orders WHERE order_id = $1 AND customer_id = $2";

      const result = await conn.query(sql, [order_id, customer_id]);

      conn.release();

      if (result.rows.length) {
        return true;
      } else return false;
    } catch (error) {
      throw new Error(
        "An Error occured while retriving order with id" +
          customer_id +
          " " +
          error
      );
    }
  }

  // TODO check if all product has the samee seller

  async createOrder(o: order): Promise<order> {
    try {
      const conn = await client.connect();

      const sql =
        "INSERT INTO orders(order_status, customer_id, order_date) VALUES ($1, $2, $3) RETURNING *";

      const result = await conn.query(sql, [
        o.order_status,
        o.customer_id,
        o.order_date,
      ]);

      conn.release;

      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not create order ${error}`);
    }
  }

  async insertOrderDetails(od: order_details) {
    try {
      const conn = await client.connect();

      const sql =
        "INSERT INTO orders_details(order_id, seller_id, product_id, quantity ) VALUES ($1, $2, $3, $4)";

      const result = await conn.query(sql, [
        od.order_id,
        od.seller_id,
        od.product_id,
        od.qty,
      ]);

      conn.release;

      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not insert order details ${error}`);
    }
  }

  //TODO update order by seller or admin
  async updateOrder(s: order) {}
  async cancelOrder(s: order) {}
}
