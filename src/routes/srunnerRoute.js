import express from 'express'
//import {verifyPassphrase} from '../middleware/verifyPassphrase.js'
import {verifyCmdText} from '../middleware/veryfiCmdText.js'
import {verifyCmdTextArray} from '../middleware/verifyCmdTextArray.js'
import {verifyCmdTextInsert} from '../middleware/veryfiCmdTextInsert.js'
import { runSQL, runValueSQL, runSelectSQL, runInsertSQLYieldRowID } from '../srunner.js'
import { handle404 } from '../middleware/handle404.js'
import  url from 'url';

export const router = express.Router()

/*
   SRunner Direct 
*/
router.post('/runselectsql', verifyCmdText, async (req, res) => {
    const result = runSelectSQL(req.body.cmdText, req.body.lowerKeys)

    res.status(result.success ? 200 : 400).json({...result, pm_id: process.env.pm_id})
})

router.post('/runvaluesql', verifyCmdText, async (req, res) => {
    const result = runValueSQL(req.body.cmdText, req.body.lowerKeys)

    res.status(result.success ? 200 : 400).json({...result, pm_id: process.env.pm_id})
})

router.post('/runsql', verifyCmdTextArray, async (req, res) => {
    const query = url.parse(req.url,true).query
    const _singleStep = query._singleStep
    const result = runSQL(req.body.cmdTexts, _singleStep)
    
    res.status(result.success ? 200 : 400).json({...result, pm_id: process.env.pm_id})
})

router.post('/runinsertsqlyieldrowid', verifyCmdTextInsert, async (req, res) => {
    const result = runInsertSQLYieldRowID(req.body.cmdText, req.body.id)

    res.status(result.success ? 201 : 400).json({...result, pm_id: process.env.pm_id})
})

/*
   SRunner RESTful
*/
// System info
router.get('/', async (req, res) => {
    const sqliteVersion = runSelectSQL('SELECT sqlite_version();')
    const numberOfTables = runSelectSQL("SELECT count(*) FROM sqlite_master WHERE type='table';")
    const numberOfIndexes = runSelectSQL("SELECT count(*) FROM sqlite_master WHERE type='index';")
    const diskSize = runSelectSQL(`
        SELECT
            ROUND((page_count * page_size) / 1024.0, 2) AS size_kb,
            ROUND((page_count * page_size) / 1024.0 / 1024.0, 2) AS size_mb,
            ROUND((page_count * page_size) / 1024.0 / 1024.0 / 1024.0, 2) AS size_gb
        FROM pragma_page_count(), pragma_page_size();
        `)

    res.json({ 
                'Database ': process.env.DB_PATH, 
                'SQLite Version': sqliteVersion.rows[0]["sqlite_version()"], 
                'Number of tables': numberOfTables.rows[0]["count(*)"], 
                'Number of indexes': numberOfIndexes.rows[0]["count(*)"], 
                "Disk Size (KB)" : diskSize.rows[0]["size_kb"], 
                "Disk Size (MB)" : diskSize.rows[0]["size_mb"], 
                "Disk Size (GB)" : diskSize.rows[0]["size_gb"] 
            })
})

// Get all 
router.get('/:table', async (req, res) => {
    const table = req.params.table
    const query = url.parse(req.url,true).query
    const _filter = query._filter
    const _sort = query._sort
    const _order = query._order
    const _offset = query._offset
    const _limit = query._limit
    const _lowerKeys = query._lowerKeys
    const cmdText = `SELECT * FROM ${table} ` +
                     (query._filter? `WHERE ${_filter} ` : ' ') + 
                     (query._sort? `ORDER BY ${_sort} ` : ' ') +
                     (query._order? `${_order.toUpperCase()} ` : ' ') + 
                     (query._limit? `LIMIT ${_limit} ` : ' ') + 
                     (query._offset? `OFFSET ${_offset} ` : ' ')

    if (query._norun)
        return res.status(200).json({cmdText})

    const result = runSelectSQL(cmdText, _lowerKeys)

    res.status(result.success ? 200 : 400).json({cmdText, ...result, pm_id: process.env.pm_id})
})

// Get one 
router.get('/:table/:key', async (req, res) => {
    const table = req.params.table
    const query = url.parse(req.url,true).query    
    const _keyname = query._keyname || "id"
    const quote = query._keytype==="string" ? "'" : ""   
    const keyvalue = req.params.key
    const _lowerKeys = query._lowerKeys
    const cmdText = `SELECT * FROM ${table} WHERE ${_keyname}=${quote}${keyvalue}${quote}`

    if (query._norun)
        return res.status(200).json({cmdText})

    const result = runSelectSQL(cmdText, _lowerKeys)

    res.status(result.success ? 200 : 400).json({
        cmdText, 
        success: result.success, 
        row: (result.rows[0] ? result.rows[0] : null),
        pm_id: process.env.pm_id
    })
})

// Create one
router.post('/:table', async (req, res) => {
    const table = req.params.table.toLowerCase()
    const query = url.parse(req.url,true).query
    let fieldList = ''
    let valueList = ''

    for (const [key, value] of Object.entries(req.body)) {
        if (fieldList!=='') fieldList += ', '
        if (valueList!=='') valueList += ', '
        
        fieldList += key 
        valueList += ((typeof value)==='string'?"'":"") + value + ((typeof value)==='string'?"'":"")
    }
    const cmdText = `INSERT INTO ${table} (${fieldList}) VALUES(${valueList})`

    if (query._norun)
        return res.status(200).json({cmdText})

    const result = runInsertSQLYieldRowID(cmdText)

    res.status(result.success ? 201 : 400).json({cmdText, ...result, pm_id: process.env.pm_id})
})

// Update one
router.patch('/:table/:key', async (req, res) => {
    const table = req.params.table.toLowerCase()
    const query = url.parse(req.url,true).query    
    const _keyname = query._keyname || "id" 
    const quote = query._keytype==="string" ? "'" : ""   
    const keyvalue = req.params.key
    let setList = ''

    for (const [key, value] of Object.entries(req.body)) {
        if (setList!=='') setList += ', '
        
        setList += `${key}=${((typeof value)==='string'?"'":"")}${value}${((typeof value)==='string'?"'":"")}`
    }
    const cmdText = `UPDATE ${table} set ${setList} WHERE ${_keyname}=${quote}${keyvalue}${quote} `
    
    if (query._norun)
        return res.status(200).json({cmdText})

    const result = runInsertSQLYieldRowID(cmdText)

    res.status(result.success ? 200 : 400).json({cmdText, ...result, pm_id: process.env.pm_id})
})

// Delete one 
router.delete('/:table/:key', async (req, res) => {
    const table = req.params.table.toLowerCase()
    const query = url.parse(req.url,true).query    
    const _keyname = query._keyname || "id" 
    const quote = query._keytype==="string" ? "'" : ""   
    const keyvalue = req.params.key
    const cmdText = `DELETE FROM ${table} WHERE ${_keyname}=${quote}${keyvalue}${quote}`
    
    if (query._norun)
        return res.status(200).json({cmdText})

    const result = runInsertSQLYieldRowID(cmdText)

    res.status(result.success ? 200 : 400).json({cmdText, ...result, pm_id: process.env.pm_id})
})

router.use(handle404);  

/*
   node.js get url query params from http request
   https://www.codexpedia.com/node-js/node-js-get-url-query-params-from-http-request/

   Object.entries()
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
*/