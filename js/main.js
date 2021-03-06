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
let board, turn, winner, slctStat, orgnlSelectedSquareClr, pieceType, ornglr, ornglc, check, pcheck, moveLcounter, row, cell1, cell2;

/*------ cached element references ------*/
const msgEl = document.getElementById("msg");
let table = document.getElementById('movelistTable');

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
    check = null;
    pcheck = true;
    slctStat = false;
    counter = 0;
    moveLcounter = 1;

    for(var i = 1;i<table.rows.length;){
        table.deleteRow(i);
    }

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
            if(cell === 0){
                td.innerHTML = '';
            }
        });
    });

    if(winner === 1) {
        msgEl.textContent = "Player Green has won. Click the Reset Button to Play Again.";
    }
    else if(winner === -1){
        msgEl.textContent = "Player Purple has won. Click the Reset Button to Play Again.";
    }
    else if(turn === 1 && check === true){
        msgEl.textContent = "Player Green's turn. You are currently in check."
    }
    else if(turn === -1 && check === true){
        msgEl.textContent = "Player Purple's turn. You are currently in check."
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
    let selectedSquare = document.getElementById(`r${rowIdx}c${colIdx}`);
  
    /*
         The if statement below checks the square that the user clicked to see if it is either empty
         or if it contains an opponent's piece. If one of these statements are true then the
         funtion will exit and no changes will be made.
    */
    if((selectedSquare.innerHTML === '' && slctStat === false) || (turn !== turn * -1 && Math.sign(board[8-rowIdx][colIdx-1]) === turn * -1 && slctStat === false )) {
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
            render();
            if(winner === 1 || winner === -1){
                slctStat = true;
            }
            else{
                slctStat = false;
            }
            return;
        }
        else if(selectedSquare.style.borderColor === 'rgb(251, 174, 210)' || selectedSquare.style.borderColor === 'rgb(255, 7, 58)'){
            board[8-rowIdx][colIdx-1] = pieceType * turn;
            if(PawnConversion(rowIdx,pieceType) === true){
                board[8-rowIdx][colIdx-1] = 3 * turn;
            }
            board[ornglr][ornglc] = 0;
            moveList(rowIdx,colIdx);
            turn*=-1;
            check = checkStatus();
            if(check === true){
               turn*=-1;
               render();
               turn*=-1;
               winner = CheckMate();
            }
            render();
            if(winner === 1 || winner === -1){
                slctStat = true;
            }
            else{
                slctStat = false;
            }
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
        ornglr = 8-rowIdx;
        ornglc = colIdx-1;
        pieceType = Math.abs(board[8-rowIdx][colIdx-1]);
        showPath(pieceType,rowIdx,colIdx);
        slctStat = true;
    }
}


