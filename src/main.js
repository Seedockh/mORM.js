import mOrm from "./mOrm";
import Student from "./entities/student";

(async () => {
  const orm = new mOrm();

  try {
    await orm.createConnection(
      //"uri": "postgres://postgres:postgres@localhost:5432/iLovePragmatic",
      { synchronize: true },
      {
        entities: [Student],
        logging: true
      },
    );

    let student1 = { firstname: "Dora", lastname: "Lexploratrice"};
    let student2 = { firstname: "Jack", lastname: "Sparrow", age:25};
    let student3 = { firstname: "Neo", lastname: "Anderson", age:75};
    let student4 = { firstname: "Madame", lastname: "Bonpoil", age:10};
    let student5 = { firstname: "Stanley", lastname: "Ipkis", age:52};
    const studentEntity = await orm.getEntity('Student');

    // save method
    let saved = await studentEntity.save(student1);
    saved = await studentEntity.save(student2);
    saved = await studentEntity.save(student3);
    saved = await studentEntity.save(student4);
    saved = await studentEntity.save(student5);

    // count method
    const countRows = await studentEntity.count();

    // findByPk method
    const thirdRow = await studentEntity.findByPk(3);
    const firstRow = await studentEntity.findByPk(1,{attributes:["id","firstname"]});

    // findAll method
    const allFullRows = await studentEntity.findAll();
    const allFilteredRows = await studentEntity.findAll({attributes:['firstname','lastname']});

    // findOne method
    const findDora = await studentEntity.findOne({where:{firstname:"Dora"}},{attributes:["id","firstname"]});
    const findFullNeo = await studentEntity.findOne({where:{firstname:"Neo", lastname:"Anderson"}});

    // update method
    const updateDora = await studentEntity.update({lastname:'The Explorator',where:{firstname:'Dora',id:1}});
    const updateNeo = await studentEntity.update({lastname:'The Matrix Masta',age:1200,where:{firstname:'Neo',id:3}});

    // remove method
    const deleteBonpoil = await studentEntity.remove({where:{firstname:'Madame'}});

    await orm.closeConnection();
  } catch(err) {
    console.log(`Error at connection : ${err}`);
    process.exit(-1);
  }

})();
