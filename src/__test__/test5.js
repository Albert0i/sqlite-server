const { openDb, runSelectSQL, runSQL, runSingleSQL } = require("./srunner");

const db = openDb("./db.sqlite");
console.log(db);

const result1 = runSelectSQL("select * from people", true);
console.log(result1);

const result2 = runSingleSQL("INSERT INTO people (first_name,last_name) VALUES('John','Smith');"
);
console.log(result2);

/*
   better-sqlite3
   https://www.npmjs.com/package/better-sqlite3

   SQLite AUTOINCREMENT
   https://www.sqlitetutorial.net/sqlite-autoincrement/?fbclid=IwAR1AB4yZ3aD88jcKjsq0svhpjFXBX3EAw4huYZFDhGVxqhTU-XelPKlx0-M

   SQLite Attach Database
   https://www.sqlitetutorial.net/sqlite-attach-database/?fbclid=IwAR2RChrM6AP0qLWVJ-j0fSWhCdstwRqLhAKAu74XqNDhaVguYdc_wSxihhs

   CREATE TABLE people (
        person_id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name text NOT NULL,
        last_name text NOT NULL
   );
   INSERT INTO people (first_name,last_name) VALUES('John','Smith');
   INSERT INTO people (first_name,last_name) VALUES('William','Wilson');
   INSERT INTO people (first_name,last_name) VALUES('Ian','Murdok');
   INSERT INTO people (first_name,last_name) VALUES('Peter','Pan');
   INSERT INTO people (first_name,last_name) VALUES('Allison','Duvar');

   attach database 'user.db' as user;
*/
