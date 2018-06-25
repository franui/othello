//クラスの関数呼び出すとき絶対()忘れるな！！！！！！！！！！！！

var main=new Main(firstAttack,colorSelect);
var list=main.reserch();
//var backup=[main.board];と置くとその時のmain.boardの値でなくグロバール変数としてのmain.boardそのものが入ってしまう
//別にaddbackup関数を作って対応した
var backup=new Array();


//クリックされた画像のIDを受け取ってその場所を示す配列を返す関数
function idtoNumberArray(id){
	var rowStr=new String(id).charAt(5);
	var columnStr=new String(id).charAt(6);
	var rowNum=Number(rowStr);
	var columnNum=Number(columnStr);
	var array=[rowNum,columnNum];
	return array;
}
		
//クリックされた時の処理の中心となる関数
function process(clickedBlock){

	var clicked=idtoNumberArray(clickedBlock.id);
	var row=clicked[0];var column=clicked[1];
	//check関数でクリックされた場所が置ける位置かどうかを調べる．置けるなら反転についての情報が入る
	var reverseinfo=main.check(row,column,list);
	
	if(reverseinfo.length>0){
	
		addbackup();
		main.put(row,column);
		main.reverse(row,column,reverseinfo);
		//画面の更新
		removeBoard();showBoard();
		main.count();ratioDisplay();
		
		//終了するかどうかの分岐
		if(main.blackCount+main.whiteCount<64){
			//listの更新はturnchangeの後でなくてはならない
			main.turnchange();turnDisplay();
			list=main.reserch();listDisplay();
			//次の人が置ける位置あるかどうかをチェックする
			passCheck();
		}else{
			//終了でもターンを変更しないとundoと噛み合わなくなる
			main.turnchange();
			finishedDisplay();
			alert("The End");
		}
	}
	
}

function passCheck(){
	if(list.length==0){
		if(main.playercolor==1){
			alert("The black can't put, and so pass.");
		}else{
			alert("The white can't put, and so pass.");
		}
		//パスが絡む時も問題なくundoできるようにbackupに"pass"を挟む
		backup.push("pass");
		main.turnchange();turnDisplay(main.turn);
		list=main.reserch();listDisplay();
		//次もパスになった場合終了だからcheckmate関数に調べさせる
		checkmate();
	}
}

//普通の終了ではなく詰みの時に呼ばれる関数
function checkmate(){
	if(list.length==0){
		finishedDisplay();
		if(main.turn==1){
			alert("The black's checkmate. The black win.");
		}else{
			alert("The white's checkmate. The white win.");
		}
	}
}





//main.boardをGUIとして出力するための関数
function showBoard(){
	var div=document.getElementById("mainplace");
	for(var i=1; i<9; i++){
		for(var j=1; j<9; j++){
			if(main.board[i][j]==0){
				var img=document.createElement('img');
				img.setAttribute("src","othello5_img/blank.png");
				img.setAttribute("id","blank"+i+j);
				img.style.cursor="pointer";
				img.setAttribute("onclick","process(this)");
				img.setAttribute("onmouseover","payattention(this)");
				img.setAttribute("onmouseout","outattention(this)");
				div.appendChild(img);
			}else if(main.board[i][j]==1){
				var img=document.createElement('img');
				img.setAttribute("src","othello5_img/black.png");
				img.setAttribute("id","black"+i+j);
				div.appendChild(img);
			}else if(main.board[i][j]==-1){
				var img=document.createElement('img');
				img.setAttribute("src","othello5_img/white.png");
				img.setAttribute("id","white"+i+j);
				div.appendChild(img);
			}
		}
		var br=document.createElement('br');
		div.appendChild(br);
	}
}
		
function removeBoard(){
	var div=document.getElementById("mainplace");
	while (div.firstChild) {
		div.removeChild(div.firstChild);
	}
}

function payattention(attentionblank){
	attentionblank.src="othello5_img/attention.png";
}
function outattention(attentionblank){
	attentionblank.src="othello5_img/blank.png";
}



function reload(){
	var res=window.confirm("Do you do all over again from the beginning?");
	if(res){
		location.reload();
	}
}

function addbackup(){
	var element=new Array();
	for(var i=0; i<10; i++){
		element[i]=new Array();
		for(var j=0; j<10; j++){
			element[i][j]=main.board[i][j]
		}
	}
	backup.push(element);
}

function undo(){
	if(backup.length>0){
		if(backup[backup.length-1] != "pass"){
			main.board=backup.pop();
			removeBoard();showBoard();
			main.count();ratioDisplay();
			main.turnchange();turnDisplay();
			list=main.reserch();listDisplay();
		}else{
			//backupの最後が"pass"だった場合．"pass"を取り除き，ターンを変更しないで元に戻す
			backup.pop();
			main.board=backup.pop();
			removeBoard();showBoard();
			main.count();ratioDisplay();
			list=main.reserch();listDisplay();
		}
	}
}





function playercolorDisplay(){
	var c=document.getElementById("playercolor");
	if(main.playercolor==1){
		c.innerHTML="You are the black.";
	}else{
		c.innerHTML="You are the white.";
	}
}

function turnDisplay(){
	var t=document.getElementById("turn");
	if(main.turn==1){
		t.innerHTML="The black's turn";
	}else{
		t.innerHTML="The white's turn";
	}
}

function ratioDisplay(){
	var ratio=document.getElementById("ratio");
	ratio.innerHTML="Black:"+main.blackCount+"&nbsp;&nbsp;"+"White:"+main.whiteCount;
}

function listDisplay(){
	var l=document.getElementById("list");
	var str=""
	for(i=0;i<list.length;i++){
		str=str+"["+list[i][0]+"]"
	}
	l.innerHTML="You can put:"+str;
}

/*
終了後に必要のない表示を消す関数
ratioDisplayの更新はこの関数が使われる前に行われるのでこの関数でする必要がない
*/
function finishedDisplay(){
	var a=document.getElementById("turn");
	var b=document.getElementById("list");
	a.innerHTML="";
	b.innerHTML="";
}