'use strict'

const LASER_SPEED = 80
const LASER_SUPER_SPEED = 40
const LASER = '<img src="img/shoot.png" alt="LASER" style="width: 25px; height: 25px;">'
const SUPER_LASER = '<img src="img/rocket.png" alt="SUPER_LASER" style="width: 25px; height: 30px;">'

var gHero
var gLaserPos
var laserInterval
var gSuperAttacks = 3
var laserSpeed = LASER_SPEED
var laserSymbol = LASER

var gAlianSortedByJ = []
var gAlianSortedByI = []
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
  if (gIsAlienFreeze) return
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

  gLaserPos = { i: gHero.pos.i - 1, j: gHero.pos.j }

  laserInterval = setInterval(() => {
    blinkLaser(gLaserPos, cas)
  }, laserSpeed)
}

// renders a LASER at specific cell for short time and removes it

function blinkLaser(gLaserPos, cas) {
  gLaserPos.i--

  if (gLaserPos.i < 0) {
    clearInterval(laserInterval)
    renderBoard(gBoard)
    gHero.isShoot = false
    return
  }

  if (gBoard[gLaserPos.i][gLaserPos.j].gameObject === ALIEN) {
    clearInterval(laserInterval)
    renderBoard(gBoard)
    playSound()
    alienShooted(gLaserPos, cas)
    renderScore()

    if (gHero.isSuper) {
      resetSuperMode()
    }
  }

  updateCell(gLaserPos, laserSymbol)
  updateCell({ i: gLaserPos.i + 1, j: gLaserPos.j }, EMPTY)

  setTimeout(() => {
    updateCell(gLaserPos, EMPTY)
  }, laserSpeed / 2)
}

function alienShooted(shootedAlienPos, cas) {
  gGame.alienCount--
  gGame.score += 10
  updateCell(shootedAlienPos, EMPTY)

  if (cas === 'n') {
    blowUpNeighbors(gBoard, shootedAlienPos.i, shootedAlienPos.j)
    return
  }

  if (gGame.alienCount === 0) {
    gameOver()
    return
  }
  renderBoard(gBoard)
  gHero.isShoot = false
}

function blowUpNeighbors(board, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue
      if (j < 0 || j >= board[0].length) continue
      var currCell = board[i][j]
      if (currCell.gameObject !== EMPTY) {
        alienShooted({ i, j })
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
