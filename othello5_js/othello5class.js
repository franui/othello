//0:空,1:黒,-1:白,5:壁

//クラスの変数に対してthisの指定を忘れるな！！！！！！！！！！！

/*
reportの構造は以下のようになっている
report=[
	[置ける位置を示す配列,[反転数,反転する方向を示す配列],[反転数,反転する方向を示す配列],…],
	[置ける位置を示す配列,[反転数,反転する方向を示す配列],[反転数,反転する方向を示す配列],…],
	…
]
*/

//処理の中心となるクラスのコンストラクタ定義
function Main(firstAttack,colorSelect){
	//メインボードの初期化．壁を含めて10*10の設計にする
	this.board=new Array();
	for(i=0;i<10;i++){
		this.board[i]=new Array();
		for(j=0;j<10;j++){
			if(i==0||i==9||j==0||j==9){
				this.board[i][j]=5;
			}else{
				this.board[i][j]=0;
			}
		}
	}
	this.board[4][5]=1;this.board[5][4]=1;
	this.board[4][4]=-1;this.board[5][5]=-1;
	//ターンの初期化
	if(firstAttack==1){
		this.turn=1;
		this.notturn=-1;
	}else{
		this.turn=-1;
		this.notturn=1;
	}
	//色の初期化
	if(colorSelect==1){
		this.playercolor=1;
		this.computercolor=-1;
	}else{
		this.playercolor=-1;
		this.computercolor=1;
	}
	//盤面上の黒と白の数の初期化
	this.blackCount=2;
	this.whiteCount=2;
}

//インスタンスメソッドの定義
Main.prototype={
	//今設定されているターンを変更する
	turnchange: function(){
		this.turn=this.turn*(-1)
		this.notturn=this.notturn*(-1)
	},

	//置ける位置を調べて配列で返す
	reserch: function(){
		var report=new Array();
		//左上からしらみ潰しに判定する．board[i][j]で注目する一つの位置を示す
		for(i=1;i<9;i++){
			for(j=1;j<9;j++){
				//空の位置のみ調べさせないと空でない位置もreportに入れてしまう
				//reportには入るが実際にはonclickイベントが登録されないため置くことは出来ない
				//結果的にパス処理が正常に出来なくなる
				if(this.board[i][j]==0){
					//注目してる位置の周囲8マスにnotturn色があればその位置を入れていく箱
					var temporarybox=new Array();
					//注目してる位置の周囲を調べるための二重ループ
					for(a=-1; a<=1; a++){
						for(b=-1; b<=1; b++){
							//ここで1=j=0を取り除かないと既にnotturn色が置かれているマスに注目した場合不都合が起きる
							//少し下のwhileループが無限ループになってしまう
							if(a!=0||b!=0){
								var row=i+a;
								var column=j+b;
								//周囲8マスにnotturn色があればその位置をtemporaryboxに入れる．これを後で調べる
								if(this.board[row][column]==this.notturn){
									temporarybox.push([row,column]);
								}
							}
						}
					}
					//注目してる位置に置いた時のひっくり返る方向/ひっくり返る数を入れていく箱
					var reverseinfobox=[[i,j]];
					for(k=0;k<temporarybox.length;k++){
						//一つのひっくり返る方向の始点の位置の行列成分を表す変数を見やすいように置き直しておく
						var movepoint=temporarybox[k]
						var reversenumber=0;
						var difference=[movepoint[0]-i,movepoint[1]-j];
						//notturn色のある方向をnotturn色が途切れるまで調べる
						while(this.board[movepoint[0]][movepoint[1]]==this.notturn){
							movepoint=[movepoint[0]+difference[0],movepoint[1]+difference[1]];
							reversenumber++;
						}
						//途切れたところが何かを調べる
						if(this.board[movepoint[0]][movepoint[1]]==this.turn){
							//ターンの色で途切れたので反転する枚数とその方向differenceを記録する
							reverseinfobox.push([reversenumber,difference]);
						}
					}
					if(reverseinfobox.length>1){
						report.push(reverseinfobox);
					}
				}
			}
		}
		return report;
	},
	
	//ある場所が，置ける位置のリストに入っているかチェックする
	check: function(row,column,list){
		//その位置とreportのある要素が一致した場合reverseinfoにその要素を入れる
		var reverseinfo=[]
		for(i=0;i<list.length;i++){
			if(list[i][0][0]==row && list[i][0][1]==column){
				reverseinfo=list[i];
				//reverseinfoの先頭の要素は[row,column]であるがこれは要らないため削除する
				reverseinfo.shift();
				break;
			}
		}
		if(reverseinfo.length>0){
			return reverseinfo;
		}else{
			return [];
		}
	},

	//putとreverseは合わせることも出来るけど意図して分ける
	put: function(row,column){
		this.board[row][column]=this.turn;
	},
	
	reverse: function(row,column,reverseinfo){
		//reverseinfo.lengthが反転する方向の数．これをループで処理する
		for(var j=0;j<reverseinfo.length;j++){
			//ある方向で反転する枚数をreversenumberとする
			var reversenumber=reverseinfo[j][0];
			//その方向で反転する位置情報をmovepointとおいて，これを書き変えつつ用いる
			var movepoint=[row,column];
			for(k=1;k<=reversenumber;k++){
				movepoint=[movepoint[0]+reverseinfo[j][1][0],movepoint[1]+reverseinfo[j][1][1]];
				this.board[movepoint[0]][movepoint[1]]=this.turn;
			}
		}
	},
	
	count: function(){
		this.blackCount=0;
		this.whiteCount=0;
		for(i=1;i<9;i++){
			for(j=1;j<9;j++){
				if(main.board[i][j]==1){
					this.blackCount++;
				}else if(main.board[i][j]==-1){
					this.whiteCount++;
				}
			}
		}
	}
}