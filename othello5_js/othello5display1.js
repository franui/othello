showBoard();
playercolorDisplay(colorSelect);
turnDisplay(firstAttack);
ratioDisplay();
estimateDisplay();
listDisplay();
treeDisplay1();
treeDisplay2();
treeDisplay3();

//コンピュータが先攻の時，ランダムに一手目を打たせる
if(main.turn==main.computercolor){

	//0以上3以下の整数乱数を生成する
	var randnum=Math.floor(Math.random()*4);
	var row=list[randnum][0][0];var column=list[randnum][0][1];
	var reverseinfo=[];
	for(i=0;i<list[randnum].length-1;i++){
		reverseinfo.push(list[randnum][i+1]);
	}
	
	//処理
	main.put(row,column);
	main.reverse(row,column,reverseinfo);
	removeBoard();showBoard();
	main.count();ratioDisplay();
	main.turnchange();turnDisplay();estimateDisplay();
	list=main.reserch();listDisplay();treeDisplay1();treeDisplay2();treeDisplay3();
	
}