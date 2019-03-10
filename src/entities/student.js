import Entity from './entity.js';

export default class Student extends Entity{
  constructor(dbInstance) {
    // getting class name instead of putting a raw 'Name'
    super(dbInstance,this.constructor.name);
  }
  static meta() {
    return {
      name: "Student",
      columns: {
        id: {
          primary: true,
          type: "number",
          generated: true
        },
        firstname: {
          type: "string"
        },
        lastname: {
          type: "string"
        },
        age: {
          type: "number"
        }
      }
    };
  }
}
