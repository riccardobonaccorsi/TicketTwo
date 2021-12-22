const express = require('express');
const session = require('express-session');
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
app.use('/static', express.static('public'));
app.use(session({
    secret: `thisisasecret`,
    saveUninitialized: false,
    resave: false
}));
app.use('/static', express.static('public'));
app.use(bodypars.json());
app.use(bodypars.urlencoded({ extended: true }));

app.listen(3000, () => { console.log('server start on port 3000'); });

var file_upload = "";
function change_file(nome) {
  file_upload = __dirname + `/public/SITO/${nome}`;
}
console.log(__dirname);
// ----------------------------------------------------------------------------------
//                      PAGINA DI LOGIN

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/SITO/login.html");
});

app.post("/", (req, res) => {
    var ssn = req.session;
    change_file('login_err.html');
    var q = `SELECT UID, nome, path_image_profile AS path, is_gestore FROM utente WHERE email="${req.body.email}" AND psw = "${req.body.psw}";`;
    db.query(q, (err, result) => {
        if (err) {
            res.sendFile(file_upload);
            throw err;
        }
        result.forEach( (row) => {
            change_file('lista.html');
            ssn.ID = row.UID;
            ssn.nome = row.nome;
            ssn.path_image = row.path;
            ssn.is_gestore = row.is_gestore;
        });
        if (file_upload == __dirname + '/public/SITO/lista.html') {
            console.log('red');
            res.redirect(`/eventi`);
        } else {
            res.redirect('/login_err');
        }
    });
});

app.get("/login_err", (req, res) => {
    console.log("UTENTE NON RICONOSCUTO");
});

// ---------------------------------------

app.get('/eventi', (req, res) => {
    var ssn = req.session;
    if (ssn.is_gestore === undefined) {
        res.redirect("/");
    } else {
        if (ssn.is_gestore == 0) {
            change_file('lista.html');
            q = 'SELECT * FROM evento';
            db.query(q, (err, result) => {
                if (err) throw err;
                var fs = require('fs');
                fs.readFile(file_upload, 'utf8', (err, data)=> {
                    if (err) throw err;
                    var $ = require('cheerio').load(data);
                    var tabella = "<table>"
                    result.forEach( (row) => {
                        var data_i = "Data inizio: ";
                        var tmp = row.data_inizio.getDate();
                        if (tmp < 10) data_i += '0';
                        data_i += tmp + "/";
                        tmp = row.data_inizio.getMonth();
                         if (tmp < 10) data_i += '0';
                        data_i += tmp + "/";
                        tmp = row.data_inizio.getFullYear();
                        if (tmp < 10) data_i += '0';
                        data_i += tmp + " ";
                        tmp = row.data_inizio.getHours();
                        if (tmp < 10) data_i += '0';
                        data_i += tmp + ":";
                        tmp = row.data_inizio.getMinutes();
                        if (tmp < 10) data_i += '0';
                        data_i += tmp + "";
                        var data_f = "Data fine: ";
                        tmp = row.data_fine.getDate();
                        if (tmp < 10) data_f += '0';
                        data_f += tmp + "/";
                        tmp = row.data_fine.getMonth();
                         if (tmp < 10) data_f += '0';
                        data_f += tmp + "/";
                        tmp = row.data_fine.getFullYear();
                        if (tmp < 10) data_f += '0';
                        data_f += tmp + " ";
                        tmp = row.data_fine.getHours();
                        if (tmp < 10) data_f += '0';
                        data_f += tmp + ":";
                        tmp = row.data_fine.getMinutes();
                        if (tmp < 10) data_f += '0';
                        data_f += tmp + "";
                        tabella = tabella + `<tr><div class="evento" id="${row.EID}"><img src="/static/img/evento_anonimo.jpg"><p>${row.nome}<br>${data_i}  ${data_f}<br>Luogo: ${row.luogo}<br>Artisti: ${row.artisti}<br>Genere: ${row.genere}<br>Prezzo: ${row.prezzo}</p></div></tr>`
                    });
                    tabella = tabella + "</table>";

                    var filtri = '<form action="/eventi" method="get">';
                    filtri = filtri + '<label for="">UID</label><br>';
                    filtri = filtri + '<input type="number" id="UID" name="UID"><br><br>';
                    filtri = filtri + '<label for="nome">Nome</label><br>';
                    filtri = filtri + '<input type="text" id="nome" name="nome"><br><br>';
                    filtri = filtri + '<label for="email">E-mail</label><br>';
                    filtri = filtri + '<input type="email" id="email" name="email"><br><br>';
                    filtri = filtri + '<input type="submit" value="Applica">';
                    filtri = filtri + "</form>";

                    var prof = "<img src='/static/IMG/foto_account.jpg'>";
                    var carr = "<img src='/static/IMG/carrello.jpg'>";
                    console.log(carr);
                    res.send($.html().replace('/lista/', tabella).replace('/filtri/', filtri).replace('/profilo/', prof).replace('/carrello/', carr));
                });
            });
        } else if (ssn.is_gestore == 1) {
            q = `SELECT * FROM evento WHERE UID = ${ssn.ID}`;
            db.query(q, (err, result) => {
                if (err) throw err;
                var fs = require('fs');
                fs.readFile(file_upload, 'utf8', (err, data)=> {
                    if (err) throw err;
                    var $ = require('cheerio').load(data);
                    var out = "<table>"
                    out = out + "<tr><th>EID</th><th>UID</th><th>Nome</th><th>data inizio</th><th>data fine</th><th>luogo</th><th>artisti</th><th>genere</th><th>prezzo</th><th></th></tr>";
                    risultati.forEach( (row) => {
                        var data_i = row.d_inizio;
                        var data_f = row.d_fine;
                        out = out + `<tr><td>${row.EID}</td><td><a href='/API/ricercaGestore?UID=${row.UID}'>${row.UID}</a></td><td>${row.nome}</td><td>${data_i}</td><td>${data_f}</td><td>${row.luogo}</td><td>${row.artisti}</td><td>${row.genere}</td><td>${row.prezzo}</td><td><button>m</button><button>e</button></td></tr>`
                    });
                    out = out + "</table>";
                    var filtri = '<form action="/API/ricercaUtente" method="get">';
                        filtri = filtri + '<label for="UID">UID</label><br>';
                        filtri = filtri + '<input type="number" id="UID" name="UID"><br><br>';
                        filtri = filtri + '<label for="nome">Nome</label><br>';
                        filtri = filtri + '<input type="text" id="nome" name="nome"><br><br>';
                        filtri = filtri + '<label for="email">E-mail</label><br>';
                        filtri = filtri + '<input type="email" id="email" name="email"><br><br>';
                        filtri = filtri + '<input type="submit" value="Applica">';
                        filtri = filtri + "</form>";

                    res.send($.html().replace('<p>/lol/</p>', out));
                });
            });
        }
    }
});

// --------------------------
//             /biglietti

app.get('/biglietti', (req, res) => {
  file_change('lista.html');
  var ssn = req.session;
  if (ssn.)
});
