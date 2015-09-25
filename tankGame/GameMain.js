//游戏
var Game = function (){
	var gameTimeRun = null; // 游戏计时器
	var gameStatus = false; //游戏状态
	var keyStatus = new Array(); //键盘状态
	var hTank = new hostTank(350,155,5); //我的坦克
	var pTank = new partnerTank(550,555,5); //朋友的坦克
	var enemyTanks = new Array(); //敌人的坦克
	var hostBullList = new Array();  //我方的子弹
	var enemyBullList = new Array();  //敌方的子弹
	
	// 游戏的初始化
	this.init = function () {
		logs('进入游戏，开始初始化...');
		for(var i=0;i<5;i++){
			enemyTanks.push(new enemyTank(60+parseInt(Math.random()*10)*85,parseInt(Math.random()*300)+50,2));
		};
		//加入键盘监听事件
		document.onkeyup = function (event){
			var keyn = event.keyCode;
			if(gameStatus)
				keyStatus[keyn] = false;
		};
		document.onkeydown = function (event){
			var keyn = event.keyCode;
			if(gameStatus)
				keyStatus[keyn] = true;
		};
		logs('初始化完成 ok ');
	};
	
	// 游戏开始
	this.start = function () {
		gameStatus = true;//更改游戏状态
		gameTimeRun = setInterval(this.scene,1000/40);
		logs('游戏开始');
	};
	
	//游戏停止
	this.stop = function () {
		gameStatus = false; //更改游戏状态
		clearInterval(gameTimeRun);
		logs('游戏暂停');
	};
	
	//游戏画布
	this.scene = function (){
		var canvas = document.getElementById('gameWindow');
		var cxt = canvas.getContext('2d');
		var sceneWidth = canvas.width; //画布宽度
		var sceneHeight = canvas.height; //画布高度
		cxt.clearRect(0,0,950,600); //清除游戏场景
		
		// 我的坦克 方向判断
		if(keyStatus[Constant_Key.KEY_W]){
			if(hTank.y >= 0+18)
				hTank.moveUp();
		}else if(keyStatus[Constant_Key.KEY_S]){
			if(hTank.y <= sceneHeight-60)
				hTank.moveDown();
		}else if(keyStatus[Constant_Key.KEY_A]){
			if(hTank.x >= 0+20)
				hTank.moveLeft();
		}else if(keyStatus[Constant_Key.KEY_D]){
			if(hTank.x <= sceneWidth-60)
				hTank.moveRight();
		}
		// 朋友坦克 方向判断
		if(keyStatus[Constant_Key.KEY_MIN_W]){
			if(pTank.y >= 0+18)
				pTank.moveUp();
		}else if(keyStatus[Constant_Key.KEY_MIN_S]){
			if(pTank.y <= sceneHeight-60)	
				pTank.moveDown();
		}else if(keyStatus[Constant_Key.KEY_MIN_A]){
			if(pTank.x >= 0+20)
				pTank.moveLeft();
		}else if(keyStatus[Constant_Key.KEY_MIN_D]){
			if(pTank.x <= sceneWidth-60)
				pTank.moveRight();
		}
		// 敌人坦克 方向判断
		for(var i=0;i<enemyTanks.length;i++){
			var tmpEnemyTanks = enemyTanks[i];
			if(tmpEnemyTanks.isLive){
				if(tmpEnemyTanks.pbNum == 50){ // 改变方向
					var eneFxRandom = [Constant_Key.KEY_W,Constant_Key.KEY_S,Constant_Key.KEY_A,Constant_Key.KEY_D];
					tmpEnemyTanks.fx = eneFxRandom[parseInt(Math.random()*(eneFxRandom.length-1))];
					tmpEnemyTanks.pbNum = 0;
				}else{
					tmpEnemyTanks.pbNum++;
				};
				//碰到边界改变方向
				if(tmpEnemyTanks.y<=0+18){  
					tmpEnemyTanks.fx = Constant_Key.KEY_S;
				}else if(tmpEnemyTanks.y>=sceneHeight-60){
					tmpEnemyTanks.fx = Constant_Key.KEY_W;
				}else if(tmpEnemyTanks.x<=0+20){
					tmpEnemyTanks.fx = Constant_Key.KEY_D;
				}else if(tmpEnemyTanks.x>=sceneWidth-60){
					tmpEnemyTanks.fx = Constant_Key.KEY_A;
				};
				// 改变坐标位置
				if(tmpEnemyTanks.fx==Constant_Key.KEY_W){
					tmpEnemyTanks.moveUp();
				}else if(tmpEnemyTanks.fx==Constant_Key.KEY_S){
					tmpEnemyTanks.moveDown();
				}else if(tmpEnemyTanks.fx==Constant_Key.KEY_A){
					tmpEnemyTanks.moveLeft();
				}else if(tmpEnemyTanks.fx==Constant_Key.KEY_D){
					tmpEnemyTanks.moveRight();
				};
			};
		};
		// 敌人坦克开火
		for(var i=0;i<enemyTanks.length;i++){
			var tmpEnemyTanks = enemyTanks[i];
			if(tmpEnemyTanks.isLive){
				if(tmpEnemyTanks.pbNum == 45){  // 　敌人开火
					enemyBullList.push(tmpEnemyTanks.palyBullet());
				};
			};
		};
		//我的开火 
		if(keyStatus[Constant_Key.KEY_J]){
			if(hTank.isLive)
				hostBullList.push(hTank.palyBullet());
		};
		//朋友的开火
		if(keyStatus[Constant_Key.KEY_MIN_J]){
			if(pTank.isLive)
				hostBullList.push(pTank.palyBullet());
		}
		
		//判断敌方与我方的子弹对消
		for(var i=0;i<enemyBullList.length;i++){
			var enemyTmp = enemyBullList[i];
			if(enemyTmp.isLive){
				for(var k=0;k<hostBullList.length;k++){
					var hostTmp = hostBullList[k];
					if(hostTmp.isLive){
						if(hostTmp.x == enemyTmp.x && hostTmp.y == enemyTmp.y){
							hostTmp.isLive = false;
							enemyTmp.isLive = false;
						};
					};
				};
			};
		};
		
		// 判断子弹碰到边界 是否击中目标 我方
		if(hostBullList.length>0){
			for(var c=0;c<hostBullList.length;c++){
				var thisBull_x = hostBullList[c]
				//判断子弹边界消失
				if(thisBull_x.x <= 0 || thisBull_x.x >= 950 || thisBull_x.y <= 0 || thisBull_x.y >= 600)
					hostBullList[c].isLive = false; //子弹死亡
				if(thisBull_x.isLive){
					// 判断打中敌人坦克
					for(var enc=0;enc<enemyTanks.length;enc++){
						if(enemyTanks[enc].isLive){
							if(thisBull_x.y >= enemyTanks[enc].y-20 && thisBull_x.y <= enemyTanks[enc].y+50 
								&& thisBull_x.x >= enemyTanks[enc].x-20 && thisBull_x.x <= enemyTanks[enc].x+50 ){
								enemyTanks[enc].isLive = false; //敌人坦克死亡
								hostBullList[c].isLive = false; //子弹死亡
								setTimeout(function (){
									enemyTanks.push(new enemyTank(60+parseInt(Math.random()*10)*85,parseInt(Math.random()*300)+50,2));
								},3000)
							};
						};
					};
				};
				if(thisBull_x.isLive){
					thisBull_x.play(); // 改变坐标
				};
			};
		};
		
		// 判断子弹碰到边界 是否击中目标 敌方
		if(enemyBullList.length>0){
			for(var c=0;c<enemyBullList.length;c++){
				var thisBull_x = enemyBullList[c];
				//判断子弹边界消失
				if(thisBull_x.x <= 0 || thisBull_x.x >= 950 || thisBull_x.y <= 0 || thisBull_x.y >= 600)
					enemyBullList[c].isLive = false; //子弹死亡
				if(hTank.isLive){  //判断是否击中A坦克
					if(thisBull_x.y >= hTank.y-20 && thisBull_x.y <= hTank.y+50 
						&& thisBull_x.x >= hTank.x-20 && thisBull_x.x <= hTank.x+50 ){
						hTank.isLive = false; //a坦克死亡
						enemyBullList[c].isLive = false; //子弹死亡
					};
				};
				if(pTank.isLive){   //判断是否击中B坦克
					if(thisBull_x.y >= pTank.y-20 && thisBull_x.y <= pTank.y+50 
						&& thisBull_x.x >= pTank.x-20 && thisBull_x.x <= pTank.x+50 ){
						pTank.isLive = false; //b坦克死亡
						enemyBullList[c].isLive = false; //子弹死亡
					};
				};
				if(thisBull_x.isLive){
					thisBull_x.play(); // 改变坐标
				};
			};
		};
		
		// 画子弹 我方
		if(hostBullList.length>0){
			for(var c=0;c<hostBullList.length;c++){
				var thisBull_x = hostBullList[c]
				if(thisBull_x.isLive)
					drawRectangle(thisBull_x); // 画子弹 
			};
		};
		
		// 画子弹 敌方
		if(enemyBullList.length>0){
			for(var c=0;c<enemyBullList.length;c++){
				var thisBull_x = enemyBullList[c];
				if(thisBull_x.isLive)
					drawRectangle(thisBull_x); // 画子弹 
			};
		};
		
		//绘画坦克
		if(hTank.isLive)
			drawRectangle(hTank);
		if(pTank.isLive)
			drawRectangle(pTank);
		for(var i=0;i<enemyTanks.length;i++){
			if(enemyTanks[i].isLive)
				drawRectangle(enemyTanks[i]);
		};
		
		//cxt.rect(200,300,500,50);
	};
	
};