var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var startFrameMillis = Date.now();
var endFrameMillis = Date.now();
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	

	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}
var MUSICPLAY = 0;
var splashTimer = 100;
var winTimer = 100;
var loseTimer = 100;
var STATESPLASH = 0;
var STATEGAME = 1;
var STATEEND = 2;
var STATEWIN = 3;
var GAMESTATE = STATESPLASH;
var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;
var METER = TILE;
var GRAVITY = METER * 9.8 * 6;
var MAXDX = METER * 10;
var MAXDY = METER * 15;
var ACCEL = MAXDX * 2;
var BACCEL = MAXDX * -2;
var FRICTION = MAXDX * 6;
var JUMP = METER * -1500;
var LIVES = 3;
var chuckNorris = document.createElement("img");
chuckNorris.src = "hero.png";
var keyboard = new Keyboard();
var player = new Player();
var BACKGROUND = document.createElement("img");
	BACKGROUND.src = "blue_sky.jpg";
var HEART = document.createElement("img");
	HEART.src = "heart.png";
var CROSS = document.createElement("img");
	CROSS.src = "pinkcross.png";
	
var music = new Howl
({
		urls : ["background.ogg"],
		loop : true,
		buffer : true,
		volume : 0.5,
		PLAY : false
});



function MUSIC()
{	
	music.play();		
};

function MUTE()
{
	music.stop();
};

var cells = [];
function initialise()
{
	for (var LIndex = 0; LIndex < LAYER_COUNT - 1; LIndex++)
	{
		cells[LIndex] = [];
		var itemIndex = 0;
		
		for (var y = 0; y < level1.layers[LIndex].height; y++)
		{
			cells[LIndex][y] = [];
			for (var x = 0; x < level1.layers[LIndex].width; x++)
			{
				if (level1.layers[LIndex].data[itemIndex] !=0)
				{
					cells[LIndex][y][x] = 1;
					cells[LIndex][y - 1][x] = 1;
					cells[LIndex][y - 1][x + 1] = 1;
					cells[LIndex][y][x + 1] = 1;
				}
				else if (cells[LIndex][y][x] != 1)
				{
					cells[LIndex][y][x] = 0;
				}
				itemIndex++;
			}
		}
	}
}

function cellAtPixelCoord(layers, x, y)
{
	if (x < 0 || x > SCREEN_WIDTH || y < 0)
		return 1;
	if (y > SCREEN_HEIGHT)
		return 0;
		
	return  cellAtTileCoord(layers, pixelToTile(x), pixelToTile(y));
};

function cellAtTileCoord(layers, Tx, Ty)
{
	if (Tx < 0 || Tx >= MAP.tw || Ty < 0)
		return 1;
		
	if (Ty >= MAP.th)
		return 0;
	
	return cells[layers][Ty][Tx];
};

function tileToPixel(tile)
{
	return tile * TILE;
};

function pixelToTile(pixel)
{
	return Math.floor(pixel/TILE);
};

function bound(value, min, max)
{
	if (value < min)
		return min;
	if (value > max)
		return max;
		
	return value;
};

initialise();

function RUNSPLASHSCREEN(deltaTime)
{
	if (splashTimer > 0)
	{
		splashTimer --
	}	
	
	if ( splashTimer == 0) 
	{
		GAMESTATE = STATEGAME
	}
	
	context.fillStyle = "#000";
	context.font = "40px Arial";
	context.fillText( "SUPER AMAZING PLATFORM ADVENTURE", SCREEN_HEIGHT/6.6, SCREEN_WIDTH/3);
};

function RUNGAMESCREEN(deltaTime)
{
	
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText(LIVES, 5, 100, 100);
	drawMap();
	player.update(deltaTime);
	player.draw(context);
	winTimer = 100;
	loseTimer = 100;
	
	context.drawImage(CROSS, 100, 20)
	
	context.draw = HEART;
	context.draw = CROSS;
	
	if (LIVES == 3)
	{
		context.drawImage(HEART, 120, 25)
		context.drawImage(HEART, 130, 25)
		context.drawImage(HEART, 140, 25)
	};
	
	if (LIVES == 2)
	{
		context.drawImage(HEART, 130, 25)
		context.drawImage(HEART, 120, 25)
	};
	
	if (LIVES == 1)
	{
		context.drawImage(HEART, 120, 25)
	};
	
	if (player.position.x >= 2044 && player.position.y >= 420)
	{
		GAMESTATE = STATEWIN
	}
	
	if (player.position.y > 600 || player.position.x < 0)
	{
		player.position.y = 7 * TILE;
		player.position.x = 11 * TILE;
		LIVES --;
		player.Sprite.setAnimation(ANIM_IDLE_LEFT);
	};
	
	if (LIVES == 0)
	{
		GAMESTATE = STATEEND
	};
};



function RUNGAMEOVER(deltaTime)
{
	context.fillStyle = "#000";
	context.font = "40px Arial";
	context.fillText( "YOU LOSE! TRY AGAIN", SCREEN_HEIGHT/2, SCREEN_WIDTH/3);
	
	if (loseTimer > 0)
	{
		loseTimer --
	}	
	
	if ( loseTimer == 0) 
	{
		GAMESTATE = STATEGAME;
		LIVES = 3;
	}
};
	
function RUNGAMEWIN(deltaTime)
{
	context.fillStyle = "#000";
	context.font = "40px Arial";
	context.fillText( "YOU WIN! GOOD WORK", SCREEN_HEIGHT/2, SCREEN_WIDTH/3);
	
	if (winTimer > 0)
	{
		winTimer --
	}	
	
	if ( winTimer == 0) 
	{
		GAMESTATE = STATEGAME;
		LIVES = 3;
		player.position.y = 7 * TILE;
		player.position.x = 11 * TILE;
		player.Sprite.setAnimation(ANIM_IDLE_LEFT);
	}
};
MUSIC();
function run()
{
	
	
	
	context.drawImage(BACKGROUND, 0, 0);
	// BACKGROUND IMAGE http://wallpaperswide.com/blue_sky_6-wallpapers.html
	context.draw = BACKGROUND;
	
	var deltaTime = getDeltaTime();
	
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}			
	//GAMESTATES
	

	switch(GAMESTATE)
	{
		case STATESPLASH:
			RUNSPLASHSCREEN(deltaTime);
		break;
		 
		case STATEGAME:
			RUNGAMESCREEN(deltaTime);
		break;
		
		case STATEEND:
			RUNGAMEOVER(deltaTime);
		break;
		
		case STATEWIN:
			RUNGAMEWIN(deltaTime);
		break;
	};

	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
	context.fillText("x " + player.position.x + " y " + player.position.y, 5, 40, 100);
	context.fillText(splashTimer +" "+ winTimer +" "+ loseTimer, 5, 60, 100);
	context.fillText(GAMESTATE, 5, 80, 100);

};


//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
