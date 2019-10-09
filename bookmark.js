const clockContainer= document.querySelector(".clock"),
    clockTime =clockContainer.querySelector(".time"),
    clockDate =clockContainer.querySelector(".date");


function changeColor() {


}
function clock() {
    const clock= new Date();

    const year = clock.getFullYear();
    const month = clock.getMonth();
    const day = clock.getDay();
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
function colorHover(type)  {
    if (type=="GH") {
        document.getElementById("GR").style.backgroundColor = '#58ACFA';
        document.getElementById("GR").style.opacity = 1000;
    }   else if(type=="NH") {
        document.getElementById("NR").style.backgroundColor = '#58FA58';
        document.getElementById("NR").style.opacity = 1000;
    }
}
function unColorHover(type)  {
    if (type=="GH") {
        document.getElementById("GR").style.backgroundColor = '#F2F2F2';
        document.getElementById("GR").style.opacity = 0.3;
    }  else if(type=="NH") {
        document.getElementById("NR").style.backgroundColor = '#F2F2F2';
        document.getElementById("NR").style.opacity = 0.3;
    }

}
function openPop()  {
    document.getElementById("registerPop").style.display="block";
    document.getElementById("registerPop").style.position="relative";
    document.getElementById("registerPop").style.left="40%";
}
init();
/*
쿠키 : 이전 흔적
세션 : key , value -> server (web)
쿠키가 보안에 더 약=> 가벼운 정보
세션 => 중요 정보
 */