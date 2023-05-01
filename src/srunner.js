const Database = require('better-sqlite3')
const { lowerObjKey, lowerObjKeyArray } = require('./utils/lowerKeys')

let db = null; 

// Open database
const openDb = (filename='db.sqlite', options={verbose: logger}) => {
    try {
        db = new Database(filename, options)
        /*
        Though not required, it is generally important to set the WAL pragma for performance reasons.
        https://github.com/WiseLibs/better-sqlite3
        */
        db.pragma('journal_mode = WAL');
        
        return db
    } 
    catch (err) {
        console.log(err)
        return err
    }
}

// Run SQL Statement and return a data table
const runSelectSQL = (cmdText, lowerKeys=false) => {
    try {
        const result = db.prepare(cmdText).all()
        if (lowerKeys)
        {
            const newResult = lowerObjKeyArray(result)
            return { success: true, rows: newResult }  
        }
        else
            return { success: true, rows: result } 
    } catch (err) {
        return { success: false, error: err }
    }
}

// Run SQL Statement and return a value
const runValueSQL = (cmdText, lowerKeys=false) => {
    try {
        const result = db.prepare(cmdText).get()
        if (lowerKeys)
        {
            const newResult = lowerObjKey(result)
            return { success: true, ...newResult }  
        }
        else
            return { success: true, ...result }
    } catch (err) {
        return { success: false, error: err }
    }
}

// Run multiple SQL Statements
const runSQL = (cmdTextArray) => {
    try {
        const result = db.exec(cmdTextArray.join(';'))

        return { success: true, result }   
    } catch (err) {
        return { success: false, error: err }

    }
}

// Run SQL Insert Statement and return the auto increment row id
const runInsertSQLYieldRowID = (cmdText, rowIdName = "id") => {
    try {
        const result = db.prepare(cmdText).run()

        return { success: true, rowsAffected: result.changes, [rowIdName]: result.lastInsertRowid }   
    } catch (err) {
        return { success: false, error: err }

    }
}


// Print out every SQL string executed by the database connection.
const logger = (cmdText) => {
    console.info(`> srunner.logger: cmdText="${cmdText}"`)
}

module.exports = { openDb, runSelectSQL, runValueSQL, runSQL, runInsertSQLYieldRowID } 

/*
   better-sqlite3
   https://www.npmjs.com/package/better-sqlite3

   create table cache (
        tabname char(40),
        crtdate numeric(8, 0),
        crttime numeric(6,0),
        primary key (tabname)
   );
   CREATE TABLE CACHE (
        TABNAME CHAR(40),
        CRTDATE NUMERIC(8, 0),
        CRTTIME NUMERIC(6,0),
        CONSTRAINT CACHE_PK PRIMARY KEY (TABNAME)
   );
   insert into cache values('table1', 1, 2);
   insert into cache values('table2', 3, 4);
   insert into cache values('table3', 5, 6);
   insert into cache values('table4', 7, 8);
   insert into cache values('table5', 9, 10);
*/