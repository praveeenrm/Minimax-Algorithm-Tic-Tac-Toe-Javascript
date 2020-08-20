var originalBoard;
const humanPlayer = 'X';
const computerPlayer = 'O';
const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7 ,8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const boxes = document.querySelectorAll('.box');
const endgame = document.querySelector('.endgame');
const restartButton = document.querySelector('button');
restartButton.addEventListener('click', startGame);
const text = document.querySelector('.text');

// Main Start Function
startGame();

function startGame() {
    endgame.style.display = 'none';
    originalBoard = Array.from(Array(9).keys())
    // originalBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].innerText = "";
        boxes[i].style.backgroundColor = 'white';
        boxes[i].addEventListener('click', turnClick);
    }
}

// Changing Turn's function
function turnClick(event) {
    if (typeof originalBoard[event.target.id] == 'number') {
        playerTurnAndComputerTurn(event.target.id, humanPlayer);
        if (!checkTie()) playerTurnAndComputerTurn(bestSpot(), computerPlayer);
    }
}

// Player and Computer Turn function
function playerTurnAndComputerTurn(id, player) {
    originalBoard[id] = player;
    boxes[id].innerText = player;
    let gameWon = checkWin(originalBoard, player);
    if (gameWon) gameOver(gameWon);
}

// Check for winning function
function checkWin(board, player) {
    gameWon = null;
    let plays = board.reduce((total, currentValue, currentIndex) => {
        // return (currentValue === player) ? total.concat(currentIndex) : total;
        if (currentValue === player) {
            return total.concat(currentIndex);
        } else {
            return total;
        }
    }, []);
    for ([index, win] of winCombinations.entries()) {
        if (win.every(ele => plays.indexOf(ele) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon
}

// Gameover function
function gameOver(gameWon) {
    for (let index of winCombinations[gameWon.index]) {
        boxes[index].style.backgroundColor = gameWon.player == humanPlayer ? 'blue' : 'red';
        // endgame.style.display = 'block';
    }
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].removeEventListener('click', turnClick);
    }

    declare(gameWon.player == humanPlayer ? 'You win!': 'You Lose.');
}

// Check for Empty Squares function
function emptySquare() {
    return originalBoard.filter(s => typeof s == 'number');
}

// Check for bestspot function
function bestSpot() {
    // return emptySquare()[0];
    return minimax(originalBoard, computerPlayer).index;
}

// Check for Tie/Draw function
function checkTie() {
    if (emptySquare().length == 0) {
        for (let i = 0; i < boxes.length; i++) {
            boxes[i].style.backgroundColor = 'green';
            boxes[i].removeEventListener('click', turnClick);
        }
        declare('Tie Game');
        return true;
    }
    return false;
}

// Declare Function
function declare(phrase) {
    endgame.style.display = 'block';
    text.innerText = phrase;
}

// Minimax Algorithm function
function minimax(newBoard, player) {
	let availSpots = emptySquare();

	if (checkWin(newBoard, humanPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, computerPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	let moves = [];
	for (let i = 0; i < availSpots.length; i++) {
		let move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == computerPlayer) {
			let result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			let result = minimax(newBoard, computerPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	let bestMove;
	if(player === computerPlayer) {
		let bestScore = -10000;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		let bestScore = 10000;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
