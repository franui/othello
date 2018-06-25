//クラスの関数呼び出すとき絶対()忘れるな！！！！！！！！！！！！
//javascriptでのグローバル変数の安易な代入は死を招く！！！！！！！！！！！


/*
残る課題
・computerthink3の調整
・評価関数の調整，多段階設定
*/






//グローバル変数群
var main=new Main(firstAttack,colorSelect);
var list=main.reserch();
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

//処理の中核
function process(clickedBlock){
	if(main.turn==main.playercolor){
		var clicked=idtoNumberArray(clickedBlock.id);
		var row=clicked[0];var column=clicked[1];
		var reverseinfo=main.check(row,column,list);
	}else{
		//コンピュータの思考方式を変えたければここを変更する
		var x=computerthink3();
		var row=x[0][0];var column=x[0][1];
		var reverseinfo=x[1];
	}
	//check関数を使って，クリックされた位置が置けるかどうかを調べたものを，判定する
	//これはプレイヤーのターンの為のifで，コンピュータのターンの場合には無条件で突破する
	if(reverseinfo.length>0){
		
		//内部処理．バックアップはプレーヤーターンの場合のみ取る
		if(main.turn==main.playercolor){addbackup();}
		main.put(row,column);
		main.reverse(row,column,reverseinfo);
		
		//終了判定前に出来る画面処理
		removeBoard();showBoard();
		main.count();ratioDisplay();
		
		//盤面上の黒と白の数で終了するかどうか分岐する
		if(main.blackCount+main.whiteCount<64){
			
			//終了判定後の内部処理・画面処理
			//listの更新はturnchangeの後でなくてはならない
			main.turnchange();turnDisplay();estimateDisplay();
			list=main.reserch();listDisplay();treeDisplay1();treeDisplay2();treeDisplay3();
			
			//次の人が置ける位置あるかどうかをチェックする
			passCheck();
		
		}else{
			//終了の処理
			finishedDisplay();
			alert("The End");
		}
	}
}

function passCheck(){
	if(list.length==0){
		if(main.turn==1){
			alert("The black can't put, and so pass.");
		}else{
			alert("The white can't put, and so pass.");
		}
		main.turnchange();turnDisplay(main.turn);
		list=main.reserch();listDisplay();treeDisplay1();treeDisplay2();treeDisplay3();
		//次もパスになった場合終了となるので，checkmate関数に調べてもらう
		checkmate();
	}else if(main.turn==main.computercolor){
		//コンピュータに打たせる
		process();
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
	}else if(main.turn==main.computercolor){
		//コンピュータに打たせる
		process();
	}
}





function computerthink1(){
	var tree=make1stTree();
	//何番目が最大値であるかを調べる．treeとlistは1対1対応しているから，このmaxnumで置くべき位置が決まる
	var maxnum=0;
	for(i=0;i<tree.length;i++){
		if(tree[maxnum]<tree[i]){
			maxnum=i;
		}
	}
	
	//reverseinfoのこの作成法については，make1stTreeにコメントを残してある
	var reverseinfo=[];
	for(j=0;j<list[maxnum].length-1;j++){
		reverseinfo.push(list[maxnum][j+1]);
	}
	
	return [list[maxnum][0],reverseinfo];
}

/*
変数の説明
minimax1:第三層の配列の各々の最大値を入れる
minimax2:第二層の配列の各々の最小値を入れる
max1:第三層の配列の各々の最大値を調べるための変数
min1:第二層の配列の各々の最小値を調べるための変数
maxnum:minimax2から最大値を選ぶ時にそれが何番目の数値かを調べるための変数
現在"finish"の処理に未対応(バグは起こらないが有利な手を打てない)
*/
function computerthink3(){
	var tree=make3rdTree();
	var minimax1=new Array();
	var minimax2=new Array();
	
	var maxnum=0;
	for(i=0;i<tree.length;i++){
	
		//minimax1の作成
		minimax1[i]=new Array();
		for(j=0;j<tree[i].length;j++){
			var max1=tree[i][j][0];	
			for(k=0;k<tree[i][j].length;k++){
				//初期値代入var max1=tree[i][j][0];で"pass"が入った場合if文が全てfalseとなってしまう為それを回避するように"pass"の時も更新する
				if(max1<tree[i][j][k] || max1=="pass"){
					max1=tree[i][j][k];
				}
			}
			minimax1[i][j]=max1;
		}
		
		//minimax2の作成
		//ループの仕方は上と全く同じだがvar min1=minimax1[i][0];のためループを分ける必要がある
		var min1=minimax1[i][0];
		for(l=0;l<tree[i].length;l++){
			//最小値を選ぶ時"pass"が選択肢にあれば"pass"を選ぶようにする
			if(min1>minimax1[i][l] || minimax1[i][l]=="pass"){
				min1=minimax1[i][l];
			}
		}
		minimax2[i]=min1;
		
		//maxnumの作成
		//初期値代入minimax2[maxnum]で"pass"が入った場合if文が全てfalseとなってしまう為それを回避するように"pass"の時も更新する
		if(minimax2[maxnum]<minimax2[i] || minimax2[maxnum]=="pass"){
			maxnum=i;
		}
	}

	var reverseinfo=[];
	for(m=0;m<list[maxnum].length-1;m++){
		reverseinfo.push(list[maxnum][m+1]);
	}
	
	//ここからconsole用の処理
	var treestr="";
	for(i=0;i<tree.length;i++){
		var str="[";
		for(j=0;j<tree[i].length;j++){
			str=str+"["+tree[i][j]+"]";
		}
		str=str+"]";
		treestr=treestr+str+"……第"+i+"群\n";
	}
	var minimax1str="";
	for(i=0;i<minimax1.length;i++){
		var str="["+minimax1[i]+"]";
		minimax1str=minimax1str+str;
	}
	var liststr=""
	for(i=0;i<list.length;i++){
		liststr=liststr+"["+list[i][0]+"]"
	}
	console.log("コンピュータ処理:\n"+treestr+"上記の三階評価関数から\n最大値表:"+minimax1str+"\n最小値表:["+minimax2+"]\n上記の2つの表を作成し"+(maxnum+1)+"番目を選びました\n置くことが出来た位置:"+liststr+"\n\n");
	
	return [list[maxnum][0],reverseinfo];
}





