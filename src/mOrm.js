import { isEmpty } from 'lodash';
import { existsSync } from 'fs';
import path from 'path';
import PostgreSQL from './engine/postgresql.js';
import Student from "./entities/student";
import Entity from "./entities/entity";

export default class mOrm {
  configPathName = "./morm.config.json";

  async createConnection(dbConfig={},extras={ entities:[] }) {
    // checking configuration 🤘
    if (isEmpty(dbConfig) || !dbConfig.uri) {
      if (!existsSync(path.join(__dirname,this.configPathName))) {
        throw new Error("Config file morm.config.json required");
      }
      this.config = require(this.configPathName);
      this.config.synchronize = dbConfig.synchronize !== undefined ? dbConfig.synchronize : false;

      this.entities = {};
      for (const entity of extras.entities) {
        this.entities[entity.prototype.constructor.name] = entity;
      }

    } else {
      if (dbConfig.uri) {
        const regExp = /^(.*):\/\/(.*):(.*)@(.*):(\d+)\/(.*)$/g;
        // ',' bypasses element 0
        const [,type,username,password,host,port,database] = regExp.exec(dbConfig.uri);
        this.config = { type, username, password, host, port, database };
      } else if (dbConfig.type && dbConfig.host && dbConfig.username && dbConfig.password && dbConfig.database) {
        this.config = dbConfig;
      }
    }

    //Instantiate database engine
    switch(this.config.type) {
      case 'postgres' :
        this.dbInstance = new PostgreSQL(this.config,this.entities);
        break;
      case 'mysql' :
        this.dbInstance = new MySQL(this.config);
        break;
      default :
        throw new Error(`Engine ${this.config.type} not supported.`)
    }

    await this.dbInstance.initialize();

  }

  //Initialize entities (get class attributes > make SQL request on Client)
  async getEntity(name) {
    const entity = await new Entity(this.dbInstance,this.entities[name].name);
    return entity;
  }

  async closeConnection() {
    await this.dbInstance.close();
  }
}