/*
    The showPath function will display a path of highlighted squares that represent where the selected piece
    can be moved to. If one of these squares contain an opponent's piece then that square will be highlighted
    red. This function is called in the selectSquare function.
*/
function showPath(pt,rIdx,cIdx) {
    rIdx = parseInt(rIdx);
    cIdx = parseInt(cIdx);
    let path;
    let i;
    let c;
    let chck;
    let pType;
    /* The if statement below checks the value of pt which reprensents the type of piece
        that the square contains, in this case, a pawn.
     */
    if(pt === 1) {
        /* The if statement below checks the value of turn to see if it is equal to one
         so that the code inside of this if statement will only affect the green pawns.
        */
        if(Math.sign(turn) === 1) {
            /* The if statement below checks to see if the pawn is on row 2 */
            if(rIdx === 2) {
                /* The for loop below will create the path. The for loop exits if a piece is obstructing the path */
                for(i = rIdx +1; i<= rIdx + 2; i++) {
                    path = document.getElementById(`r${i}c${cIdx}`);
                    if(path.innerHTML !== '') {
                        break;
                    }
                    // The code in the if statement below will execute when the Green King is in check.
                    if(check === true || pcheck === true){
                        // The square being looked at now contains a pawn
                        board[8-i][cIdx-1] = 1;
                        // The selected square is now empty
                        board[8-rIdx][cIdx-1] = 0;
                        // checkStatus is used to see if the king is still in check with the new layout
                        chck = checkStatus();
                        // The code in the if statement below is executed if the Green King is still in check.
                        if(chck === true){
                            // The two squares are now set to their previous values, and
                            // the current iteration in the for loop is skipped.
                            board[8-i][cIdx-1] = 0;
                            board[8-rIdx][cIdx-1] = 1;
                            continue;
                        }
                        // The two squares are now set to their previous values.
                        board[8-i][cIdx-1] = 0;
                        board[8-rIdx][cIdx-1] = 1;
                    }
                    path.style.border = "4px solid #fbaed2";
                }
            }
            /* The else statement below is called when the pawn selected is not on row 2 */
            else{
                i = rIdx + 1;
                if(i > 8){
                    return;
                }
                path = document.getElementById(`r${i}c${cIdx}`);
                if(path.innerHTML !== ''){
                    // Do nothing
                }
                // The code in the else if statement below will execute when the Green King is in check.
                else if(check === true || pcheck === true){
                    // The square being looked at now contains a pawn
                    board[8-i][cIdx-1] = 1;
                    // The selected square is now empty
                    board[8-rIdx][cIdx-1] = 0;
                    // checkStatus is used to see if the king is still in check with the new layout
                    chck = checkStatus();
                    // The code in the if statement below is executed if the Green King is still in check.
                    if(chck === true){
                        // The two squares are now set to their previous values
                        board[8-i][cIdx-1] = 0;
                        board[8-rIdx][cIdx-1] = 1;
                    }
                    else{
                        // The two squares are now set to their previous values and
                        // the square being looked at is highlighted.
                        board[8-i][cIdx-1] = 0;
                        board[8-rIdx][cIdx-1] = 1;
                        path.style.border = "4px solid #fbaed2";
                    }
                }
                else{
                    path.style.border = "4px solid #fbaed2";
                }
            }
            /*  Lines 233 - 241 will highlight the two diagonally above squares red if they are
                occupied by an opponent's piece.
             */
            i = rIdx + 1;
            let leftTop = document.getElementById(`r${i}c${cIdx-1}`);
            let rightTop = document.getElementById(`r${i}c${cIdx+1}`);
            if(Math.sign(board[8-rIdx-1][cIdx-2]) === -1) {
                // The code in the if statement below will execute when the Green King is in check.
                if(check === true || pcheck === true){
                    // pieceType stores the value of the original piece
                    pType = board[8-rIdx-1][cIdx-2];
                    // The square being looked at now contains a pawn
                    board[8-rIdx-1][cIdx-2] = 1;
                    // The selected square is now empty
                    board[8-rIdx][cIdx-1] = 0;
                    // checkStatus is used to see if the king is still in check with the new layout
                    chck = checkStatus();
                    // The code in the if statement below is executed if the Green King is still in check.
                    if(chck === true){
                        // The two squares are now set to their previous values
                        board[8-rIdx-1][cIdx-2] = pType;
                        board[8-rIdx][cIdx-1] = 1;
                    }
                    else{
                        // The two squares are now set to their previous values
                        // and the selected square is highlighted.
                        board[8-rIdx-1][cIdx-2] = pType;
                        board[8-rIdx][cIdx-1] = 1;
                        leftTop.style.border = "4px solid #ff073a";
                    }
                }
                else{
                    leftTop.style.border = "4px solid #ff073a";
                }
            }
            if(Math.sign(board[8-rIdx-1][cIdx]) === -1) {
                // The code in the if statement below will execute when the Green King is in check.
                if(check === true || pcheck === true){
                    // pieceType stores the value of the original piece
                    pType = board[8-rIdx-1][cIdx];
                    // The square being looked at now contains a pawn
                    board[8-rIdx-1][cIdx] = 1;
                    // The selected square is now empty
                    board[8-rIdx][cIdx-1] = 0;
                    // checkStatus is used to see if the king is still in check with the new layout
                    chck = checkStatus();
                    // The code in the if statement below is executed if the Green King is still in check.
                    if(chck === true){
                        // The two squares are now set to their previous values
                        board[8-rIdx-1][cIdx] = pType;
                        board[8-rIdx][cIdx-1] = 1;
                    }
                    else{
                        // The two squares are now set to their previous values
                        // and the selected square is highlighted.
                        board[8-rIdx-1][cIdx] = pType;
                        board[8-rIdx][cIdx-1] = 1;
                        rightTop.style.border = "4px solid #ff073a";
                    }
                }
                else{
                    rightTop.style.border = "4px solid #ff073a";
                }
            }
        }
        /* The code in the esle statement below affects purple pawns */
        else{
            /* The if statement below checks to see if the pawn is on row 7 */
            if(rIdx === 7) {
                /* The for loop below will create the path. The for loop exits if a piece is obstructing the path */
                for(i = rIdx -1; i>= rIdx - 2; i--) {
                    path = document.getElementById(`r${i}c${cIdx}`);
                    if(path.innerHTML !== '') {
                        break;
                    }
                    // The code in the if statement below will execute when the Purple King is in check.
                    if(check === true || pcheck === true){
                        // The square being looked at now contains a pawn
                        board[8-i][cIdx-1] = -1;
                        // The selected square is now empty
                        board[8-rIdx][cIdx-1] = 0;
                        // checkStatus is used to see if the king is still in check with the new layout
                        chck = checkStatus();
                        // The code in the if statement below is executed if the Purple King is still in check.
                        if(chck === true){
                            // The two squares are now set to their previous values, and
                            // the current iteration in the for loop is skipped.
                            board[8-i][cIdx-1] = 0;
                            board[8-rIdx][cIdx-1] = -1;
                            continue;
                        }
                        // The two squares are now set to their previous values.
                        board[8-i][cIdx-1] = 0;
                        board[8-rIdx][cIdx-1] = -1;
                    }
                    path.style.border = "4px solid #fbaed2";
                }
            }
            /* The else statement below is called when the pawn selected is not on row 7 */
            else{
                i = rIdx - 1;
                if(i < 0){
                    return;
                }
                path = document.getElementById(`r${i}c${cIdx}`);
                if(path.innerHTML !== ''){
                    // Do nothing
                }
                // The code in the else if statement below will execute when the Green King is in check.
                else if(check === true || pcheck === true){
                    // The square being looked at now contains a pawn
                    board[8-i][cIdx-1] = -1;
                    // The selected square is now empty
                    board[8-rIdx][cIdx-1] = 0;
                    // checkStatus is used to see if the king is still in check with the new layout
                    chck = checkStatus();
                    // The code in the if statement below is executed if the Green King is still in check.
                    if(chck === true){
                        // The two squares are now set to their previous values
                        board[8-i][cIdx-1] = 0;
                        board[8-rIdx][cIdx-1] = -1;
                    }
                    else{
                        // The two squares are now set to their previous values and
                        // the square being looked at is highlighted.
                        board[8-i][cIdx-1] = 0;
                        board[8-rIdx][cIdx-1] = -1;
                        path.style.border = "4px solid #fbaed2";
                    }
                }
                else{
                    path.style.border = "4px solid #fbaed2";
                }
            }
            /*  Lines 270 - 278 will highlight the two diagonally bottom squares red if they are
                occupied by an opponent's piece.
             */
            i = rIdx - 1;
            let leftBottom = document.getElementById(`r${i}c${cIdx-1}`);
            let rightBottom = document.getElementById(`r${i}c${cIdx+1}`);
            if(Math.sign(board[8-rIdx+1][cIdx-2]) === 1) {
                // The code in the if statement below will execute when the Purple King is in check.
                if(check === true || pcheck === true){
                    // pieceType stores the value of the original piece
                    pType = board[8-rIdx+1][cIdx-2];
                    // The square being looked at now contains a pawn
                    board[8-rIdx+1][cIdx-2] = -1;
                    // The selected square is now empty
                    board[8-rIdx][cIdx-1] = 0;
                    // checkStatus is used to see if the king is still in check with the new layout
                    chck = checkStatus();
                    if(chck === true){
                        // The two squares are now set to their previous values
                        board[8-rIdx+1][cIdx-2] = pType;
                        board[8-rIdx][cIdx-1] = -1;
                    }
                    else{
                        // The two squares are now set to their previous values
                        // and the selected square is highlighted.
                        board[8-rIdx+1][cIdx-2] = pType;
                        board[8-rIdx][cIdx-1] = -1;
                        leftBottom.style.border = "4px solid #ff073a";
                    }
                }
                else{
                    leftBottom.style.border = "4px solid #ff073a";
                }
            }
            if(Math.sign(board[8-rIdx+1][cIdx]) === 1) {
                // The code in the if statement below will execute when the Purple King is in check.
                if(check === true || pcheck === true){
                    // pieceType stores the value of the original piece
                    pType = board[8-rIdx+1][cIdx];
                    // The square being looked at now contains a pawn
                    board[8-rIdx+1][cIdx] = -1;
                    // The selected square is now empty
                    board[8-rIdx][cIdx-1] = 0;
                    // checkStatus is used to see if the king is still in check with the new layout
                    chck = checkStatus();
                    // The code in the if statement below is executed if the Purple King is still in check.
                    if(chck === true){
                        // The two squares are now set to their previous values
                        board[8-rIdx+1][cIdx] = pType;
                        board[8-rIdx][cIdx-1] = -1;
                    }
                    else{
                        // The two squares are now set to their previous values
                        // and the selected square is highlighted.
                        board[8-rIdx+1][cIdx] = pType;
                        board[8-rIdx][cIdx-1] = -1;
                        rightBottom.style.border = "4px solid #ff073a";
                    }
                }
                else{
                    rightBottom.style.border = "4px solid #ff073a";
                }
            }
        }
    }
    /*
        The else if statement below checks the value of pt which represents the type of piece
        that the square contains, in this case, the king. 
    */
    else if(pt === 2){
        let leftTop = document.getElementById(`r${rIdx+1}c${cIdx-1}`);
        let left = document.getElementById(`r${rIdx}c${cIdx-1}`);
        let leftBottom = document.getElementById(`r${rIdx-1}c${cIdx-1}`);
        let rightBottom = document.getElementById(`r${rIdx-1}c${cIdx+1}`);
        let right = document.getElementById(`r${rIdx}c${cIdx+1}`);
        let rightTop = document.getElementById(`r${rIdx+1}c${cIdx+1}`);
        let top = document.getElementById(`r${rIdx+1}c${cIdx}`);
        let bottom = document.getElementById(`r${rIdx-1}c${cIdx}`);
        /* Lines 299 - 312 will highlight the bottom left square the appropriate color */
        if(leftBottom == undefined){
            // Do nothing
        }
        else {
            let ri = 8-rIdx+1;
            let ci = cIdx-2;
            let ks = kingSurrounding(ri, ci);
            if(ks === true){
                // Do nothing
            }
            else if(Math.sign(board[8-rIdx+1][cIdx-2]) === 0){
                leftBottom.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-rIdx+1][cIdx-2]) === turn){
                // Do nothing
            }
            else{
                leftBottom.style.border = "4px solid #ff073a";
            }
        }
        /* Lines 314 - 327 will highlight the left square the appropriate color */
        if(left == undefined){
            // Do nothing
        }
        else{
            let ri = 8-rIdx;
            let ci = cIdx-2;
            let ks = kingSurrounding(ri, ci);
            if(ks === true){
                // Do nothing
            }
            else if(Math.sign(board[8-rIdx][cIdx-2]) === 0){
                left.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-rIdx][cIdx-2]) === turn){
                // Do nothing
            }
            else{
                left.style.border = "4px solid #ff073a";
            }
        }
        /* Lines 329 - 342 will highlight the bottom right square the appropriate color */
        if(rightBottom == undefined){
            // Do nothing
        }
        else{
            let ri = 8-rIdx+1;
            let ci = cIdx;
            let ks = kingSurrounding(ri, ci);
            if(ks === true){
                // Do nothing
            }
            else if(Math.sign(board[8-rIdx+1][cIdx]) === 0){
                rightBottom.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-rIdx+1][cIdx]) === turn){
                // Do nothing
            }
            else{
                rightBottom.style.border = "4px solid #ff073a";
            }
        }
        /* Lines 344 - 357 will highlight the right square the appropriate color */
        if(right == undefined){
            // Do nothing
        }
        else{
            let ri = 8-rIdx;
            let ci = cIdx;
            let ks = kingSurrounding(ri, ci);
            if(ks === true){
                // Do nothing
            }
            else if(Math.sign(board[8-rIdx][cIdx]) === 0){
                right.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-rIdx][cIdx]) === turn){
                // Do nothing
            }
            else{
                right.style.border = "4px solid #ff073a";
            }
        }
        /* Lines 359 - 372 will highlight the bottom left square the appropriate color */
        if(bottom == undefined){
            // Do nothing
        }
        else{
            let ri = 8-rIdx+1;
            let ci = cIdx-1;
            let ks = kingSurrounding(ri, ci);
            if(ks === true){
                // Do nothing
            }
            else if(Math.sign(board[8-rIdx+1][cIdx-1]) === 0){
                bottom.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-rIdx+1][cIdx-1]) === turn){
                // Do nothing
            }
            else{
                bottom.style.border = "4px solid #ff073a";
            }
        }
        /* Lines 374 - 387 will highlight the top left square the appropriate color */
        if(leftTop == undefined){
            // Do nothing
        }
        else{
            let ri = 8-rIdx-1;
            let ci = cIdx-2;
            let ks = kingSurrounding(ri, ci);
            if(ks === true){
                // Do nothing
            }
            else if(Math.sign(board[8-rIdx-1][cIdx-2]) === 0){
                leftTop.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-rIdx-1][cIdx-2]) === turn){
                // Do nothing
            }
            else{
                leftTop.style.border = "4px solid #ff073a";
            }
        }
        /* Lines 389 - 402 will highlight the top right square the appropriate color */
        if(rightTop == undefined){
            // Do nothing
        }
        else{
            let ri = 8-rIdx-1;
            let ci = cIdx;
            let ks = kingSurrounding(ri, ci);
            if(ks === true){
                // Do nothing
            }
            else if(Math.sign(board[8-rIdx-1][cIdx]) === 0){
                rightTop.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-rIdx-1][cIdx]) === turn){
                // Do nothing
            }
            else{
                rightTop.style.border = "4px solid #ff073a";
            }
        }
        /* Lines 404 - 417 will highlight the top square the appropriate color */
        if(top == undefined){
            // Do nothing
        }
        else{
            let ri = 8-rIdx-1;
            let ci = cIdx-1;
            let ks = kingSurrounding(ri, ci);
            if(ks === true){
                // Do nothing
            }
            else if(Math.sign(board[8-rIdx-1][cIdx-1]) === 0){
                top.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-rIdx-1][cIdx-1]) === turn){
                // Do nothing
            }
            else{
                top.style.border = "4px solid #ff073a";
            }
            //kingSurrounding(ri,ci);
        }

    }
    /*
        The else if statement below checks the value of pt which represents the type of piece
        that the square contains, in this case, the queen. 
    */
    else if(pt === 3){
        // Squares above Queen
        for(i = rIdx+1; i<=8;i++){
            path = document.getElementById(`r${i}c${cIdx}`);
            if(Math.sign(board[8-i][cIdx-1]) === 0){
                if(check === true || pcheck === true){
                    board[8-i][cIdx-1] = 3*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][cIdx-1] = 0;
                        board[8-rIdx][cIdx-1] = 3*turn;
                        continue;
                    }
                    board[8-i][cIdx-1] = 0;
                    board[8-rIdx][cIdx-1] = 3*turn;
                }
                path.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-i][cIdx-1]) === turn){
                break;
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-i][cIdx-1];
                    board[8-i][cIdx-1] = 3*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][cIdx-1] = pType;
                        board[8-rIdx][cIdx-1] = 3*turn;
                    }
                    else{
                        board[8-i][cIdx-1] = pType;
                        board[8-rIdx][cIdx-1] = 3*turn;
                        path.style.border = "4px solid #ff073a";
                        break;
                    }
                }
                else{
                    path.style.border = "4px solid #ff073a";
                    break;
                }
            }
        }
        // Squares below Queen
        for(i = rIdx-1; i>=1;i--){
            path = document.getElementById(`r${i}c${cIdx}`);
            if(Math.sign(board[8-i][cIdx-1]) === 0){
                if(check === true || pcheck === true){
                    board[8-i][cIdx-1] = 3*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][cIdx-1] = 0;
                        board[8-rIdx][cIdx-1] = 3*turn;
                        continue;
                    }
                    board[8-i][cIdx-1] = 0;
                    board[8-rIdx][cIdx-1] = 3*turn;
                }
                path.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-i][cIdx-1]) === turn){
                break;
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-i][cIdx-1];
                    board[8-i][cIdx-1] = 3*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][cIdx-1] = pType;
                        board[8-rIdx][cIdx-1] = 3*turn;
                    }
                    else{
                        board[8-i][cIdx-1] = pType;
                        board[8-rIdx][cIdx-1] = 3*turn;
                        path.style.border = "4px solid #ff073a";
                        break;
                    }
                }
                else{
                    path.style.border = "4px solid #ff073a";
                    break;
                }
            }
        }
        // Squares to the right of Queen
        for(i = cIdx+1; i<=8; i++){
            path = document.getElementById(`r${rIdx}c${i}`);
            if(Math.sign(board[8-rIdx][i-1]) === 0){
                if(check === true || pcheck === true){
                    board[8-rIdx][i-1] = 3*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-rIdx][i-1] = 0;
                        board[8-rIdx][cIdx-1] = 3*turn;
                        continue;
                    }
                    board[8-rIdx][i-1] = 0;
                    board[8-rIdx][cIdx-1] = 3*turn;
                }
                path.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-rIdx][i-1]) === turn){
                break;
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-rIdx][i-1];
                    board[8-rIdx][i-1] = 3*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-rIdx][i-1] = pType;
                        board[8-rIdx][cIdx-1] = 3*turn;
                    }
                    else{
                        board[8-rIdx][i-1] = pType;
                        board[8-rIdx][cIdx-1] = 3*turn;
                        path.style.border = "4px solid #ff073a";
                        break;
                    }
                }
                else{
                    path.style.border = "4px solid #ff073a";
                    break;
                }
            }
        }
        // Squares to the left of Queen
        for(i= cIdx-1;i>=1;i--){
            path = document.getElementById(`r${rIdx}c${i}`);
            if(Math.sign(board[8-rIdx][i-1]) === 0){
                if(check === true || pcheck === true){
                    board[8-rIdx][i-1] = 3*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-rIdx][i-1] = 0;
                        board[8-rIdx][cIdx-1] = 3*turn;
                        continue;
                    }
                    board[8-rIdx][i-1] = 0;
                    board[8-rIdx][cIdx-1] = 3*turn;
                }
                path.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-rIdx][i-1]) === turn){
                break;
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-rIdx][i-1];
                    board[8-rIdx][i-1] = 3*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-rIdx][i-1] = pType;
                        board[8-rIdx][cIdx-1] = 3*turn;
                    }
                    else{
                        board[8-rIdx][i-1] = pType;
                        board[8-rIdx][cIdx-1] = 3*turn;
                        path.style.border = "4px solid #ff073a";
                        break;
                    }
                }
                else{
                    path.style.border = "4px solid #ff073a";
                    break;
                }
            }
        }
        // Upper right diagnal squares
        for(i = rIdx+1, c = cIdx+1; i<=8 && c<=8; i++,c++){
            path = document.getElementById(`r${i}c${c}`);
            if(Math.sign(board[8-i][c-1]) === 0){
                if(check === true || pcheck === true){
                    board[8-i][c-1] = 3*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][c-1] = 0;
                        board[8-rIdx][cIdx-1] = 3*turn;
                        continue;
                    }
                    board[8-i][c-1] = 0;
                    board[8-rIdx][cIdx-1] = 3*turn;
                }
                path.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-i][c-1]) === turn){
                break;
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-i][c-1];
                    board[8-i][c-1] = 3*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][c-1] = pType;
                        board[8-rIdx][cIdx-1] = 3*turn;
                    }
                    else{
                        board[8-i][c-1] = pType;
                        board[8-rIdx][cIdx-1] = 3*turn;
                        path.style.border = "4px solid #ff073a";
                        break;
                    }
                }
                else{
                    path.style.border = "4px solid #ff073a";
                    break;
                }
            }
        }
        // Upper left diagnal squares
        for(i = rIdx+1, c= cIdx-1; i<=8 && c>=1; i++,c--){
            path = document.getElementById(`r${i}c${c}`);
            if(Math.sign(board[8-i][c-1]) === 0){
                if(check === true || pcheck === true){
                    board[8-i][c-1] = 3*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][c-1] = 0;
                        board[8-rIdx][cIdx-1] = 3*turn;
                        continue;
                    }
                    board[8-i][c-1] = 0;
                    board[8-rIdx][cIdx-1] = 3*turn;
                }
                path.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-i][c-1]) === turn){
                break;
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-i][c-1];
                    board[8-i][c-1] = 3*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][c-1] = pType;
                        board[8-rIdx][cIdx-1] = 3*turn;
                    }
                    else{
                        board[8-i][c-1] = pType;
                        board[8-rIdx][cIdx-1] = 3*turn;
                        path.style.border = "4px solid #ff073a";
                        break;
                    }
                }
                else{
                    path.style.border = "4px solid #ff073a";
                    break;
                }
            }
        }
        // Bottom left diagonal squares
        for(i = rIdx-1, c = cIdx-1; i>=1 && c>=1; i--,c--){
            path = document.getElementById(`r${i}c${c}`);
            if(Math.sign(board[8-i][c-1]) === 0){
                if(check === true || pcheck === true){
                    board[8-i][c-1] = 3*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][c-1] = 0;
                        board[8-rIdx][cIdx-1] = 3*turn;
                        continue;
                    }
                    board[8-i][c-1] = 0;
                    board[8-rIdx][cIdx-1] = 3*turn;
                }
                path.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-i][c-1]) === turn){
                break;
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-i][c-1];
                    board[8-i][c-1] = 3*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][c-1] = pType;
                        board[8-rIdx][cIdx-1] = 3*turn;
                    }
                    else{
                        board[8-i][c-1] = pType;
                        board[8-rIdx][cIdx-1] = 3*turn;
                        path.style.border = "4px solid #ff073a";
                        break;
                    }
                }
                else{
                    path.style.border = "4px solid #ff073a";
                    break;
                }
            }
        }
        // Bottom right diagonal squares
        for(i = rIdx-1, c = cIdx+1; i>=1 && c<=8;i--,c++){
            path = document.getElementById(`r${i}c${c}`);
            if(Math.sign(board[8-i][c-1]) === 0){
                if(check === true || pcheck === true){
                    board[8-i][c-1] = 3*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][c-1] = 0;
                        board[8-rIdx][cIdx-1] = 3*turn;
                        continue;
                    }
                    board[8-i][c-1] = 0;
                    board[8-rIdx][cIdx-1] = 3*turn;
                }
                path.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-i][c-1]) === turn){
                break;
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-i][c-1];
                    board[8-i][c-1] = 3*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][c-1] = pType;
                        board[8-rIdx][cIdx-1] = 3*turn;
                    }
                    else{
                        board[8-i][c-1] = pType;
                        board[8-rIdx][cIdx-1] = 3*turn;
                        path.style.border = "4px solid #ff073a";
                        break;
                    }
                }
                else{
                    path.style.border = "4px solid #ff073a";
                    break;
                }
            }
        }

    }
    /*
        The else if statement below checks the value of pt which represents the type of piece
        that the square contains, in this case, the bishop. 
    */
    else if(pt === 4){
        // Upper right diagnal squares
        for(i = rIdx+1, c = cIdx+1; i<=8 && c<=8; i++,c++){
            path = document.getElementById(`r${i}c${c}`);
            if(Math.sign(board[8-i][c-1]) === 0){
                if(check === true || pcheck === true){
                    board[8-i][c-1] = 4*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][c-1] = 0;
                        board[8-rIdx][cIdx-1] = 4*turn;
                        continue;
                    }
                    board[8-i][c-1] = 0;
                    board[8-rIdx][cIdx-1] = 4*turn;
                }
                path.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-i][c-1]) === turn){
                break;
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-i][c-1];
                    board[8-i][c-1] = 4*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][c-1] = pType;
                        board[8-rIdx][cIdx-1] = 4*turn;
                    }
                    else{
                        board[8-i][c-1] = pType;
                        board[8-rIdx][cIdx-1] = 4*turn;
                        path.style.border = "4px solid #ff073a";
                        break;
                    }
                }
                else{
                    path.style.border = "4px solid #ff073a";
                    break;
                }
            }
        }
        // Upper left diagnal squares
        for(i = rIdx+1, c= cIdx-1; i<=8 && c>=1; i++,c--){
            path = document.getElementById(`r${i}c${c}`);
            if(Math.sign(board[8-i][c-1]) === 0){
                if(check === true || pcheck === true){
                    board[8-i][c-1] = 4*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][c-1] = 0;
                        board[8-rIdx][cIdx-1] = 4*turn;
                        continue;
                    }
                    board[8-i][c-1] = 0;
                    board[8-rIdx][cIdx-1] = 4*turn;
                }
                path.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-i][c-1]) === turn){
                break;
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-i][c-1];
                    board[8-i][c-1] = 4*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][c-1] = pType;
                        board[8-rIdx][cIdx-1] = 4*turn;
                    }
                    else{
                        board[8-i][c-1] = pType;
                        board[8-rIdx][cIdx-1] = 4*turn;
                        path.style.border = "4px solid #ff073a";
                        break;
                    }
                }
                else{
                    path.style.border = "4px solid #ff073a";
                    break;
                }
            }
        }
        // Bottom left diagonal squares
        for(i = rIdx-1, c = cIdx-1; i>=1 && c>=1; i--,c--){
            path = document.getElementById(`r${i}c${c}`);
            if(Math.sign(board[8-i][c-1]) === 0){
                if(check === true || pcheck === true){
                    board[8-i][c-1] = 4*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][c-1] = 0;
                        board[8-rIdx][cIdx-1] = 4*turn;
                        continue;
                    }
                    board[8-i][c-1] = 0;
                    board[8-rIdx][cIdx-1] = 4*turn;
                }
                path.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-i][c-1]) === turn){
                break;
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-i][c-1];
                    board[8-i][c-1] = 4*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][c-1] = pType;
                        board[8-rIdx][cIdx-1] = 4*turn;
                    }
                    else{
                        board[8-i][c-1] = pType;
                        board[8-rIdx][cIdx-1] = 4*turn;
                        path.style.border = "4px solid #ff073a";
                        break;
                    }
                }
                else{
                    path.style.border = "4px solid #ff073a";
                    break;
                }
            }
        }
        // Bottom right diagonal squares
        for(i = rIdx-1, c = cIdx+1; i>=1 && c<=8;i--,c++){
            path = document.getElementById(`r${i}c${c}`);
            if(Math.sign(board[8-i][c-1]) === 0){
                if(check === true || pcheck === true){
                    board[8-i][c-1] = 4*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][c-1] = 0;
                        board[8-rIdx][cIdx-1] = 4*turn;
                        continue;
                    }
                    board[8-i][c-1] = 0;
                    board[8-rIdx][cIdx-1] = 4*turn;
                }
                path.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-i][c-1]) === turn){
                break;
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-i][c-1];
                    board[8-i][c-1] = 4*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][c-1] = pType;
                        board[8-rIdx][cIdx-1] = 4*turn;
                    }
                    else{
                        board[8-i][c-1] = pType;
                        board[8-rIdx][cIdx-1] = 4*turn;
                        path.style.border = "4px solid #ff073a";
                        break;
                    }
                }
                else{
                    path.style.border = "4px solid #ff073a";
                    break;
                }
            }
        }
    }
    /*
        The else if statement below checks the value of pt which represents the type of piece
        that the square contains, in this case, the knight. 
    */
    else if(pt === 5){
        let rightTop = document.getElementById(`r${rIdx+2}c${cIdx+1}`);
        let rightMid = document.getElementById(`r${rIdx+1}c${cIdx+2}`);
        let rightBMid = document.getElementById(`r${rIdx-1}c${cIdx+2}`);
        let rightBottom = document.getElementById(`r${rIdx-2}c${cIdx+1}`);
        let leftTop = document.getElementById(`r${rIdx+2}c${cIdx-1}`);
        let leftMid = document.getElementById(`r${rIdx+1}c${cIdx-2}`);
        let leftBMid = document.getElementById(`r${rIdx-1}c${cIdx-2}`);
        let leftBottom = document.getElementById(`r${rIdx-2}c${cIdx-1}`);

        if(leftBottom == undefined){
            // Do nothing
        }
        else{
            if(Math.sign(board[8-rIdx+2][cIdx-2]) === 0){
                if(check === true || pcheck === true){
                    board[8-rIdx+2][cIdx-2] = 5*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-rIdx+2][cIdx-2] = 0;
                        board[8-rIdx][cIdx-1] = 5*turn;
                    }
                    else{
                        board[8-rIdx+2][cIdx-2] = 0;
                        board[8-rIdx][cIdx-1] = 5*turn;
                        leftBottom.style.border = "4px solid #fbaed2";
                    }
                }
                else{
                    leftBottom.style.border = "4px solid #fbaed2";
                }
            }
            else if(Math.sign(board[8-rIdx+2][cIdx-2]) === turn){
                // Do nothing
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-rIdx+2][cIdx-2];
                    board[8-rIdx+2][cIdx-2] = 5*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-rIdx+2][cIdx-2] = pType;
                        board[8-rIdx][cIdx-1] = 5*turn;
                    }
                    else{
                        board[8-rIdx+2][cIdx-2] = pType;
                        board[8-rIdx][cIdx-1] = 5*turn;
                        leftBottom.style.border = "4px solid #ff073a";
                    }
                }
                else{
                    leftBottom.style.border = "4px solid #ff073a";
                }
            }
        }

        if(leftBMid == undefined){
            // Do nothing
        }
        else{
            if(Math.sign(board[8-rIdx+1][cIdx-3]) === 0){
                if(check === true || pcheck === true){
                    board[8-rIdx+1][cIdx-3] = 5*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-rIdx+1][cIdx-3] = 0;
                        board[8-rIdx][cIdx-1] = 5*turn;
                    }
                    else{
                        board[8-rIdx+1][cIdx-3] = 0;
                        board[8-rIdx][cIdx-1] = 5*turn;
                        leftBMid.style.border = "4px solid #fbaed2";
                    }
                }
                else{
                    leftBMid.style.border = "4px solid #fbaed2";
                }
            }
            else if(Math.sign(board[8-rIdx+1][cIdx-3]) === turn){
                // Do nothing
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-rIdx+1][cIdx-3];
                        board[8-rIdx+1][cIdx-3] = 5*turn;
                        board[8-rIdx][cIdx-1] = 0;
                        chck = checkStatus();
                        if(chck === true){
                            board[8-rIdx+1][cIdx-3] = pType;
                            board[8-rIdx][cIdx-1] = 5*turn;
                        }
                        else{
                            board[8-rIdx+1][cIdx-3] = pType;
                            board[8-rIdx][cIdx-1] = 5*turn;
                            leftBMid.style.border = "4px solid #ff073a";
                        }
                }
                else{
                    leftBMid.style.border = "4px solid #ff073a";
                }
            }
        }

        if(leftMid == undefined){
            // Do nothing
        }
        else{
            if(Math.sign(board[8-rIdx-1][cIdx-3]) === 0){
                if(check === true || pcheck === true){
                    board[8-rIdx-1][cIdx-3] = 5*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-rIdx-1][cIdx-3] = 0;
                        board[8-rIdx][cIdx-1] = 5*turn;
                    }
                    else{
                        board[8-rIdx-1][cIdx-3] = 0;
                        board[8-rIdx][cIdx-1] = 5*turn;
                        leftMid.style.border = "4px solid #fbaed2";
                    }
                }
                else{
                    leftMid.style.border = "4px solid #fbaed2";
                }
            }
            else if(Math.sign(board[8-rIdx-1][cIdx-3]) === turn){
                // Do nothing
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-rIdx-1][cIdx-3];
                    board[8-rIdx-1][cIdx-3] = 5*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-rIdx-1][cIdx-3] = pType;
                        board[8-rIdx][cIdx-1] = 5*turn;
                    }
                    else{
                        board[8-rIdx-1][cIdx-3] = pType;
                        board[8-rIdx][cIdx-1] = 5*turn;
                        leftMid.style.border = "4px solid #ff073a";
                    }
                }
                else{
                    leftMid.style.border = "4px solid #ff073a";
                }
            }
        }

        if(leftTop == undefined){
            // Do nothing
        }
        else{
            if(Math.sign(board[8-rIdx-2][cIdx-2]) === 0){
                if(check === true || pcheck === true){
                    board[8-rIdx-2][cIdx-2] = 5*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-rIdx-2][cIdx-2] = 0;
                        board[8-rIdx][cIdx-1] = 5*turn;
                    }
                    else{
                        board[8-rIdx-2][cIdx-2] = 0;
                        board[8-rIdx][cIdx-1] = 5*turn;
                        leftTop.style.border = "4px solid #fbaed2";
                    }
                }
                else{
                    leftTop.style.border = "4px solid #fbaed2";
                }
            }
            else if(Math.sign(board[8-rIdx-2][cIdx-2]) === turn){
                // Do nothing
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-rIdx-2][cIdx-2];
                        board[8-rIdx-2][cIdx-2] = 5*turn;
                        board[8-rIdx][cIdx-1] = 0;
                        chck = checkStatus();
                        if(chck === true){
                            board[8-rIdx-2][cIdx-2] = pType;
                            board[8-rIdx][cIdx-1] = 5*turn;
                        }
                        else{
                            board[8-rIdx-2][cIdx-2] = pType;
                            board[8-rIdx][cIdx-1] = 5*turn;
                            leftTop.style.border = "4px solid #ff073a";
                        }
                }
                else{
                    leftTop.style.border = "4px solid #ff073a";
                }
            }
        }

        if(rightTop == undefined){
            // Do nothing
        }
        else{
            if(Math.sign(board[8-rIdx-2][cIdx]) === 0){
                if(check === true || pcheck === true){
                    board[8-rIdx-2][cIdx] = 5*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-rIdx-2][cIdx] = 0;
                        board[8-rIdx][cIdx-1] = 5*turn;
                    }
                    else{
                        board[8-rIdx-2][cIdx] = 0;
                        board[8-rIdx][cIdx-1] = 5*turn;
                        rightTop.style.border = "4px solid #fbaed2";
                    }
                }
                else{
                    rightTop.style.border = "4px solid #fbaed2";
                }
            }
            else if(Math.sign(board[8-rIdx-2][cIdx]) === turn){
                // Do nothing
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-rIdx-2][cIdx];
                    board[8-rIdx-2][cIdx] = 5*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-rIdx-2][cIdx] = pType;
                        board[8-rIdx][cIdx-1] = 5*turn;
                    }
                    else{
                        board[8-rIdx-2][cIdx] = pType;
                        board[8-rIdx][cIdx-1] = 5*turn;
                        rightTop.style.border = "4px solid #ff073a";
                    }
                }
                else{
                    rightTop.style.border = "4px solid #ff073a";
                }
            }
        }

        if(rightMid == undefined){
            // Do nothing
        }
        else{
            if(Math.sign(board[8-rIdx-1][cIdx+1]) === 0){
                if(check === true || pcheck === true){
                    board[8-rIdx-1][cIdx+1] = 5*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-rIdx-1][cIdx+1] = 0;
                        board[8-rIdx][cIdx-1] = 5*turn;
                    }
                    else{
                        board[8-rIdx-1][cIdx+1] = 0;
                        board[8-rIdx][cIdx-1] = 5*turn;
                        rightMid.style.border = "4px solid #fbaed2";
                    }
                }
                else{
                    rightMid.style.border = "4px solid #fbaed2";
                }
            }
            else if(Math.sign(board[8-rIdx-1][cIdx+1]) === turn){
                // Do nothing
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-rIdx-1][cIdx+1];
                        board[8-rIdx-1][cIdx+1] = 5*turn;
                        board[8-rIdx][cIdx-1] = 0;
                        chck = checkStatus();
                        if(chck === true){
                            board[8-rIdx-1][cIdx+1] = pType;
                            board[8-rIdx][cIdx-1] = 5*turn;
                        }
                        else{
                            board[8-rIdx-1][cIdx+1] = pType;
                            board[8-rIdx][cIdx-1] = 5*turn;
                            rightMid.style.border = "4px solid #ff073a";
                        }
                }
                else{
                    rightMid.style.border = "4px solid #ff073a";
                }
            }
        }

        if(rightBMid == undefined){
            // Do nothing
        }
        else{
            if(Math.sign(board[8-rIdx+1][cIdx+1]) === 0){
                if(check === true || pcheck === true){
                    board[8-rIdx+1][cIdx+1] = 5*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-rIdx+1][cIdx+1] = 0;
                        board[8-rIdx][cIdx-1] = 5*turn;
                    }
                    else{
                        board[8-rIdx+1][cIdx+1] = 0;
                        board[8-rIdx][cIdx-1] = 5*turn;
                        rightBMid.style.border = "4px solid #fbaed2";
                    }
                }
                else{
                    rightBMid.style.border = "4px solid #fbaed2";
                }
            }
            else if(Math.sign(board[8-rIdx+1][cIdx+1]) === turn){
                // Do nothing
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-rIdx+1][cIdx+1];
                    board[8-rIdx+1][cIdx+1] = 5*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-rIdx+1][cIdx+1] = pType;
                        board[8-rIdx][cIdx-1] = 5*turn;
                    }
                    else{
                        board[8-rIdx+1][cIdx+1] = pType;
                        board[8-rIdx][cIdx-1] = 5*turn;
                        rightBMid.style.border = "4px solid #ff073a";
                    }
                }
                else{
                    rightBMid.style.border = "4px solid #ff073a";
                }
            }
        }

        if(rightBottom == undefined){
            // Do nothing
        }
        else{
            if(Math.sign(board[8-rIdx+2][cIdx]) === 0){
                if(check === true || pcheck === true){
                    board[8-rIdx+2][cIdx] = 5*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-rIdx+2][cIdx] = 0;
                        board[8-rIdx][cIdx-1] = 5*turn;
                    }
                    else{
                        board[8-rIdx+2][cIdx] = 0;
                        board[8-rIdx][cIdx-1] = 5*turn;
                        rightBottom.style.border = "4px solid #fbaed2";
                    }
                }
                else{
                    rightBottom.style.border = "4px solid #fbaed2";
                }
            }
            else if(Math.sign(board[8-rIdx+2][cIdx]) === turn){
                // Do nothing
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-rIdx+2][cIdx];
                    board[8-rIdx+2][cIdx] = 5*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-rIdx+2][cIdx] = pType;
                        board[8-rIdx][cIdx-1] = 5*turn;
                    }
                    else{
                        board[8-rIdx+2][cIdx] = pType;
                        board[8-rIdx][cIdx-1] = 5*turn;
                        rightBottom.style.border = "4px solid #ff073a";
                    }
                }
                else{
                    rightBottom.style.border = "4px solid #ff073a";
                }
            }
        }
    }
    /* The else statement below creates the path for the rook */
    else if(pt === 6) {
        // Squares above Rook
        for(i = rIdx+1; i<=8;i++){
            path = document.getElementById(`r${i}c${cIdx}`);
            if(Math.sign(board[8-i][cIdx-1]) === 0){
                if(check === true || pcheck === true){
                    board[8-i][cIdx-1] = 6*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][cIdx-1] = 0;
                        board[8-rIdx][cIdx-1] = 6*turn;
                        continue;
                    }
                    board[8-i][cIdx-1] = 0;
                    board[8-rIdx][cIdx-1] = 6*turn;
                }
                path.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-i][cIdx-1]) === turn){
                break;
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-i][cIdx-1];
                    board[8-i][cIdx-1] = 6*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][cIdx-1] = pType;
                        board[8-rIdx][cIdx-1] = 6*turn;
                    }
                    else{
                        board[8-i][cIdx-1] = pType;
                        board[8-rIdx][cIdx-1] = 6*turn;
                        path.style.border = "4px solid #ff073a";
                        break;
                    }
                }
                else{
                    path.style.border = "4px solid #ff073a";
                    break;
                }
            }
        }
        // Squares below Rook
        for(i = rIdx-1; i>=1;i--){
            path = document.getElementById(`r${i}c${cIdx}`);
            if(Math.sign(board[8-i][cIdx-1]) === 0){
                if(check === true || pcheck === true){
                    board[8-i][cIdx-1] = 6*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][cIdx-1] = 0;
                        board[8-rIdx][cIdx-1] = 6*turn;
                        continue;
                    }
                    board[8-i][cIdx-1] = 0;
                    board[8-rIdx][cIdx-1] = 6*turn;
                }
                path.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-i][cIdx-1]) === turn){
                break;
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-i][cIdx-1];
                    board[8-i][cIdx-1] = 6*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-i][cIdx-1] = pType;
                        board[8-rIdx][cIdx-1] = 6*turn;
                    }
                    else{
                        board[8-i][cIdx-1] = pType;
                        board[8-rIdx][cIdx-1] = 6*turn;
                        path.style.border = "4px solid #ff073a";
                        break;
                    }
                }
                else{
                    path.style.border = "4px solid #ff073a";
                    break;
                }
            }
        }
        // Squares to the right of Rook
        for(i = cIdx+1; i<=8; i++){
            path = document.getElementById(`r${rIdx}c${i}`);
            if(Math.sign(board[8-rIdx][i-1]) === 0){
                if(check === true || pcheck === true){
                    board[8-rIdx][i-1] = 6*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-rIdx][i-1] = 0;
                        board[8-rIdx][cIdx-1] = 6*turn;
                        continue;
                    }
                    board[8-rIdx][i-1] = 0;
                    board[8-rIdx][cIdx-1] = 6*turn;
                }
                path.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-rIdx][i-1]) === turn){
                break;
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-rIdx][i-1];
                    board[8-rIdx][i-1] = 6*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-rIdx][i-1] = pType;
                        board[8-rIdx][cIdx-1] = 6*turn;
                    }
                    else{
                        board[8-rIdx][i-1] = pType;
                        board[8-rIdx][cIdx-1] = 6*turn;
                        path.style.border = "4px solid #ff073a";
                        break;
                    }
                }
                else{
                    path.style.border = "4px solid #ff073a";
                    break;
                }
            }
        }
        // Squares to the left of Rook
        for(i= cIdx-1;i>=1;i--){
            path = document.getElementById(`r${rIdx}c${i}`);
            if(Math.sign(board[8-rIdx][i-1]) === 0){
                if(check === true || pcheck === true){
                    board[8-rIdx][i-1] = 6*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-rIdx][i-1] = 0;
                        board[8-rIdx][cIdx-1] = 6*turn;
                        continue;
                    }
                    board[8-rIdx][i-1] = 0;
                    board[8-rIdx][cIdx-1] = 6*turn;
                }
                path.style.border = "4px solid #fbaed2";
            }
            else if(Math.sign(board[8-rIdx][i-1]) === turn){
                break;
            }
            else{
                if(check === true || pcheck === true){
                    pType = board[8-rIdx][i-1];
                    board[8-rIdx][i-1] = 6*turn;
                    board[8-rIdx][cIdx-1] = 0;
                    chck = checkStatus();
                    if(chck === true){
                        board[8-rIdx][i-1] = pType;
                        board[8-rIdx][cIdx-1] = 6*turn;
                    }
                    else{
                        board[8-rIdx][i-1] = pType;
                        board[8-rIdx][cIdx-1] = 6*turn;
                        path.style.border = "4px solid #ff073a";
                        break;
                    }
                }
                else{
                    path.style.border = "4px solid #ff073a";
                    break;
                }
            }
        }
    }
}

