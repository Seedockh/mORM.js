# mORM.js

## ORM made from scratch with NodeJS

### Initialization :
First, you can put your database configuration in a JSON file so mOrm can connect automatically. For example :
> morm.config.json
`{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "postgres",
  "database": "iLovePragmatic"
}`

Now you can create a new mOrm instance :
`import mOrm from "./mOrm";

const orm = new mOrm();`

### Connection :
Then it's time to create a connection, wether with an URI :

`await orm.createConnection(
  "uri": "postgres://postgres:postgres@localhost:5432/iLovePragmatic",
);`

or with other settings :
`{ synchronize: true },
{
  entities: [YourTableName],
  logging: true
}`

or with your full configuration object if you don't want to use morm.config.json.

### Queries
