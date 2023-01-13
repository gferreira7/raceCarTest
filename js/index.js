let gameStart = false
let updateInterval

window.onload = () => {
  document.getElementById('start-button').onclick = () => {
    gameStart = true
    startGame()
  }

  function startGame() {
    updateCanvas()
  }
}

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const road = new Image()
road.src = '../images/road.png'

class Car {
  constructor() {
    this.x = 225
    this.y = 550

    const car = new Image()

    car.addEventListener('load', () => {
      this.car = car
      if (gameStart) {
        this.draw()
      }
    })

    car.src = '../images/car.png'
  }

  moveLeft() {
    if (this.x >= 100) {
      this.x -= 25
    }
  }

  moveRight() {
    if (this.x <= 350) this.x += 25
  }

  draw() {
    ctx.drawImage(this.car, this.x, this.y, 50, 100)
  }
}

class Obstacle {
  constructor(width, startingX) {
    this.height = 50
    this.width = width
    this.startingX = startingX
    this.y = 0
  }

  draw() {
    ctx.fillStyle = 'red'
    ctx.fillRect(this.startingX, this.y, this.width, this.height)
  }
}

const newCar = new Car()

const obstaclesArray = []
let survivedObstacles = 0
let currentScore = 0

setInterval(() => {
  const randWidth = Math.floor(Math.random() * 125) + 75
  const randStartingX = Math.floor(Math.random() * 125) + 75
  
  const newObstacle = new Obstacle(randWidth, randStartingX)
  obstaclesArray.push(newObstacle)
}, 3000)

const obstacle1 = new Obstacle(100, 100)

document.addEventListener('keydown', (e) => {
  switch (e.keyCode) {
    case 37:
      newCar.moveLeft()
      break
    case 39:
      newCar.moveRight()
      break
  }
})


const updateCanvas = () => {
  updateInterval = setInterval(() => {

    ctx.clearRect(0, 0, 500, 700)
    ctx.drawImage(road, 0, 0, 500, 700)

    updateObstacles()
    updateScore()
    newCar.draw()
  }, 1000 / 60)
}

const updateObstacles = () => {
  obstaclesArray.forEach((obstacle) => {
    
    obstacle.y += 5

    // every obstacle that is survived by car increases combo and score adds exponentially
    if (obstacle.y >= 650) {
      obstaclesArray.shift()
      survivedObstacles++
      currentScore += 1 * survivedObstacles
    }
    obstacle.draw()
    if(isGameOver(obstacle)){
      gameStart = false
      clearInterval(updateInterval)
      
      ctx.fillStyle = 'black'
      ctx.font = '60px Arial'
      ctx.fillText('GAME OVER', 150, 150, 250)
    }
  })
}

// updates every frame
const updateScore = () => {
  ctx.fillStyle = 'white'
  ctx.font = '30px Arial'
  ctx.fillText(
    `Score: ${currentScore}
    Combo: ${survivedObstacles}`,
    75,
    50,
    150
  )
}

// check for collision on every obstacle every frame
const isGameOver = (obstacle) => {
  if (obstacle.y > 500 && obstacle.y < 600) {
    //eligible for collision
    if (obstacle.startingX > newCar.x) {
      return false
    } else {
      if (obstacle.startingX + obstacle.width < newCar.x) {
        return false
      } else {
        return true
      }
    }
  } else {
    return false
  }
}

