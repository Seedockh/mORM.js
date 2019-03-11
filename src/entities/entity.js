export default class Entity {
  constructor(dbInstance, name) {
    this.dbInstance = dbInstance,
    this.name = name
  }

  async save(data) {
    if(typeof data!="object") throw new Error('No data object to be saved.');
    const colNames = [];
    const colValues = [];
    for (const col in data) {
      colNames.push(`${col}`);
      colValues.push(`'${data[col]}'`);
    };
    console.log(`Request sent : INSERT INTO ${this.name} (${colNames.join(',')}) VALUES (${colValues.join(',')})`);

    try {
      await this.dbInstance.client.query(`INSERT INTO ${this.name} (${colNames.join(',')}) VALUES (${colValues.join(',')})`);
      const result = await this.dbInstance.client.query(`SELECT * from ${this.name} where ${colNames[0]} = ${colValues[0]}`);
      return result.rows[result.rows.length-1]; //returns last occurence result
    } catch(e) {
      console.log(`Error while inserting data.`);
      console.log(e.message);
    }
  }


  async count() {
    console.log(`Request sent : SELECT COUNT(*) FROM ${this.name}`);
    try {
      const result = await this.dbInstance.client.query(`SELECT COUNT(*) FROM ${this.name}`);
      return result.rows[0].count;
    } catch(e) {
      console.log(`Error while counting data.`);
      console.log(e.message);
    }
  }

  async findByPk(id, { attributes }={}) {
    if(typeof id!='number') throw new Error(`Primary key of ${this.name} is not ${typeof id}.`);
    let attr = (typeof attributes!="undefined" && attributes!=null && attributes.length!=null && attributes.length>0) ? attributes.join(',') : '*';
    try {
      const res = await this.dbInstance.client.query(`SELECT a.attname, format_type(a.atttypid, a.atttypmod) AS data_type FROM pg_index i JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey) WHERE  i.indrelid = 'public.${this.name}'::regclass AND i.indisprimary;`);
      const pk = await res.rows[0].attname;
      console.log(`Request sent : SELECT ${attr} FROM ${this.name} WHERE ${pk}=${id}`);
      const result = await this.dbInstance.client.query(`SELECT ${attr} FROM ${this.name} WHERE ${pk}=${id}`);
      return JSON.stringify(result.rows[0],null,2);

    } catch(e) {
      console.log(`Error while fetching data.`);
      console.log(e.message);
    }
  }


  async findAll({ attributes }={}) {
    let attr = (typeof attributes!="undefined" && attributes!=null && attributes.length!=null && attributes.length>0) ? attributes.join(',') : '*';
    console.log(`Request sent : SELECT ${attr} FROM ${this.name}`);
    try {
      const result = await this.dbInstance.client.query(`SELECT ${attr} FROM ${this.name}`);
      return JSON.stringify(result.rows,null,2);
    } catch(e) {
      console.log(`Error while fetching data.`);
      console.log(e.message);
    }
  }


  async findOne({ where, attributes=[] }={}) {
    if(typeof where!="object") throw new Error('Where clause must be an object {field:value}');

    const whereClause = [];
    Object.keys(where).forEach(key => whereClause.push(`${key}='${where[key]}'`) )

    let attr = (typeof attributes!="undefined" && attributes!=null && attributes.length!=null && attributes.length>0) ? attributes.join(',') : '*';
    console.log(`Request sent : SELECT ${attr} FROM ${this.name} WHERE ${whereClause.join(' AND ')}`);
    try {
      const result = await this.dbInstance.client.query(`SELECT ${attr} FROM ${this.name} WHERE ${whereClause.join(" AND ")}`);
      return JSON.stringify(result.rows[0],null,2);
    } catch(e) {
      console.log(`Error while fetching data.`);
      console.log(e.message);
    }
  }


  async update(data) {
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
      console.log(`Request sent : UPDATE ${this.name} SET ${updateClause.join(',')} WHERE ${whereClause.join(' AND ')};`);
      await this.dbInstance.client.query(`UPDATE ${this.name} SET ${updateClause.join(',')} WHERE ${whereClause.join(' AND ')};`);
      const result = await this.dbInstance.client.query(`SELECT * FROM ${this.name} WHERE ${updateClause[0]}`);
      return JSON.stringify(result.rows,null,2);
    } catch(e) {
      console.log('Error while updating data.');
      console.log(e.message);
    }
  }


  async remove(data) {
    if(typeof data!="object" || !data.where || data==={}) {
      throw new Error('No valid data object to be deleted.');
    }
    const whereClause = [];
    Object.keys(data.where).forEach(key => {
      const checkedVal = typeof data.where[key]==="number" ? data.where[key] : `'${data.where[key]}'`;
      whereClause.push(`${key}=${checkedVal}`);
    });
    try {
      console.log(`Request sent : DELETE FROM ${this.name} WHERE ${whereClause.join(' AND ')};`);
      const result = await this.dbInstance.client.query(`DELETE FROM ${this.name} WHERE ${whereClause.join(' AND ')};`);
      return (JSON.stringify(result.rowCount,null,2));
    } catch(e) {
      console.log('Error while deleting data.');
      console.log(e.message);
    }
  }
}
