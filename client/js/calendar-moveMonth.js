function movePrev() {
    // 투두리스트 삭제
    inputBox.value = "";
    const $divs = document.querySelectorAll('#input-list > div');
    $divs.forEach(function (e) {
        e.remove();
    });
    const $btns = document.querySelectorAll('#input-list > button');
    $btns.forEach(function (e1) {
        e1.remove();
    });

    //1월이면 연도랑 달 모두 바꾸
    if (pageFirst.getMonth() === 1) {
        pageFirst = new Date(first.getFullYear() - 1, 12, 1);
        first = pageFirst;
        if (first.getFullYear() % 4 === 0) {
            pageYear = leapYear;
        } else {
            pageYear = notLeapYear;
        }
    } else {
        pageFirst = new Date(first.getFullYear(), first.getMonth() - 1, 1);
        first = pageFirst;
    }
    today = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());


    currentTitle.innerHTML = monthList[first.getMonth()] + '&nbsp;&nbsp;&nbsp;&nbsp;' + first.getFullYear();
    removeCalendar();
    showCalendar();
    showMain(today);
    clickedDate1 = document.getElementById('today.getDate()');
    clickedDate1.classList.add('active');
    clickStart();
    reshowingList();
}

function moveNext() {
    // 투두리스트 삭제
    inputBox.value = "";
    const $divs = document.querySelectorAll('#input-list > div');
    $divs.forEach(function (e) {
        e.remove();
    });
    const $btns = document.querySelectorAll('#input-list > button');
    $btns.forEach(function (e1) {
        e1.remove();
    });

    // 12월이면 연도랑 달 모두 바꾸기
    if (pageFirst.getMonth() === 12) {
        pageFirst = new Date(first.getFullYear() + 1, 1, 1);
        first = pageFirst;
        if (first.getFullYear() % 4 === 0) {
            pageYear = leapYear;
        } else {
            pageYear = notLeapYear;
        }
    } else {
        pageFirst = new Date(first.getFullYear(), first.getMonth() + 1, 1);
        first = pageFirst;
    }
    today = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

    currentTitle.innerHTML = monthList[first.getMonth()] + '&nbsp;&nbsp;&nbsp;&nbsp;' + first.getFullYear();
    removeCalendar();
    showCalendar();
    showMain(today);
    clickedDate1 = document.getElementById('today.getDate()');
    clickedDate1.classList.add('active');
    clickStart();
    reshowingList();
}

function changeMonth() {
    prev.addEventListener('click', movePrev);
    next.addEventListener('click', moveNext);
}