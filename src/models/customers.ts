import client from "../database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;

export type customer = {
  customer_id?: number;
  customer_email: string;
  cus_first_name: string;
  cus_last_name: string;
  customer_password: string;
  created_at?: Date;
  role_id: number;
};

export class customers {
  async deleteCustomer(id: number): Promise<customer[]> {
    try {
      const conn = await client.connect();

      const sql = "DELETE FROM customer WHERE customer_id = $1";

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(`Could not retrive customers ${error}`);
    }
  }
  async getAllCustomers(): Promise<customer[]> {
    try {
      const conn = await client.connect();

      const sql = "SELECT * FROM customer";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(`Could not retrive customers ${error}`);
    }
  }

  async getCustomerWithId(id: number): Promise<customer | null> {
    try {
      const conn = await client.connect();

      const sql = "SELECT * FROM customer WHERE customer_id = $1";

      const result = await conn.query(sql, [id]);

      conn.release;

      //checking if there is a result
      if (result.rows.length) {
        //save result into variable customer
        const customer = result.rows[0];
        //check if it is not null
        if (customer != null) return customer;
      }
      //else not found return null
      return null;
    } catch (error) {
      throw new Error(`Could not retrive customer with id ${id} ${error}`);
    }
  }

  async createCustomer(c: customer): Promise<customer> {
    try {
      const conn = await client.connect();

      const sql =
        "INSERT INTO customer(customer_email, Cus_First_Name,  Cus_Last_Name, Customer_Password, role_id) VALUES ($1, $2, $3, $4, $5) RETURNING *";
      const hash = bcrypt.hashSync(
        c.customer_password + pepper,
        Number(saltRounds)
      );
      const result = await conn.query(sql, [
        c.customer_email,
        c.cus_first_name,
        c.cus_last_name,
        hash,
        c.role_id,
      ]);

      //close connection
      conn.release;

      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not create customer ${error}`);
    }
  }

  //FOR TESTING PURPOSES ONLY
  async createCustomerWithoutHash(c: customer): Promise<customer> {
    try {
      const conn = await client.connect();

      const sql =
        "INSERT INTO customer(customer_email, Cus_First_Name,  Cus_Last_Name, Customer_Password, role_id) VALUES ($1, $2, $3, $4, $5) RETURNING *";

      const result = await conn.query(sql, [
        c.customer_email,
        c.cus_first_name,
        c.cus_last_name,
        c.customer_password,
        c.role_id,
      ]);

      //close connection
      conn.release;

      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not create customer ${error}`);
    }
  }
  async checkEmail(email: string): Promise<boolean | undefined> {
    try {
      const conn = await client.connect();

      const sql =
        "SELECT customer_email FROM customer WHERE customer_email iLike $1";
      const result = await conn.query(sql, [email]);

      //close connection
      conn.release;

      if (result.rows.length) {
        return true;
      } else false;
    } catch (error) {
      throw new Error("an error occured while checking for email " + error);
    }
  }

  // takes email and password
  async loginCustomer(
    email: string,
    password: string
  ): Promise<customer | null | undefined> {
    try {
      //connect to database
      const conn = await client.connect();
      //get the customer details from database
      const sql = "SELECT * FROM customer WHERE customer_email = $1";
      const result = await conn.query(sql, [email]);

      conn.release();
      //check if there is a result with credintials
      if (result.rows.length) {
        const user = result.rows[0];

        //hash the current password and compare it with the customer password in the database
        if (bcrypt.compareSync(password + pepper, user.customer_password)) {
          return user;
        }
      }
      return null;
    } catch (error) {
      throw new Error(
        "An Error occured while retriving login details " + error
      );
    }
  }

  async updateCustomer(s: customer) {}
}
