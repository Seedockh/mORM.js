import mOrm from "./mOrm";

(async () => {
  const orm = new mOrm();

  try {
    await orm.createConnection({
      //"uri": "postgres://efrei:efrei@localhost:5432/iLovePragmatic"
      //entity: [Student,Project,Note]
    });
  } catch(err) {
    console.log(err);
    process.exit(-1);
  }
})();
