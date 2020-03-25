document.addEventListener("DOMContentLoaded", startGame);
let bird, myScore, myBackground, backgroundMusic;
let myObstacles = [];

function startGame() {
    document.getElementById("play").addEventListener("click", function () {
        myBackground = new Component(1000,400, "media/background.png", 0, 0, "background");
        bird = new Component(60, 40, "media/bird.png", 10, 120, "image");
        myScore = new Component("30px", "Consolas", "black", 280, 40, "text");
        backgroundMusic = new Sound("media/background.wav");
        backgroundMusic.play();
        SnappyBird.start();
    });

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

let SnappyBird = {
    canvas : document.createElement("canvas"),
    start : function () {
        this.canvas.width = 1000;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.getElementById("wrapper").appendChild(SnappyBird.canvas);
        this.frameNo = 0;
        this.interval = setInterval(UpdateGame, 20);
        window.addEventListener('keydown', function (e) {
            SnappyBird.key = e.key;
        });
        window.addEventListener('keyup', function () {
            SnappyBird.key = false;
        });
        this.score = 0;
        document.getElementById("play").style.display = "none";
    },
    clear : function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function () {
        clearInterval(this.interval);
        backgroundMusic.stop();
        alert("Game Over! Final Score: " + SnappyBird.score);
        document.getElementById("play").style.display = "block";
        myObstacles = [];
    }
};

function everyInterval(n) {
    return (SnappyBird.frameNo / n) % 1 === 0;

}

function Component(width, height, color, x, y, type) {
    let ctx, myLeft, myRight, myTop, myBottom, otherLeft, otherRight, otherTop, otherBottom, crash, rockBottom, hitTop, bottom = 360;
    this.type = type;
    if (type === "image" || type === "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.color = color;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0.05;
    this.gravitySpeed = 0;
    this.update = function (){
        ctx = SnappyBird.context;
        if (this.type === "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.x, this.y);
        }
        else if (type === "image" || type === "background") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            if (type === "background") {
                ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
            }
        }
        else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    this.newPos = function () {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitTop();
        this.hitBottom();
        if (this.type === "background") {
            if (this.x === -(this.width)) {
                this.x = 0;
                this.y = 0;
            }
        }
    };
    this.hitBottom = function() {
        rockBottom = SnappyBird.canvas.height - this.height;
        if (this.y >= rockBottom) {
            this.y = rockBottom;
            this.gravitySpeed = 0;
            if (this.y === bottom) {
                SnappyBird.stop();
            }
        }
    };
    this.hitTop = function () {
        hitTop = 0;
        if (this.y <= hitTop) {
            this.y = hitTop;
            this.gravitySpeed = 0;
        }
    };
    this.crashWith = function(otherObj) {
        myLeft = this.x;
        myRight = this.x + (this.width);
        myTop = this.y;
        myBottom = this.y + (this.height);
        otherLeft = otherObj.x;
        otherRight = otherObj.x + (otherObj.width);
        otherTop = otherObj.y;
        otherBottom = otherObj.y + (otherObj.height);

        crash = !((myBottom < otherTop) ||
            (myTop > otherBottom) ||
            (myRight < otherLeft) ||
            (myLeft > otherRight));
        return crash;
    }
}

function accelerate(n) {
    bird.gravity = n;
}

function UpdateGame() {
    let x, minHeight, maxHeight, height, minGap, maxGap, gap;
    for (let i = 0; i < myObstacles.length; i += 1) {
        if (bird.crashWith(myObstacles[i])) {
            SnappyBird.stop();
            return;
        }
    }
    SnappyBird.clear();
    SnappyBird.frameNo += 1;
    myBackground.speedX = -1;
    myBackground.newPos();
    myBackground.update();
    if (SnappyBird.frameNo === 1 || everyInterval(150)) {
        x = SnappyBird.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 70;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new Component(30, height, "green", x, 0));
        myObstacles.push(new Component(30, x - height - gap, "green", x, height + gap));
    }
    for (let i = 0; i < myObstacles.length; i++) {
        myObstacles[i].x += -1;
        if (myObstacles[i].x === 5) {
            SnappyBird.score++;
            myScore.text = "SCORE: " + SnappyBird.score;
            myScore.update();
        }
        myObstacles[i].update();
    }

    myScore.text = "SCORE: " + SnappyBird.score;
    myScore.update();

    if (SnappyBird.key && SnappyBird.key === "ArrowUp") {accelerate(-0.5);}
    if (SnappyBird.key && SnappyBird.key === "ArrowDown") {accelerate(0.2);}
    if (!SnappyBird.key) {accelerate(0.2)}

    bird.newPos();
    bird.update();
}