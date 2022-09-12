import client from "../database";

export type admin = {
  admin_id: number;
  admin_name: string;
};

export class admins {
  //get all admins for admins only
  async getAllAdmins(): Promise<admin[]> {
    try {
      const conn = await client.connect();

      const sql = "SELECT * FROM admins";
      const result = await conn.query(sql);
      //close the connection
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not retrive roles: ${err}`);
    }
  }
  //get specific role
  //upate role
  //delete role
}
