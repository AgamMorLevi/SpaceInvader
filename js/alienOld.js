'use strict'

var gIntervalAliens
var gIntervalCandys
var gAliens = []
const ALIEN_ROW_LENGTH = 8
const ALIEN_ROW_COUNT = 3
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
        isCandy: false,
        gameObject: getAlienIcon({ pos: { i, j }, type: SKY }),
        type: SKY,
      }
      gAliens.push(gAlien)
      gGame.alienCount++
      board[i][j] = gAlien
      getAlienIcon(gAlien)
    }
  }
  gIntervalAliens = setInterval(moveAliens, ALIEN_SPEED)
  // gIntervalCandys = setInterval(addCandy, 10000)
}

function getAlienIcon(gAlien) {
  if (gAlien.gameObject === EMPTY) return EMPTY
  if (gAlien.pos.i === gAliensTopRowIdx) {
    return '👽'
  } else if (gAlien.pos.i === gAliensBottomRowIdx) {
    return '👾'
  } else {
    return '😃'
  }
}

function shiftBoardRight(board, fromI, toI) {
  for (var i = fromI; i <= toI; i++) {
    for (var j = BOARD_SIZE - 1; j >= 0; j--) {
      if (board[i][j].gameObject !== EMPTY && j + 1 < BOARD_SIZE) {
        const newIcon = getAlienIcon({ pos: { i, j }, type: SKY })
        updateCell({ i, j: j }, EMPTY)
        updateCell({ i, j: j + 1 }, newIcon)
        board[i][j + 1].gameObject = newIcon
      }
    }
  }
  renderBoard(board)
}

function shiftBoardLeft(board, fromI, toI) {
  for (var i = fromI; i <= toI; i++) {
    for (var j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j].gameObject !== EMPTY && j - 1 >= 0) {
        const newIcon = getAlienIcon({ pos: { i, j }, type: SKY })
        updateCell({ i, j }, EMPTY)
        updateCell({ i, j: j - 1 }, newIcon)
        board[i][j - 1].gameObject = newIcon
      }
    }
  }
  renderBoard(board)
}

function shiftBoardDown(board, fromI, toI) {
  for (var i = toI; i >= fromI; i--) {
    for (var j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j].gameObject !== EMPTY) {
        updateCell({ i, j }, EMPTY)
        if (i + 1 < BOARD_SIZE) {
          const newIcon = getAlienIcon({ pos: { i, j }, type: SKY })
          updateCell({ i: i + 1, j }, newIcon)
          board[i + 1][j].gameObject = newIcon
        }
      }
    }
    isDown = false
    renderBoard(board)
  }

  gAliensTopRowIdx++
  gAliensBottomRowIdx++
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
  var aliensInBottomRow = gAliens.filter((alien) => alien.pos.i === gAliensBottomRowIdx)

  if (aliensInBottomRow.length === 0) return

  var randomIndex = getRandomInt(0, aliensInBottomRow.length - 1)
  var randomAlien = aliensInBottomRow[randomIndex]

  var gAlianMach = gAliens.find((gAlien) => gAlien.pos === randomAlien.pos)
  console.log(gAlianMach)
  gAlianMach.isCandy = true
  return '🍬'

  // setTimeout(() => {
  //   gAliens.forEach((gAlien) => {
  //     if (gAlien.alienSymbol === CANDY) {
  //       alienSymbol = ALIEN
  //       gAlien.symbol = alienSymbol
  //       gAlien.isCandy = false
  //       updateCell(gAlien.pos, ALIEN)
  //     }
  //   })
  // }, 5000)
}
