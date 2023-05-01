# sqlite-server

## SQLite Server --- JSON Server facsimile backed by SQLite. 


<div style="text-align: right; color:white; background-color:black"><em>
Hey, diddle diddle,<br />
The cat and the fiddle.
</em></div>


### Prologue 
I love [SQLite](https://www.sqlite.org/index.html), I love [json-server](https://www.npmjs.com/package/json-server), I love everything simple and small. Chastity is purity; debauchery is obscenity... Alas! Servers for SQL tend to be colossal and monolithic. While questing for full-fledged API gateway to Oracle Database. I was obliged to implement a small cache module. SQLite was the answer without second thought. Previously, I have worked with [SQLite Client for Node.js Apps](https://github.com/kriasoft/node-sqlite#readme) and [better-sqlite3](https://github.com/WiseLibs/better-sqlite3). Both of them serve my purpose, both of them have their pros and cons. Of the two packages, I chose later for simplicity and performance. 


### I. Project setup

1. Clone this [repository](https://github.com/Albert0i/sqlite-server.git), and run `npm install`;

2. Create a .env file
.env
```
SERVER_PORT=8989

PASSPHRASE=VEUdEii4n7nCvofaBRJEC

DELAY404=10000
```

3. Run `npm run dev` to start the gateway. 


### II. SRunner Restful
1. Get all 
```
GET http://localhost:8989/api/v1/sr/people
Content-Type: application/json
```

2. Get all with options
```
GET http://localhost:8989/api/v1/sr/people?_filter=person_id>3&_sort=first_name&_order=asc&_offset=5&_limit=5&_lowerKeys=true
Content-Type: application/json
```
where 
- _filter     - condition 
- _sort       - sort by field
- _order      - asc or desc 
- _offset     - skip n rows  
- _limit      - take n rows 
- _lowerkeys  - lowercase object keys, default 'false'
- _norun      - do not run, default 'false'

Previous GET statement returns: 
```json
{
  "cmdText": "SELECT * FROM people WHERE person_id>3 ORDER BY first_name ASC LIMIT 5 OFFSET 5 "
}
```

3. Get one
```
GET http://localhost:8989/api/v1/sr/people/25?_keyname=person_id&_lowerKeys=true
Content-Type: application/json
```
where
- _keyname    - keyname, default 'id'
- _keytype    - keytype, default 'number' 
- _lowerkeys  - lowercase object keys, default 'false'


4. Create one
```
POST http://localhost:8989/api/v1/sr/people
Content-Type: application/json

{ 
    "first_name" : "First5",
    "last_name" : "Last5"
}
```

5. Update one
```
PATCH http://localhost:8989/api/v1/sr/people/33?_keyname=person_id
Content-Type: application/json

{ 
    "first_name" : "IAN",
    "last_name" : "MURDOK"
}
```
where
- _keyname    - keyname, default 'id'
- _keytype    - keytype, default 'number' 

6. Delete one 
```
DELETE http://localhost:8989/api/v1/sr/people/33?_keyname=person_id
Content-Type: application/json
```
where
- _keyname    - keyname, default 'id'
- _keytype    - keytype, default 'number' 


### III. SRunner Direct 
1. runSelectSQL
```
POST http://localhost:8989/api/v1/sr/runselectsql
Content-Type: application/json

{
  "cmdText": "select * from people",
  "lowerKeys": true
}
```

2. runValueSQL
```
POST http://localhost:8989/api/v1/sr/runvaluesql
Content-Type: application/json

{
  "cmdText": "select * from people where first_name = 'Ian'",
  "lowerKeys": true
}
```

3. runSQL
```
POST http://localhost:8989/api/v1/sr/runsql
Content-Type: application/json

{
  "cmdTexts": [
      "INSERT INTO people (first_name,last_name) VALUES('First1','Last1')",
      "INSERT INTO people (first_name,last_name) VALUES('First2','Last2')",
      "INSERT INTO people (first_name,last_name) VALUES('First3','Last3')"
      ]
}
```

4. runInsertSQLYieldRowID
```
POST http://localhost:8989/api/v1/sr/runinsertsqlyieldrowid
Content-Type: application/json

{
  "cmdText": "INSERT INTO people (first_name,last_name) VALUES('First4','Last4')",
  "id": "person_id"
}
```


### IV. Summary 


### V. Reference
1. [SQLite](https://www.sqlite.org/index.html)
2. [better-sqlite3](https://www.npmjs.com/package/better-sqlite3)
3. [SQLite AUTOINCREMENT](https://www.sqlitetutorial.net/sqlite-autoincrement/?fbclid=IwAR1AB4yZ3aD88jcKjsq0svhpjFXBX3EAw4huYZFDhGVxqhTU-XelPKlx0-M)
4. [Diddling Considered as one of the Exact Sciences](https://poemuseum.org/diddling-considered-as-one-of-the-exact-sciences/)


### Epilogue 
```

```


### EOF (2023/05/01)
