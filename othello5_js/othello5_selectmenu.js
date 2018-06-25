//マウスホバー時の画像変更を一括して行う
function dmousechange(num){
	switch(num){
		case 1:
			document.getElementById("d1").src="othello5_img/upperleftquestion.png";
			break;
		case 2:
			document.getElementById("d2").src="othello5_img/upperrightquestion.png";
			break;
		//一人プレイが選ばれた時の左下
		case 31:
			document.getElementById("d3").src="othello5_img/lowerleftquestion1.png";
			break;
		//二人プレイが選ばれた時の左下
		case 32:
			document.getElementById("d3").src="othello5_img/lowerleftquestion2.png";
			break;
		//一人プレイが選ばれた時の右下
		case 41:
			document.getElementById("d4").src="othello5_img/lowerrightquestion1.png";
			break;
		//二人プレイが選ばれた時の右下
		case 42:
			document.getElementById("d4").src="othello5_img/lowerrightquestion2.png";
			break;
		case -1:
			document.getElementById("d1").src="othello5_img/whitepannel.png";
			break;
		case -2:
			document.getElementById("d2").src="othello5_img/blackpannel.png";
			break;
		case -3:
			document.getElementById("d3").src="othello5_img/blackpannel.png";
			break;
		case -4:
			document.getElementById("d4").src="othello5_img/whitepannel.png";
			break;
	}
}
		
//プレイヤー人数が選択された時の処理を行う
function playersselected(players){
	//HTML間で変数を渡す
	window.localStorage.setItem("players",players);
			
	var d1=document.getElementById("d1");
	var d2=document.getElementById("d2");
	var d3=document.getElementById("d3");
	var d4=document.getElementById("d4");
			
	if(players==1){
		//クリックされた画像の切り替えと，上段のイベントの削除
		d1.src="othello5_img/oneplay.png";
		d1.style.cursor="default";
		d1.onclick=null;
		d1.onmouseover=null;
		d1.onmouseout=null;
		d2.style.cursor="default";
		d2.onclick=null;
		d2.onmouseover=null;
		d2.onmouseout=null;
		//下段のイベントの設定
		d3.style.cursor="pointer";
		d3.setAttribute("onclick","onegamestart(1)");
		d3.setAttribute("onmouseover","dmousechange(31)");
		d3.setAttribute("onmouseout","dmousechange(-3)");
		d4.style.cursor="pointer";
		d4.setAttribute("onclick","onegamestart(-1)");
		d4.setAttribute("onmouseover","dmousechange(41)");
		d4.setAttribute("onmouseout","dmousechange(-4)");
	}else{
		//クリックされた画像の切り替えと，上段のイベントの削除
		d2.src="othello5_img/twoplay.png";
		d1.style.cursor="default";
		d1.onclick=null;
		d1.onmouseover=null;
		d1.onmouseout=null;
		d2.style.cursor="default";
		d2.onclick=null;
		d2.onmouseover=null;
		d2.onmouseout=null;
		//下段のイベントの設定
		d3.style.cursor="pointer";
		d3.setAttribute("onclick","twogamestart(1)");
		d3.setAttribute("onmouseover","dmousechange(32)");
		d3.setAttribute("onmouseout","dmousechange(-3)");
		d4.style.cursor="pointer";
		d4.setAttribute("onclick","twogamestart(-1)");
		d4.setAttribute("onmouseover","dmousechange(42)");
		d4.setAttribute("onmouseout","dmousechange(-4)");
	}
}

function onegamestart(selectedcolor){
	//HTML間で変数を渡す
	window.localStorage.setItem("color",selectedcolor);
			
	//プレイヤーの使う色が選択された時の処理を行う
	if(selectedcolor==1){
		//クリックされた画像の切り替えと，上段のイベントの削除
		d3.src="othello5_img/blackplay.png";
		d3.style.cursor="default";
		d3.onclick=null;
		d3.onmouseover=null;
		d3.onmouseout=null;
		d4.style.cursor="default";
		d4.onclick=null;
		d4.onmouseover=null;
		d4.onmouseout=null;
	}else{
		//クリックされた画像の切り替えと，上段のイベントの削除
		d4.src="othello5_img/whiteplay.png";
		d3.style.cursor="default";
		d3.onclick=null;
		d3.onmouseover=null;
		d3.onmouseout=null;
		d4.style.cursor="default";
		d4.onclick=null;
		d4.onmouseover=null;
		d4.onmouseout=null;
	}
			
	//以下の点滅とタイムアウト，改良の余地多々あり

	$(function(){
		//firefoxでの見た目が悪かったため，<font size="+1">を追加
		document.getElementById("random").innerHTML="<font size='+1'><b>Now deciding which color attack first…</b></font>";
		var i=0;
		var timerId=setInterval(function(){
						$("#random").fadeOut("slow",function(){$(this).fadeIn("slow")});
						i++;
						if(i==10){
							clearInterval(timerId);
						}
					},200);
	});
			
	setTimeout(function(){
		var randnum=Math.floor(Math.random()*2);
		if(randnum==0){
			document.getElementById("random").innerHTML="<font size='+1'><b>The black attack first.</b></font>";
			window.localStorage.setItem("first",1);
			$(function() {
				$("#kokodesu").after("<button style='cursor:pointer;' onclick='movetoboard()'>Game Start</button>");
			});
		}else{
			document.getElementById("random").innerHTML="<font size='+1'><b>The white attack first.</b></font>";
			window.localStorage.setItem("first",-1);
			$(function() {
				$("#kokodesu").after("<button style='cursor:pointer;' onclick='movetoboard()'>Game Start</button>");
			});
		}
	},3200);
}
		
function twogamestart(firstattack){
	//HTML間で変数を渡す
	//二人プレイの場合playercolor変数は必要ないので1を渡して良い
	window.localStorage.setItem("first",firstattack);
	window.localStorage.setItem("color",1);
			
	//先攻が選択された時の処理を行う
	if(firstattack==1){
		//クリックされた画像の切り替えと，上段のイベントの削除
		d3.src="othello5_img/blackplay.png";
		d3.style.cursor="default";
		d3.onclick=null;
		d3.onmouseover=null;
		d3.onmouseout=null;
		d4.style.cursor="default";
		d4.onclick=null;
		d4.onmouseover=null;
		d4.onmouseout=null;
	}else{
		//クリックされた画像の切り替えと，上段のイベントの削除
		d4.src="othello5_img/whiteplay.png";
		d3.style.cursor="default";
		d3.onclick=null;
		d3.onmouseover=null;
		d3.onmouseout=null;
		d4.style.cursor="default";
		d4.onclick=null;
		d4.onmouseover=null;
		d4.onmouseout=null;
	}
			
	//ゲームスタートボタンの設置
	//var button=document.createElement("button");
	//button.setAttribute("onclick","movetoboard()");
	//button.innerHTML="Game Start";
	//document.getElementById("cent").appendChild(button);
	$(function() {
		$("#kokodesu").after("<button style='cursor:pointer;' onclick='movetoboard()'>Game Start</button>");
	});
}
		
//ゲーム画面を記述したメインのhtmlに移動する
function movetoboard(){
	location.href="othello5.html";
}
