import client from "../database";

export type order = {
  order_id?: number;
  order_status: string;
  customer_id: number;
  seller_id: number;
  order_auth: string;
};

export type order_details = {
  order_details_id?: number;
  order_id: number;
  product_id: number;
  qty: number;
  seller_id?: number;
  customer_id?: number;
};

export class orders {
  async deleteOrder(id: number): Promise<order[]> {
    try {
      const conn = await client.connect();

      const sql = "DELETE FROM orders where order_id = $1";

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(`Could not retrive orders ${error}`);
    }
  }
  async deleteOrderDetails(id: number): Promise<order[]> {
    try {
      const conn = await client.connect();

      const sql = "DELETE FROM orders_details where order_id = $1";

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(`Could not retrive orders ${error}`);
    }
  }
  async getAllOrders(): Promise<order[]> {
    try {
      const conn = await client.connect();

      const sql = "SELECT * FROM orders";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(`Could not retrive orders ${error}`);
    }
  }

  // TODO get all orders by customer
  async getAllOrdersByCustomer(customer_id: number): Promise<order[]> {
    try {
      const conn = await client.connect();

      const sql = "SELECT * FROM orders WHERE customer_id = $1";

      const result = await conn.query(sql, [customer_id]);

      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(`Could not retrive orders ${error}`);
    }
  }

  // TODO get all orders by seller
  async getAllOrdersBySeller(seller_id: number): Promise<orders[]> {
    try {
      const conn = await client.connect();

      const sql =
        "SELECT order_id, order_status, order_date, customer_id FROM orders WHERE seller_id = $1;";

      const result = await conn.query(sql, [seller_id]);

      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(`Could not retrive orders ${error}`);
    }
  }

  // TODO get all order details for specific order
  async getOrderDetails(id: number): Promise<order_details[]> {
    try {
      const conn = await client.connect();

      const sql =
        "SELECT * FROM orders INNER JOIN orders_details on orders_details.order_id = orders.order_id WHERE orders.order_id = $1";

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(
        "An Error occured while retriving order with id" + id + " " + error
      );
    }
  }

  async getOrderDetailSeller(id: number): Promise<order_details[]> {
    try {
      const conn = await client.connect();

      const sql =
        "SELECT * FROM orders_details INNER JOIN(SELECT orders.order_id, orders.order_status, orders.customer_id, orders.seller_id FROM orders) o on o.order_id = orders_details.order_id WHERE o.order_id = $1;";

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(
        "An Error occured while retriving order with id" + id + " " + error
      );
    }
  }

  // TODO check if all product has the samee seller
  async createOrder(o: order): Promise<order> {
    try {
      const conn = await client.connect();

      const sql =
        "INSERT INTO orders(order_status, customer_id, seller_id, order_auth) VALUES ($1, $2, $3, $4) RETURNING *";

      const result = await conn.query(sql, [
        o.order_status,
        o.customer_id,
        o.seller_id,
        o.order_auth,
      ]);

      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not create order ${error}`);
    }
  }

  async insertOrderDetails(od: order_details) {
    try {
      const conn = await client.connect();

      const sql =
        "INSERT INTO orders_details(order_id, product_id, quantity, customer_id) VALUES ($1, $2, $3, $4)";

      const result = await conn.query(sql, [
        od.order_id,
        od.product_id,
        od.qty,
        od.customer_id,
      ]);

      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not insert order details ${error}`);
    }
  }

  //TODO update order by seller or admin
  async updateOrder(
    order_id: number,
    order_status: String,
    order_auth: String
  ): Promise<order> {
    try {
      const conn = await client.connect();

      const sql =
        "UPDATE orders SET order_status = $1 WHERE order_id = $2 AND order_auth = $3 RETURNING *";

      const result = await conn.query(sql, [
        order_status,
        order_id,
        order_auth,
      ]);

      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not update order with id ${order_id}: ${error}`);
    }
  }
  async cancelOrder(s: order) {}

  async getOrderID(id: number): Promise<order> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders WHERE order_id = $1";

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not update order with id ${id}: ${error}`);
    }
  }
}
