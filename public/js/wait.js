var socket = io(),
  elem;

if (!window.localStorage.getItem("uno")) {
  window.location.replace("/");
}

function getUsers() {
  $(".boxContainer").html("");
  fetch("/tools/users")
  .then(response => response.json())
  .then(data => {
    if (data.length <= 0) {
      window.location.replace("/game/leave");
    }
    for (i in data) {
      elem = $("<div></div>");
      if (JSON.parse(window.localStorage.getItem("uno")).name == data[i]) {
        data[i] = data[i] += " (me)"
      }
      elem.html(data[i]);
      elem.attr("class", "box")
      $(".boxContainer").append(elem);
    }
  });
}

getUsers();

socket.on("updateUsers", () => {
  getUsers();
});
