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
app.use('/static', express.static('public'));
app.use(bodypars.json());
app.use(bodypars.urlencoded({ extended: true }));

var file_upload = __dirname + "/public/API/api.html";

//                      GESTIONE DATI
// ------------------------------------------------------------------------------------
// MOSTRA
app.get('/API/mostra/:table', (req, res, next) => {
  if (req.body != undefined) {
    var modifica = false;
    var erro = false;
    var id = undefined;
    if (req.query.hasOwnProperty('m')) {
      modifica = true;
      id = req.query['uid'];
    }
    if (req.query.hasOwnProperty('e')) {
      erro = true;
      id = req.query['e'];
    }
    var q = `SELECT * FROM ${req.params.table}`;

    if (req.params.table == 'cliente' || req.params.table == 'gestore') {
      q = q + ` JOIN utente ON utente.UID = ${req.params.table}.UID`;
    }
    q = q + " WHERE ";
    var t = 6;

    for (var getNome in req.query) {
      if (req.query.hasOwnProperty(getNome) && getNome != 'e' && getNome != 'm' && req.query[getNome] != "") {
        q = q + `${req.params.table}.${getNome}='${req.query[getNome]}' AND `;
        t = 4;
      }
    }
    q = q.substring(0, q.length - t);
    db.query(q, (err, risultati) => {
      if (err) throw err;
      if (req.params.table == "utente") {
        var filtri = '<form action="/API/mostra/utente?" method="get">';
        filtri = filtri + '<label for="UID">UID</label><br>';
        filtri = filtri + '<input type="number" id="UID" min="0" name="UID"><br><br>';
        filtri = filtri + '<label for="nome">Nome</label><br>';
        filtri = filtri + '<input type="text" id="nome" name="nome"><br><br>';
        filtri = filtri + '<label for="email">E-mail</label><br>';
        filtri = filtri + '<input type="email" id="email" name="email"><br><br>';
        filtri = filtri + '<input type="submit" value="Applica">';
        filtri = filtri + "</form>";

        var out = "<table>"
        out = out + "<tr><th>UID</th><th>Nome</th><th>E-mail</th><th></th></tr>";
        risultati.forEach( (row) => {
          if (modifica) out = out + `<tr><td>${row.UID}</td><td><input type="text" id="m_nome" class='m_' name="nome" value="${row.nome}"></td><td><input type="email" id="m_email" class='m_' name="email" value="${row.email}"></td><td><a id='m_a' onclick='return aggiungi();'><button>Salva</button></a></td></tr>`;
          else if (erro && row.UID == id) { out = out + `<tr style="background-color: ff3333;"><td>${row.UID}</td><td>${row.nome}</td><td>${row.email}</td><td><a href="/API/mostra/utente?UID=${row.UID}&m=1"><button id='tabella'><img src='/static/img/modifica.png'></button></a><a href="/API/elimina/utente?UID=${row.UID}"><button id='tabella'><img src='/static/img/cestino.jpg'></button></a></td></tr>`; out = out + `<tr style='background-color: ff9999; '><td colspan=4>Impossibile eliminare questo elemento. E' necessario prima eliminarlo dalla collezione cliente o gestore.</td></tr>` }
          else out = out + `<tr><td>${row.UID}</td><td>${row.nome}</td><td>${row.email}</td><td><a href="/API/mostra/utente?UID=${row.UID}&m=1"><button id='tabella'><img src='/static/img/modifica.png'></button></a><a href="/API/elimina/utente?UID=${row.UID}"><button id='tabella'><img src='/static/img/cestino.jpg'></button></a></td></tr>`;
        });

        out = out + "</table>";
        var aggiungi = '<form action="/API/aggiungi/utente" method="post" id="f_aggiungi"  style="display:none">';
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
        var filtri = "<form method='get' action='/API/mostra/cliente'>";
        filtri = filtri + "<label for='UID'>UID</label><br>";
        filtri = filtri + "<input type='number' min='0' nome='UID'><br><br>";
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
        out = out + "<tr><th>UID</th><th>Nome</th><th>Cognome</th><th>E-mail</th><th>Data di nascita</th><th>Residenza</th><th></th></tr>";
        risultati.forEach( (row) => {
          if (modifica) out = out + `<tr><td>${row.UID}</td><td>${row.nome}<td><input type="text" id="m_cognome" class='m_' name="cognome" value="${row.cognome}"></td><td>${row.email}<td><input type="date" id="m_data" class='m_' name="data_nascita" value="${row.data_nascita}"></td><td><input type="text" id="m_residenza" class="m_" name="residenza" value="${row.residenza}"></td><td><a id='m_a' onclick='return aggiungi();'><button>Salva</button></a></td></tr>`;
          else out = out + `<tr><td>${row.UID}</td><td>${row.nome}</td><td>${row.cognome}</td><td>${row.email}</td><td>${row.data_nascita.getDate()}/${row.data_nascita.getMonth()+1}/${row.data_nascita.getFullYear()}</td><td>${row.residenza}</td><td><a href="/API/mostra/cliente?UID=${row.UID}&m=1"><button id='tabella'><img src='/static/img/modifica.png'></button></a><a href="/API/elimina/cliente?UID=${row.UID}"><button id='tabella'><img src='/static/img/cestino.jpg'></button></a></td></tr>`;
        });

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
        var filtri = "<form method='get' action='/API/mostra/gestore'>";
        filtri = filtri + "<label for='UID'>UID</label><br>";
        filtri = filtri + "<input type='number' min='0' nome='UID'><br><br>";
        filtri = filtri + "<label for='nome'>Nome</label><br>";
        filtri = filtri + "<input type='text' nome='nome'><br><br>";
        filtri = filtri + "<label for='email'>E-mail</label><br>";
        filtri = filtri + "<input type='email' nome='email'><br><br>";
        filtri = filtri + "<label for='dati_bancari'>Dati bancari</label><br>";
        filtri = filtri + "<input type='dati_bancari' nome='dati_bancari'><br><br>";
        filtri = filtri + "<input type='submit' value='Applica'>";
        filtri = filtri + "</form>";

        var out = "<table>"
        out = out + "<tr><th>UID</th><th>Nome</th><th>E-mail</th><th>Dati bancari</th><th></th></tr>";
        risultati.forEach( (row) => {
          if (modifica) out = out + `<tr><td>${row.UID}</td><td>${row.nome}</td><td>${row.email}</td><td><input type="text" id="m_dati" class="m_" name="dati_bancari" value="${row.dati_bancari}"></td><td><a id="m_a" onclick="return aggiungi();"><button>Salva</button></a></tr>`;
          else out = out + `<tr><td>${row.UID}</td><td>${row.nome}</td><td>${row.email}</td><td>${row.dati_bancari}</td><td><a href="/API/mostra/gestore?UID=${row.UID}&m=1"><button id='tabella'><img src='/static/img/modifica.png'></button></a><a href="/API/elimina/gestore?id=${row.UID}"><button id='tabella'><img src='/static/img/cestino.jpg'>'</button></a></td></tr>`;
        });
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
        var filtri = "<form method='get' action='/API/mostra/evento'>";
        filtri = filtri + "<label for='EID'>EID</label><br>";
        filtri = filtri + "<input type='number' min='0' nome='EID'><br>";
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
        filtri = filtri + "<input type='text' nome='prezzo'><br><br>";
        filtri = filtri + "<input type='submit' value='Applica'>";
        filtri = filtri + "</form>";

        var out = "<table>"
        out = out + "<tr><th>EID</th><th>UID</th><th>Nome</th><th>Data inizio</th><th>Data fine</th><th>Luogo</th><th>Artisti</th><th>Genere</th><th>Prezzo</th><th></th></tr>";
        risultati.forEach( (row) => {
          if (modifica) {
            var data_i = row.data_inizio.getFullYear() + "-"; if(row.data_inizio.getMonth()<10) data_i += "0"; data_i += row.data_inizio.getMonth() + "-"; if(row.data_inizio.getDate()<10) data_i += "0"; data_i += row.data_inizio.getDate()  + "T"; if(row.data_inizio.getHours()<10) data_i += "0"; data_i += row.data_inizio.getHours() + ":"; if (row.data_inizio.getMinutes()<10) data_i += "0"; data_i += row.data_inizio.getMinutes();
            var data_f = row.data_fine.getFullYear() + "-"; if(row.data_fine.getMonth()<10) data_f += "0"; data_f += row.data_fine.getMonth() + "-"; if(row.data_fine.getDate()<10) data_f += "0"; data_f += row.data_fine.getDate()  + "T"; if(row.data_fine.getHours()<10) data_f += "0"; data_f += row.data_fine.getHours() + ":"; if (row.data_fine.getMinutes()<10) data_f += "0"; data_f += row.data_fine.getMinutes();
            out = out + `<tr><td>${row.EID}</td><td><input type="number" min='1' id="m_UID" class="m_" name="UID" value="${row.UID}"></td><td><input type="text" id="m_nome" class="m_" value="${row.nome}"></td><td><input type="datetime-local" id="m_data_inizio" class="m_" name="data_inizio" value="${data_i}"></td><td><input type="datetime-local" id="m_data_fine" class="m_" name="data_fine" value="${data_f}"></td><td><input type="text" id="m_luogo" class="m_" name="luogo" value="${row.luogo}"></td><td><input type="text" id="m_artisti" class="m_" name="artisti" value="${row.artisti}"></td><td><input type="text" id="m_genere" class="m_" name="genere" value="${row.genere}"></td><td><input type="number" id="m_prezzo" class="m_" name="prezzo" value="${row.prezzo}"></td><td><a id="m_a" onclick="return aggiungi();">Salva</a></td></tr>`;
          } else {
            var data_i = row.data_inizio.getDate() + "/" + row.data_inizio.getMonth() + "/" + row.data_inizio.getFullYear() + " " + row.data_inizio.getHours() + ":"  + row.data_inizio.getMinutes();
            var data_f = row.data_fine.getDate() + "/" + row.data_fine.getMonth() + "/" + row.data_fine.getFullYear()  + " " + row.data_fine.getHours() + ":"  + row.data_fine.getMinutes();
            out = out + `<tr><td>${row.EID}</td><td><a href='/API/mostra/gestore?UID=${row.UID}'>${row.UID}</a></td><td>${row.nome}</td><td>${data_i}</td><td>${data_f}</td><td>${row.luogo}</td><td>${row.artisti}</td><td>${row.genere}</td><td>${row.prezzo}</td><td><a href="/API/mostra/evento?EID=${row.EID}&m=1"><button id='tabella'><img src='/static/img/modifica.png'></button></a><a href="/API/elimina/evento?EID=${row.EID}"><button id='tabella'><img src='/static/img/cestino.jpg'></button></a></td></tr>`;
          }
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
})
// AGGIUNGI
app.post('/API/aggiungi/:table', (req, res) => {
  var q = `INSERT INTO ${req.params.table} (/col/) VALUES (/val/);`;
  var t = 0;
  var col = '';
  var val = '';
  for (var nome in req.body) { col += `${nome}, `; val += `'${req.body[nome]}', `; t = 2; }
  if (t!=0) { val = val.substring(0, val.length-t); col = col.substring(0, col.length-t); }
  db.query(q.replace('/col/', col).replace('/val/', val), (err, resu) => { if (err) throw err; });
  res.redirect('/API/mostra/' + req.params.table);
});
// MODIFICA
app.get('/API/modifica/:table', (req, res, next) => {
  var q = `UPDATE ${req.params.table} SET `;
  var t = 0;
  if (req.params.table == "evento") {
    for (var nome in req.query) if (nome != 'EID') { q = q + `${nome} = "${req.query[nome]}" , `; t = 2 }
    if (t != 0) { q = q.substring(0, q.length-t); }
    q = q + `WHERE EID = ${req.query['EID']}`;
  } else {
    for (var nome in req.query) if (nome != 'UID') { q = q + `${nome} = "${req.query[nome]}" , `; t = 2 }
    if (t != 0) { q = q.substring(0, q.length-t); }
    q = q + `WHERE UID = ${req.query['UID']}`;
  }
  db.query(q, (err, res) => {if (err) throw err;});
  res.redirect(`/API/mostra/${req.params.table}`);
});
// ELIMINA
app.get('/API/elimina/:table', (req, res, next) => {
  var q = `DELETE FROM ${req.params.table} WHERE `;
  if (req.params.table == 'evento') {
    q = q + 'EID = ' + req.query['EID'];
  } else {
    q = q + 'UID = ' + req.query['UID'];
  }
  db.query(q, (err, result) => {
    if (err) res.redirect(`/API/mostra/${req.params.table}?e=${req.query['UID']}`);
    else res.redirect(`/API/mostra/${req.params.table}`);
  });
});


//                      JSON
// ------------------------------------------------------------------------------------
// SELECT
app.get('/API/json/select/:table', (req, res, next) => {
  var q = 'SELECT /colonne/ FROM /tabella/ /condizione/'.replace('/tabella/', req.params.table);
  if (req.query.hasOwnProperty('colonne') && req.query.colonne != '') q = q.replace('/colonne/', req.query.colonne);
  else q = q.replace('/colonne/', '*');
  
  if (req.query.hasOwnProperty('where') && req.query.where != '') q = q.replace('/condizione/', 'WHERE ' + req.query.where);
  else q = q.replace('/condizione/', '');
  
  q += ';';
  
  db.query(q, (err, rows, fields) => {
    if (err) res.send(err);
    else res.send(rows);
  });
});
// JOIN
app.get('/API/json/join/:table/:table2', (req, res, next) => {
  var q = 'SELECT /colonne/ FROM /tabella/ JOIN /tabella2/ ON /on/ /condizione/'.replace('/tabella/', req.params.table).replace('/tabella2/', req.params.table2);
  if (req.params.table == 'evento')  q = q.replace('/on/', req.params.table2 + '.UID = ' + req.params.table + '.EID' )
  else if (req.params.table2 == 'evento') q = q.replace('/on/', req.params.table + '.UID = ' + req.params.table2 + '.EID' )
  else  q = q.replace('/on/', req.params.table + '.UID = ' + req.params.table2 + '.UID' )
  
  if (req.query.hasOwnProperty('colonne') && req.query.colonne != '') q = q.replace('/colonne/', req.query.colonne);
  else q = q.replace('/colonne/', '*');
  
  if (req.query.hasOwnProperty('where') && req.query.where != '') q = q.replace('/condizione/', 'WHERE ' + req.query.where);
  else q = q.replace('/condizione/', '');
  
  q += ';';
  
  db.query(q, (err, rows, fields) => {
    if (err) res.send(err);
    else res.send(rows);
  });
});
// AGGIUNGI
app.get('/API/json/aggiungi/:table', (req, res, next) => {
  var q = 'INSERT INTO /tabella/ (/colonne/) VALUES ("/valori/)'.replace('/tabella/', req.params.table);
  
  var colonne = '';
  var valori = '';
  var t_c = 0;
  var t_v = 1;
  for (var nome in req.query) { colonne = colonne + nome + ', '; valori = valori + req.query[nome] + '" , "'; t_c = 2; t_v = 4; }
  if (t_c != 0) { q = q.replace('/colonne/', colonne.substring(0, colonne.length-t_c)); }
  if (t_c != 1) { q = q.replace('/valori/', valori.substring(0, valori.length-t_v)); }
  
  q += ';';
  
  db.query(q, (err, rows, fields) => {
    if (err) res.send(err);
    else res.send(rows);
  });
});
// UPDATE
app.get('/API/json/update/:table', (req, res, next) => {
  var q = 'UPDATE /tabella/ SET /set/ WHERE /where/'.replace('/tabella/', req.params.table);
  
  var t = 0;
  var set = '';
  if (req.params.table == "evento") {
    for (var nome in req.query) if (nome != 'EID') { set = set + `${nome} = "${req.query[nome]}" , `; t = 2 }
    if (t != 0) { q = q.replace('/set/', set.substring(0, q.length-t)); }
    q = q.replace('/where/', `EID = ${req.query['EID']}`);
  } else {
    for (var nome in req.query) if (nome != 'UID') { set = set + `${nome} = "${req.query[nome]}" , `; t = 2 }
    if (t != 0) { q = q.replace('/set/', set.substring(0, set.length-t)); }
    q = q.replace('/where/', `UID = ${req.query['UID']}`);
  }
  
  q += ';';
  
  db.query(q.replace(new RegExp('\"', 'g'), '"'), (err, rows, fields) => {
    if (err) res.send(err);
    else res.send(rows);
  });
});
// DELETE
app.get('/API/json/delete/:table', (req, res, next) => {
  var q = 'DELETE FROM /tabella/ WHERE /where/'.replace('/tabella/', req.params.table);
  
  if (req.params.table == "evento") q = q.replace('/where/', `EID = ${req.query['EID']}`);
  else q = q.replace('/where/', `UID = ${req.query['UID']}`);
  
  q += ';';
  
  db.query(q.replace(new RegExp('\"', 'g'), '"'), (err, rows, fields) => {
    if (err) res.send(err);
    else res.send(rows);
  });
});

app.listen(3001, () => { console.log('server start on port 3001'); });
