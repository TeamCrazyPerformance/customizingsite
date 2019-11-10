function prev() {
    // 투두리스트 리셋
    inputBox.value = "";
    const $divs = document.querySelectorAll('#input-list >div');
    $divs.forEach(function (e) {
        e.remove();

    });
    const $btns = document.querySelectorAll('#input-list>button');
    $btns.forEach(function (e1) {
        e1.remove();
    });
    // 1월인 경우 예외처리
    if(pageFirst.getMonth()===1){
        pageFirst = new Date(first.getFullYear()-1, 12, 1);
        first = pageFirst;
        // 윤년 처리까지 ..
        if(first.getFullYear() %4 === 0){
            pageYear = leapYear;
        }else{
            pageYear = notLeapYear;
        }
    } else {
        pageFirst = new Date(first.getFullYear(), first.getMonth()-1, 1);
        first = pageFirst;
    }

    today = new Date(today.getFullYear(), today.getMonth()-1, today.getDate());
    currentTitle.innerHTML = monthList[first.getMonth()]+'&nbsp;&nbsp;&nbsp;'+ first.getFullYear();
    removeCalendar();
    showCalendar();

    // 나중에 만들 변수랑 함수들 
    showMain();
     clickedDate1 = document.getElementById(today.getDate());
     clicedDate1.classList.add('active');
    clickStart();
    reshowingList();
}
