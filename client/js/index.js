function logout() {
    localStorage.token = null;
    location.reload();
}

$(document).ready(function() {
    if(localStorage.token) {
        $.ajax({
            url: "http://cs.kuvh.kr/api/user/myinfo",
            headers: {"x-access-token": localStorage.token},
            success: function(data) {
                $("#footer > span").html(`${data.nickname}님 환영합니다! <a href="#" onclick="logout()"> 로그아웃</a>`);
            },
            error: function() {
                localStorage.token = null;
            }
        });
    }
});