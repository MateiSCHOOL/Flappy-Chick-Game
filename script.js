console.log("Version updated 25.03.24")
const canvas = document.getElementById("myCanvas")
const context = canvas.getContext("2d")

const scoreDisplay = document.getElementById("myScore")
const scoreContext = scoreDisplay.getContext("2d")

const difficultyDisplay = document.getElementById("myDifficulties")
const difficulties = document.querySelectorAll(".difficulty")
document.body.style.zoom = screen.height / 13 + "%" /*Zooms user's POV */

/*Sets up username box input + variable to check whether username already given */
const userNameBox = document.getElementById("username")
let usernameGiven = false
let username
userNameBox.addEventListener("keyup", event => {
    if (event.code == "Enter"){
        username = userNameBox.value
        console.log(username)
        userNameBox.style.display = "none"
        usernameGiven = true
    }
})

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

/*Sound setup*/
let flapSound = new Audio("wingflap.mp3")
let startSound = new Audio("wingstart.mp3")
let loseSound = new Audio("birdfall.mp3")

difficulties.forEach(difficulty => difficulty.addEventListener("click", Initialize))
/*Listens for input from user in the difficulty choice box and initializes program by triggering Initialize function*/

/*These 2 event listeners wait for keyboard or click input from the user and change the bird's y coordinate if the game is running*/
window.addEventListener("keyup", event => {
    if((event.code == "Space" || event.code == "ArrowUp") && running == true){
        bird.y -= 75
        flapSound.play()
        checkOver()
    }
})
canvas.addEventListener("click", event => {
    if(running == true){
        bird.y -= 75
        flapSound.play()
        checkOver()
    }
})

function Initialize(){
    let difficultyLevel = Number(this.getAttribute("difficultyIndex"))
    difficultyDisplay.style.display = "none"
    console.log(difficultyLevel)
   
    /*Program remembers the difficulty to be used at a later date and removes the difficulty selection box since program has started */
 
    score = 0 /*Resets score */

    /*Resets Score Box */
    scoreDisplay.style.display = "block"
    scoreContext.font = "32px Permanent Marker, Cursive"
    scoreContext.fillStyle = "rgb(48, 48, 48)"
    scoreContext.fillRect(0, 0, 100, 100)
    scoreContext.fillStyle = "white"
    scoreContext.textAlign = "center"


    scoreContext.fillText(`${score}`, 50, 50)

    health = 1 - (difficultyLevel) /*Resets health */

    bird.x = 100 /*Resets user's x position, in case they've just won and need a reset position */
    bird.y = 100 /*Resets user's y position */

    /*Initializes game */
    running = true
    clearCanvas()
    drawBird()
    startSound.play()
    createPillars(difficultyLevel)
    nextFrame(difficultyLevel)
}

function nextFrame(difficultyLevel){
    const Interval = setInterval(update, 100)
    function update(){
        if (running == true){
            velocity = Math.sqrt(19.6*(700 - (700 - bird.y)))
            velocity = velocity / 4
            bird.y = bird.y + velocity
            /*Velocity calculated and adjusted for game by me */

            pillar1.x -= 10
            pillar2.x -= 10

            checkCollision()
            checkOver()
            checkScore(difficultyLevel)
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

function createPillars(difficultyLevel){
    let auxilary = (difficultyLevel * 100)
    console.log(auxilary)
    pillar1.x = 500
    pillar2.x = 500
    function createRandom(){
        return Math.floor(Math.random() * (20))
        /*Generates random integer number between 0 (included) and 25 (excluded)*/
    }
    pillar1.height = createRandom() * 20
    pillar2.height = pillar1.height + 300 - auxilary
    pillar2.y = 700 - pillar2.height
    console.log(pillar2.height - pillar1.height)
}
/*Function checks whether player has surpassed pillars so that it can give point and create next pillars */
function checkScore(difficultyLevel){
    if (pillar1.x + 100 <= 0){
        createPillars(difficultyLevel)
        score += 1

        if (bestScore < score){
            bestScore = score
        }
   
        /*Resets and writes on the mini canvas, dedicated for score display */
        scoreContext.fillStyle = "rgb(48, 48, 48)"
        scoreContext.fillRect(0, 0, 100, 100)

        scoreContext.font = "32px Permanent Marker, Cursive"
        scoreContext.fillStyle = "white"
        scoreContext.textAlign = "center"
        scoreContext.fillText(`${score}`, 50, 50)

        if (health < 1){
            health += 0.25
            /*Increases health if possible as user surpasses a pillar */
        }

        if ( (score == 20 && difficultyLevel == 0) || (score == 50 && difficultyLevel == 0.5) || (score == 100 && difficultyLevel == 0.75) ) {
            winSequence() /*Begins win sequence function if the user has reached the required score for their difficulty */
        }
    }
}
/*Checks if game has ended: this occurs when either player has run out of  health, or has collided with the ground/exceeded bounds */
function checkOver(){
    if (bird.y > 650 || bird.y < 0 || health <= 0){
        health = 0
        running = false
        clearCanvas()
        drawBird()
        drawPillars()
        loseSound.play()
        setTimeout(clearCanvas, 500)
        setTimeout(loseText, 1000)
        setTimeout(scoreText, 1000)

        /*Removes the score indicator from below the canvas and instead shows difficulty bar so user can start new game */
        scoreDisplay.style.display = "none"
        difficultyDisplay.style.display = "grid"

        /*if username has not been received, then username input becomes available */
        if (usernameGiven == false) {
            userNameBox.style.display = "block"
        }
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
    context.font = "30px Permanent Marker, Cursive"
    context.fillStyle = "red"
    context.textAlign = "center"
    context.fillText("poor chick...", 250, 350)
    context.fillText(`bad: ${username}`, 250, 500) /*Puts user's name into end screen */
}

/*Creates the text which states user's best score and current score*/
function scoreText(){
    context.font = "30px Permanent Marker, Cursive"
    context.fillStyle = "white"
    context.textAlign = "center"
    context.fillText(`current score: ${score}`, 250, 400)
    context.fillText(`best score: ${bestScore}`, 250, 450)
}

/*Animation for when user has won */
function winSequence(){
    const flyInterval = setInterval(flyAnimation, 100)
    let x=0
    x += 1

    console.log("user has won")
    function flyAnimation(){
        if (bird.x <= 500){
            running = false
            clearCanvas()
            bird.x += 15
            flapSound.play()
            drawBird()
        }
        else{
            clearInterval(flyInterval)
            context.font = "36px Permanent Marker, Cursive"
            context.fillStyle = "green"
            context.textAlign = "center"
            context.fillText("you saved the baby chick!", 250, 350)
            scoreText()
            context.fillText(`good job: ${username}`, 250, 500) /*Puts user's name into win screen */

            /*Removes the score indicator from below the canvas and instead shows difficulty bar so user can start new game */
            scoreDisplay.style.display = "none"
            difficultyDisplay.style.display = "grid"

            /*if username has not been received, then username input becomes available */
            if (usernameGiven == false) {
                userNameBox.style.display = "block"
            }
        }
    }
}