//盤面を点数で評価する関数．序盤中盤終盤隙が無いように分ける．主要な関数の一つ
//とりあえず評価関数は借り物を使う
function estimate(color){
	var estimateTable=[
		[45,-11,4,-1,-1,4,-11,45],
		[-11,-16,-1,-3,-3,-1,-16,-11],
		[4,-1,2,-1,-1,2,-1,4],
		[-1,-3,-1,0,0,-1,-3,-1],
		[-1,-3,-1,0,0,-1,-3,-1],
		[4,-1,2,-1,-1,2,-1,4],
		[-11,-16,-1,-3,-3,-1,-16,-11],
		[45,-11,4,-1,-1,4,-11,45]
	];
	var value=0;
	for(var i=1; i<9; i++){
		for(var j=1; j<9; j++){
			if(main.board[i][j]==color){
				value=value+estimateTable[i-1][j-1];
			}
		}
	}
	return value;
}

//一階のtreeを作成する
function make1stTree(){
	var tree=[]
	for(i=0;i<list.length;i++){
	
		var row=list[i][0][0];var column=list[i][0][1];
		//var reverseinfo=list[i];reverseinfo.shift();とするとグローバル変数そのものが代入されてしまう
		//shift()でグローバル変数としてのlistが削られてしまうからclickedprocessのcheck関数で処理がおかしくなる
		//pushを使えばこれを回避しつつreverse関数の引数に対応したreverseinfoを上手く作ることができる
		var reverseinfo=[];
		for(j=0;j<list[i].length-1;j++){reverseinfo.push(list[i][j+1]);}
		
		addbackup();
		main.put(row,column);main.reverse(row,column,reverseinfo);
		//treeに評価関数の値を入れる
		tree.push(estimate(main.turn));
		//戻る
		main.board=backup.pop();
		
	}
	return tree;
}

//二階のtreeを作成する
function make2ndTree(){
	var tree=new Array();
	//ここ文字をi使うとおかしなことになる．変数の重複…？．iがグローバル変数として使われてる可能性がある
	//全体的におかしな名前をforの変数に設定した
	for(aa=0;aa<list.length;aa++){
		tree[aa]=new Array();
		
		var row=list[aa][0][0];var column=list[aa][0][1];
		var reverseinfo=[];
		for(bb=0;bb<list[aa].length-1;bb++){reverseinfo.push(list[aa][bb+1]);}
		
		addbackup();
		main.put(row,column);main.reverse(row,column,reverseinfo);
		
		main.count();
		
		if(main.blackCount+main.whiteCount<64){
		
			main.turnchange();list=main.reserch();
			
			//passCheckをする
			if(list.length==0){
				tree[aa].push("pass");
			}else{
				for(cc=0;cc<list.length;cc++){
					row=list[cc][0][0];column=list[cc][0][1];
					reverseinfo=[];
					for(dd=0;dd<list[cc].length-1;dd++){reverseinfo.push(list[cc][dd+1]);}
					
					addbackup();
					main.put(row,column);main.reverse(row,column,reverseinfo);
					
					tree[aa].push(estimate(main.turn));
					main.board=backup.pop();
				}
			}
			main.turnchange();
			main.board=backup.pop();
			main.count();
			list=main.reserch();
		}else{
			tree[aa].push("finish");
			main.board=backup.pop();
		}
	}
	return tree;
}

