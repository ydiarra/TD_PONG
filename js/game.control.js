game.control = {
    controlSystem : null,
    mousePointer:null,

    onKeyDown : function(event) {
        if ( event.keyCode == game.keycode.KEYDOWN ) {
            game.control.controlSystem = "KEYBOARD";

            game.playerOne.goDown = true;
        } else if ( event.keyCode == game.keycode.KEYUP ) {
            game.control.controlSystem = "KEYBOARD";

            game.playerOne.goUp = true;
        }
        if ( event.keyCode == game.keycode.SPACEBAR && !game.ball.inGame && game.gameOn && game.playerOne.service ) {
            game.ball.inGame = true;
            if ( game.playerOne.originalPosition === "right" ) {
                console.log(game.playerOne.originalPosition,game.ball.inGame);
                game.ball.inGame = true;
                game.ball.sprite.posX = game.playerOne.sprite.posX - game.playerOne.sprite.width-10;
                game.ball.sprite.posY = game.playerOne.sprite.posY+game.playerOne.sprite.height/2;
                game.ball.directionX = -1;
                game.ball.directionY = 1;
            } else {
                console.log(game.playerOne.originalPosition,game.ball.inGame );
                game.ball.inGame = true;
                game.ball.sprite.posX = game.playerOne.sprite.posX + game.playerOne.sprite.width+10;
                game.ball.sprite.posY = game.playerOne.sprite.posY+game.playerOne.sprite.height/2;
                game.ball.directionX = 1;
                game.ball.directionY = 1;
            }
        }
    },

    onKeyUp : function(event) {
        if ( event.keyCode == game.keycode.KEYDOWN   ) {
            game.playerOne.goDown = false;
        } else if ( event.keyCode == game.keycode.KEYUP ) {
            game.playerOne.goUp = false;

        }
    },
    onMouseMove : function(event) {

        game.control.controlSystem = "MOUSE";

        let mon_element = document.getElementById('blocToCenter');
        console.log(elementPosition(mon_element));
        if ( event ) {
            game.control.mousePointer = event.clientY-conf.MOUSECORRECTIONPOSY-elementPosition(mon_element);
        }

        if ( game.control.mousePointer > game.playerOne.sprite.posY
            && game.gameOn
            && game.control.controlSystem == "MOUSE"
            && game.playerOne.sprite.posY < conf.GROUNDLAYERHEIGHT - game.playerOne.sprite.height) {
            game.playerOne.goDown = true;
            game.playerOne.goUp = false;
        } else if ( game.control.mousePointer < game.playerOne.sprite.posY
            && game.gameOn
            && game.control.controlSystem == "MOUSE"
            && game.playerOne.sprite.posY > 0) {
            game.playerOne.goUp = true;
            game.playerOne.goDown = false;

        } else {
            game.playerOne.goDown = false;
            game.playerOne.goUp = false;
        }
    },

    onStartGameClickButton : function() {
        if ( !game.gameOn ) {

            game.reinitGame();

            game.gameOn = true;

        }
    },
    drawImageInLayer : function(targetLayer, image, x, y) {
    },
    onPauseGameClickButton : function() {
        if ( game.gameOn ) {
            game.gameOn = false;
            game.pauseGameButton.style.display = 'none';
            game.continueGameButton.style.display = 'inline';
        }
    },

    onContinueGameClickButton : function() {
        if ( !game.gameOn ) {
            game.gameOn = true;
            game.pauseGameButton.style.display = 'inline';
            game.continueGameButton.style.display = 'none';
        }
    }
};
function elementPosition (a) {
    return a.offsetTop ;

}
