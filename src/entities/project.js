import Entity from './entity.js';

export default class Project extends Entity{
  constructor(dbInstance) {
    // getting class name instead of putting a raw 'Name'
    super(dbInstance,this.constructor.name);
  }
  static meta() {
    return {
      name: "Project",
      columns: {
        id: {
          primary: true,
          type: "number",
          generated: true
        },
        name: {
          type: "string"
        }
      }
    };
  }
}
