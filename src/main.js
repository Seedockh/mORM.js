import mOrm from "./mOrm";
import Student from "./entities/student";

(async () => {
  const orm = new mOrm();

  try {
    await orm.createConnection({
      //"uri": "postgres://postgres:postgres@localhost:5432/iLovePragmatic",
      synchronize: true,
      entities: [Student]
    });
  } catch(err) {
    console.log(`Error at connection : ${err}`);
    process.exit(-1);
  }
})();
