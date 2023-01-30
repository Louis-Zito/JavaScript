const timeLeftDisplay = document.querySelector('#time-left')
const resultDisplay = document.querySelector('#result')
const StartPausebutton = document.querySelector('start-pause-button')
const squares = document.querySelectorAll('.grid div')
const width = 9
let currentIndex = 76

function moveFrog(e){

    squares[currentIndex].classList.remove('frog')

    switch(e.key){
        case 'ArrowLeft':
            currentIndex -= 1
            break
        case 'ArrowRight':
            currentIndex += 1
            break
        case 'ArrowUp':
            currentIndex -= width
            break
        case 'ArrowDown':
            currentIndex += width
            break
    }
    squares[currentIndex].classList.add('frog')
}

document.addEventListener('keyup', moveFrog)