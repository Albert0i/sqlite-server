require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const rfs = require('rotating-file-stream') // version 2.x
const { router : srunnerRoute } = require('./routes/srunnerRoute')
const { handle404 } = require('./middleware/handle404')
const { openDb } = require('./srunner')

const app = express()
app.use(express.json());
app.use(cors());

// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'logs')
  })
   
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

app.use('/api/v1/sr', srunnerRoute)

app.all('/*', handle404)

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server started on ${process.env.SERVER_PORT}...`)    
    openDb(path.join(__dirname, 'data', 'db.sqlite'))
})

/*
   better-sqlite3
   https://www.npmjs.com/package/better-sqlite3

   SQLite AUTOINCREMENT
   https://www.sqlitetutorial.net/sqlite-autoincrement/?fbclid=IwAR1AB4yZ3aD88jcKjsq0svhpjFXBX3EAw4huYZFDhGVxqhTU-XelPKlx0-M

   SQLite Attach Database
   https://www.sqlitetutorial.net/sqlite-attach-database/?fbclid=IwAR2RChrM6AP0qLWVJ-j0fSWhCdstwRqLhAKAu74XqNDhaVguYdc_wSxihhs
*/