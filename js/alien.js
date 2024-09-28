const ALIEN = '<img src="img/BigChickenCIU.webp" alt="ALIEN" style="width: 30px; height: 30px;">'
var gAliens = []
var shootedAliens = []
const ALIEN_ROW_LENGTH = 8
const ALIEN_ROW_COUNT = 3

var gDirection = 'Right'
var gIntervalAliens
var gAliensTopRowIdx
var gAliensBottomRowIdx
var gIsAlienFreeze = true
var isMovingRight = true
var shouldMoveDown = false

function createAliens(board) {
  gAliensTopRowIdx = 0
  gAliensBottomRowIdx = ALIEN_ROW_COUNT - 1

  for (var i = 0; i < ALIEN_ROW_COUNT; i++) {
    for (var j = 0; j < ALIEN_ROW_LENGTH; j++) {
      const gAlien = createAlien(i, j)
      board[i][j].gameObject = gAlien.gameObject
    }
  }
  gIntervalAliens = setInterval(() => moveAliens(board), ALIEN_SPEED)
}

function createAlien(i, j) {
  const gAlien = {
    pos: { i: i, j: j },
    isCandy: false,
    gameObject: ALIEN,
    type: 'ALIEN',
    isShooted: false,
  }
  gAliens.push(gAlien)
  gGame.alienCount++
  return gAlien
}

function moveAliens(board) {
  if (gIsAlienFreeze) return

  gDirection = getMoveDir()

  if (gDirection === 'Down') {
    updateAlienPositions(gDirection)
    gDirection = isMovingRight ? 'Right' : 'Left'
    updateAlienPositions(gDirection)
    shouldMoveDown = true
  }

  if (shouldMoveDown) {
    shiftBoardDown(board, gAliensTopRowIdx, gAliensBottomRowIdx)
    shouldMoveDown = false
  } else {
    switch (gDirection) {
      case 'Left':
        shiftBoardLeft(board, gAliensTopRowIdx, gAliensBottomRowIdx)
        break
      case 'Right':
        shiftBoardRight(board, gAliensTopRowIdx, gAliensBottomRowIdx)
        break
    }
    updateAlienPositions(gDirection)
  }
  if (gAliensBottomRowIdx >= gHero.pos.i) {
    clearInterval(gIntervalAliens)
    gameOver()
  }
}

function getMoveDir() {
  gDirection = isMovingRight ? 'Right' : 'Left'
  for (var i = 0; i < gAliens.length; i++) {
    if (gAliens[i].pos.j === BOARD_SIZE - 1) {
      isMovingRight = false
      gDirection = 'Down'
      break
    }
    if (!isMovingRight && gAliens[i].pos.j < 0) {
      isMovingRight = true
      gDirection = 'Down'
      break
    }
  }

  return gDirection
}

function updateAlienPositions(direction) {
  for (var i = 0; i < gAliens.length; i++) {
    switch (direction) {
      case 'Left':
        if (gAliens[i].pos.j >= 0) gAliens[i].pos.j -= 1
        break
      case 'Right':
        if (gAliens[i].pos.j < BOARD_SIZE - 1) gAliens[i].pos.j += 1
        break
      case 'Down':
        if (gAliens[i].pos.i < BOARD_SIZE - 1) gAliens[i].pos.i += 1
        break
    }
  }
}

function shiftBoardRight(board, fromI, toI) {
  for (var i = fromI; i <= toI; i++) {
    for (var j = BOARD_SIZE - 1; j >= 0; j--) {
      if (board[i][j].gameObject === ALIEN && j < BOARD_SIZE - 1) {
        updateCell({ i, j: j }, EMPTY)
        updateCell({ i, j: j + 1 }, ALIEN)
        board[i][j + 1].gameObject = ALIEN
      }
    }
  }
  renderBoard(board)
}

function shiftBoardLeft(board, fromI, toI) {
  for (var i = fromI; i <= toI; i++) {
    for (var j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j].gameObject === ALIEN && j > 0) {
        updateCell({ i, j }, EMPTY)
        updateCell({ i, j: j - 1 }, ALIEN)
        board[i][j - 1].gameObject = ALIEN
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
          updateCell({ i: i + 1, j }, ALIEN)
          board[i + 1][j].gameObject = ALIEN
        }
      }
    }
    renderBoard(board)
  }

  gAliensTopRowIdx++
  gAliensBottomRowIdx++
}
