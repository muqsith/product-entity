const pathModule = require("path");
const { URL } = require("url");

const fs = require("fs-extra");
const { program } = require("commander");
const { Client } = require("pg");

const getFileData = async (filePath) => {
  const buf = await fs.readFile(filePath);
  return buf.toString("utf8");
};

const run = async (user, password, dbName, connectionString) => {
  console.log(`
    Initializing database ${dbName} for user ${user} ...
  `);

  const connectionParams = new URL(connectionString);
  const superUser = connectionParams.username;
  const superUserPassword = connectionParams.password;
  const host = connectionParams.hostname;
  const port = connectionParams.port;

  let superUserClient = new Client({ connectionString });
  await superUserClient.connect();

  let queryResult = await superUserClient.query({
    text: "SELECT 1 FROM pg_database WHERE datname=$1",
    values: [dbName],
  });

  if (queryResult.rowCount > 0) {
    await superUserClient.query(`DROP DATABASE ${dbName}`);
  }

  // 1. create role
  queryResult = await superUserClient.query({
    text: "SELECT 1 FROM pg_roles WHERE rolname=$1",
    values: [user],
  });

  if (queryResult.rowCount > 0) {
    await superUserClient.query({
      text: `DROP ROLE ${user}`,
    });
  }

  await superUserClient.query({
    text: `CREATE ROLE ${user} CREATEDB LOGIN PASSWORD '${password}'`,
  });

  // 2. create database
  await superUserClient.query(`CREATE DATABASE ${dbName} `);

  await superUserClient.end();

  // 3. create extension in the database
  superUserClient = new Client({
    user: superUser,
    password: superUserPassword,
    database: dbName,
    host,
    port,
  });
  await superUserClient.connect();
  await superUserClient.query(`CREATE EXTENSION "uuid-ossp"`);
  await superUserClient.end();

  // 4. create schema
  const userClient = new Client({
    user,
    password,
    database: dbName,
    host,
    port,
  });
  await userClient.connect();

  await userClient.query("BEGIN");
  try {
    const baseSQL = await getFileData(
      pathModule.resolve(__dirname, "..", "sql", "base.sql")
    );

    await userClient.query(baseSQL);

    await userClient.query("COMMIT");
  } catch (err) {
    console.error(err);
    await userClient.query("ROLLBACK");
  }

  await userClient.end();
};

program
  .option("-u, --user <string>")
  .option("-p, --password <string>")
  .option("-d, --database <string>")
  .option("-c, --connection-string <string>");

program.parse();

const options = program.opts();
const user = options.user;
const password = options.password;
const dbName = options.database;
const connectionString = options.connectionString;

if (!user || !password || !dbName || !connectionString) {
  console.error(`
    user or password or dbName or connectionString cannot be empty
  `);
  process.exit(100);
}

run(user, password, dbName, connectionString);
