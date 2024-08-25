// console.log("hello worlds");

//declare our variable for our 2D array, score, row, and columns.
let board;
let score = 0;
let rows = 4;
let columns = 4;
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;
//create a function to set the game
//start of setGame()
function setGame() {
	//initialize the 4x4 gameboard with all tiles set to 0.
	board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

	//create the gameboard on the html document


	for(let r=0 ; r < rows; r++) {//create rows
		for(let c=0; c < columns; c++){//create columns
			// console.log(`[r${r}-c${c}]`);

			//create div element representing tile a tile
			let	tile = document.createElement("div");

			//unique id for each tile based on coordinate 
			tile.id = r.toString() + "-" + c.toString();
			//get number from the board
			let num = board[r][c];

			//Update the tile's appearance based on the value
			updateTile(tile, num);

			//place the tile inside the grid(board), in the right row and column
			document.getElementById("board").append(tile);

		}
	}

	setTwo();
	setTwo();
}

//end of setGame()

// start of updateTile
function updateTile(tile, num) {
	//clear the title text
	tile.innerText = "";

	// clear the classList to avoid multiple classes
	tile.classList.value = "";

	//add the class named "tile" to the classList of the tile, for the styling
	tile.classList.add("tile");

	// to check if the current num is not 0
	if (num > 0) {
		//set the tile's text to the number based on num value
		tile.innerText = num.toString();
		if (num <= 4096) {
			tile.classList.add("x" + num.toString());
		}
		else{
			tile.classList.add("x8192");
		}
	}
}
//end of updateTile

//start of window.onLoad
window.onload = function(){
	setGame();
}
//end of window.onLoad

//start of handleSlide()
//"e" represents the event objects, which contains about the event occured
function handSlide(e) {
	console.log(e.code);
	//check if the pressed key code is one of the arrowkeys
	if (["ArrowLeft","ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
		//to avoid scrolling
		e.preventDefault();
		if (e.code == "ArrowLeft") {
			slideLeft();
			setTwo();
		}
		else if(e.code == "ArrowRight"){
			slideRight();
			setTwo();
		}
		else if(e.code == "ArrowUp"){
			slideUp();
			setTwo();
		}
		else if(e.code == "ArrowDown"){
			slideDown();
			setTwo();
		}

		document.getElementById("score").innerText = score;

		setTimeout(()=>{
			if (hasLost()) {
				alert("Game Over! You have list the the game. Game will restart.");
				alert("Press any arrow key to restart");
				restartGame();
				
			}
			checkWin();
		}, 100);
		
	}


}

document.addEventListener("keydown", handSlide);
//end of handleSlide()

//start of filterZero(tiles)
function filterZero(tiles){	// removing empty tiles
	//create new array by removing zeroes
	return tiles.filter(num => num != 0);
}
//start of filterZero(tiles)


//start of slide(tiles)
function slide(tiles){	//for sliding and merging tiles
	tiles = filterZero(tiles);

	for (let i = 0; i < tiles.length; i++) {
		// if two adjacent numbers are equal
		if (tiles[i] == tiles[i + 1]) {
			tiles[i] *= 2;
			tiles[i+1] = 0;
			//add to the scoreboard
			score += tiles[i];
		}
	}

	tiles = filterZero(tiles);

	//to get the 4 columns
	while (tiles.length < 4){
		tiles.push(0);
	}

	return tiles;
}
//end of slide(tiles)

function slideLeft() {
	for (let r = 0; r < rows; r++) {

		//store current row in the row variable

		let row = board[r];

		//line for animation
		let originalRow = row.slice();
		//slide() function will return a new value
		row = slide(row);

		//updated value in the board
		board[r] = row;
		for(let c = 0; c < columns; c++){
			let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if (originalRow[c] !== num && num !== 0) {
            	tile.style.animation = "slide-from-right 0.3s"

            	//remove animation after complete
            	setTimeout(() =>{
            		tile.style.animation = "";
            	},300);
            }



            updateTile(tile, num);
		}
	}
}

function slideRight() {
	for (let r = 0; r < rows; r++) {

		//store current row in the row variable

		let row = board[r];
		//original animation
		let originalRow = row.slice();
		//reverse the row array since it's sliding to the right
		row.reverse();

		//slide() function will return a new value
		row = slide(row);
		row.reverse();
		//updated value in the board
		board[r] = row;
		for(let c = 0; c < columns; c++){
			let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if (originalRow[c] !== num && num !== 0) {
            	tile.style.animation = "slide-from-left 0.3s"

            	//remove animation after complete
            	setTimeout(() =>{
            		tile.style.animation = "";
            	},300);
            }

            updateTile(tile, num);


		}
	}
}

function slideUp() {
	for (let c = 0; c < columns; c++) {

		//create a temporary col that represents column
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
		//original copy of animation
		let originalCol = col.slice();
		col = slide(col);


		for(let r = 0; r < rows; r++){
			//reset the values of board array back to the values of the modified col
			board[r][c] = col[r];

			let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if (originalCol[r] !== num && num !== 0) {
            	tile.style.animation = "slide-from-bottom 0.3s"

            	//remove animation after complete
            	setTimeout(() =>{
            		tile.style.animation = "";
            	},300);
            }
            updateTile(tile, num);
		}
	}
}

function slideDown() {
	for (let c = 0; c < columns; c++) {

		//create a temporary col that represents column

		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

		//original copy of animation
		let originalCol = col.slice();
		col.reverse();
		col = slide(col);
		col.reverse();

		for(let r = 0; r < rows; r++){
			//reset the values of board array back to the values of the modified col
			board[r][c] = col[r];

			let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if (originalCol[r] !== num && num !== 0) {
            	tile.style.animation = "slide-from-top 0.3s"

            	//remove animation after complete
            	setTimeout(() =>{
            		tile.style.animation = "";
            	},300);
            }
            updateTile(tile, num);
		}
	}
}

//start of hasEmptyTile
//check whether game board contains any empty space (0) tiles
function hasEmptyTile(){
	for (let r = 0; r < columns; r++) {
		for (let c = 0; c < columns; c++) {

			if (board[r][c] == 0) {
				return true;
			}
		}
	}
	return false;
}
//start of hasEmptyTile

//start of setTwo - add a random new 2 tile in the game board
function setTwo(){
	//check if hasEmptyTile is false
	if (!hasEmptyTile) {
		return;
	}

	//declare a value found tile
	let found = false;

	//this will run until random empty tile is found
	while(!found){
		//Math.random() - generates random number base on the condition
		//Math.floor() - rounds down to the nearest integer
		//to get a random value for r and c from 1-4
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		// if the position value is 0, set the value to 2
		if (board[r][c] == 0) {
			board[r][c] = 2;
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			tile.innerText = "2";
			tile.classList.add("x2");

			found = true;
		}
	}
}
//end of setTwo

//start checkWin
function checkWin(){
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < columns; c++) {
			//check if the current tile is a winning tile
			if (board[r][c] == 2048 && is2048Exist == false) {
				alert("You win! You got 2048");
				is2048Exist = true;
			}
			else if (board[r][c] == 4096 && is4096Exist == false) {
				alert("You are unstoppable at 4096! You are fantastically unstoppable");
				is4096Exist = true;
			}
			else if (board[r][c] == 8192 && is8192Exist == false) {
				alert("Victory! You have reached 8192! You are incredibly awesome!");
				is8192Exist = true;
			}
		}
	}
}
//end of checkWin

