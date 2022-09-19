import client from "../../../database";
//here we put type
export type memory = {
    Memory_Id:number;
    Memory_Name:String;
     Memory_Size:String;
     Memory_Speed: String;
      Manufacturer:String;
 
};

export class memoryClass {
  async getAllmemory(): Promise<memory[]> {
    try {
               //wait the response from server

      const conn = await client.connect();

      const sql = "SELECT * FROM memory";
      const result = await conn.query(sql);
      //close the connection
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not retrive memory: ${err}`);
    }
  }
 
}