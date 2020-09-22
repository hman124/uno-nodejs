$(".side-nav-open").click(() => {
  $(".side-nav").css("width", "200px");
});
$(".side-nav-close").click(() => {
  $(".side-nav").css("width", "0px");
});

$(".side-nav").append("<div class='space'><a href='/about'>About</a></div>");  
if(window.location.pathname == "/game/wait"){
$(".side-nav").append("<div class='space'><a href='/game/leave'>Leave Game</a></div>");
}
