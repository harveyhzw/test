// 坦克
var Tank = function (x,y,sd,colorxb){
	this.colors = [['green','red','#FF8C08'],['#527384','#FFFFFF','yellow'],['yellow','red','green']];
	this.color = this.colors[colorxb];
	this.x = x;
	this.y = y;
	this.sd = sd;
	this.fx = 87;
	this.isLive = true;
	this.bulletLive = true;
	this.type = 'tank';
	
	this.moveUp=function(){
		this.y-=this.sd;
		this.fx = 87;
	};
	this.moveDown=function(){
		this.y+=this.sd;
		this.fx = 83;
	};
	this.moveLeft=function(){
		this.x-=this.sd;
		this.fx = 65;
	};
	this.moveRight=function(){
		this.x+=this.sd;
		this.fx = 68;
	};
	
	//开火
	this.palyBullet=function (){
		var bull = null;
		if(this.fx == 87){
			bull = new Bullet('#FFFFFF',this.x+23,this.y-15,this.fx,10);
		}else if(this.fx == 83){
			bull = new Bullet('#FFFFFF',this.x+23,this.y+50,this.fx,10);
		}else if(this.fx == 65){
			bull = new Bullet('#FFFFFF',this.x-12,this.y+22,this.fx,10);
		}else if(this.fx == 68){
			bull = new Bullet('#FFFFFF',this.x+50,this.y+22,this.fx,10);
		}
		return bull;
	};
	
};

//我的坦克
var hostTank = function (x,y,sd){
	this.myColor = 0;
	this.tank=Tank;
	this.tank(x,y,sd,this.myColor);
};

//伙伴坦克
var partnerTank = function (x,y,sd){
	this.myColor = 2;
	this.tank=Tank;
	this.tank(x,y,sd,this.myColor);
};

//敌人坦克
var enemyTank = function (x,y,sd){
	this.pbNum = 0;
	this.myColor = 1;
	this.tank=Tank;
	this.tank(x,y,sd,this.myColor);
};

//绘画目标矩形
var drawRectangle = function (goalType,cxt){
	var canvas = document.getElementById('gameWindow');
	var cxt = canvas.getContext('2d');
	// 根据类型判断
	
	//画一个坦克
	if(goalType.type == 'tank'){
		var x = goalType.x;
		var y = goalType.y;
		var keyn = goalType.fx;
		var color = goalType.myColor;
		if(keyn==87 || keyn==83){
			cxt.fillStyle = goalType.colors[color][0];
			cxt.fillRect(x,y,5,40);  //(x,y,width,height)
			cxt.fillRect(x+40,y,5,40);
			cxt.fillRect(x+10,y+5,25,30);
			cxt.fillStyle = goalType.colors[color][2];
			cxt.arc(x+23,y+20,5,0,Math.PI*2,true);
			cxt.fill();
			cxt.beginPath();
			cxt.lineWidth = 3;
			cxt.strokeStyle = goalType.colors[color][1];
			if(keyn==87){
				cxt.fillStyle = goalType.colors[color][1];
				cxt.fillRect(x+19,y-15,8,15);
				cxt.moveTo(x+23,y+15);
				cxt.lineTo(x+23,y);
			}else if(keyn==83){
				cxt.fillStyle = goalType.colors[color][1];
				cxt.fillRect(x+19,y+40,8,15);
				cxt.moveTo(x+23,y+25);
				cxt.lineTo(x+23,y+40);
			}
		}else if(keyn==65 || keyn==68){
			cxt.fillStyle = goalType.colors[color][0];
			cxt.fillRect(x,y,40,5);  //(x,y,width,height)
			cxt.fillRect(x,y+40,40,5);
			cxt.fillRect(x+5,y+10,30,25);
			cxt.fillStyle = goalType.colors[color][2];
			cxt.arc(x+20,y+23,5,0,Math.PI*2,true);
			cxt.fill();
			cxt.beginPath();
			cxt.lineWidth = 3;
			cxt.strokeStyle = goalType.colors[color][1];
			if(keyn==65){
				cxt.fillStyle = goalType.colors[color][1];
				cxt.fillRect(x-15,y+18,15,8);
				cxt.moveTo(x+15,y+22);
				cxt.lineTo(x,y+22);
			}else if(keyn==68){
				cxt.fillStyle = goalType.colors[color][1];
				cxt.fillRect(x+40,y+18,15,8);
				cxt.moveTo(x+25,y+22);
				cxt.lineTo(x+40,y+22);
			}
		}
	}else if(goalType.type == 'bullet'){
		cxt.beginPath();
		cxt.strokeStyle = goalType.color;
		cxt.fillStyle = goalType.color;
		cxt.arc(goalType.x,goalType.y,1,0,Math.PI*2,true);
		cxt.fill();
	}
	
	cxt.closePath();
	cxt.stroke();
};

//子弹
var Bullet = function (color,x,y,fx,sd){
	this.color = color;
	this.x = x;   
	this.y = y;
	this.fx = fx;
	this.sd = sd;
	this.isLive = true;
	this.type = 'bullet';
	
	//打炮
	this.play = function (){
		if(this.fx==87){
			this.y -= this.sd;
		}else if(this.fx==83){
			this.y += this.sd;
		}else if(this.fx==65){
			this.x -= this.sd;
		}else if(this.fx==68){
			this.x += this.sd;
		}
	}
};










