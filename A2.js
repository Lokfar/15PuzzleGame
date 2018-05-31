/* 
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
Title : Assignment 2 Sliding Block Puzzle
Author : Chen Wuqiao 
Description : Exercises for Assignment 2
Created : 2018/5/15
Modified : None
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
*/

// global variables---------------------------------start
// The serial number of the background images
var pictureNo = 0;
//The total number of background images
var pictureCount = 5;
//The total number of the sliders
var partCount = 15;
//Whether the slider can be clicked 
var clickable = false;
// global variables---------------------------------end

/**
 * Summary: Creates all the tiles necessary.
 * @return undefined
 */
function createTiles() {
    //Get the elements to place the tiles
    var pictureBox = document.getElementById("pictureBox");
    var partNo;
    //Use loops to create tiles
    for (i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            //create element 'div'
            var part = document.createElement("div");
            part.addEventListener("click", tileClicked);
            //Calculating the sequence number by the row and column value 
            partNo = i * 4 + j;
            //set classname
            part.className = "picturePart" + " " + "pictureNo" + pictureNo + " " + "bgPosition" + partNo;
            //set id
            part.id = "blockPosition" + "Row" + i + "Column" + j;
            pictureBox.appendChild(part);
        }
    }
    //initialize variable Move count
    moveCountClean();
}
//Movetiles ----------------------------------------------start
//functions below are used to move the tiles
/**
 * Summary: when the tile is clicked, checkif the tile can move to the empty spot.if the tile can move, move the tile to the empty spot
 * @param {event} event  the event that mouse clicking the tiles
 * @return undefined
 */
function tileClicked(event) {
    //if the user doesn't click the button 'play', show a tip to remind him 
    if (!clickable) {
        showTip("Click the 'play' to start the game!", 'info', 2000);
        return;
    }
    //get the row and column from id by regular expression
    var regNumber = /\d+(.\d+)?/g;
    var blankPicture = document.getElementsByClassName("bgPosition" + partCount)[0];
    var blankStr = blankPicture.id
    var BlankArray = blankStr.match(regNumber);
    var blankRow = BlankArray[0];
    var blankColumn = BlankArray[1];
    var thisStr = this.id;
    var thisArray = thisStr.match(regNumber);
    var thisRow = thisArray[0];
    var thisColumn = thisArray[1];
    //check if the clicked tile is near the blank tile, if so, exchange their position.
    if ((Math.abs(thisRow - blankRow) == 1 && thisColumn == blankColumn) || (Math.abs(thisColumn - blankColumn) == 1 && thisRow == blankRow)) {
        moveTiles(blankPicture, this);
    }
    //Check whether or not it has been returned
    check();
}

/**
 * Summary: when the direction key is pressed, move tiles if avaliable
 * @param {event} event  the event that derection key pressing
 * @return undefined
 */
function keyMovementListener() {
    //if the user doesn't click the button 'play', show a tip to remind him 
    if (!clickable) {
        showTip("Click the 'play' to start the game!", 'info', 2000);
        return;
    }
    //get the keycode to decide the type of derection key 
    var key = event.keyCode;
    switch (key) {
        case 37:
            keyMove(0, 1);//left
            break;
        case 38:
            keyMove(1, 0);//up
            break;
        case 39:
            keyMove(0, -1);//right
            break;
        case 40:
            keyMove(-1, 0);//down
            break;
        default:
            break;
    }
}
/**
 * Summary: move the tiles if avaliable
 * @param {int} addRow  the difference between the Row of blankpart and the Row of target part
  * @param {int} addColumn  the difference between the Column of blankpart and the Column of target part
 * @return undefined
 */
function keyMove(addRow, addColumn) {
    var blankPart = document.getElementsByClassName("bgPosition" + partCount)[0];
    var blankRow = parseInt(getRowandColumn(blankPart)[0]);
    var blankColumn = parseInt(getRowandColumn(blankPart)[1]);
    var moveRow = blankRow + parseInt(addRow);
    var moveColumn = blankColumn + parseInt(addColumn);
    //check if the key move is valid
    if (moveRow < 0 || moveRow > 3 || moveColumn < 0 || moveColumn > 3) {
        return;
    } else {
        var movePart = document.getElementById("blockPosition" + "Row" + moveRow + "Column" + moveColumn);
        
        moveTiles(blankPart, movePart);
    }
}
/**
 * Summary: get the row and column by regex
 * @return {array} RowAndColumn  an array that contains the row and column, the row is the first element.
 */
function getRowandColumn(picturePart) {
    var regNumber = /\d+(.\d+)?/g;
    var blankStr = picturePart.id
    var RowandColumn = blankStr.match(regNumber);
    return RowandColumn;
}
/**
 * Summary: exchange the position of blankPart and targetPart
 * @param {element} blankPart the blank part 
 * @param {element} movePart  the part which is going to move
 * @return undifinded
 */
function moveTiles(blankPart, movePart) {
    var str = blankPart.className;
    blankPart.className = movePart.className;
    movePart.className = str;
    addMoveCount();
}
/**
 * Summary: the moveCount add one after one successful move
 * @return undifinded
 */
function addMoveCount() {
    var moveCountNumber = parseInt(document.getElementById("moveCountNumber").innerHTML) + 1;
    document.getElementById("moveCountNumber").innerHTML = moveCountNumber;
}
/**
 * Summary: reset the moveCount
 * @return undifinded
 */