/* This function will check to see if any of the kings are in danger
   Not finished yet */
function checkStatus(){
    let r;
    let c;
    let bool;
    let kingRow;
    let kingCol;

    for(r = 0; r<8;r++){
        for(c = 0; c<8;c++){
            if(board[r][c] === 2*turn){
                kingRow = r;
                kingCol = c;
                r = 9;
                break;
            }
        }
    }
    bool = kingSurrounding(kingRow,kingCol);
    if(bool === true) return true;
    else return false;
}

/* This function will prevent the king from moving to a square
   that is in the path of an opponent's piece 
*/
function kingSurrounding(rIdx,cIdx){
    let r;
    let c;
    let oppntPc = false;
    let kingNear = false;

   // Check for pawns.
   // The code in the if statement below only affects the Green King
   if(turn === 1){
       // The if statement below prevents out of bounds error
       if(rIdx-1 < 0){
           // Do nothing
       }
       else{
           if(board[rIdx-1][cIdx-1] === -1 || board[rIdx-1][cIdx+1] === -1){
           return true;
          }
       }
    }
    // The code in the else statement below only affects the Purple King
    else{
        // The if statement below prevents out of bounds error
        if(rIdx+1 > 7){
            // Do nothing
        }
        else{
            if(board[rIdx+1][cIdx-1] === 1 || board[rIdx+1][cIdx+1] === 1){
                return true;
            }
        }
    }

    // Check for knights
    if(rIdx-2 < 0 || cIdx-1 < 0){
        // Do nothing
    }
    else{
        if(board[rIdx-2][cIdx-1] === 5*turn*-1) return true;
    }
    if(rIdx-1 < 0 || cIdx-2 < 0){
        // Do nothing
    }
    else{
        if(board[rIdx-1][cIdx-2] === 5*turn*-1) return true;     
    }
    if(rIdx+1 > 7 || cIdx-2 < 0){
        // Do Nothing
    }
    else{
        if(board[rIdx+1][cIdx-2] === 5*turn*-1) return true;
    }
    if(rIdx+2 > 7 || cIdx-1 < 0){
        // Do nothing
    }
    else{
        if(board[rIdx+2][cIdx-1] === 5*turn*-1) return true;
    }
    if(rIdx-2 < 0 || cIdx+1 > 7){
        // Do Nothing
    }
    else{
        if(board[rIdx-2][cIdx+1] === 5*turn*-1) return true;
    }
    if(rIdx-1 < 0 || cIdx+2 > 7){
        // Do nothing
    }
    else{
        if(board[rIdx-1][cIdx+2] === 5*turn*-1) return true;
    }
    if(rIdx+1 > 7 || cIdx+2 > 7){
        // Do Nothing
    }
    else{
        if(board[rIdx+1][cIdx+2] === 5*turn*-1) return true;
    }
    if(rIdx+2 > 7 || cIdx+1 > 7){
        // Do Nothing
    }
    else{
        if(board[rIdx+2][cIdx+1] === 5*turn*-1) return true;
    }

    // Check for enemy king
    let k = kingNby(rIdx,cIdx,turn*-1);
    if(k === true) return true;
   

   // Check for Queen and Rooks on to the right of the king
   for(c = cIdx;c<8;c++){
       // If statement below allows king to capture piece that is right next to it
       if((board[rIdx][c] === 3*turn*-1 || board[rIdx][c] === 6*turn*-1) && c === cIdx){
            // Do nothing
       }
       // The else if statement below if the square being looked at contains an enemy Queen or a Rook
       else if(board[rIdx][c] === 3*turn*-1 || board[rIdx][c] === 6*turn*-1){
           if(oppntPc === true){
               kingNear = kingNby(rIdx,cIdx,turn);
               // The if statement below checks to see if the square next to the king contains an enemy piece
               if(kingNear === true && Math.sign(board[rIdx][cIdx]) === -1*turn){
                   oppntPc = false;
                   return true;
               }
               else{
                   // Do nothing
               }
           }
           else{
               return true;
           }
       }
       // The else if statement below checks to see if the current square contains a friendly piece that is not the King
       else if(Math.sign(board[rIdx][c]) === turn && board[rIdx][c] !== 2*turn){
           break;
       }
       // The else if statement below checks if the current square contains an enemy piece
       else if(Math.sign(board[rIdx][c]) === -1*turn){
         if(oppntPc === false){
                oppntPc = true;
        }
        else if(oppntPc === true){
            break;
        }
    }
   }

   oppntPc = false;
   // Check for Queen and Rooks on to the left of the square
   for(c = cIdx; c>=0; c--){
       if((board[rIdx][c] === 3*turn*-1 || board[rIdx][c] === 6*turn*-1) && c === cIdx){
           // Do nothing
       }
       else if(board[rIdx][c] === 3*turn*-1 || board[rIdx][c] === 6*turn*-1){
           if(oppntPc === true){
               kingNear = kingNby(rIdx,cIdx,turn);
               if(kingNear === true && Math.sign(board[rIdx][cIdx]) === -1*turn){
                   oppntPc = false;
                   kingNear = false;
                   return true;
               }
               else{
                   // Do nothing
               }
           }
           else{
               return true;
           }
       }
       else if(Math.sign(board[rIdx][c]) === turn  && board[rIdx][c] !== 2*turn){
           break;
       }
       else if(Math.sign(board[rIdx][c]) === -1*turn){
           if(oppntPc === false){
               oppntPc = true;
           }
           else if(oppntPc === true){
               break;
           }
    }
}
    oppntPc = false;
   // Check for Queen and Rooks above
   for(r = rIdx; r>=0; r--){
       if((board[r][cIdx] === 3*turn*-1 || board[r][cIdx] === 6*turn*-1) && r === rIdx){
           // Do nothing
       }
       else if(board[r][cIdx] === 3*turn*-1 || board[r][cIdx] === 6*turn*-1){
           if(oppntPc === true){
               kingNear = kingNby(rIdx,cIdx,turn);
               if(kingNear === true && Math.sign(board[rIdx][cIdx]) === -1*turn){
                   oppntPc = false;
                   return true;
               }
               else{
                   // Do nothing
               }
           }
           else{
               return true;
           }
       }
       else if(Math.sign(board[r][cIdx]) === turn && board[r][cIdx] !== 2*turn){
           break;
       }
       else if(Math.sign(board[r][cIdx]) === -1*turn){
           if(oppntPc === false){
               oppntPc = true;
           }
           else if(oppntPc === true){
               break;
           }
       }
   }
   oppntPc = false;
   // Check for Queen and Rooks below
   for(r = rIdx; r<8; r++){
        if((board[r][cIdx] === 3*turn*-1 || board[r][cIdx] === 6*turn*-1) && r === rIdx){
            // Do nothing
        }
        else if(board[r][cIdx] === 3*turn*-1 || board[r][cIdx] === 6*turn*-1){
            if(oppntPc === true){
                kingNear = kingNby(rIdx,cIdx,turn);
                if(kingNear === true && Math.sign(board[rIdx][cIdx]) === -1*turn){
                    oppntPc = false;
                    return true;
                }
                else{
                    // Do nothing
                }
            }
            else{
                return true;
            }
        }
        else if(Math.sign(board[r][cIdx]) === turn && board[r][cIdx] !== 2*turn){
            break;
        }
        else if(Math.sign(board[r][cIdx]) === -1*turn){
            if(oppntPc === false){
                oppntPc = true;
            }
            else if(oppntPc === true){
                break;
            }
        }
    }
    oppntPc = false;
  // Check for Queen and Bishops in the upper right
  for(r = rIdx, c = cIdx; r>=0 && c<=8; r--,c++){
        if((board[r][c] === 3*turn*-1 || board[r][c] === 4*turn*-1) && r === rIdx){
         // Do nothing
        }
        else if(board[r][c] === 3*turn*-1 || board[r][c] === 4*turn*-1){
         if(oppntPc === true){
             kingNear = kingNby(rIdx,cIdx,turn);
             if(kingNear === true && Math.sign(board[rIdx][cIdx]) === -1*turn){
                 oppntPc = false;
                 return true;
             }
             else{
                 // Do nothing
             }
         }
         else{
             return true;
         }
        }
        else if(Math.sign(board[r][c]) === turn && board[r][c] !== 2*turn){
         break;
        }
        else if(Math.sign(board[r][c]) === -1*turn){
            if(oppntPc === false){
                oppntPc = true;
            }
            else if(oppntPc === true){
                break;
            }
        }
    }
    oppntPc = false;
 // Check for Queen and Bishops in the upper left
 for(r = rIdx, c= cIdx; r>=0 && c>=0; r--,c--){
        if((board[r][c] === 3*turn*-1 || board[r][c] === 4*turn*-1) && r === rIdx){
            // Do nothing
        }
        else if(board[r][c] === 3*turn*-1 || board[r][c] === 4*turn*-1){
            if(oppntPc === true){
                kingNear = kingNby(rIdx,cIdx,turn);
                if(kingNear === true && Math.sign(board[rIdx][cIdx]) === -1*turn){
                    oppntPc = false;
                    return true;
                }
                else{
                    // Do nothing
                }
            }
            else{
                return true;
            }
        }
        else if(Math.sign(board[r][c]) === turn && board[r][c] !== 2*turn){
            break;
        }
        else if(Math.sign(board[r][c]) === -1*turn){
           if(oppntPc === false){
               oppntPc = true;
           }
           else if(oppntPc === true){
               break;
           }
        }
    }
    oppntPc = false;
 //Check for Queen and Bishops in the bottom right
 for(r = rIdx, c = cIdx; r<8 && c<8; r++,c++){
        if((board[r][c] === 3*turn*-1 || board[r][c] === 4*turn*-1) && r === rIdx){
            // Do nothing
        }
        else if(board[r][c] === 3*turn*-1 || board[r][c] === 4*turn*-1){
            if(oppntPc === true){
                kingNear = kingNby(rIdx,cIdx,turn);
                if(kingNear === true && Math.sign(board[rIdx][cIdx]) === -1*turn){
                    oppntPc = false;
                    return true;
                }
                else{
                    // Do nothing
                }
            }
            else{
                return true;
            }
        }
        else if(Math.sign(board[r][c]) === turn && board[r][c] !== 2*turn){
            break;
        }
         else if(Math.sign(board[r][c]) === -1*turn){
           if(oppntPc === false){
               oppntPc = true;
           }
           else if(oppntPc === true){
               break;
           }
        }
    }
    oppntPc = false;
 // Check for Queen and Bishops in the bottom left
 for(r = rIdx, c = cIdx; r<8 && c>=0; r++,c--){
        if((board[r][c] === 3*turn*-1 || board[r][c] === 4*turn*-1) && r === rIdx){
            // Do nothing
        }
        else if(board[r][c] === 3*turn*-1 || board[r][c] === 4*turn*-1){
            if(oppntPc === true){
                kingNear = kingNby(rIdx,cIdx,turn);
                if(kingNear === true && Math.sign(board[rIdx][cIdx]) === -1*turn){
                    oppntPc = false;
                    return true;
                }
                else{
                    // Do nothing
                }
            }
            else{
                return true;
            }
         }
        else if(Math.sign(board[r][c]) === turn && board[r][c] !== 2*turn){
            break;
         }
        else if(Math.sign(board[r][c]) === -1*turn){
           if(oppntPc === false){
               oppntPc = true;
           }
           else if(oppntPc === true){
               break;
           }
        }
    }
}

