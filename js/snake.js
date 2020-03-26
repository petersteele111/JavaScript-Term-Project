$(function () {

    var canvas = $('#canvas')[0];
    var ctx = canvas.getContext("2d");
    var width = $('#canvas').width();
    var height = $('#canvas').height();
    var cellWidth = 10;
    var direction;
    var snakeFood;
    var score;
    var snakeArray;

    $('#canvas').hide();

    $('#play').click(BeginGame);

    function BeginGame() {
        $('#canvas').show();
        $('#startImage').hide();
        direction = "right";
        createSnake();
        createFood();
        score = 0;

        backgroundMusic = new Sound("media/snake_music.wav");
        backgroundMusic.play();

        if (typeof gameStart != "undefined") clearInterval(gameStart);
        gameStart = setInterval(draw, 60);
        $('#play').hide();
    }

    function Sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.setAttribute("loop", "true");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
            this.sound.play().then(function () { console.log("Looks like sound is working")}).catch(function () {
                console.log("Chrome is dumb, and requires some kind of action to start the background music first");
            });
        };
        this.stop = function(){
            this.sound.pause();
        };
    }

    function createSnake() {
        var snakeLength = 3;
        snakeArray = [];
        for (var i = snakeLength - 1; i >= 0; i--) {
            snakeArray.push({x:i, y:0});
        }
    }

    function createFood() {
        snakeFood = {
            x:Math.round(Math.random()*(width - cellWidth)/cellWidth),
            y:Math.round(Math.random()*(height - cellWidth)/cellWidth),
        }
    }

    function draw() {
        ctx.fillStyle = "Black";
        ctx.fillRect(0,0, width, height);
        ctx.strokeStyle = "White";
        ctx.strokeRect(0, 0, width, height);

        var mX = snakeArray[0].x;
        var mY = snakeArray[0].y;

        if(direction === "right") mX++;
        else if(direction === "left") mX--;
        else if(direction === "up") mY--;
        else if(direction === "down") mY++;

        if(mX === -1 || mX === width/cellWidth || mY === -1 || mY === height/cellWidth || checkCollision(mX, mY, snakeArray))
        {
            GameOver();
            $('#play').html("Play Again").show();
            
        }

        if(mX === snakeFood.x && mY === snakeFood.y)
        {
            var snakeTail = {x: mX, y: mY};
            score++;
            createFood();
        }
        else
        {
            var snakeTail = snakeArray.pop();
            snakeTail.x = mX; snakeTail.y = mY;
        }

        snakeArray.unshift(snakeTail);

        for(var i = 0; i < snakeArray.length; i++)
        {
            var c = snakeArray[i];
            drawCell(c.x, c.y);
        }

        var scoreText = "Score: " + score;
        ctx.font = "18px Arial";
        ctx.fillText(scoreText, 5, height-5);
        drawFood(snakeFood.x, snakeFood.y);
    }

    function drawCell(x, y)
    {
        ctx.fillStyle = "White";
        ctx.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
        ctx.strokeStyle = "black";
        ctx.strokeRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
    }

    function drawFood(x, y)
    {
        ctx.fillStyle = "Red";
        ctx.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
    }

    function checkCollision(x, y, array) {

        for(var i = 0; i < array.length; i++)
        {
            if(array[i].x === x && array[i].y === y)
                return true;
        }
        return false;
    }

    $(document).keydown(function(e){
        var key = e.which;
        if(key == "37" && direction != "right") direction = "left";
        else if(key == "38" && direction != "down") direction = "up";
        else if(key == "39" && direction != "left") direction = "right";
        else if(key == "40" && direction != "up") direction = "down";
    });

    function GameOver() {
        backgroundMusic.stop();
        $('#gameOver').text("Game Over! Final Score: " + score);
        $("#dialog" ).dialog({
            modal: true,
            buttons: {
                Ok: function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    }
});
