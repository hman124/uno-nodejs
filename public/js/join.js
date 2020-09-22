var socket = io();

if (window.localStorage.getItem("uno")) {
  window.location.replace("/game/wait");
}

$("#joinBtn").click(() => {
  socket.emit("addUser", $("#usrName").val(), socket.id);
});

socket.on("confirmUser", (status, name) => {
      if (status) {
        window.localStorage.setItem("uno", `{"name": "${name}"}`);
        window.location.replace("/game/wait");
      } else {
        alert("Username is Invalid");
      }});
