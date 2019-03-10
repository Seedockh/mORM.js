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
    if(typeof id!="number") throw new Error('Row id must be a number.');
    //if(typeof id!="object") throw new Error('No data to be saved.');
    let attr = (typeof attributes!="undefined" && attributes!=null && attributes.length!=null && attributes.length>0) ? attributes.join(',') : '*';
    console.log(`Request sent : SELECT ${attr} FROM ${this.name} WHERE id=${id}`);
    try {
      const result = await this.dbInstance.client.query(`SELECT ${attr} FROM ${this.name} WHERE id=${id}`);
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


  }
  async remove(data) {


  }
}
