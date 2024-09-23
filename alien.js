'use strict'

const ALIEN_SPEED = 1000
const ALIEN = '👽'
const CANDY = '🍬'
const SKY = '^'
const ALIENS = 'aliens'
const EMPTY = ' '

var gIntervalAliens
var gCandyInterval
var alienSymbol = ALIEN

var gAliens = []
var gDirection = 'right'
var isDown = false

// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row
var gAliensTopRowIdx
var gAliensBottomRowIdx
var gIsAlienFreeze = true

function createAliens(board) {
  gAliensTopRowIdx = 0
  gAliensBottomRowIdx = ALIEN_ROW_COUNT - 1

  for (var i = 0; i < ALIEN_ROW_COUNT; i++) {
    for (var j = 0; j < ALIEN_ROW_LENGTH; j++) {
      const gAlien = {
        pos: { i: i, j: j },
        speed: ALIEN_SPEED,
      }
      gAliens.push(gAlien)
      gGame.alienCount++
      board[i][j] = { gameObject: alienSymbol, type: ALIENS }
    }
  }
  gIntervalAliens = setInterval(moveAliens, ALIEN_SPEED)
  gCandyInterval = setInterval(addCandy, 10000)
}

function shiftBoardRight(board, fromI, toI) {
  for (var i = fromI; i <= toI; i++) {
    for (var j = BOARD_SIZE - 1; j >= 0; j--) {
      if (board[i][j].gameObject === ALIEN && j + 1 < BOARD_SIZE) {
        updateCell({ i, j }, EMPTY)
        updateCell({ i, j: j + 1 }, alienSymbol)
      }
    }
  }
  renderBoard(board)
}

function shiftBoardLeft(board, fromI, toI) {
  for (var i = fromI; i <= toI; i++) {
    for (var j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j].gameObject === ALIEN && j - 1 >= 0) {
        updateCell({ i, j }, EMPTY)
        updateCell({ i, j: j - 1 }, alienSymbol)
      }
    }
  }
  renderBoard(board)
}

function shiftBoardDown(board, fromI, toI) {
  for (var i = toI; i >= fromI; i--) {
    for (var j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j].gameObject === ALIEN) {
        updateCell({ i, j }, EMPTY)
        if (i + 1 < BOARD_SIZE) {
          updateCell({ i: i + 1, j }, alienSymbol)
        }
      }
    }
  }

  isDown = false
  gAliensTopRowIdx++
  gAliensBottomRowIdx++
  renderBoard(board)
}

// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
function moveAliens() {
  if (gIsAlienFreeze) return
  const board = gBoard

  gAliens.forEach((gAlien) => {
    if ((gDirection === 'left' && gAlien.pos.j === 0) || (gDirection === 'right' && gAlien.pos.j === BOARD_SIZE - 1)) {
      gAliens.forEach((gAlien) => {
        gAlien.pos.i += 1
      })
      shiftBoardDown(board, gAliensTopRowIdx, gAliensBottomRowIdx)
      gDirection = gDirection === 'left' ? 'right' : 'left'
    }
  })
  setTimeout(() => {
    if (gDirection === 'left') {
      shiftBoardLeft(board, gAliensTopRowIdx, gAliensBottomRowIdx)
    } else if (gDirection === 'right') {
      shiftBoardRight(board, gAliensTopRowIdx, gAliensBottomRowIdx)
    }
  }, 10)

  moveAlien()

  if (gAliensBottomRowIdx >= gHero.pos.i) {
    clearInterval(gIntervalAliens)
    gameOver()
  }

  renderBoard(board)
}

function moveAlien() {
  gAliens.forEach((gAlien) => {
    if (gDirection === 'left') {
      gAlien.pos.j -= 1
    }
    if (gDirection === 'right') {
      gAlien.pos.j += 1
    }
  })
}

function addCandy() {
  var aliansInFirstRow = gAliens.filter((alien) => alien.pos.i === gAliensTopRowIdx)

  if (gAliensTopRowIdx.length === 0) return
  var randomIndx = getRandomInt(0, aliansInFirstRow.length - 1)
  var randomAlien = aliansInFirstRow[randomIndx]

  // if (gBoard[randomAlien.pos.i][randomAlien.pos.j].gameObject === ALIEN) {
  //   alienSymbol = CANDY
  // } else {
  //   alienSymbol = ALIEN
  // }
}
