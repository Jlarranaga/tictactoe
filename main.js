
//*Constants
const markers = {
    0: '',
    1: 'X',
    '-1': 'O'
}

//* State Variables
let board
let turn
let winner

//*Cached DOM Elements
const messageEl = document.querySelector('h2')
const resetButton = document.querySelector('button')
const markerEl = [...document.querySelectorAll('#board > div')] //<-- board in an array from the HTML 

//*Functions
function init (){
    turn = 1
    winner = null;

    board = [
        [0,0,0],
        [0,0,0],
        [0,0,0],

    ]

    render();
}

init();

function renderBoard(){

    board.forEach((colArr, colIdx)=>{

        colArr.forEach((cellValue, rowIdx)=>{

            const cellId = `c${colIdx}r${rowIdx}`

            const cellEl = document.getElementById(cellId)

            cellEl.innerText = markers[cellValue]
                //TODO fix size of X and O on board
        })
    })

}

function renderControls(){
    markerEl.forEach((markerEl, colIdx)=>{
        //const hideMarker = !board[colIdx].includes(0) || winner

        //markerEl.style.visibility = hideMarker ? 'hidden' : 'visible'
    })
}

function renderMessage(){
    if (winner === 'T'){
        messageEl.innerText = 'Tie!'
    }else if(winner){
       // messageEl.innertext = 
    }
}

function render(){
    renderBoard();
    renderMessage();
    renderControls();
}

function handleBlock(event){

    //board[a][b] = markerEl.indexOf(event.target)

    const colIdx = markerEl.indexOf(event.target)
    //const rowIdx = markerEl[colIdx].indexOf(event.target)

    const colArr = board[colIdx]
    //const rowIdx = colArr.indexOf(markerEl)


    const cell = event.srcElement.id
    const s = cell.toString()
    const row = s.split("")
    const rowIdx = row.pop()

    if(rowIdx === -1) return

    //colArr[rowIdx] = turn
    //board[a][b] = turn

    turn *= -1

    winner = getWinner(colIdx, rowIdx)
    render();
}

function countAdjacent (colIdx, rowIdx, colOffset, rowOffset){
    const player = board[colIdx][rowIdx]
    let count = 0

    colIdx += colOffset
    rowIdx += rowOffset

    while(
        board[colIdx] !== undefined && 
        board[colIdx][rowIdx] !== undefined && 
        board[colIdx][rowIdx] === player
    ){
        count ++
        colIdx += colOffset
        rowIdx += rowOffset
    }

    return count
}

function checkHorizontalWin (colIdx, rowIdx){
    //goimng left
    const adjustCountLeft = countAdjacent(colIdx, rowIdx, -1, 0)

    //going right
    const adjustCountRight = countAdjacent(colIdx, rowIdx, 1, 0)

    return adjustCountLeft + adjustCountRight >= 2 ? board[colIdx][rowIdx] : null
}

//verticla win

function checkVerticalWinner (colIdx, rowIdx){
    return countAdjacent(colIdx, rowIdx, 0, -1) === 2 ? board[colIdx][rowIdx] : null
}

//diagonal win
function checkDiagonalSENWWin (colIdx, rowIdx){
    const adjustCountNW = countAdjacent(colIdx, rowIdx, -1, 1)

    const adjustCountSE = countAdjacent(colIdx, rowIdx, 1, -1)

    return adjustCountNW + adjustCountSE >= 2 ? board[colIdx][rowIdx] : null
}

function checkDiagonalSWNEWin (colIdx, rowIdx){
    const adjustCountNE = countAdjacent(colIdx, rowIdx, 1, 1)

    const adjustCountSW = countAdjacent(colIdx, rowIdx, -1, -1)

    return adjustCountNE + adjustCountSW >= 2 ? board[colIdx][rowIdx] : null
}

function getWinner(colIdx, rowIdx){
    return (
        checkHorizontalWin(colIdx, rowIdx) ||
        checkVerticalWinner(colIdx, rowIdx) ||
        checkDiagonalSENWWin(colIdx, rowIdx) ||
        checkDiagonalSWNEWin(colIdx, rowIdx)

    )
}

//*Event Listeners

document.getElementById('board').addEventListener('click',handleBlock)

resetButton.addEventListener('click', init)