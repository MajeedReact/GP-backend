import client from "../../../database";
//here we put type
export type cpu = {
 
  CPU_Id: number;
   CPU_Name :String;
   cpu_image :String;
   Socket: String;
   Cores: String;
   Manufacturer: String;
   core_clock:String;
   boost_clock: String;
};

export class cpuClass {
  //get all admins for admins only
  async getAllcpus(): Promise<cpu[]> {
    try {
               //wait the response from server

      const conn = await client.connect();

      const sql = "SELECT * FROM admins";
      const result = await conn.query(sql);
      //close the connection
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not retrive cpu: ${err}`);
    }
  }
 
}