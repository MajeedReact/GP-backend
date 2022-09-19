import client from "../../../database";
//here we put type
export type gpu = {
    GPU_Id :number;
     GPU_Name :string;
     chipset :string;
       memory :string;
       core_clock: string;
        boost_clock :string;
        Manufacturer: string;
};

export class gpuClass {
  //get all gpu
  async getAllgpus(): Promise<gpu[]> {
    try {
       //wait the response from server
      const conn = await client.connect();

      const sql = "SELECT * FROM gpu";
      const result = await conn.query(sql);
      //close the connection
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not retrive gpu: ${err}`);
    }
  }
 
}