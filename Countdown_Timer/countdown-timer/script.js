const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minsEl = document.getElementById('mins');
const secondsEl = document.getElementById('seconds');

const newYears = '1 Jan 2023';

function countdown(){
    const newYearsDate = new Date(newYears);
    const currentDate = new Date();

    //convert mili to seconds
    const totalSeconds = (newYearsDate - currentDate) / 1000;
    //seconds to days
    const days = Math.floor(totalSeconds / 3600 / 24);
    //days to hours
    const hours = Math.floor(totalSeconds / 3600) % 24;
    //second to minutes
    const minutes = Math.floor(totalSeconds / 60) % 60;
    //seconds
    const seconds = Math.floor(totalSeconds) % 60;

    daysEl.innerHTML = days;
    hoursEl.innerHTML = formatTime(hours);
    minsEl.innerHTML = formatTime(minutes);
    secondsEl.innerHTML = formatTime(seconds);
}

//prepend 0 if time < 10
function formatTime(time){
    return time < 10 ? `0${time}` : time;
}

//initial call
countdown();

//call every milisecond
setInterval(countdown, 1000)