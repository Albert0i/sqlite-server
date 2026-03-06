import 'dotenv/config' 
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
//import path from 'path'
//import rfs from 'rotating-file-stream' // version 2.x
import { router as srunnerRoute } from './routes/srunnerRoute.js'
import { handle404 } from './middleware/handle404.js'
import { openDb } from './srunner.js'

const app = express()
app.use(express.json());
app.use(cors());

app.use(morgan('dev'))
app.use('/api/v1', srunnerRoute)
//app.use(handle404)

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server started on ${process.env.SERVER_PORT}`, 
                  process.env.pm_id? `, instance id is ${process.env.pm_id}`:'')    
    //openDb(path.join(__dirname, 'data', 'db.sqlite'))
    openDb(process.env.DB_PATH)
})

/*
   better-sqlite3
   https://www.npmjs.com/package/better-sqlite3

   SQLite AUTOINCREMENT
   https://www.sqlitetutorial.net/sqlite-autoincrement/?fbclid=IwAR1AB4yZ3aD88jcKjsq0svhpjFXBX3EAw4huYZFDhGVxqhTU-XelPKlx0-M

   SQLite Attach Database
   https://www.sqlitetutorial.net/sqlite-attach-database/?fbclid=IwAR2RChrM6AP0qLWVJ-j0fSWhCdstwRqLhAKAu74XqNDhaVguYdc_wSxihhs
*/