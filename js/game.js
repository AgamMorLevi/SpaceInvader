'use strict'

const BOARD_SIZE = 14
// const ALIEN_ROW_LENGTH = gLevel[0].ALIEN_ROW_LENGTH
const ALIEN_ROW_LENGTH = 8
const ALIEN_ROW_COUNT = 3
// const ALIEN_SPEED = gLevel[0].ALIEN_SPEED
const ALIEN_SPEED = 1000
const HERO = '♆'
const SKY = '^'
const EMPTY = ''

var gBoard
var gGame = {
  isOn: false,
  alienCount: 0,
  score: 0,
}

// Called when game loads
function onInit() {
  gGame.score = 0
  gGame.alienCount = 0
  gBoard = createBoard()
  renderBoard(gBoard)
  rendervictoryContainer()
  renderScore()
}

document.addEventListener('keydown', onKeyDown)

// Create and returns the board with aliens on top, ground at bottom
// use the functions: createCell, createHero, createAliens
//
//Place a single line of few aliens on top, no need for
//   them to move just yet

//   later on you can: switch to a more advanced model of cells as described in code
//   above).

function createBoard() {
  const board = []

  for (var i = 0; i < BOARD_SIZE; i++) {
    board.push([])

    for (var j = 0; j < BOARD_SIZE; j++) {
      board[i][j] = createCell(EMPTY)
    }
  }
  createAliens(board)
  createHero(board)
  return board
}

// Render the board as a <table> to the page
function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      const cell = board[i][j].gameObject
      const className = `cell cell-${i}-${j}`

      strHTML += `<td class="${className}">${cell}</td>`
    }
    strHTML += '</tr>'
  }
  const elContainer = document.querySelector('.board')
  elContainer.innerHTML = strHTML
}

// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(gameObject = null) {
  return {
    type: SKY,
    gameObject: gameObject,
  }
}

// position such as: {i: 2, j: 7}
function updateCell(pos, gameObject = null) {
  gBoard[pos.i][pos.j].gameObject = gameObject // modal
  var elCell = getElCell(pos) //DOM
  elCell.innerHTML = gameObject || EMPTY
}

function getElCell(pos) {
  return document.querySelector(`.cell-${pos.i}-${pos.j}`)
}

function renderScore() {
  var elScore = document.querySelector('.score')
  elScore.innerText = gGame.score
}

function gameOver() {
  gIsAlienFreeze = true
  var elVictoryContainer = document.querySelector('.victorious-container')
  elVictoryContainer.style.display = 'block'

  var elMsg = document.querySelector('.message')
  elMsg.style.display = 'block'

  if (gGame.alienCount === 0) {
    elMsg.innerText = 'Victory!'
  } else if (gAliensBottomRowIdx >= gHero.pos.i) {
    elMsg.innerText = 'You lost, try again'
  }
  var elRestartBtn = document.querySelector('.restart')
  elRestartBtn.innerText = 'RESTART'
}

function restartGame() {
  var elVictoryContainer = document.querySelector('.victorious-container')
  elVictoryContainer.style.display = 'none'
  gIsAlienFreeze = false
  gSuperAttacks = 3
  gAliens = []
  gDirection = 'right'
  onInit()
}

function rendervictoryContainer() {
  var elVictoryContainer = document.querySelector('.victorious-container')
  elVictoryContainer.innerHTML = `
  <h2 class="message"></h2>
  <button class="restart" onclick="restartGame()">START</button>
  `
}
