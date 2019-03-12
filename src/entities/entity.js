import Log from '../libs/mLog'

export default class Entity {
  constructor(dbInstance, name) {
    this.dbInstance = dbInstance;
    this.name = name;
    this.logger = dbInstance.logger;
  }

  async save(data) {
    const { logger } = this;
    if(typeof data!="object") throw new Error('No data object to be saved.');
    const colNames = [];
    const colValues = [];
    for (const col in data) {
      colNames.push(`${col}`);
      colValues.push(`'${data[col]}'`);
    };
    try {
      const query = await this.dbInstance.client.query(`INSERT INTO ${this.name} (${colNames.join(',')}) VALUES (${colValues.join(',')})`);
      logger.w(`INSERT INTO ${this.name} (${colNames.join(',')}) VALUES (${colValues.join(',')})`);
      const result = await this.dbInstance.client.query(`SELECT * from ${this.name} where ${colNames[0]} = ${colValues[0]}`);
      return result.rows[result.rows.length-1]; //returns last occurence result
    } catch(e) {
      logger.w(`Error while inserting data.`);
      logger.w(e.message);
    }
  }


  async count() {
    const { logger } = this;
    try {
      const result = await this.dbInstance.client.query(`SELECT COUNT(*) FROM ${this.name}`);
      logger.w(`SELECT COUNT(*) FROM ${this.name}`);
      return result.rows[0].count;
    } catch(e) {
      logger.w(`Error while counting data.`);
      logger.w(e.message);
    }
  }

  async findByPk(id, { attributes }={}) {
    const { logger } = this;
    if(typeof id!='number') throw new Error(`Primary key of ${this.name} is not ${typeof id}.`);
    let attr = (typeof attributes!="undefined" && attributes!=null && attributes.length!=null && attributes.length>0) ? attributes.join(',') : '*';
    try {
      const res = await this.dbInstance.client.query(`SELECT a.attname, format_type(a.atttypid, a.atttypmod) AS data_type FROM pg_index i JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey) WHERE  i.indrelid = 'public.${this.name}'::regclass AND i.indisprimary;`);
      const pk = await res.rows[0].attname;
      logger.w(`SELECT ${attr} FROM ${this.name} WHERE ${pk}=${id}`);
      const result = await this.dbInstance.client.query(`SELECT ${attr} FROM ${this.name} WHERE ${pk}=${id}`);
      return JSON.stringify(result.rows[0],null,2);

    } catch(e) {
      logger.w(`Error while fetching data.`);
      logger.w(e.message);
    }
  }


  async findAll({ attributes }={}) {
    const { logger } = this;
    let attr = (typeof attributes!="undefined" && attributes!=null && attributes.length!=null && attributes.length>0) ? attributes.join(',') : '*';
    logger.w(`SELECT ${attr} FROM ${this.name}`);
    try {
      const result = await this.dbInstance.client.query(`SELECT ${attr} FROM ${this.name}`);
      return JSON.stringify(result.rows,null,2);
    } catch(e) {
      logger.w(`Error while fetching data.`);
      logger.w(e.message);
    }
  }


  async findOne({ where, attributes=[] }={}) {
    const { logger } = this;
    if(typeof where!="object") throw new Error('Where clause must be an object {field:value}');

    const whereClause = [];
    Object.keys(where).forEach(key => whereClause.push(`${key}='${where[key]}'`) )

    let attr = (typeof attributes!="undefined" && attributes!=null && attributes.length!=null && attributes.length>0) ? attributes.join(',') : '*';
    logger.w(`SELECT ${attr} FROM ${this.name} WHERE ${whereClause.join(' AND ')}`);
    try {
      const result = await this.dbInstance.client.query(`SELECT ${attr} FROM ${this.name} WHERE ${whereClause.join(" AND ")}`);
      return JSON.stringify(result.rows[0],null,2);
    } catch(e) {
      logger.w(`Error while fetching data.`);
      logger.w(e.message);
    }
  }


  async update(data) {
    const { logger } = this;
    if(typeof data!="object" || !data.where || Object.values(data).length<2) {
      throw new Error('No valid data object to be updated.');
    }
    const updateClause = []
    const whereClause = [];
    Object.keys(data.where).forEach(key => {
      const checkedVal = typeof data.where[key]==="number" ? data.where[key] : `'${data.where[key]}'`;
      whereClause.push(`${key}=${checkedVal}`);
    });
    Object.keys(data).forEach(dat => {
      if (dat!=='where') {
        const checkedVal = typeof data[dat]==="number" ? data[dat] : `'${data[dat]}'`;
        updateClause.push(`${dat}=${checkedVal}`);
      }
    });
    try {
      logger.w(`UPDATE ${this.name} SET ${updateClause.join(',')} WHERE ${whereClause.join(' AND ')};`);
      await this.dbInstance.client.query(`UPDATE ${this.name} SET ${updateClause.join(',')} WHERE ${whereClause.join(' AND ')};`);
      const result = await this.dbInstance.client.query(`SELECT * FROM ${this.name} WHERE ${updateClause[0]}`);
      return JSON.stringify(result.rows,null,2);
    } catch(e) {
      logger.w('Error while updating data.');
      logger.w(e.message);
    }
  }


  async remove(data) {
    const { logger } = this;
    if(typeof data!="object" || !data.where || data==={}) {
      throw new Error('No valid data object to be deleted.');
    }
    const whereClause = [];
    Object.keys(data.where).forEach(key => {
      const checkedVal = typeof data.where[key]==="number" ? data.where[key] : `'${data.where[key]}'`;
      whereClause.push(`${key}=${checkedVal}`);
    });
    try {
      logger.w(`DELETE FROM ${this.name} WHERE ${whereClause.join(' AND ')};`);
      const result = await this.dbInstance.client.query(`DELETE FROM ${this.name} WHERE ${whereClause.join(' AND ')};`);
      return (JSON.stringify(result.rowCount,null,2));
    } catch(e) {
      logger.w('Error while deleting data.');
      logger.w(e.message);
    }
  }
}
