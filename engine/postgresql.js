import { Client } from 'pg';
import Core from './core.js';

export default class PostgreSQL extends Core {
  constructor(options) {
    super(options);
  }

  async initialize() {
    const {host,port,username,password,database} = this;
    this.client = new Client({ user: username, host, port, database, password });

    try {
      await client.connect();
      this.client.query('SELECT NOW()',(err,res)=>{
        console.log(err,res);
        this.client.end();
      })
    } catch(e) {
      console.log(`Database ${database} doesn't exist.`);
    }
  }
}