// start of hasLost() - check if board is full
function hasLost() {
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < columns; c++) {
			if (board[r][c] == 0) {

				//found an empty tile, user has not lost
				return false;
			}

			const currentTile = board[r][c];

			//check if the adjacent cells have possible merge.
			if (
				r > 0 && board[r-1][c] === currentTile || r < rows - 1 && board[r+1][c] === currentTile || c > 0 && board[r][c-1] === currentTile || c < columns - 1 && board[r][c+1] === currentTile
			) {
				//found adjacent cell with the same value, user not lost.
				return false;

			}
		}
	}
	//no possible move left/user lost
	return true;
}
// end of hasLost()

//start of restartGame()
function restartGame(){
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    
    setTwo()    // new tile   
    score = 0;
}
//end of restartGame()


//for mobile device
let startX = 0;
let startY = 0;

document.addEventListener("touchstart", (e) => {
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;

	
})

document.addEventListener("touchmove", (e) =>{
	if (!e.target.className.includes("tile")) {
		return
	}
	e.preventDefault();

}, {passive: false});

//listen for the touchend event on the entire document
document.addEventListener("touchend", (e) =>{
	if (!e.target.className.includes("tile")) {
		return;
	}
	//calculate the touched screen
	let diffX = startX - e.changedTouches[0].clientX;
	let diffY = startY - e.changedTouches[0].clientY;
	console.log(diffX);
	console.log(diffY);

	//horizontal swipe
	if (Math.abs(diffX) > Math.abs(diffY)) {
		if (diffX > 0) {
			slideLeft();
			setTwo();
		}
		else{
			slideRight();
			setTwo();
		}
	}
	//vertical swipe
	else{
		if (diffY > 0) {
			slideUp();
			setTwo();
		}
		else{
			slideDown();
			setTwo();
		}
	}
	document.getElementById("score").innerText = score;
	setTimeout(()=>{
			if (hasLost()) {
				alert("Game Over! You have list the the game. Game will restart.");
				alert("Press any arrow key to restart");
				restartGame();
				
			}
			checkWin();
		}, 100);
})