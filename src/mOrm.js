import { isEmpty } from 'lodash';
import { existsSync } from 'fs';
import path from 'path';
import PostgreSQL from '../engine/postgresql.js';

export default class mOrm {
  configPathName = "./morm.config.json";

  async createConnection(dbConfig = {}) {

    // checking configuration 🤘
    if (isEmpty(dbConfig)) {
      if (!existsSync(path.join(__dirname,this.configPathName))) {
        throw new Error("Config file morm.config.json required");
      }
      this.config = require(this.configPathName);
    } else {
      if (dbConfig.uri) {
        const regExp = /^(.*):\/\/(.*):(.*)@(.*):(\d+)\/(.*)$/g;
        // ',' bypasses element 0
        const [, type,username,password,host,port,database] = regExp.exec(dbConfig.uri);
        this.config = { type, username, password, host, port, database };

      } else {
        this.config = dbConfig;
      }
    }
    console.log(this.config);

    //Instantiate database engine

    switch(this.config.type) {
      case 'postgres' :
        this.dbInstance = new PostgreSQL(this.config);
        break;
      case 'mysql' :
        this.dbInstance = new MySQL(this.config);
        break;
      default :
        throw new Error(`Engine ${this.config.type} not supported.`)
    }

    await this.dbInstance.initialize();

    //Initialize entities (get class attributes > make SQL request on Client)
  }
}
