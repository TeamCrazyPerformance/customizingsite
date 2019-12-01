var currentTitle = document.getElementById('current-year-month');
var calendarBody = document.getElementById('calendar-body');
var today = new Date();
var first = new Date(today.getFullYear(), today.getMonth(), 1);
var dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var leapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var notLeapYear = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var pageFirst = first;
var pageYear;

var prev = document.getElementById("prev");
var next = document.getElementById("next");
var inputBox = document.getElementById('input-box');

var mainTodayDay = document.getElementById('main-day');
var mainTodayDate = document.getElementById('main-date');

if (first.getFullYear() % 4 === 0) {
    pageYear = leapYear;
} else {
    pageYear = notLeapYear;
}

function showCalendar() {
    let monthCnt = 100;
    let cnt = 1;
    for (var i = 0; i < 6; i++) {
        var $tr = document.createElement('tr');
        $tr.setAttribute('id', monthCnt);
        for (var j = 0; j < 7; j++) {
            if ((i === 0 && j < first.getDay()) || cnt > pageYear[first.getMonth()]) {
                var $td = document.createElement('td');
                $tr.appendChild($td);
            } else {
                var $td = document.createElement('td');
                $td.textContent = cnt;
                $td.setAttribute('id', cnt);
                $tr.appendChild($td);
                cnt++;
            }
        }
        monthCnt++;
        calendarBody.appendChild($tr);
    }

    currentTitle.innerHTML = monthList[first.getMonth()] + '&nbsp;&nbsp;&nbsp;&nbsp;' + first.getFullYear();
}



function removeCalendar() {
    let catchTr = 100;
    for (var i = 100; i < 106; i++) {
        var $tr = document.getElementById(catchTr);
        $tr.remove();
        catchTr++;
    }
}

$(document).ready(function () {
    showCalendar();
    showMain(today);
    clickedDate1 = document.getElementById(today.getDate());
    clickedDate1.classList.add('active');
    clickStart();
    reshowingList();
});


// node =>  export require()
// 전역 변수 다 함수 안에 넣기
// 함수 안에 있지 않은건 다 애기

