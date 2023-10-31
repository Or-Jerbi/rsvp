const express = require('express');
const mysql= require('mysql');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express()
app.use(cors())
app.use(express.json());

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password:'',
    database:'rspv'
})

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL!');
});

// app.post('/updateAllTokens', (req, res) => {
//     const sqlFetch = 'SELECT id FROM guestslist';
//     db.query(sqlFetch, (err, results) => {
//       if (err) throw err;
  
//       for (const row of results) {
//         const id = row.id;
//         const newToken = uuidv4();
  
//         const sqlUpdate = 'UPDATE guestslist SET token = ? WHERE id = ?';
//         db.query(sqlUpdate, [newToken, id], (updateErr, updateResult) => {
//           if (updateErr) throw updateErr;
//           console.log(`Token updated for row with ID ${id}`);
//         });
//       }

//       res.send('Tokens updated for all rows');
//     });
//   });

app.get('/data', (req, res) => {
    const token = req.query.token; // Retrieve token from query parameter
    const sql = 'SELECT full_name FROM guestslist WHERE token = ?';
    const values = [token];
    db.query(sql, values, (err, data) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ error: 'Error fetching data from the database' });
        }
        res.json(data);
    });
});


app.post('/insert', (req,res)=> {
    const token=req.body.token;
    console.log((token));
    if(token)
    {   
        const sql = "UPDATE guestslist SET guests_number = ?, attending = ? WHERE token = ?";
        const values = [
            req.body.guestsNumber,
            req.body.attending,
            token
        ];
        console.log(values);


    db.query(sql, values, (err, data) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.json(err);
        }
        console.log('Query result:', data);
        return res.json(data);
    });
    }
    console.log(db.state)
})

app.get('/', (re, res)=> {
    console.log(db)
    return res.json("From Backend side");
})



app.get('/guests', (re,res)=> {
    const sql = "SELECT * FROM guests";
    db.query(sql, (err, data)=> {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.listen(8081, ()=> {
    console.log("Server is running on port 8081");
})