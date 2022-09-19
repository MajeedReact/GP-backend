import client from "../../../database";
//here we put type
export type motherboard  = {
  MB_Id: number; 
  MB_Name:String;
  Socket:String;
  Manufacturer:String;
  min_memory_speed:String;
};

export class motherboardClass {
  async getAllmotherboard(): Promise<motherboard[]> {
    try {
               //wait the response from server

      const conn = await client.connect();

      const sql = "SELECT * FROM motherboard";
      const result = await conn.query(sql);
      //close the connection
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not retrive motherboard: ${err}`);
    }
  }
 
}