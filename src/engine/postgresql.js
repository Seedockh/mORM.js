import { Client } from 'pg';
import Core from './core.js';

export default class PostgreSQL extends Core {
  constructor(options,extras) {
    super(options,extras);
  }

  async initialize() {
    const {host,port,username,password,database,synchronize,entities} = this;
    this.client = new Client({ host, port, user:username, password, database });
    try {
      await this.client.connect();
      Object.values(entities).forEach( entity => {
        const table = entity.meta();
        try {
          if (synchronize) {
            this.client.query(this.dropTable(table.name));
          } else {
          }
          const query = this.createTable(table.name,table.columns);
          console.log(`Request sent : ${query}`);
          this.client.query(query);
        } catch(err) {
          console.log(`Error whilde creating table ${table.name}.`);
          console.log(err);
        }
      });
    } catch(e) {
      console.log(e.message);
      console.log(`Database ${database} doesn't exist.`);
    }
  }

  createTable(name,cols) {
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
        this.client.end();
        throw new Error(`Table field <${colName}> must have a specified type.`);
      }
    }
    return `CREATE TABLE IF NOT EXISTS ${name} ( ${columns} ) `;
  }

  dropTable(name) {
    console.log(`Request sent : DROP TABLE IF EXISTS ${name}`);
    return `DROP TABLE IF EXISTS ${name}`;
  }

  async close() {
    await this.client.end();
  }
}
