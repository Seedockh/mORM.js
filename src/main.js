import mOrm from "./mOrm";

(async () => {
  const orm = new mOrm();

  try {
    await orm.createConnection({
      "type": "postgres",
      "host": "localhost",
      "port": 5432,
      "username": "efrei",
      "password": "efrei",
      "database": "iLovePragmatic"
    });
  } catch(err) {
    console.log(err);
    process.exit(-1);
  }
})();