/* This function is called in the kingSurrounding function
    and will be used to check if there is a king next
    to an occupied square.
*/
function kingNby(r,c,t){
    // If king is directly to the right
    if(c > 7){
        // Do nothing
    }
    else{
        if(board[r][c+1] === 2*t) return true;
    }

    // If king is directly to the upper right
    if(r-1 < 0 || c+1 > 7){
        // Do Nothing
    }
    else{
        if(board[r-1][c+1] === 2*t) return true;
    }

    // If king is directly above
    if(r-1 < 0){
        // Do nothing
    }
    else{
        if(board[r-1][c] === 2*t) return true;

    }

    // If king is directly to the upper left
    if(r-1 < 0 || c-1 < 0){
        // Do Nothing
    }
    else{
        if(board[r-1][c-1] === 2*t) return true;
    }

    // If king is directly to the left
    if(c-1 < 0){
        // Do Nothing
    }
    else{
        if(board[r][c-1] === 2*t) return true;
    }

    // If king is directly to the bottom left
    if(r+1 > 7 || c-1 < 0){
        // Do Nothing
    }
    else{
        if(board[r+1][c-1] === 2*t) return true;
    }

    // If king is directly to the bottom
    if(r+1 > 7){
        // Do Nothing
    }
    else{
        if(board[r+1][c] === 2*t) return true;
    }

    // If king is directly to the bottom right
    if(r+1 > 7 || c+1 > 7){
        // Do Nothing
    }
    else{
        if(board[r+1][c+1] === 2*t) return true;
    }

    return false;
}

