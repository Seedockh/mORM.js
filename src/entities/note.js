import Entity from './entity.js';

export default class Note extends Entity{
  constructor(dbInstance) {
    // getting class name instead of putting a raw 'Name'
    super(dbInstance,this.constructor.name);
  }
  static meta() {
    return {
      name: "Note",
      columns: {
        id: {
          primary: true,
          type: "number",
          generated: true
        },
        note: {
          type: "number"
        }
      }
    };
  }
}
