// Grabs the tabContent for the specific game and passes it to another method
function getGameDescription(game) {
    switch (game) {
        case "SnappyBird":
            var tabContent = document.getElementById("gameTab1");
            openGameDescription(tabContent, game);
            break;
        case "BreakOut":
            var tabContent = document.getElementById("gameTab2");
            openGameDescription(tabContent, game);
            break;
        case "Snake":
            var tabContent = document.getElementById("gameTab3");
            openGameDescription(tabContent, game);
            break;
    }
}

// Sets the current tab content to visible, hides the other content, and sets the button to the active class for styling
function openGameDescription(tabContent, game) {
    let content, button, active;
    tabContent.style.display = "block";
    content = document.getElementsByClassName('tabContent');
    for (i = 0;i<content.length;i++) {
        if (content[i].id !== tabContent.id) {
            content[i].style.display = "none";
        }
    }
    button = document.getElementsByClassName("tabLink");
    for (i = 0; i < button.length; i++) {
        if (button[i].id !== game.id) {
            button[i].classList.remove("active");
        }
    }
    active = document.getElementById(game);
    active.className += " active";
}

// General Event Listener for the Tab Buttons on index page
document.querySelectorAll('.tabLink').forEach(button => button.addEventListener('click', function () {
    getGameDescription(button.id);
}));

function playGame(playGame) {
    switch (playGame) {
        case "PlayGame1":
            window.location.href = "SnappyBird/SnappyBird.html";
            break;
        case "PlayGame2":
            window.location.href = "BreakOut/BreakOut.html";
            break;
        case "PlayGame3":
            window.location.href = "Snake/Snake.html";
            break;
    }
}

// Event Listener for the play buttons
document.querySelectorAll('button').forEach(playButton => playButton.addEventListener('click', function() {
    playGame(playButton.id);
}));