showBoard();

//"You are the ～."を表示しない
var playercolorset=document.getElementById("playercolor");
playercolorset.innerHTML="";

turnDisplay(firstAttack);
ratioDisplay();

//"Inner process"を表示しない
var titledisplayset=document.getElementById("title");
titledisplayset.innerHTML="";

listDisplay();
