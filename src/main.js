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
    console.log(`========> Database initialized successfully !`);

    // save method

    let student1 = { firstname: "Dora", lastname: "Lexploratrice"};
    let student2 = { firstname: "Jack", lastname: "Sparrow", age:25};
    let student3 = { firstname: "Neo", lastname: "Anderson", age:75};
    let student4 = { firstname: "Madame", lastname: "Bonpoil", age:10};
    let student5 = { firstname: "Stanley", lastname: "Ipkis", age:52};
    const studentEntity = await orm.getEntity('Student');
    let saved = await studentEntity.save(student1);
    console.log(`========> New student ${saved.firstname}`);
    saved = await studentEntity.save(student2);
    console.log(`========> New student ${saved.firstname}`);
    saved = await studentEntity.save(student3);
    console.log(`========> New student ${saved.firstname}`);
    saved = await studentEntity.save(student4);
    console.log(`========> New student ${saved.firstname}`);
    saved = await studentEntity.save(student5);
    console.log(`========> New student ${saved.firstname}`);

    // count method
    const countRows = await studentEntity.count();
    console.log(`========> Number of rows : ${countRows}`);

    // findByPk method
    const thirdRow = await studentEntity.findByPk(3);
    console.log(`========> Third row : ${thirdRow}`);
    const firstRow = await studentEntity.findByPk(1,{attributes:["id","firstname"]});
    console.log(`========> First row : ${firstRow}`);

    // findAll method
    const allFullRows = await studentEntity.findAll();
    console.log(`========> All full rows : ${allFullRows}`);
    const allFilteredRows = await studentEntity.findAll({attributes:['firstname','lastname']});
    console.log(`========> All filtered rows : ${allFilteredRows}`);

    // findOne method
    const findDora = await studentEntity.findOne({where:{firstname:"Dora"}},{attributes:["id","firstname"]});
    console.log(`========> Find Dora row : ${findDora}`);
    const findFullNeo = await studentEntity.findOne({where:{firstname:"Neo", lastname:"Anderson"}});
    console.log(`========> Find Neo row : ${findFullNeo}`);

    // update method
    const updateDora = await studentEntity.update({lastname:'The Explorator',where:{firstname:'Dora',id:1}});
    console.log(`========> Update Dora row : ${updateDora}`);
    const updateNeo = await studentEntity.update({lastname:'The Matrix Masta',age:1200,where:{firstname:'Neo',id:3}});
    console.log(`========> Update Neo row : ${updateNeo}`);

    // remove method
    const deleteBonpoil = await studentEntity.remove({where:{firstname:'Madame'}});
    console.log(`========> Delete Madame Bonpoil row : ${deleteBonpoil} row(s) deleted.`);

    await orm.closeConnection();
  } catch(err) {
    console.log(`Error at connection : ${err}`);
    process.exit(-1);
  }

})();
