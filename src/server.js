import 'dotenv/config' 
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { createStream } from 'rotating-file-stream';
import path from 'path';
import { router as srunnerRoute } from './routes/srunnerRoute.js'
import { handle404 } from './middleware/handle404.js'
import { openDb } from './srunner.js'

const app = express()
app.use(express.json());
app.use(cors());

// Create a rotating write stream (daily rotation)
const accessLogStream = createStream('access.log', {
    interval: '1d',   // rotate daily
    path: path.join(process.cwd(), 'log'),
    compress: 'gzip'  // compress rotated files
  });
  
// Use Morgan with the rotating stream
app.use(morgan('combined', { stream: accessLogStream }));  

app.use('/api/v1', srunnerRoute)
app.use(handle404)

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server started on ${process.env.SERVER_PORT}`, 
                  process.env.pm_id? `, instance id is ${process.env.pm_id}`:'')    
    
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