import { Client } from 'pg';
import Core from './core.js';

export default class PostgreSQL extends Core {
  constructor(options) {
    super(options);
  }

  async initialize() {
    const {host,port,username,password,database} = this;
    this.client = new Client({ host, port, user:username, password, database });

    try {
      await this.client.connect();
      console.log(this.synchronize);
      this.client.end();
    } catch(e) {
      console.log(e.message);
      console.log(`Database ${database} doesn't exist.`);
    }


    /*this.client.query(`DROP TABLE IF EXISTS ${}`,(err,res)=>{


      this.client.end();
    });*/

  }
}
