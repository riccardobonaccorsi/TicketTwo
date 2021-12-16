const express = require('express');
const mysql = require('mysql');
const bodypars = require('body-parser');
const Connection = require('mysql/lib/Connection');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'remoto',
  password: 'Rem',
  database: 'tickettwo'
});
db.connect((err) => {
  if (err) throw err;
  console.log('connsesso');
});

const app = express();
app.use(bodypars.json());
app.use(bodypars.urlencoded({ extended: true }));

app.listen(3000, () => { console.log('server start on port 3000'); });

var file_upload = "";
function change_file(nome) {
  file_upload = __dirname + `/public/${nome}`;
}

// ----------------------------------------------------------------------------------
//                      PAGINA DI LOGIN

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/SITO/login.html");
});

app.post("/", (req, res) => {
    console.log(req.body);
    change_file('login_err.html');
    var q = `SELECT UID FROM utente WHERE email="${req.body.email}" AND psw = "${req.body.psw}";`;
    db.query(q, (err, result) => {
        console.log('In query');
        if (err) {
            res.sendFile(file_upload);
            throw err;
        }
        result.forEach( (row) => { 
            change_file('lista.html');
        });
        if (file_upload == __dirname + '/public/lista.html') {
            q = 'SELECT * FROM evento';
            db.query(q, (err, result) => {
                if (err) throw err;
                var fs = require('fs');
                fs.readFile(file_upload, 'utf8', (err, data)=> {
                    if (err) throw err;
                    var $ = require('cheerio').load(data);
                    var inserisci = "<table>";
                    result.forEach((row) => inserisci = inserisci+`<tr><th>${row.nome}</th><th>${row.p2}</th></tr>`);
                    inserisci = inserisci + '</table>';
                    res.send($.html().replace('<p>/lol/</p>', inserisci));
                });
            });
        } else {
            console.log('query vuota');

            res.sendFile(file_upload);        
        }
    });
    console.log('query fine');
});

app.get("/login_err", (req, res) => {
    console.log("UTENTE NON RICONOSCUTO");
});