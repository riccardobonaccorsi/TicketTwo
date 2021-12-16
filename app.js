const express = require('express');
const mysql = require('mysql');
const bodypars = require('body-parser');

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

var file_upload = __dirname + "/public/API/api.html";

// ------------------------------------------------------------------

app.get('/API/mostra/:table', (req, res, next) => {
  if (req.body != undefined) {
    if (req.hasOwnProperty('m') && req.body['m']) {
      res.send('BISOGNA MODIFICARE');
    } else {
      var q = `SELECT * FROM ${req.params.table}`;
      
      if (req.params.table == 'cliente' || req.params.table == 'gestore') {
        q = q + ` JOIN utente ON utente.UID = ${req.params.table}.UID`;
      }
      q = q + " WHERE ";
      var t = 6;

      for (var getNome in req.query) {
        if (req.query.hasOwnProperty(getNome) && req.query[getNome] != "") {
          q = q + `${getNome}='${req.query[getNome]}' AND `;
          t = 4;
        }
      }
      q = q.substring(0, q.length - t);
      
      db.query(q, (err, risultati) => {
        if (err) throw err;
        if (req.params.table == "utente") {
          var filtri = '<form action="/API/ricercaUtente" method="get">';
          filtri = filtri + '<label for="UID">UID</label><br>';
          filtri = filtri + '<input type="number" id="UID" name="UID"><br><br>';
          filtri = filtri + '<label for="nome">Nome</label><br>';
          filtri = filtri + '<input type="text" id="nome" name="nome"><br><br>';
          filtri = filtri + '<label for="email">E-mail</label><br>';
          filtri = filtri + '<input type="email" id="email" name="email"><br><br>';
          filtri = filtri + '<input type="submit" value="Applica">';
          filtri = filtri + "</form>";
    
          var out = "<table>"
          out = out + "<tr><th>UID</th><th>NOME</th><th>E-mail</th><th></th></tr>";
          risultati.forEach( (row) => out = out + `<tr><td>${row.UID}</td><td>${row.nome}</td><td>${row.email}</td><td><a href="/API/modifica/utente?id=${row.UID}"><button>m</button></a><a href="/API/elimina/utente?id=${row.UID}"><button>e</button></a></tr>`);
          out = out + "</table>";

          var aggiungi = '<form method="post" id="f_aggiungi"  style="display:none">';
          aggiungi = aggiungi + '<table>';
          aggiungi = aggiungi + '<tr><th>Nome</th><th>Email</th><th>Password</th><th></th></tr>';
          aggiungi = aggiungi + '<tr><td><input type="text" name="nome"></td><td><input type="email" name="email"></td><td><input type="password" name="psw"></td><td><input id="s_aggiungi" type="submit"></td></tr>';
          aggiungi = aggiungi + '</table></form>';

          var fs = require('fs');
          fs.readFile(file_upload, 'utf8', (err, data) => {
            if (err) throw err;
            var $ = require('cheerio').load(data);
            res.send($.html().replace(new RegExp('/titolo/', 'g'), 'Utente').replace('/filtri/', filtri).replace('/table/', out).replace('/agg/', aggiungi));
          });
        } else if (req.params.table == "cliente") {
          var filtri = "<form method='get' action='/API/ricercaCliente'>";
          filtri = filtri + "<label for='UID'>UID</label><br>";
          filtri = filtri + "<input type='number' nome='UID'><br><br>";
          filtri = filtri + "<label for='nome'>Nome</label><br>";
          filtri = filtri + "<input type='text' nome='nome'><br><br>";
          filtri = filtri + "<label for='cognome'>Cognome</label><br>";
          filtri = filtri + "<input type='text' nome='cognome'><br><br>";
          filtri = filtri + "<label for='email'>E-mail</label><br>";
          filtri = filtri + "<input type='email' nome='email'><br><br>";
          filtri = filtri + "<label for='data_nascita'>Data nascita</label><br>";
          filtri = filtri + "<input type='date' nome='data_nascita'><br><br>";
          filtri = filtri + "<label for='residenza'>Residenza</label><br>";
          filtri = filtri + "<input type='text' nome='residenza'><br><br>";
          filtri = filtri + "<input type='submit' value='Applica'>";
          filtri = filtri + "</form>";
    
          var out = "<table>"
          out = out + "<tr><th>UID</th><th>Nome</th><th>Cognome</th><th>E-mail</th><th>data di nascita</th><th>residenza</th></tr>";
          risultati.forEach( (row) => out = out + `<tr><td>${row.UID}</td><td>${row.nome}</td><td>${row.cognome}</td><td>${row.email}</td><td>${row.data_nascita}</td><td>${row.residenza}</td></td>`);
          out = out + "</table>";
    
          var aggiungi = '<form method="post" id="f_aggiungi"  style="display:none"><table>';
          aggiungi = aggiungi + '<tr><th>Uid</th><th>Cognome</th><th>Data di Nascita</th><th>Residenza</th><th></th></tr>';
          aggiungi = aggiungi + '<tr><td><input type="number" min = 0 name="uid"></td><td> <input type="text" name="cognome"></td><td> <input type="date" name="data_nascita"></td><td> <input type="text" name="residenza"></td><td> <input id="s_aggiungi" type="submit"></td></tr>';
          aggiungi = aggiungi + '</table></form>';

          var fs = require('fs');
          fs.readFile(file_upload, 'utf8', (err, data) => {
            if (err) throw err;
            var $ = require('cheerio').load(data);
            res.send($.html().replace('/titolo/', 'Cliente').replace('/filtri/', filtri).replace('/table/', out).replace('/agg/', aggiungi));
          });
        } else if (req.params.table == "gestore") {
          var filtri = "<form method='get' action='/API/ricercaGestore'>";
          filtri = filtri + "<label for='UID'>UID</label><br>";
          filtri = filtri + "<input type='number' nome='UID'><br><br>";
          filtri = filtri + "<label for='nome'>Nome</label><br>";
          filtri = filtri + "<input type='text' nome='nome'><br><br>";
          filtri = filtri + "<label for='email'>E-mail</label><br>";
          filtri = filtri + "<input type='email' nome='email'><br><br>";
          filtri = filtri + "<label for='dati_bancari'>Dati bancari</label><br>";
          filtri = filtri + "<input type='dati_bancari' nome='dati_bancari'><br><br>";
          filtri = filtri + "<input type='submit' value='Applica'>";
          filtri = filtri + "</form>";
    
          var out = "<table>"
          out = out + "<tr><th>UID</th><th>Nome</th><th>E-mail</th><th>dati bancari</th></tr>";
          risultati.forEach( (row) => out = out + `<tr><td>${row.UID}</td><td>${row.nome}</td><td>${row.email}</td><td>${row.dati_bancari}</td></td>`);
          out = out + "</table>";

          var aggiungi = '<form method="post" id="f_aggiungi" style="display:none"><table>';
			 aggiungi = aggiungi + '<tr><th>Uid</th><th>Dati bancari</th></tr>';
			 aggiungi = aggiungi + '<tr><td><input type="number" min = 0 name="uid"></td><td><input type="text" name="dati_bancaro"></td><td><input id="s_aggiungi" type="submit"></td></tr>';
			 aggiungi = aggiungi + '</table></form>';

          var fs = require('fs');
          fs.readFile(file_upload, 'utf8', (err, data) => {
            if (err) throw err;
            var $ = require('cheerio').load(data);
            res.send($.html().replace('/titolo/', 'Gestore').replace('/filtri/', filtri).replace('/table/', out).replace('/agg/', aggiungi));
          });
        } else if (req.params.table == "evento") {
          var filtri = "<form method='get' action='/API/ricercaEvento'>";
          filtri = filtri + "<label for='EID'>EID</label><br>";
          filtri = filtri + "<input type='number' min='1' nome='EID'><br>";
          filtri = filtri + "<label for='UID'>UID</label><br>";
		      filtri = filtri + "<input type='number' min='1' nome='UID'><br>";
          filtri = filtri + "<label for='nome'>Nome</label><br>";
          filtri = filtri + "<input type='text' nome='nome'><br>";
          filtri = filtri + "<label for='data_inizio'>Data inizio</label><br>";
          filtri = filtri + `<input type='date' min='${Date().getUTCDate}' nome='data_inizio'><br>`;
          filtri = filtri + "<label for='data_fine'>Data fine</label><br>";
          filtri = filtri + "<input type='date' nome='data_fine'><br>";
          filtri = filtri + "<label for='luogo'>Luogo</label><br>";
          filtri = filtri + "<input type='text' nome='luogo'><br>";
          filtri = filtri + "<label for='artisti'>Artisti</label><br>";
          filtri = filtri + "<input type='text' nome='artisti'><br>";
          filtri = filtri + "<label for='genere'>Genere</label><br>";
          filtri = filtri + "<input type='text' nome='genere'><br>";
          filtri = filtri + "<label for='prezzo'>Prezzo</label><br>";
          filtri = filtri + "<input type='text' nome='prezzo'><br>";
          filtri = filtri + "<input type='submit' value='Applica'>";
          filtri = filtri + "</form>";

          var out = "<table>"
          out = out + "<tr><th>EID</th><th>UID</th><th>Nome</th><th>data inizio</th><th>data fine</th><th>luogo</th><th>artisti</th><th>genere</th><th>prezzo</th><th></th></tr>";
          risultati.forEach( (row) => {
            var data_i = row.d_inizio;
            var data_f = row.d_fine;
            out = out + `<tr><td>${row.EID}</td><td><a href='/API/ricercaGestore?UID=${row.UID}'>${row.UID}</a></td><td>${row.nome}</td><td>${data_i}</td><td>${data_f}</td><td>${row.luogo}</td><td>${row.artisti}</td><td>${row.genere}</td><td>${row.prezzo}</td><td><button>m</button><button>e</button></td></tr>`
          });
          out = out + "</table>";
   
          var aggiungi = '<form method="post" id="f_aggiungi"  style="display:none"><table>';
          aggiungi = aggiungi + '<tr><th>Uid</th><th>Nome</th><th>Data inizio</th><th>Data fine</th><th>Ora inizio</th><th>Ora fine</th></tr>';
          aggiungi = aggiungi + '<tr><td><input type="number" min = 0 name="uid"></td><td><input type="text" name="nome"></td><td><input type="date" name="data_inizio"></td><td><input type="date" name="data_fine"></td><td><input type="time" name="ora_inizio"></td><td> <input type="time" name="ora_fine"></td></tr>';
          aggiungi = aggiungi + '<tr><th>Luogo</th><th>Artisti</th><th>Genere</th><th>Prezzo</th><th></th></tr>';
          aggiungi = aggiungi + '<tr><td><input type="text" name="luogo"></td><td><input type="text" name="artisti"></td><td><input type="text" name="genere"></td><td><input type="number" step="0.01" name="prezzo"></td><td> <input id="s_aggiungi" type="submit"></td></tr>';
          aggiungi = aggiungi + '</table></form>';

          var fs = require('fs');
          fs.readFile(file_upload, 'utf8', (err, data) => {
            if (err) throw err;
            var $ = require('cheerio').load(data);
            res.send($.html().replace('/titolo/', 'Evento').replace('/filtri/', filtri).replace('/table/', out).replace('/agg/', aggiungi));
          });
        }
      });
    }
  }
})

// -------------------------------------------------------------------------------------

app.post('/API/aggiungi/:table', (req, res) => {
  console.log(req.body);
  res.send('pagina in costruzione');
});

// -------------------------------------------------------------------------------------

app.get('/API/modifica/:table', (req, res, next) => {
  console.log(req.body);
  res.redirect(`/API/mostra/${req.params.table}?m=t&id=${req.body['id']}`);
});

// -------------------------------------------------------------------------------------

app.get('/API/elimina/:table', (req, res, next) => {
  console.log(req.body);
  var q = `DELETE FROM ${req.params.table} WHERE `;
  if (req.params.table == 'evento') {
    q = q + 'EID = ';
  } else {
    q = q + 'UID = ';
  }
  q = q + req.body['id'];
  /*db.query(q, (err, result) => {
    if (err) throw err; 
    res.redirect(`/API/mostra/${req.params.table}`);
  });*/
  console.log(req);
  console.log(q);
  res.redirect(`/API/mostra/${req.params.table}`);

});

app.listen(3001, () => { console.log('server start on port 3000'); });
