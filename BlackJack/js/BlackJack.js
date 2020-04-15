document.getElementById("play").addEventListener("click", function () {
    let canvas, ctx, ballRadius, x, y, dx, dy, paddleHeight, paddleWidth, paddleX, brickRowCount, brickColumnCount,
        brickWidth, brickHeight, brickPadding, brickOffsetTop, brickOffsetLeft, score, lives, ballColor;
    canvas = document.getElementById("breakoutCanvas");
    ctx = canvas.getContext("2d");
    ballRadius = 10;
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = Math.floor(Math.random() * 7) + 5; // Initial Speed
    dy = -5;
    paddleHeight = 10;
    paddleWidth = 100;
    paddleX = (canvas.width - paddleWidth) / 2;
    brickRowCount = 9;
    brickColumnCount = 5;
    brickWidth = 75;
    brickHeight = 20;
    brickPadding = 10;
    brickOffsetTop = 30;
    brickOffsetLeft = 30;
    score = 0;
    lives = 3;
    ballColor = 0;

    let bricks = [];
    for (let column = 0; column < brickColumnCount; column++) {
        bricks[column] = [];
        for (let row = 0; row < brickRowCount; row++) {
            bricks[column][row] = {x: 0, y: 0, status: 1};
        }
    }

    document.addEventListener("mousemove", mouseMoveHandler, false);

    function mouseMoveHandler(e) {
        let relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    function drawBall(num = 0) {
        let ballColor = ["red", "blue", "green", "yellow"];
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = ballColor[num];
        ctx.fill();
        ctx.closePath();
    }


    // Detects collisions with the bricks
    function collisionDetection() {
        for (let column = 0; column < brickColumnCount; column++) {
            for (let row = 0; row < brickRowCount; row++) {
                let brickElement = bricks[column][row];
                if (brickElement.status === 1) {
                    if (x > brickElement.x && x < brickElement.x + brickWidth && y > brickElement.y && y < brickElement.y + brickHeight) {
                        dy = -dy + .5;
                        brickElement.status = 0;
                        ballColor = Math.floor(Math.random() * 5);
                        score = score + 2;
                        if (score === ((brickRowCount * brickColumnCount) * 2)) {
                            if (lives === 3) {
                                alert("Perfect Game! No lives lost. You Won!")
                            } else if (lives === 2) {
                                alert("Great Job you only lost one life! You Won!")
                            } else {
                                alert("That was a close one, you only had 1 life left! You Won!")
                            }
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "White";
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        let brickColor = ["red", "blue", "yellow", "green", "purple"];
        for (let column = 0; column < brickColumnCount; column++) {
            for (let row = 0; row < brickRowCount; row++) {
                if (bricks[column][row].status === 1) {
                    let brickX = (row * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (column * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[column][row].x = brickX;
                    bricks[column][row].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = brickColor[column];
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function drawScore() {
        ctx.font = "18px Arial";
        ctx.fillStyle = "White";
        ctx.fillText("Score: " + score, 8, 20);
    }

    function drawLives() {
        ctx.font = "18px Arial";
        ctx.fillStyle = "White";
        ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall(ballColor);
        drawPaddle();
        drawScore();
        drawLives();
        collisionDetection();
        // Detects collisions with the edge of the canvas
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        // Detects hitting ceiling
        if (y + dy < ballRadius) {
            dy = -dy;
        }
        // If not hitting bottom
        else if (y + dy > canvas.height - ballRadius) {
            // if hitting inside of the paddles width
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            // Hit bottom, decrease life by 1
            else {
                lives--;
                if (!lives) {
                    alert("Game Over! Sorry better luck next time :) Final Score was: " + score + " points");
                    document.location.reload();
                }
                // Start back over in center of screen if lives remain
                else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dy = -5;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }
        x += dx;
        y += dy;
        requestAnimationFrame(draw);
    }

    draw();
});
