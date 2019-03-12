import { Client } from 'pg';
import Core from './core.js';
import Log from '../libs/mLog'

export default class PostgreSQL extends Core {
  constructor(options,extras) {
    super(options,extras);
  }
  logger = new Log(this.logging);

  async initialize() {
    const {host,port,username,password,database,synchronize,entities,logging,logger} = this;
    this.client = new Client({ host, port, user:username, password, database });
    try {
      await this.client.connect();
      Object.values(entities).forEach( async entity => {
        const table = entity.meta();
        try {
          if (synchronize) {
            await this.client.query(this.dropTable(table.name));
            logger.w(this.dropTable(table.name));
          }
          const query = this.createTable(table.name,table.columns);
          this.client.query(query);
          logger.w(query);
        } catch(err) {
          logger.w(`Error while creating table ${table.name}.`);
          logger.w(err);
        }
      });
    } catch(e) {
      logger.w(e.message);
      logger.w(`Database ${database} doesn't exist.`);
    }
  }

  createTable(name,cols,logging) {
    let columns = "";
    for (let colName in cols) {
      let col = cols[colName];
      if (col.type) {
        switch (col.type) {
          case 'string':
            col.type = 'VARCHAR (255)';
            break;
          case 'number':
            col.type = 'numeric';
            break;
          default:
            col.type = 'VARCHAR (255)';
            break;
        }

        if (col.generated) columns += `${colName} SERIAL`;
        else columns += `${colName} ${col.type}`;
        if (col.primary) columns += ` PRIMARY KEY`;

        if (Object.keys(cols)[Object.keys(cols).indexOf(colName)+1]) columns += `, `;
      } else {
        throw new Error(`Table field <${colName}> must have a specified type.`);
      }
    }
    return `CREATE TABLE IF NOT EXISTS ${name} ( ${columns} ) `;
  }

  dropTable(name) {
    return `DROP TABLE IF EXISTS ${name}`;
  }

  async close() {
    await this.client.end((err,res)=>{
      if (err) throw new Error("Connection ended badly.");
    });
  }
}
