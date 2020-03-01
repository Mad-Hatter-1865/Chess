/*----- constants -----*/
const LETTERS = {
    '1' : 'a',
    '2' : 'b',
    '3' : 'c',
    '4' : 'd',
    '5' : 'e',
    '6' : 'f',
    '7' : 'g',
    '8' : 'h'
};

const PLAYERS = {
    '1' : 'Green',
    '-1' : 'Purple'
};

/*----- app's state (variables) ------*/
let board, turn, winner, slctStat, orgnlSelectedSquareClr;

/*------ cached element references ------*/
const msgEl = document.getElementById("msg");

/* ------- event listeners --------*/
document.querySelector('table.board').addEventListener('click',selectSquare);
/*-------- functions -------*/
init();
function init() {
    board = [
        [-6,-5,-4,-3,-2,-4,-5,-6],
        [-1,-1,-1,-1,-1,-1,-1,-1],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1],
        [6,5,4,3,2,4,5,6]
    ];

    turn = 1;
    winner = null;
    slctStat = false;
    render();
}

function render() {
    board.forEach(function(rowArr, rowidx){
        rowArr.forEach(function(cell, colidx){
            let td = document.getElementById(`r${8-rowidx}c${1+colidx}`);
            let currRow = 8 - rowidx;
            let currCol = 1 + colidx;

            /*
              Lines 57 through 72 will check currRow and currCol(The two variables represent the indexes of the 
              board array) and determine the correct border color of the variable td(Variable represents
              a square on the board) based off the values of currRow and currCol.
            */
            if(currRow % 2) {
                if(!(currCol % 2)) {
                    td.style.borderColor = '#0eecb3';
                }
                else {
                    td.style.borderColor = '#bc13fe'
                }
            }
            else{
                if(currCol % 2){
                    td.style.borderColor = '#0eecb3';
                }
                else {
                    td.style.borderColor = '#bc13fe'
                }
            }

            if(cell === 1) {
                td.innerHTML = "<img src='images/Pawn.png' width=25 height=25 name='pieces'>";
            }
            if(cell === -1) {
                td.innerHTML = "<img src='images/Pawn2.png' width=25 height=25 name='pieces'>";
            }
            if(cell === 2) {
                td.innerHTML = "<img src='images/King.png' width=35 height=35 name='pieces'>";
            }
            if(cell === -2) {
                td.innerHTML = "<img src='images/King2.png' width=35 height=35 name='pieces'>";
            }
            if(cell === 3) {
                td.innerHTML = "<img src='images/Queen.png' width=35 height=35 name='pieces'>";
            }
            if(cell === -3) {
                td.innerHTML = "<img src='images/Queen2.png' width=35 height=35 name='pieces'>";
            }
            if(cell === 4) {
                td.innerHTML = "<img src='images/Bishop.png' width=30 height=30 name='pieces'>";
            }
            if(cell === -4) {
                td.innerHTML = "<img src='images/Bishop2.png' width=30 height=30 name='pieces'>";
            }
            if(cell === 5) {
                td.innerHTML = "<img src='images/Knight.png' width=30 height=30 name='pieces'>";
            }
            if(cell === -5) {
                td.innerHTML = "<img src='images/Knight2.png' width=30 height=30 name='pieces'>";
            }
            if(cell === 6) {
                td.innerHTML = "<img src='images/Rook.png' width=30 height=30 name='pieces'>";
            }
            if(cell === -6) {
                td.innerHTML = "<img src='images/Rook2.png' width=30 height=30 name='pieces'>";
            }
        });
    });

    if(winner === 1) {
        msgEl.textContent = "Player Green has won. Click the Reset Button to Play Again.";
    }
    else if(winner === -1){
        msgEl.textContent = "Player Purple has won. Click the Reset Button to Play Again.";
    }
    else {
        msgEl.textContent = `Player ${PLAYERS[turn]}'s Turn`;
    }
}

/*
    The selectSquare function allows the player to select one of their pieces by clicking the 
    square that contains that piece(Once a square has been clicked, the border of that square will be highlighted), 
    and allows the player to deselect a piece by clicking on the square that is currently selected.
*/
function selectSquare(evt) {
    let rowIdx = evt.target.id[1];
    let colIdx = evt.target.id[3];
    let pieceType;
    let selectedSquare = document.getElementById(`r${rowIdx}c${colIdx}`);
    /*
         The if statement below checks the square that the user clicked to see if it is either empty
         or if it contains an opponent's piece. If one of these statements are true then the
         funtion will exit and no changes will be made.
    */
    if(selectedSquare.innerHTML === '' || (turn !== turn * -1 && Math.sign(board[8-rowIdx][colIdx-1]) === turn * -1 )) {
        return;
    }
    /*
        If the player did not select an empty square or a square that is occupied by an opponent's piece, meaning
        that the player clicked on a square that contains one of their pieces, then the else if statement below
        will check to see if the value of the variable named slctStat is equal to true.(slctStat is equal to true
        when there is a square currently selected, and false when one is is not.)
    */
    else if(slctStat === true){
        /* 
            The if statement below checks if the player clicked on the square that is currently selected by checking 
            the border color of the square. If this is true then the border color will be set to green or purple 
            depending on the value of orgnlSelectedSquareClr. slcStat will be set to false, and the function will 
            exit. This the deselect logic for the function.
        */
        if(selectedSquare.style.borderColor === 'rgb(245, 53, 170)') {
            selectedSquare.style.borderColor = orgnlSelectedSquareClr;
            slctStat = false;
            return;
        }
        /*
             If the player clicks on one of their squares that is not currently selected then no changes will be made
             and the funtion will exit. This prevents the player from being able to have multiple pieces selected at 
             the same time.
        */
        else {
            return;
        }
    }
    /*
         The else statement below is called when the player clicks one of their squares when there is not a 
         square currently selected. The square that is clicked will have its border highlighted and its 
         original border color will be stored. slctStat is now true. 
    */
    else{
        orgnlSelectedSquareClr = selectedSquare.style.borderColor;
        selectedSquare.style.border = "4px solid #f535aa";
        pieceType = Math.abs(board[8-rowIdx][colIdx-1]);
        console.log(pieceType);
        slctStat = true;
    }
}


function reset() {
    init();
}