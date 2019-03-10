export default class Core {
  constructor({ host, port, username, password, database }) {
    this.host = host;
    this.port = port;
    this.username = username;
    this.password = password;
    this.database = database;
  }

  dump(is_uri) {
    if (is_uri) {
      console.log(`Database URI informations :
      HOST : ${this.host}
      PORT : ${this.port}
      USERNAME : ${this.username}
      PASSWORD : ${this.password}
      DATABASE : ${this.database}
      `);
    }
  }
}
