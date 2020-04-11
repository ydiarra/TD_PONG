
let game = {
    groundWidth : 700,
    groundHeight : 400,
    groundColor: "#000000",
    netWidth : 6,
    netColor: "#FFFFFF",
    groundLayer : null,
    wallSound:null,
    playerSound:null,
    divGame:null,
    gameOn:false,
    startGameButton:null,
    devResX : 1366,
    devResY : 738,
    targeResX : null,
    targetResY : null,
    ratioResX : null,
    ratioResY : null,
    ball : {
        sprite : null,
        color : "#FFD700",
        directionX : 1,
        directionY : 1,
        speed : 1,
        inGame:false,
        move : function() {
            if ( this.inGame ) {
                this.sprite.posX += this.directionX * this.speed;
                this.sprite.posY += this.directionY * this.speed;
            }
        },

        lost : function(player) {
            var returnValue = false;
            if ( player.originalPosition == "left" && this.sprite.posX < player.sprite.posX - this.sprite.width ) {
                returnValue = true;
            } else if ( player.originalPosition == "right" && this.sprite.posX > player.sprite.posX + player.sprite.width ) {
                returnValue = true;
            }
            return returnValue;
        },

        bounce : function(soundToPlay) {
            if ( this.sprite.posX > conf.GROUNDLAYERWIDTH || this.sprite.posX < 0 ) {
                this.directionX = -this.directionX;
                soundToPlay.play();
            }
            if ( this.sprite.posY > conf.GROUNDLAYERHEIGHT || this.sprite.posY < 0  ) {
                this.directionY = -this.directionY;
                soundToPlay.play();
            }
        },
        collide : function(anotherItem) {
            if ( !( this.sprite.posX >= anotherItem.sprite.posX + anotherItem.sprite.width || this.sprite.posX <= anotherItem.sprite.posX - this.sprite.width
                || this.sprite.posY >= anotherItem.sprite.posY + anotherItem.sprite.height || this.sprite.posY <= anotherItem.sprite.posY - this.sprite.height ) ) {
                // Collision
                return true;
            }
            return false;
        },
        speedUp: function() {
            this.speed = this.speed + .1;
        },

    },
    playerOne : {
        sprite : null,
        color : "#FFFFFF",
        goUp : false,
        goDown : false,
        originalPosition : "left",
        score : 0,
        ai : false

    },
    playerTwo : {
        sprite : null,
        color : "#FFFFFF",
        goUp : false,
        goDown : false,
        originalPosition : "right",
        score : 0,
        ai : true
    },
    init : function() {
        this.initScreenRes();
        this.resizeDisplayData(conf,this.ratioResX,this.ratioResY);

        this.divGame = document.getElementById("divGame");
        this.startGameButton = document.getElementById("startGame");

        this.groundLayer= game.display.createLayer("terrain", conf.GROUNDLAYERWIDTH, conf.GROUNDLAYERHEIGHT,
            this.divGame, 0, "#000000", 10, 50);
        game.display.drawRectangleInLayer(this.groundLayer, conf.NETWIDTH, conf.GROUNDLAYERHEIGHT, this.netColor,
            conf.GROUNDLAYERWIDTH/2 - conf.NETWIDTH/2, 0);

        this.scoreLayer = game.display.createLayer("score", conf.GROUNDLAYERWIDTH, conf.GROUNDLAYERHEIGHT,
            this.divGame, 1, undefined, 10, 50);
        game.display.drawTextInLayer(this.scoreLayer , "SCORE", "10px Arial", "#FF0000", 10, 10);

        this.playersBallLayer = game.display.createLayer("joueursetballe", conf.GROUNDLAYERWIDTH,
            conf.GROUNDLAYERHEIGHT, this.divGame, 2, undefined, 10, 50);
        game.display.drawTextInLayer(this.playersBallLayer, "JOUEURSETBALLE", "10px Arial",
            "#FF0000", 100, 100);

        this.displayScore(0,0);

        this.ball.sprite = game.display.createSprite(conf.BALLWIDTH,conf.BALLHEIGHT,conf.BALLPOSX,conf.BALLPOSY,
            "./img/ball.png");
        this.displayBall();

        this.playerOne.sprite = game.display.createSprite(conf.PLAYERONEWIDTH,conf.PLAYERONEHEIGHT,conf.PLAYERONEPOSX,conf.PLAYERONEPOSY,
            "./img/playerOne.png");
        this.playerTwo.sprite = game.display.createSprite(conf.PLAYERTWOWIDTH,conf.PLAYERTWOHEIGHT,conf.PLAYERTWOPOSX,conf.PLAYERTWOPOSY,
            "./img/playerTwo.png");
        this.displayPlayers();

        this.initKeyboard(game.control.onKeyDown, game.control.onKeyUp);
        this.initMouse(game.control.onMouseMove);
        this.initStartGameButton();

        this.wallSound = new Audio("./sound/wall.ogg");
        this.playerSound = new Audio("./sound/player.ogg");
        game.speedUpBall();
        game.ai.setPlayerAndBall(this.playerTwo, this.ball);
    },
    displayScore : function(scorePlayer1, scorePlayer2) {
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer1, conf.SCOREFONTSIZE + "pt DS-DIGIB", "#FFFFFF", conf.SCOREPOSXPLAYER1, conf.SCOREPOSYPLAYER1);
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer2, conf.SCOREFONTSIZE + "pt DS-DIGIB", "#FFFFFF", conf.SCOREPOSXPLAYER2, conf.SCOREPOSYPLAYER2);
    },
    displayBall : function() {
        game.display.drawImageInLayer(this.playersBallLayer, this.ball.sprite.img, this.ball.sprite.posX,
            this.ball.sprite.posY,this.ball.sprite.width,this.ball.sprite.height);
    },
    displayPlayers : function() {
        game.display.drawImageInLayer(this.playersBallLayer, this.playerOne.sprite.img, this.playerOne.sprite.posX,
            this.playerOne.sprite.posY,this.playerOne.sprite.width,this.playerOne.sprite.height);
        game.display.drawImageInLayer(this.playersBallLayer, this.playerTwo.sprite.img, this.playerTwo.sprite.posX,
            this.playerTwo.sprite.posY,this.playerTwo.sprite.width,this.playerTwo.sprite.height);
    },
    moveBall : function() {
        this.ball.move();
        this.ball.bounce(this.wallSound);
        this.displayBall();
    },
    clearLayer : function(targetLayer) {
        targetLayer.clear();
    },
    initKeyboard : function(onKeyDownFunction, onKeyUpFunction) {
        window.onkeydown = onKeyDownFunction;
        window.onkeyup = onKeyUpFunction;
    },
    movePlayers : function() {
        if ( game.control.controlSystem == "KEYBOARD" ) {
            // keyboard control
            if ( game.playerOne.goUp ) {
                game.playerOne.sprite.posY-=5;
            } else if ( game.playerOne.goDown ) {
                game.playerOne.sprite.posY+=5;
            }
        } else if ( game.control.controlSystem == "MOUSE" ) {
            // mouse control
            if (game.playerOne.goUp && game.playerOne.sprite.posY > game.control.mousePointer)
                game.playerOne.sprite.posY-=5;
            else if (game.playerOne.goDown && game.playerOne.sprite.posY < game.control.mousePointer)
                game.playerOne.sprite.posY+=5;
        }
    },
    initMouse : function(onMouseMoveFunction) {
        window.onmousemove = onMouseMoveFunction;
    },
    collideBallWithPlayersAndAction : function() {
        if ( this.ball.collide(game.playerOne) ) {
            this.changeBallPath(game.playerOne, game.ball);
            //this.playerSound.play();
        }
        if ( this.ball.collide(game.playerTwo) ) {
            this.changeBallPath(game.playerTwo, game.ball);
           // this.playerSound.play();
        }
    },
    lostBall : function() {
        if ( this.ball.lost(this.playerOne) ) {
            this.playerTwo.score++;
            if ( this.playerTwo.score > 2 ) {
                this.gameOn = false;
                this.ball.inGame = false;
            } else {
                this.ball.inGame = false;

                if ( this.playerOne.ai ) {
                    setTimeout(game.ai.startBall(), 3000);
                }
            }
        } else if ( this.ball.lost(this.playerTwo) ) {
            this.playerOne.score++;
            if ( this.playerOne.score > 2 ) {
                this.gameOn = false;
                this.ball.inGame = false;
            } else {
                this.ball.inGame = false;

                if ( this.playerTwo.ai ) {
                    setTimeout(game.ai.startBall(), 3000);
                }
            }
        }

        this.scoreLayer.clear();
        this.displayScore(this.playerOne.score, this.playerTwo.score);
    },
    initStartGameButton : function() {
        this.startGameButton.onclick = game.control.onStartGameClickButton;
    },
    reinitGame : function() {
        this.ball.inGame = false;
        this.ball.speed = 1;
        this.playerOne.score = 0;
        this.playerTwo.score = 0;
        this.scoreLayer.clear();
        this.displayScore(this.playerOne.score, this.playerTwo.score);
    },
    ballOnPlayer : function(player, ball) {
        var returnValue = "CENTER";
        var playerPositions = player.sprite.height/5;
        if ( ball.sprite.posY > player.sprite.posY && ball.sprite.posY < player.sprite.posY + playerPositions ) {
            returnValue = "TOP";
        } else if ( ball.sprite.posY >= player.sprite.posY + playerPositions && ball.sprite.posY < player.sprite.posY + playerPositions*2 ) {
            returnValue = "MIDDLETOP";
        } else if ( ball.sprite.posY >= player.sprite.posY + playerPositions*2 && ball.sprite.posY < player.sprite.posY +
            player.sprite.height - playerPositions ) {
            returnValue = "MIDDLEBOTTOM";
        } else if ( ball.sprite.posY >= player.sprite.posY + player.sprite.height - playerPositions && ball.sprite.posY < player.sprite.posY +
            player.sprite.height ) {
            returnValue = "BOTTOM";
        }
        return returnValue;
    },
    changeBallPath : function(player, ball) {
        if (player.originalPosition == "left") {
            switch (game.ballOnPlayer(player, ball)) {
                case "TOP":
                    ball.directionX = 1;
                    ball.directionY = -3;
                    break;
                case "MIDDLETOP":
                    ball.directionX = 1;
                    ball.directionY = -1;
                    break;
                case "CENTER":
                    ball.directionX = 2;
                    ball.directionY = 0;
                    break;
                case "MIDDLEBOTTOM":
                    ball.directionX = 1;
                    ball.directionY = 1;
                    break;
                case "BOTTOM":
                    ball.directionX = 1;
                    ball.directionY = 3;
                    break;
            }
        } else {
            switch (game.ballOnPlayer(player, ball)) {
                case "TOP":
                    ball.directionX = -1;
                    ball.directionY = -3;
                    break;
                case "MIDDLETOP":
                    ball.directionX = -1;
                    ball.directionY = -1;
                    break;
                case "CENTER":
                    ball.directionX = -2;
                    ball.directionY = 0;
                    break;
                case "MIDDLEBOTTOM":
                    ball.directionX = -1;
                    ball.directionY = 1;
                    break;
                case "BOTTOM":
                    ball.directionX = -1;
                    ball.directionY = 3;
                    break;
            }
        }
    },
        speedUp: function() {
            this.speed = this.speed + .1;
        },
    speedUpBall: function() {
        setInterval(function() {
            game.ball.speedUp();
        }, 5000);
    },
    initScreenRes : function() {
        this.targetResX = window.screen.availWidth;
        this.targetResY = window.screen.availHeight;
        this.ratioResX = this.targetResX/this.devResX;
        this.ratioResY = this.targetResY/this.devResY;
    },
    resizeDisplayData : function(object, ratioX, ratioY) {
        var property;
        for ( property in object ) {
            if ( property.match(/^.*X.*$/i) || property.match(/^.*WIDTH.*$/i) ) {
                object[property] = Math.round(object[property] * ratioX);
            } else {
                object[property] = Math.round(object[property] * ratioY);
            }
        }
    },
};
