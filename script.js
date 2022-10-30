
const tiles = document.querySelectorAll(".tile");
const PLAYER_X = "X";
const PLAYER_O = "O";
let turn = PLAYER_X;

// This creates an array of 9 items as there are 9 elements that have the class "tile" and we've captured these by using querySelector
const boardState = Array(tiles.length);
boardState.fill(null);

// ELEMENTS
const strike = document.getElementById("strike");
const gameOverArea = document.getElementById("game-over-area");
const gameOverText = document.getElementById("game-over-text");
const playAgain = document.getElementById("play-again");
// Listening out whether to start a new game 
playAgain.addEventListener("click", startNewGame);

// CREATING VARIABLES TO REFERENCE THE SOUNDS
const gameOverSound = new Audio("sounds/game_over.wav");
const clickSound  = new Audio ("sounds/click.wav");

// LOOPING THROUGH EACH TILE - when the tile is clicked, the "tileClick" function is called
tiles.forEach(tile => addEventListener("click", tileClick));

// This will add the hover text for the current turn 
function setHoverText() {
    //remove all hover text - looping over the tiles 
    tiles.forEach(tile => {
        tile.classList.remove("x-hover")
        tile.classList.remove("o-hover")
    });

    // Template literals provide an easy way to interpolate variables and expressions into strings.
    const hoverClass = `${turn.toLowerCase()}-hover`;

    // When you hover over a tile, you can see whether it is X or O's turn to play
    tiles.forEach(tile => {
        if (tile.innerText == ""){
            tile.classList.add(hoverClass)
        }
    });
}


function tileClick(event){
    // If the gameOverArea is visible, the function will stop executing
    if (gameOverArea.classList.contains("visible")) {
        return;
    }

    // Represents the tile that got clicked ie: the event
    const tile = event.target;
    const tileNumber = tile.dataset.index;
    if (tile.innerText = "" ) {
        // This will exit the if statement
        return; 
    }

    // Changing/Updating the tile content depending on who played
    if (turn === PLAYER_X) {
        tile.innerText = PLAYER_X;
        boardState[tileNumber - 1] = PLAYER_X;
        turn = PLAYER_O;
    } else {
        tile.innerText = PLAYER_O;
        // Updating the array
        boardState[tileNumber - 1] = PLAYER_O;
        turn = PLAYER_X;
    }

    clickSound.play();

    // Must be called here, so that the program can switch between players (hover for X, X plays, hover for O)
    setHoverText();
    checkWinner();
}

// CHECKING THE WINNER - will use a data structure (an array) ahead of time and determine which strikethrough to use
function checkWinner() {
    for (const winningCombination of winningCombinations) {
        // Object destructuting - extracting the combo and strikeClass from the chosen object from array 
        // This is a neater way of extracting our chosen values 
        const {combo, strikeClass} = winningCombination;
        // We always do "-1" to extract the actual item in the array (zero-indexed)
        // We're finding the position on the board, not an array value 
        const tileValue1 = boardState[combo[0]-1];
        const tileValue2 = boardState[combo[1]-1];
        const tileValue3 = boardState[combo[2]-1];

        if (tileValue1 != null && tileValue1 === tileValue2 && tileValue1 === tileValue3) {
            strike.classList.add(strikeClass)
            // Outputting to the user who the winner is 
            gameOverScreen(tileValue1);
            // This exits the if statment before getting to the code to check for a draw
            return;
        }       

        // Check for a draw 
        // This will check that if every tile is filled but does not equal a winning combination, we output to the screen 
        const allTilesFilledIn = boardState.every((tile) => tile !== null);
        if (allTilesFilledIn){
            // Passing in null so we can get the "Draw!" text outputted 
            gameOverScreen(null);
        }
    }

}

function gameOverScreen(winnerText) {
    let text = "Draw!";
    if (winnerText != null) {
        text = `Winner is ${winnerText}!`;
    }
    // Manipulating the DOM to show the text of who won onto the screen
    gameOverArea.className = "visible";
    gameOverText.innerText = text;
    gameOverSound.play();
}

function startNewGame() {
    // Refreshing/clearing previous values of elements 
    // We're clearing whatever was there before and replacing it with "strike"
    strike.className = "strike;"
    gameOverArea.className = "hidden";
    boardState.fill(null);
    tiles.forEach((tile) => (tile.innerText= ""));
    turn = PLAYER_X;
    setHoverText();
}

const winningCombinations = [
    // what is the winning combination : which strikthrough to use 

    // rows
    {combo:[1, 2, 3], strikeClass: "strike-row-1"},
    {combo:[4, 5, 6], strikeClass: "strike-row-2"}, 
    {combo:[7, 8, 9], strikeClass: "strike-row-3"}, 
    // columns 
    {combo:[1, 4, 7], strikeClass: "strike-column-1"}, 
    {combo:[2, 5, 8], strikeClass: "strike-column-2"}, 
    {combo:[3, 6, 9], strikeClass: "strike-column-3"}, 
    // diagonals 
    {combo:[1, 5, 9], strikeClass: "strike-diagonal-1"}, 
    {combo:[3, 5, 7], strikeClass: "strike-diagonal-2"},
];