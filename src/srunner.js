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
const runSQL = (cmdTextArray, singleStep=false) => {
    let result = null
    let rowsAffected = 0 

    if (singleStep) console.log('> srunner.runSQL:singleStep is true')
        if (singleStep) {            
            for (i=0; i<cmdTextArray.length; i++) 
                try {
                    if (cmdTextArray[i].trim().length !==0) {
                        result = db.prepare(cmdTextArray[i]).run()
                        rowsAffected += result.changes                        
                    }
                } catch (err) 
                {
                    console.log(err)
                    console.log(`> srunner.runSQL:cmdTextArray[${i}]="${cmdTextArray[i].trim()}"`)
                    return { success: false, error: err }    
                } 
            return { success: true, rowsAffected }    
        } else {
            try {
                result = db.exec(cmdTextArray.join(';'))
                return { success: true, result }   
            }
            catch (err) {
                console.log(err)
                return { success: false, error: err }
            }
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
*/