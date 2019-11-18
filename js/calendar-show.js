const currentTitle = document.getElementById('current-year-month');
const calendarBody = document.getElementById('calendar-body');
// 오늘 날짜, 연도, 요일 정보 다 담기
let today = new Date();
// 첫날 설정, 이제 getYear 아니고 getFullYear 임
let first = new Date(today.getFullYear(), today.getMonth(),1);

// 요일, 달, 윤년 데이 저장
const dayList= ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const monthList= ['January','February','March','April','May','June','July','August','September','October','November','December'];
const leapYear = [31,29,31,30,31,30,31,31,30,31,30,31];
const notLeapYear = [31,28,31,30,31,30,31,31,30,31,30,31];

// 출력할 폼이랑 정보 => 년도랑 요일들
let pageFirst = first;
let pageYear;
    //윤년일 경우
    if(first.getFullYear()%4 ===0){
        pageYear=leapYear;
    }else{
        pageYear=notLeapYear;
    }

function showCalendar() {
    let monthCnt = 100;
   let cnt = 1;
    // 최대 6주 출력 (row)
    for (let i=0;i<6;i++){
        let $tr = document.createElement('tr');
        $tr.setAttribute('id', monthCnt);
        // 7일 출력 (column)
        for(let j=0; j<7; j++){
            // 첫주에 시작하는 요일부터 날짜 출력 + 달력 출력 종료 조건 = 빈칸으로 행 채우기
            if((i=== 0 &&first.getDay()) || cnt>pageYear[first.getMonth()]){
                let $td = document.createElement('td');
                $tr.appendChild($td);
            }
            else{
                let $td = document.createElement('td');
                $td.textContent = cnt;
                $td.setAttribute('id', cnt);
                $tr.appendChild($td);
                cnt++;
            }
        }
        monthCnt++;
        calendarBody.appendChild($tr);
    }

}
    showCalendar();

    function removeCalendar() {
        let catchTr = 100;
        for(let i=100;i<106;i++){
            let $tr = document.getElementById(catchTr);
            $tr.remove();
            catchTr++;
        }
    }