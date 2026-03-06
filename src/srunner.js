import 'dotenv/config' 
import Database from 'better-sqlite3'
//import { lowerObjKey, lowerObjKeyArray } from './utils/lowerKeys.js'

let db = null; 

// Open database
export const openDb = (filename='db.sqlite', options={verbose: logger}) => {
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
export const runSelectSQL = (cmdText) => {
    try {
        const result = db.prepare(cmdText).all()
  
        return { success: true, rows: result } 
    } catch (err) {
        return { success: false, error: err }
    }
}

// Run SQL Statement and return a value
export const runValueSQL = (cmdText) => {
    try {
        const result = db.prepare(cmdText).get()
        
        return { success: true, ...result }
    } catch (err) {
        return { success: false, error: err }
    }
}

// Run multiple SQL Statements
export const runSQL = (cmdTextArray, singleStep=false) => {
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
export const runInsertSQLYieldRowID = (cmdText, rowIdName = "id") => {
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