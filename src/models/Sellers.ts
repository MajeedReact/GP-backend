import client from "../database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;

export type seller = {
  seller_id?: number;
  seller_email: string;
  seller_password: string;
  shop_name: string;
  role_id: number;
};

export class sellers {
  async deleteSeller(id: number): Promise<seller[]> {
    try {
      const conn = await client.connect();

      const sql = "DELETE FROM seller WHERE seller_id = $1";

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(`Could not retrive customers ${error}`);
    }
  }
  async checkShopName(shop_name: string): Promise<boolean> {
    try {
      const conn = await client.connect();

      const sql = "SELECT shop_name FROM seller WHERE shop_name = $1";
      const result = await conn.query(sql, [shop_name]);
      //close the connection
      conn.release();

      if (result.rows.length) return true;

      return false;
    } catch (err) {
      throw new Error(`Could not retrive roles: ${err}`);
    }
  }
  //for admins only
  async getAllSeller(): Promise<seller[]> {
    try {
      const conn = await client.connect();

      const sql = "SELECT * FROM seller";
      const result = await conn.query(sql);
      //close the connection
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not retrive roles: ${err}`);
    }
  }
  //get specific seller and all their posts maybe use join
  async getSellerWithId(seller_id: number): Promise<seller> {
    try {
      const conn = await client.connect();

      const sql = "SELECT * FROM seller WHERE seller_id = $1";
      const result = await conn.query(sql, [seller_id]);
      //close the connection
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not retrive seller: ${err}`);
    }
  }

  //getSellerPageWithShopName
  //create seller, add phone number
  async createSeller(s: seller): Promise<seller> {
    try {
      const conn = await client.connect();

      const sql =
        "INSERT INTO seller (seller_email, seller_password, shop_name, role_id) VALUES ($1, $2, $3, $4) RETURNING shop_name";
      const hash = bcrypt.hashSync(
        s.seller_password + pepper,
        Number(saltRounds)
      );
      const result = await conn.query(sql, [
        s.seller_email,
        hash,
        s.shop_name,
        s.role_id, //which is seller role may change it later
      ]);
      //close the connection
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create seller: ${err}`);
    }
  }

  async checkEmail(email: string): Promise<boolean | undefined> {
    try {
      const conn = await client.connect();

      const sql = "SELECT seller_email FROM seller WHERE seller_email = $1";
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

  async loginSeller(
    email: string,
    password: string
  ): Promise<seller | null | undefined> {
    try {
      //connect to database
      const conn = await client.connect();
      //get the customer details from database
      const sql = "SELECT * FROM seller WHERE seller_email = $1";
      const result = await conn.query(sql, [email]);

      conn.release();
      //check if there is a result with credintials
      if (result.rows.length) {
        const seller = result.rows[0];

        //hash the current password and compare it with the customer password in the database
        if (bcrypt.compareSync(password + pepper, seller.seller_password)) {
          return seller;
        }
      }
      return null;
    } catch (error) {
      throw new Error(
        "An Error occured while retriving login details " + error
      );
    }
  }
  //upate seller
  //if decoded seller id == await sellers.getSellerWithId, if seller id == decoded id then they can update
  //delete seller
}
