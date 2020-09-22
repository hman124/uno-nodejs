const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const sqlite3 = require('sqlite3').verbose();
const fs = require("fs");

let dbFile = "./db/users.db",
  dbExists = fs.existsSync(dbFile),
  db = new sqlite3.Database(dbFile);

//Pages
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/join.html")
});

app.get("/game/wait", (req, res) => {
  res.sendFile(__dirname + "/public/html/wait.html")
});

app.get("/game/play", (req, res) => {
  res.sendFile(__dirname + "/public/html/play.html")
});

app.get("/game/leave", (req, res) => {
  res.sendFile(__dirname + "/public/html/leave.html")
});

// app.get("/game/kick/:userId", (req, res) => {
//   res.send(req.params);
// });

app.get("/join", (req, res) => {
  res.redirect(301, "/");
});

//Apis
var users;
app.get("/tools/users", (req, res) => {
  users = [];
  db.serialize(() => {
    db.all("SELECT name FROM users", (err, row) => {
      if (err) {
        throw err;
      }
      row.forEach((row) => {
        users.push(row.name);
      });
      res.send(users);
    });
  });
});

app.get("/tools/users/clearAll", (req, res) => {
  db.serialize(() => {
    db.run("DELETE FROM users WHERE 1");
    res.send("<style>*{font-family:arial;}</style>{'message':'success'}")
  });
});

//Assets
app.get("/assets/img/cards.png", (req, res) => {
  res.sendFile(__dirname + "/public/img/cards.png")
});

app.get("/assets/css/master.css", (req, res) => {
  res.sendFile(__dirname + "/public/css/master.css");
});

app.get("/assets/css/uno.css", (req, res) => {
  res.sendFile(__dirname + "/public/css/uno.css");
});

app.get("/assets/js/master.js", (req, res) => {
  res.sendFile(__dirname + "/public/js/master.js");
});

app.get("/assets/js/jquery.min.js", (req, res) => {
  res.sendFile(__dirname + "/public/js/jquery.min.js");
});

app.get("/assets/js/join.js", (req, res) => {
  res.sendFile(__dirname + "/public/js/join.js");
});

app.get("/assets/js/menu.js", (req, res) => {
  res.sendFile(__dirname + "/public/js/menu.js");
});

app.get("/assets/js/wait.js", (req, res) => {
  res.sendFile(__dirname + "/public/js/wait.js");
});

//Etc
app.get("/greeting.exe", (req, res) => {
  var d = new Date();
  if (d.getHours() > 11) {
    res.send("Good Afternoon");
  } else {
    res.send("Good Morning");
  }
});

app.get("/tools/users/isUserTaken", (req, res) => {
  res.send(db.each(`SELECT * FROM users WHERE name='hman'`));
});

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/html/404.html");
});

//Socket.io
io.on('connection', (socket) => {
  socket.on('addUser', (name, socketId) => {
    if (!/\S/.test(name)) {
      io.to(socketId).emit("confirmUser", false);
    } else {
      var cleaned = cleanStr(name);
      io.to(socketId).emit("confirmUser", true, cleaned);
      console.log("User Joined: " + name)
      db.run(`INSERT INTO users (name) VALUES ('${cleaned}')`);
      io.emit("updateUsers");
    }
  });

  socket.on('removeUser', (name) => {
    console.log('User Left: ' + name);
    db.run(`DELETE FROM users WHERE name='${name}'`);
    io.emit("updateUsers");
  });
});

function cleanStr(str) {
  return str.replace(/&/g, "&#38;")
    .replace(/"/g, "&#34;")
    .replace(/\./g, "&#46;")
    .replace(/'/g, "&#39;")
    .replace(/>/g, "&#62;")
    .replace(/</g, "&#60;")
    .replace(/\\/g, "&#92;");
}

http.listen(3000, () => {
  console.log("Listening on localhost:3000");
});
