//��Ϸ
var Game = function (){
	var gameTimeRun = null; // ��Ϸ��ʱ��
	var gameStatus = false; //��Ϸ״̬
	var keyStatus = new Array(); //����״̬
	var hTank = new hostTank(350,155,5); //�ҵ�̹��
	var pTank = new partnerTank(550,555,5); //���ѵ�̹��
	var enemyTanks = new Array(); //���˵�̹��
	var hostBullList = new Array();  //�ҷ����ӵ�
	var enemyBullList = new Array();  //�з����ӵ�
	
	// ��Ϸ�ĳ�ʼ��
	this.init = function () {
		logs('������Ϸ����ʼ��ʼ��...');
		for(var i=0;i<5;i++){
			enemyTanks.push(new enemyTank(60+parseInt(Math.random()*10)*85,parseInt(Math.random()*300)+50,2));
		};
		//������̼����¼�
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
		logs('��ʼ����� ok ');
	};
	
	// ��Ϸ��ʼ
	this.start = function () {
		gameStatus = true;//������Ϸ״̬
		gameTimeRun = setInterval(this.scene,1000/40);
		logs('��Ϸ��ʼ');
	};
	
	//��Ϸֹͣ
	this.stop = function () {
		gameStatus = false; //������Ϸ״̬
		clearInterval(gameTimeRun);
		logs('��Ϸ��ͣ');
	};
	
	//��Ϸ����
	this.scene = function (){
		var canvas = document.getElementById('gameWindow');
		var cxt = canvas.getContext('2d');
		var sceneWidth = canvas.width; //�������
		var sceneHeight = canvas.height; //�����߶�
		cxt.clearRect(0,0,950,600); //�����Ϸ����
		
		// �ҵ�̹�� �����ж�
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
		// ����̹�� �����ж�
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
		// ����̹�� �����ж�
		for(var i=0;i<enemyTanks.length;i++){
			var tmpEnemyTanks = enemyTanks[i];
			if(tmpEnemyTanks.isLive){
				if(tmpEnemyTanks.pbNum == 50){ // �ı䷽��
					var eneFxRandom = [Constant_Key.KEY_W,Constant_Key.KEY_S,Constant_Key.KEY_A,Constant_Key.KEY_D];
					tmpEnemyTanks.fx = eneFxRandom[parseInt(Math.random()*(eneFxRandom.length-1))];
					tmpEnemyTanks.pbNum = 0;
				}else{
					tmpEnemyTanks.pbNum++;
				};
				//�����߽�ı䷽��
				if(tmpEnemyTanks.y<=0+18){  
					tmpEnemyTanks.fx = Constant_Key.KEY_S;
				}else if(tmpEnemyTanks.y>=sceneHeight-60){
					tmpEnemyTanks.fx = Constant_Key.KEY_W;
				}else if(tmpEnemyTanks.x<=0+20){
					tmpEnemyTanks.fx = Constant_Key.KEY_D;
				}else if(tmpEnemyTanks.x>=sceneWidth-60){
					tmpEnemyTanks.fx = Constant_Key.KEY_A;
				};
				// �ı�����λ��
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
		// ����̹�˿���
		for(var i=0;i<enemyTanks.length;i++){
			var tmpEnemyTanks = enemyTanks[i];
			if(tmpEnemyTanks.isLive){
				if(tmpEnemyTanks.pbNum == 45){  // �����˿���
					enemyBullList.push(tmpEnemyTanks.palyBullet());
				};
			};
		};
		//�ҵĿ��� 
		if(keyStatus[Constant_Key.KEY_J]){
			if(hTank.isLive)
				hostBullList.push(hTank.palyBullet());
		};
		//���ѵĿ���
		if(keyStatus[Constant_Key.KEY_MIN_J]){
			if(pTank.isLive)
				hostBullList.push(pTank.palyBullet());
		}
		
		//�жϵз����ҷ����ӵ�����
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
		
		// �ж��ӵ������߽� �Ƿ����Ŀ�� �ҷ�
		if(hostBullList.length>0){
			for(var c=0;c<hostBullList.length;c++){
				var thisBull_x = hostBullList[c]
				//�ж��ӵ��߽���ʧ
				if(thisBull_x.x <= 0 || thisBull_x.x >= 950 || thisBull_x.y <= 0 || thisBull_x.y >= 600)
					hostBullList[c].isLive = false; //�ӵ�����
				if(thisBull_x.isLive){
					// �жϴ��е���̹��
					for(var enc=0;enc<enemyTanks.length;enc++){
						if(enemyTanks[enc].isLive){
							if(thisBull_x.y >= enemyTanks[enc].y-20 && thisBull_x.y <= enemyTanks[enc].y+50 
								&& thisBull_x.x >= enemyTanks[enc].x-20 && thisBull_x.x <= enemyTanks[enc].x+50 ){
								enemyTanks[enc].isLive = false; //����̹������
								hostBullList[c].isLive = false; //�ӵ�����
								setTimeout(function (){
									enemyTanks.push(new enemyTank(60+parseInt(Math.random()*10)*85,parseInt(Math.random()*300)+50,2));
								},3000)
							};
						};
					};
				};
				if(thisBull_x.isLive){
					thisBull_x.play(); // �ı�����
				};
			};
		};
		
		// �ж��ӵ������߽� �Ƿ����Ŀ�� �з�
		if(enemyBullList.length>0){
			for(var c=0;c<enemyBullList.length;c++){
				var thisBull_x = enemyBullList[c];
				//�ж��ӵ��߽���ʧ
				if(thisBull_x.x <= 0 || thisBull_x.x >= 950 || thisBull_x.y <= 0 || thisBull_x.y >= 600)
					enemyBullList[c].isLive = false; //�ӵ�����
				if(hTank.isLive){  //�ж��Ƿ����A̹��
					if(thisBull_x.y >= hTank.y-20 && thisBull_x.y <= hTank.y+50 
						&& thisBull_x.x >= hTank.x-20 && thisBull_x.x <= hTank.x+50 ){
						hTank.isLive = false; //a̹������
						enemyBullList[c].isLive = false; //�ӵ�����
					};
				};
				if(pTank.isLive){   //�ж��Ƿ����B̹��
					if(thisBull_x.y >= pTank.y-20 && thisBull_x.y <= pTank.y+50 
						&& thisBull_x.x >= pTank.x-20 && thisBull_x.x <= pTank.x+50 ){
						pTank.isLive = false; //b̹������
						enemyBullList[c].isLive = false; //�ӵ�����
					};
				};
				if(thisBull_x.isLive){
					thisBull_x.play(); // �ı�����
				};
			};
		};
		
		// ���ӵ� �ҷ�
		if(hostBullList.length>0){
			for(var c=0;c<hostBullList.length;c++){
				var thisBull_x = hostBullList[c]
				if(thisBull_x.isLive)
					drawRectangle(thisBull_x); // ���ӵ� 
			};
		};
		
		// ���ӵ� �з�
		if(enemyBullList.length>0){
			for(var c=0;c<enemyBullList.length;c++){
				var thisBull_x = enemyBullList[c];
				if(thisBull_x.isLive)
					drawRectangle(thisBull_x); // ���ӵ� 
			};
		};
		
		//�滭̹��
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