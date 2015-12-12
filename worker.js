addEventListener("message",function(e){
	if(e.data.type == "dice"){
		var d = e.data.value.toLowerCase();
		if (d.match(/[ -~]+/) === null || d !== d.match(/[ -~]+/)[0]) {log("全角文字とか混ざってない？");exit();return}
		if (d.match(/\d+[d,D]\d+ ?\d*/g) === null || d !== d.match(/\d+[d,D]\d+ ?\d*/g)[0]){log("入力がなんかおかしいみたい");exit();return}
		var spl = d.split(' ');
		var dice = spl[0].split('d');
		if(spl.length == 2){
			infinitydice(dice[0],dice[1],spl[1]);
		}else{
			normaldice(dice[0],dice[1]);
		}
	}
});
function normaldice(n,m){
	var logarr = ["normal diceroll: " + n + "D" + m];
	var dicelog = [];
	for(var i=0;i<n;i++){
		var a = diceroll(m);
		dicelog.push(a);
		if(i%100 == 0){log((logarr.concat((i+1) + "/" + n + ": " + a).join('\n')));}
	}
	logarr.push("...completed");
	logarr.push("\n" + dicelog.join(', '));
	log(logarr.join('\n'));
	result(dicelog.reduce(function(a,b){return a+b}));
}
function infinitydice(n,m,c){
	var logarr = ["infinity diceroll: " + n + "D" + m + " critical: " + c];
	var dicelog = [];
	var nextn = n;
	var cnt = 0;
	var _result = 0;
	while (true){
		var dl = [];
		for (var i=0;i<nextn;i++){
			var a = diceroll(m);
			cnt++;
			dl.push(a);
			if(cnt%100 == 0){log((logarr.concat((cnt+1) + ": " + a).join('\n')));}
		}
		dicelog.push(dl);
		var numOfCritical = dl.filter(function(n){return c <= n}).length;
		if(numOfCritical == 0){
			_result += Number(dl.reduce(function(a,b){Math.max(a,b)}));
			break;
		}else{
			_result += Number(m);
			nextn = numOfCritical;
		}
	}
	logarr.push("...completed");
	dicelog.forEach(function(arr){logarr.push(arr.join(", "))});
	log(logarr.join('\n'));
	result(_result);
}
function diceroll(n){
	return Math.floor( Math.random() * n ) + 1;
}
function log(s){
	postMessage({type:"log",value:s});
}
function result(s){
	postMessage({type:"result",value:s});
}
function exit(){
	postMessage({type:"result",value:""});
}