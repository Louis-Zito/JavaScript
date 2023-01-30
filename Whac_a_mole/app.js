const squares = document.querySelectorAll('.square');
const mole = document.querySelector('.mole');
const timeLeft = document.querySelector('#time-left');
const score = document.querySelector('#score');

let result = 0;
let hitPosition;
let currentTime = 10;
let moleSpeed = null;

function randomSquare(){
    //square is placeholder var can use any
    squares.forEach(square => {
        //remove mole from array of squares
        square.classList.remove('mole');
    })

    //want random pos 0 - 8
    let randomSquare = squares[Math.floor(Math.random() * 9)];
    randomSquare.classList.add('mole');

    hitPosition = randomSquare.id;
}

squares.forEach(square => {
    square.addEventListener('mousedown', () => {
        if (square.id == hitPosition){
            result++;
            score.textContent = result;
            hitPosition = null;
        }
    })
})

function moveMole(){
    //call function every 500 ms for mole speed
    moleSpeed = setInterval(randomSquare, 500);
}

moveMole();

function countDown(){
    currentTime--;
    timeLeft.textContent = currentTime;

    if (currentTime == 0){
        clearInterval(countDownTimerId);
        clearInterval(moleSpeed);
        alert('Game Over - final score is ' + result);
    }
}

//timer for game length
let countDownTimerId = setInterval(countDown, 1000)