/*
scriptの動的読み込みの為の関数定義
「script/動的/読み込み」と検索して出てくるコードはほとんど、直後の読み込みを考慮していないので使えなかった
jQueryを用いたコードは何故か全てエラーとなった
http://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q1462557389を引用して全く改変していない
*/
function insertScript(arr) {
	var n = 0;
	function callback(path, undefined) {
		if (!path) return;
		var script = document.createElement('script');
		script.src = path;
		script.onload = script.onreadystatechange = function() {
			if (!script.readyState || /loaded|complete/.test(script.readyState)) {
				script.onload = script.onreadystatechange = null;
				script = undefined;
				callback(arr[n++]);
			}
		};
		document.body.appendChild(script);
	}
	callback(arr[n++]);
}

/*
プレイ人数の選択に応じて異なるscriptを動的に読み込む
processを記述したscriptではクリックに反応した操作のみを記述しているので、それだけを読み込んだのでは何も表示されない
そのためまず初めに盤面を表示するothello5display1.js/othello5display2.jsを追加で読み込んでいる
*/
if(players==1){
	insertScript(['othello5_js/othello5oneplayprocess.js','othello5_js/othello5display1.js']);
}else if(players==2){
	insertScript(['othello5_js/othello5twoplayprocess.js','othello5_js/othello5display2.js']);
}
