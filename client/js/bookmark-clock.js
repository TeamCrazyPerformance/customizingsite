const clockContainer= document.querySelector(".bookmark-clock"),
    clockTime =clockContainer.querySelector(".bookmark-time"),
    clockDate =clockContainer.querySelector(".bookmark-date");


function clock(){
    const clock= new Date();

    const year = clock.getFullYear();
    const month = clock.getMonth()+1;
    const day = clock.getDate();
    const hours = clock.getHours();
    const minutes = clock.getMinutes();
    const seconds = clock.getSeconds();

    clockDate.innerText = `${year}.${month<10? `0${month}`: month}.${day<10? `0${day}`:day}`;
    clockTime.innerText = `${hours <10? `0${hours}`: hours} : ${minutes<10? `0${minutes}`: minutes } : ${seconds<10? `0${seconds}` : seconds}`;
}

function init() {
    clock();
    setInterval(clock, 1000);

}

init();
