
let game = {
    groundWidth : 700,
    groundHeight : 400,
    groundColor: "#000000",
    netWidth : 6,
    netColor: "#FFFFFF",
    groundLayer : null,
    scorePosPlayer1 : 300,
    scorePosPlayer2 : 365,
    wallSound:null,
    playerSound:null,
    divGame:null,
    gameOn:false,
    startGameButton:null,
    ball : {
        width : 10,
        height : 10,
        color : "#FFFFFF",
        posX : 200,
        posY : 200,
        directionX:1,
        directionY:1,
        speed:1,
        inGame:false,
        imagePath:'./img/ball.png',
        move : function() {
            if ( this.inGame ) {
                this.posX += this.directionX * this.speed;
                this.posY += this.directionY * this.speed;
            }
        },
        initImage : function(width, height) {
            this.img = new Image(width, height);
            this.img.src = this.imagePath;
            this.img.width = width;
            this.img.height = height;
        },
        lost : function(player) {
            var returnValue = false;
            if ( player.originalPosition == "left" && this.posX < player.posX - this.width ) {
                returnValue = true;
            } else if ( player.originalPosition == "right" && this.posX > player.posX + player.width ) {
                returnValue = true;
            }
            return returnValue;
        },

        bounce : function(soundToPlay) {
            if ( this.posX > game.groundWidth || this.posX < 0 ) {
                this.directionX = -this.directionX;
                soundToPlay.play();
            }
            if ( this.posY > game.groundHeight || this.posY < 0  ) {
                this.directionY = -this.directionY;
                soundToPlay.play();
            }
        },
        collide : function(anotherItem) {
            if ( !( this.posX >= anotherItem.posX + anotherItem.width || this.posX <= anotherItem.posX - this.width
                || this.posY >= anotherItem.posY + anotherItem.height || this.posY <= anotherItem.posY - this.height ) ) {
                // Collision
                return true;
            }
            return false;
        },

    },
    playerOne : {
        width : 10,
        height :50,
        color : "#FFFFFF",
        posX : 10,
        posY : 200,
        goUp : false,
        goDown : false,
        originalPosition : "left",
        score:0,
        ai:false,
        imagePath : "./img/playerOne.png",
        initImage : function(width, height) {
            this.img = new Image(width, height);
            this.img.src = this.imagePath;
            this.img.width = width;
            this.img.height = height;
        },
    },
    playerTwo : {
        width : 10,
        height : 50,
        color : "#FFFFFF",
        posX : 650,
        posY : 200,
        goUp : false,
        goDown : false,
        originalPosition : "right",
        score:0,
        ai:true,
        imagePath : "./img/playerTwo.png",
        initImage : function(width, height) {
            this.img = new Image(width, height);
            this.img.src = this.imagePath;
            this.img.width = width;
            this.img.height = height;
        },
    },
    init : function() {
        this.divGame = document.getElementById("divGame");
        this.startGameButton = document.getElementById("startGame");

        this.groundLayer= game.display.createLayer("terrain", this.groundWidth, this.groundHeight, this.divGame,
            0, "#000000", 10, 50);
        game.display.drawRectangleInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor,
            this.groundWidth/2 - this.netWidth/2, 0);

        this.scoreLayer = game.display.createLayer("score", this.groundWidth, this.groundHeight, this.divGame,
            1, undefined, 10, 50);
        game.display.drawTextInLayer(this.scoreLayer , "SCORE", "10px Arial", "#FF0000", 10, 10);

        this.playersBallLayer = game.display.createLayer("joueursetballe", this.groundWidth, this.groundHeight,
            this.divGame, 2, undefined, 10, 50);
        game.display.drawTextInLayer(this.playersBallLayer, "JOUEURSETBALLE", "10px Arial", "#FF0000",
            100, 100);

        this.displayScore(0,0);

        this.ball.initImage(10,10);
        this.displayBall(200,200);

        this.playerOne.initImage(15,70);
        this.playerTwo.initImage(15,70);
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
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer1, "50pt DS-DIGIB",
            "#FFFFFF", this.scorePosPlayer1,  55);
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer2, "50pt DS-DIGIB",
            "#FFFFFF", this.scorePosPlayer2, 55);
    },
    displayBall : function() {
        game.display.drawImageInLayer(this.playersBallLayer, this.ball.img, this.ball.posX, this.ball.posY);
    },
    displayPlayers : function() {
        game.display.drawImageInLayer(this.playersBallLayer, this.playerOne.img, this.playerOne.posX,
            this.playerOne.posY);
        game.display.drawImageInLayer(this.playersBallLayer, this.playerTwo.img, this.playerTwo.posX,
            this.playerTwo.posY);
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
                game.playerOne.posY-=5;
            } else if ( game.playerOne.goDown ) {
                game.playerOne.posY+=5;
            }
        } else if ( game.control.controlSystem == "MOUSE" ) {
            // mouse control
            if (game.playerOne.goUp && game.playerOne.posY > game.control.mousePointer)
                game.playerOne.posY-=5;
            else if (game.playerOne.goDown && game.playerOne.posY < game.control.mousePointer)
                game.playerOne.posY+=5;
        }
    },
    initMouse : function(onMouseMoveFunction) {
        window.onmousemove = onMouseMoveFunction;
    },
    collideBallWithPlayersAndAction : function() {
        if ( this.ball.collide(game.playerOne) ) {
            this.changeBallPath(game.playerOne, game.ball);
            this.playerSound.play();
        }
        if ( this.ball.collide(game.playerTwo) ) {
            this.changeBallPath(game.playerTwo, game.ball);
            this.playerSound.play();
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
        var playerPositions = player.height/5;
        if ( ball.posY > player.posY && ball.posY < player.posY + playerPositions ) {
            returnValue = "TOP";
        } else if ( ball.posY >= player.posY + playerPositions && ball.posY < player.posY + playerPositions*2 ) {
            returnValue = "MIDDLETOP";
        } else if ( ball.posY >= player.posY + playerPositions*2 && ball.posY < player.posY +
            player.height - playerPositions ) {
            returnValue = "MIDDLEBOTTOM";
        } else if ( ball.posY >= player.posY + player.height - playerPositions && ball.posY < player.posY +
            player.height ) {
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
    }
};
