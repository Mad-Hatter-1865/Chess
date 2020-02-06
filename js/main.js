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
let board, turn, winner;

/*------ cached element references ------*/
const msgEl = document.getElementById("msg");

/* ------- event listeners --------*/
document.querySelector('table.board').addEventListener('click',selectPiece);
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

function selectPiece(evt) {
    let rowIdx = evt.target.id[1];
    let colIdx = evt.target.id[3];
    let selectedSquare = document.getElementById(`r${rowIdx}c${colIdx}`);
    console.log(selectedSquare);
}