function moveCountClean() {
    document.getElementById("moveCountNumber").innerHTML = 0;
}
//Movetiles --------------------------------------------------end


/**
 * Summary: Shuffle up the tiles in the beginning of the game
 * @param {event} event  the event that mouse clicking the button 'play'
 * @return undefined
 */
function shuffleTiles(event) {
    //get the random array of serial numbers
    randomArray = [];
    for (var k = 0; k < partCount + 1; k++) {
        randomArray[k] = k;
    }
    function cmp() {
        return 0.5 - Math.random();
    }
    //Disrupt the array until it meets the requirements 
    do {
        randomArray.sort(cmp);
    } while (!check_random_isValid)
    //exchange the tiles classname
    var partNo;
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            partNo = i * 4 + j;
            document.getElementById("blockPosition" + "Row" + i + "Column" + j).className = "picturePart" + " " + "pictureNo" + pictureNo + " " + "bgPosition" + randomArray[partNo];
        }
    }
    //now the user can play the game
    clickable = true;
    changeButtontoRestart();
    moveCountClean();
}

/**
 * Summary: Check whether the random array is valid， make sure that the puzzle can be solved.
 * @return undefined
 */
function check_random_isValid() {
    var count = 0;
    for (var i = 0; i < partCount + 1; i++) {
        for (var j = i + 1; j < partCount + 1; j++) {
            if (randomArray[j] < randomArray[i]) {
                count++;
            }
        }
    }
    return count % 2 === 0;
}
/**
 * Summary: Check whether or not it has been returned. 
 * @return undefined
 */
function check() {
    var partNo;
    var className = "";
    //If any tile does not come back, return
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            partNo = i * 4 + j;
            var part = document.getElementById("blockPosition" + "Row" + i + "Column" + j);
            className = "picturePart" + " " + "pictureNo" + pictureNo + " " + "bgPosition" + partNo;
            if (part.className != className) {
                return;
            }
        }
    }
    // If all of them are back, show imformation and restart the game.
    winInfo();
    restartGame();
}
/**
 * Summary: Change the background image of the puzzle 
 * @return undefined
 */
function change_img(event) {
    pictureNo = (pictureNo + 1) % pictureCount;
    var partNo;
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            partNo = i * 4 + j;
            document.getElementById("blockPosition" + "Row" + i + "Column" + j).className = "picturePart" + " " + "pictureNo" + pictureNo + " " + "bgPosition" + partNo;
        }
    }
    //once change the image, reset the game
    moveCountClean();
    changeButtontoPlay();
}
/**
 * Summary: put all the picture parts back to their initial state
 * @return undifinded
 */
function pictureBack() {
    var partNo;
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            partNo = i * 4 + j;
            document.getElementById("blockPosition" + "Row" + i + "Column" + j).className = "picturePart" + " " + "pictureNo" + pictureNo + " " + "bgPosition" + partNo;
        }
    }
}

//button listeners ---------------------------------------start
/**
 * Summary: the event listener that for the button 'Play'
 * @return undifinded
 */
function playGame(event) {
    shuffleTiles();
        showTip("You can move the slider by clicking it or by pressing the direction key. ", 'info', 2000);
    changeButtontoRestart();
}
/**
 * Summary: the event listener that for the button 'restart'
 * @return undifinded
 */
function restartGame(event) {
    pictureBack();
    moveCountClean();
    changeButtontoPlay();
}
/**
 * Summary: change button 'play' to 'restart' after click it
 * @return undifinded
 */
function changeButtontoRestart() {
    document.getElementById("startButton").innerHTML = "RESTART";
    document.getElementById("startButton").removeEventListener("click", playGame);
    document.getElementById("startButton").addEventListener("click", restartGame);
}
/**
 * Summary: change button 'restart' to 'play' after click it
 * @return undifinded
 */
function changeButtontoPlay() {
    document.getElementById("startButton").innerHTML = "PLAY";
    document.getElementById("startButton").removeEventListener("click", restartGame);
    document.getElementById("startButton").addEventListener("click", playGame);
    clickable = false;
}
//button listeners ---------------------------------------end


//tips and dialog------------------------------------------start
/**
 * Summary: this function is used to show small tip
 * @param {String} tip   the tip that you want to show
 * @param {String} type   the type of the tip, info, warning and so on
  * @param {int} delayTime   the time that the tip show on the screen
 * @return undifinded
 */
function showTip(tip, type, delayTime) {
    var $tip = $('#tip');
    $tip.stop(true).prop('class', 'alert alert-' + type).text(tip).css('margin-left', -$tip.outerWidth() / 2).fadeIn(500).delay(delayTime).fadeOut(500);
}
/**
 * Summary: this function is to show the user that the game is over, and show their moveCount.
 * @return undifinded
 */
function winInfo() {
    var count1 = document.getElementById("moveCountNumber").innerHTML;
    var content = " steps";
    content = count1.toString() + content;
    document.getElementById("winBox").innerHTML = content;
    $("#winBox").dialog({
        title: "WIN!",
        modal: true,
        buttons: {
            "OK": function () {
                $(this).dialog("close");
            }
        }
    })
}
//tips and dialog------------------------------------------end
/**
 * When the page loads, create our puzzle
 */
window.onload = function () {

    createTiles();
    document.getElementById("startButton").addEventListener("click", playGame);
    document.getElementById("changeImageButton").addEventListener("click", change_img);
    document.onkeydown = keyMovementListener;
}