function CheckMate() {
    let row;
    let col;
    let s;
    let rparam;
    let cparam;
    let ptype;
    console.log("Current turn: " + turn);
    for(row = 0; row<8; row++){
        for(col = 0; col<8; col++){
            if(Math.sign(board[row][col]) === turn){
                ptype = Math.abs(board[row][col]);
                rparam = 8 - row;
                cparam = col + 1;
                showPath(ptype,rparam,cparam);
            }
        }
    }

    for(row = 0; row<8; row++){
        for(col = 0; col<8; col++){
            s = document.getElementById(`r${8-row}c${col+1}`);
            if(s.style.borderColor === 'rgb(251, 174, 210)' || s.style.borderColor === 'rgb(255, 7, 58)'){
                return null;
            }
        }
    }

    return turn * -1;
}

function PawnConversion(r,p){
    if(p !== 1) return false;
    else{
        if(turn === 1 && 8-r === 0){
            return true;
        }
        else if(turn === -1 && 8-r === 7){
            return true;
        }
    }
    return false;
}

function moveList(r,c) {
    if(turn === 1){
        row = table.insertRow(-1);
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell1.innerHTML = `${moveLcounter}. ${LETTERS[c]}${r}`;
    }
    else{
        cell2.innerHTML = `${LETTERS[c]}${r}`;
        moveLcounter++;
    }
}

function reset() {
    init();
}