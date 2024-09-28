'use strict'

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// const gLevel = [
//   {
//     LEVEL: 'Easy',
//     ALIEN_ROW_LENGTH: 5,
//     ALIEN_SPEED: 800,
//   },
//   {
//     LEVEL: 'Normal',
//     ALIEN_ROW_LENGTH: 8,
//     ALIEN_SPEED: 1000,
//   },
//   {
//     LEVEL: 'Hard',
//     ALIEN_ROW_LENGTH: 10,
//     ALIEN_SPEED: 1500,
//   },
// ]
// var level = gLevel[0]
// function selectLevel(i) {
//   level = gLevel[i]
//   console.log(level)
//   onInit()
// }

// function createBtnLevel() {
//   var btnVal = ''
//   for (var i = 0; i < 3; i++) {
//     btnVal += `<button onclick="selectLevel(${i})">${gLevel[i].LEVEL}</button>`
//   }
//   document.querySelector('.levels-container').innerHTML = btnVal
// }
