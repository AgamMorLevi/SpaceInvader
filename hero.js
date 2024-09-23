'use strict'

const LASER_SPEED = 80
const LASER_SUPER_SPEED = 40
const LASER = '⤊'
const SUPER_LASER = '^'

var gHero
var laserInterval
var gSuperAttacks = 3
var laserSpeed = LASER_SPEED
var laserSymbol = LASER
// creates the hero and place it on board
function createHero(board) {
  gHero = {
    pos: { i: 12, j: 5 },
    isShoot: false,
    isSuper: false,
  }
  board[gHero.pos.i][gHero.pos.j].gameObject = HERO
}

// Handle game keys
// Move the hero right (1) or left (-1)
function onKeyDown(ev) {
  switch (ev.key) {
    case 'ArrowLeft':
      moveHero(-1)
      break

    case 'ArrowRight':
      moveHero(1)
      break

    case ' ':
      if (!gHero.isShoot) {
        shoot()
      }
      break
    case 'n':
      if (!gHero.isShoot) {
        shoot('n')
      }
      break
    case 'x':
      if (!gHero.isShoot && gSuperAttacks > 0) {
        superMode()
      }
      break
  }
}
function moveHero(dir) {
  var nextPos = { i: gHero.pos.i, j: gHero.pos.j + dir }
  if (nextPos.j < 0 || nextPos.j >= BOARD_SIZE) return

  updateCell(gHero.pos, EMPTY)

  gHero.pos.j += dir

  updateCell(nextPos, HERO)
  return nextPos
}

// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot(cas) {
  gHero.isShoot = true

  var gLaserPos = { i: gHero.pos.i - 1, j: gHero.pos.j }

  laserInterval = setInterval(() => {
    if (gBoard[gLaserPos.i][gLaserPos.j].gameObject === ALIEN) {
      console.log(gGame.alienCount, 'alienCount')
      gGame.alienCount--
      if (cas === 'n') {
        blowUpNeighbors(gBoard, gLaserPos.i, gLaserPos.j)
        console.log(gGame.alienCount, 'alienCount')
      }

      clearInterval(laserInterval)
      alienShooted(gLaserPos)
      gHero.isShoot = false
      renderScore()

      if (gHero.isSuper) {
        resetSuperMode()
      }

      return
    }

    if (gLaserPos.i === 0) {
      clearInterval(laserInterval)
      gHero.isShoot = false
      return
    }
    gLaserPos.i--
    updateCell({ i: gLaserPos.i + 1, j: gLaserPos.j }, EMPTY)
    if (gBoard[gLaserPos.i][gLaserPos.j].gameObject !== ALIEN) {
      blinkLaser(gLaserPos)
    }
  }, laserSpeed)
}

// renders a LASER at specific cell for short time and removes it
function blinkLaser(pos) {
  updateCell(pos, laserSymbol)
  setTimeout(() => {
    updateCell(pos, EMPTY)
  }, laserSpeed / 2)
}

function alienShooted(laserPos) {
  updateCell(laserPos, EMPTY)
  var shootedAlien = gAliens.findIndex((alien) => alien.pos.i === laserPos.i && alien.pos.j === laserPos.j)
  gAliens.splice(shootedAlien, 1)
  gGame.score += 10

  var isBottomRowEmpty = true
  gAliens.forEach((alien) => {
    if (alien.pos.i === gAliensBottomRowIdx) {
      isBottomRowEmpty = false
    }
  })

  if (isBottomRowEmpty) {
    gAliensBottomRowIdx--
  }

  if (gGame.alienCount === 0) {
    gameOver()
  }
}

function blowUpNeighbors(board, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue
      if (j < 0 || j >= board[0].length) continue
      var currCell = board[i][j]
      if (currCell.gameObject === ALIEN) {
        alienShooted({ i, j })
        gGame.alienCount--
      }
    }
  }
  gHero.isShoot = false
}

function superMode() {
  gHero.isSuper = true
  laserSpeed = LASER_SUPER_SPEED
  laserSymbol = SUPER_LASER

  shoot()
  gSuperAttacks--
}

function resetSuperMode() {
  gHero.isSuper = false
  laserSpeed = LASER_SPEED
  laserSymbol = LASER
}
