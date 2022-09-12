import client from "../database";

export type roles = {
  role_id: number;
  role_name: string;
};

export class accessRoles {
  //get all roles for admins only
  async getAllRoles(): Promise<roles[]> {
    try {
      const conn = await client.connect();

      const sql = "SELECT * FROM roles";
      const result = await conn.query(sql);
      //close the connection
      conn.release();

      if (result.rowCount < 5) {
        console.log("less than 5");
      }

      return result.rows;
    } catch (err) {
      throw new Error(`Could not retrive roles: ${err}`);
    }
  }
  //get specific role
  //upate role
  //delete role
}
