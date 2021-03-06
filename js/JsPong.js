(function () {
    // début du code isolé

    let requestAnimId;
    let initialisation = ()=> {
        // le code de l'initialisation

        //changement d'init pour savoir si IA ou pas
        game.init();


        requestAnimId = window.requestAnimationFrame(main); // premier appel de main au rafraîchissement de la page
        socket.emit('nbreConnection');
    };
    let main = ()=> {
        // le code du jeu
        game.clearLayer(game.playersBallLayer);
        game.movePlayers();
        //envoyer ça position
        if((game.playerOne.goDown || game.playerOne.goUp)&&(game.playerTwo.IdSocket!==null)){
            console.log('je suis passé par la ');
            socket
                .emit('Position',{
                    'Destinataire':game.NomPartieMulti,
                    'Position':game.playerOne.sprite.posY,
                });
            //console.log(game.playerOne.goDown , game.playerOne.goUp);
        }
        game.displayPlayers();
        game.moveBall();
        if ( game.teamOne.service)
            socket
                .emit('balle',{
                    'Destinataire':game.NomPartieMulti,
                    'Balle':game.ball
                });
        if ( game.ball.inGame ){
            game.lostBall();

        }


        if (game.playerTwo.ai)
            game.ai.move();
        game.collideBallWithPlayersAndAction();
        requestAnimId = window.requestAnimationFrame(main); // rappel de main au prochain rafraîchissement de la page
    };
    window.onload = initialisation; // appel de la fonction initialisation au chargement de la page
    // fin du code isolé

})();
