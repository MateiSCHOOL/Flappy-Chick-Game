const canvas = document.getElementById("myCanvas")
const context = canvas.getContext("2d")
const scoreDisplay = document.getElementById("myScore")
const difficultyDisplay = document.getElementById("myDifficulties")
const difficulties = document.querySelectorAll(".difficulty")
document.body.style.zoom = screen.height / 11 + "%" /*Zooms user's POV */
/*
Basic Setup to allow me to acces DOM (Document Object Model) elements with ease
*/

/*Variable Setup */

let score, velocity, health, running, bestScore = 0

let bird = {
    x:100,
    y:300,
    width:50,
    height:50
}
let pillar1 = {
    x:0,
    y:0,
    height:0
}
let pillar2 = {
    x:0,
    y:0,
    height:0
}


/*Image setup*/
birdImage = new Image()
birdImage.src = "Bird.png"


difficulties.forEach(difficulty => difficulty.addEventListener("click", Initialize))
/*Listens for input from user in the difficulty choice box and initializes program by triggering Initialize function*/

/*These 2 event listeners wait for keyboard or click input from the user and change the bird's y coordinate if the game is running*/
window.addEventListener("keyup", event => {
    if((event.code == "Space" || event.code == "ArrowUp") && running == true){
        bird.y -= 75
        checkOver()
    }
})
canvas.addEventListener("click", event => {
    if(running == true){
        bird.y -= 75
        checkOver()
    }
})

function Initialize(){
    let difficultyLevel = Number(this.getAttribute("difficultyIndex"))
    difficultyDisplay.style.display = "none"
    console.log(difficultyLevel)
    scoreDisplay.style.display = "block"
    /*Program remembers the difficulty to be used at a later date and removes the difficulty selection box since program has started */
 
    score = 0 /*Resets score */
    scoreDisplay.textContent = score

    health = 1 - (difficultyLevel) /*Resets health */

    bird.y = 100 /*Resets user position */

    /*Initializes game */
    running = true
    clearCanvas()
    drawBird()
    createPillars()
    nextFrame(difficultyLevel)
}

function nextFrame(difficultyLevel){
    const Interval = setInterval(update, 100)
    function update(){
        if (running == true){
            velocity = Math.sqrt(19.6*(700 - (700 - bird.y)))
            velocity = velocity / (4 - difficultyLevel) /*The higher the difficulty level, the higher the velocity */
            bird.y = bird.y + velocity
            /*Velocity calculated and adjusted for game by me */

            pillar1.x -= 10
            pillar2.x -= 10

            checkCollision()
            checkOver()
            checkScore()
            clearCanvas()
            drawPillars()
            drawBird()
        }
        else{
            clearInterval(Interval)
            console.log("Program stopped")
        }
    }
}


/*Draw functions which update the canvas with changes made*/

function clearCanvas(){
    context.fillStyle = "skyblue"
    context.fillRect(0, 0, 500, 700)

    context.fillStyle = "green"
    context.fillRect(0, 700, 500, 50)
}

function drawBird(){
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height)

    /*Health Bar Graphical Representation */
    context.fillStyle = "rgb(102,255,0)" /*rgb code notation for a shade of green I like  */
    context.fillRect(bird.x, bird.y + 50, 50 * health, 20)

    context.fillStyle = "red"
    context.fillRect(bird.x + (50 * health), bird.y + 50, 50*(1-health), 20)
    /*Creates health bar outline */
    context.strokeRect(bird.x, bird.y + 50, 50, 20)
}

function drawPillars(){
    context.fillStyle = "lightgreen"
    context.strokeStyle = "black"
    context.fillRect(pillar1.x, pillar1.y, 100, pillar1.height)
    context.fillRect(pillar2.x, pillar2.height, 100, pillar2.y)

    /*Creates pillar outline*/
    context.strokeRect(pillar1.x, pillar1.y, 100, pillar1.height)
    context.strokeRect(pillar2.x, pillar2.height, 100, pillar2.y)
}

/*Generates pillar coordinates*/

function createPillars(){
    pillar1.x = 500 
    pillar2.x = 500
    function createRandom(){
        return Math.floor(Math.random() * (25))
        /*Generates random integer number between 0 (included) and 25 (excluded)*/
    }
    pillar1.height = createRandom() * 20
    pillar2.height = pillar1.height + 200
    pillar2.y = 700 - pillar2.height
}
/*Function checks whether player has surpassed pillars so that it can give point and create next pillars */
function checkScore(){
    if (pillar1.x + 100 <= 0){
        createPillars()
        score += 1
        scoreDisplay.textContent = score
        if (health < 1){
            health += 0.25
        }
    }
}
/*Checks if game has ended: this occurs when either player has run out of  health, or has collided with the ground/exceeded bounds */
function checkOver(){
    if (bird.y > 650 || bird.y < 0 || health <= 0){
        health = 0
        running = false

        if (bestScore < score){
            bestScore = score
        }
        
        setTimeout(clearCanvas, 500)
        setTimeout(loseText, 1000)
        setTimeout(scoreText, 1000)
        scoreDisplay.style.display = "none"
        difficultyDisplay.style.display = "grid"
    }
}
/*Checks if player has collided with pillar*/
function checkCollision(){
    if (pillar1.x <= 150 && pillar1.x >= 0)
    {
        if(bird.y <= pillar1.height || bird.y + 50 >= pillar2.height){
            health -= 0.25
            console.log(health)
            checkOver()
        }
    }
}

/*Creates the text which informs the user that they have lost*/
function loseText(){
    context.font = "36px Permanent Marker, Cursive"
    context.fillStyle = "red"
    context.textAlign = "center"
    context.fillText("poor chick...", 250, 350)
}

/*Creates the text which states user's best score and current score*/
function scoreText(){
    context.font = "30px Permanent Marker, Cursive"
    context.fillStyle = "white"
    context.textAlign = "center"
    context.fillText(`current score: ${score}`, 250, 400)
    context.fillText(`best score: ${bestScore}`, 250, 450)
}