//三階のtreeを作成する
//この記述ごり押し過ぎる。ループしてる部分にもっと一般性を持たせたいが…
function make3rdTree(){

	var tree=new Array();
	
	//ループ一週目
	for(aa=0;aa<list.length;aa++){
		tree[aa]=new Array();
		
		var row=list[aa][0][0];var column=list[aa][0][1];
		var reverseinfo=[];
		for(bb=0;bb<list[aa].length-1;bb++){reverseinfo.push(list[aa][bb+1]);}
		
		addbackup();
		main.put(row,column);main.reverse(row,column,reverseinfo);
		
		main.count();
		if(main.blackCount+main.whiteCount<64){
		
			main.turnchange();list=main.reserch();
			
			if(list.length==0){
				tree[aa][0]=new Array();
				
				//if(list.length==0)後のmain.board=backup.pop()と噛み合わせるため入れてみる
				addbackup();
				
				if(main.blackCount+main.whiteCount<64){
				
					main.turnchange();list=main.reserch();
				
					if(list.length==0){
						tree[aa][0].push("pass");
					}else{
						for(cc=0;cc<list.length;cc++){
							row=list[cc][0][0];column=list[cc][0][1];
							reverseinfo=[];
							for(dd=0;dd<list[cc].length-1;dd++){reverseinfo.push(list[cc][dd+1]);}
					
							addbackup();
							main.put(row,column);main.reverse(row,column,reverseinfo);
					
							tree[aa][0].push(estimate(main.turn));
							main.board=backup.pop();
						}
					}
					main.turnchange();
					main.board=backup.pop();
					main.count();
					list=main.reserch();
					
				}else{
					tree[aa][0].push("finish");
					main.board=backup.pop();
				}
				
			}else{
				
				//ループ二週目
				for(cc=0;cc<list.length;cc++){
					tree[aa][cc]=new Array();
				
					row=list[cc][0][0];column=list[cc][0][1];
					reverseinfo=[];
					for(dd=0;dd<list[cc].length-1;dd++){reverseinfo.push(list[cc][dd+1]);}
					
					addbackup();
					main.put(row,column);main.reverse(row,column,reverseinfo);
					
					main.count();
					if(main.blackCount+main.whiteCount<64){
					
						main.turnchange();list=main.reserch();
						
						if(list.length==0){
							tree[aa][cc].push("pass");
						}else{
							//ループ三週目
							for(ee=0;ee<list.length;ee++){
								row=list[ee][0][0];column=list[ee][0][1];
								reverseinfo=[];
								for(ff=0;ff<list[ee].length-1;ff++){reverseinfo.push(list[ee][ff+1]);}
					
								addbackup();
								main.put(row,column);main.reverse(row,column,reverseinfo);
					
								tree[aa][cc].push(estimate(main.turn));
								main.board=backup.pop();
							}
						}
						main.turnchange();
						main.board=backup.pop();
						main.count();
						list=main.reserch();
					}else{
						tree[aa][cc].push("finish");
						main.board=backup.pop();
					}
				}
			}
			main.turnchange();
			main.board=backup.pop();
			main.count();
			list=main.reserch();
		}else{
			tree[aa].push("finish");
			main.board=backup.pop();
		}
	}
	return tree;
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
		//終了時の全てのケースで，undo後にターンがずれないよう調整するのは困難なので，ここでやや強引ではあるが調整する
		main.turn=main.playercolor;
		main.notturn=main.computercolor;
		//turnDisplay();は，終了後にundoした場合に，ターン表示が消えたままにならない為に必要
		turnDisplay();
		main.board=backup.pop();
		removeBoard();showBoard();
		main.count();ratioDisplay();
		estimateDisplay();
		list=main.reserch();listDisplay();treeDisplay1();treeDisplay2();treeDisplay3();
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

function estimateDisplay(){
	var est=document.getElementById("estimate");
	est.innerHTML="Black:"+estimate(1)+"point&nbsp;&nbsp;"+"White:"+estimate(-1)+"point";
}

function listDisplay(){
	var l=document.getElementById("list");
	var str=""
	for(i=0;i<list.length;i++){
		str=str+"["+list[i][0]+"]"
	}
	l.innerHTML="You can put:"+str;
}

function treeDisplay1(){
	var t=document.getElementById("tree1");
	t.innerHTML="First order evaluation function:<br>["+make1stTree()+"]";
}

function treeDisplay2(){
	var t=document.getElementById("tree2");
	var str=""
	var tree=make2ndTree();
	for(c=0;c<tree.length;c++){
		str=str+"["+tree[c]+"]"
	}
	t.innerHTML="Second order evaluation function:"+"<br>"+str;
}

function treeDisplay3(){
	var tree=make3rdTree();
	var t=document.getElementById("tree3");
	t.innerHTML="Third order evaluation function:<br>"
	for(i=0;i<tree.length;i++){
		var str="";
		str=str+"[";
		for(j=0;j<tree[i].length;j++){
			str=str+"["+tree[i][j]+"]";
		}
		str=str+"]";
		t.innerHTML=t.innerHTML+str+"<br>";
	}
}

/*
終了後に必要のない表示を消す関数
ratioDisplayの更新はこの関数が使われる前に行われるのでこの関数でする必要がない
estimateDisplayの更新はこの関数が使われる前に行われないのでこの関数で纏めて行う
*/
function finishedDisplay(){
	var a=document.getElementById("turn");
	var b=document.getElementById("list");
	var c=document.getElementById("tree1");
	var d=document.getElementById("tree2");
	var e=document.getElementById("tree3");
	a.innerHTML="";
	b.innerHTML="";
	c.innerHTML="";
	d.innerHTML="";
	e.innerHTML="";
	estimateDisplay();
}