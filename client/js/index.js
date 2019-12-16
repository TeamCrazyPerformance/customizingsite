function logout() {
    localStorage.token = null;
    location.reload();
}

function initMypage() {
    $("#wrapper").append("<!-- MyPage Dialog -->\n" +
        "\t\t\t\t<div id=\"mypage\" class=\"modal\">\n" +
        "\t\t\t\t\t<h2>마이페이지</h2>\n" +
        "\t\t\t\t\t<form>\n" +
        "\t\t\t\t\t\t<div class=\"form-group\">\n" +
        "\t\t\t\t\t\t\t<label for=\"name\">Account</label>\n" +
        "\t\t\t\t\t\t\t<input type=\"text\" name=\"account\" class=\"text required\" id=\"account\" placeholder=\"어카운트 이름을 입력해주세요\" required>\n" +
        "\t\t\t\t\t\t</div>\n" +
        "\t\t\t\t\t\t<div class=\"form-group\">\n" +
        "\t\t\t\t\t\t\t<input type=\"submit\" value=\"저장\" class=\"button submit\">\n" +
        "\t\t\t\t\t\t</div>\n" +
        "\t\t\t\t\t</form>\n" +
        "\t\t\t\t</div>");

    $("form").submit(function(event){
        event.preventDefault();
        var data = $(this).serializeArray();

        $.ajax({
            type: "PUT",
            url: "http://cs.kuvh.kr/api/user/account",
            headers: {"x-access-token": localStorage.token},
            data: data,
            success: function(data) {
                alert("정보가 수정되었습니다.");
                location.reload();
            },
            error: function() {
                alert("잠시 후 다시 시도해주세요.");
            }
        });
    });
}

$(document).ready(function() {
    if(localStorage.token) {
        $.ajax({
            url: "http://cs.kuvh.kr/api/user/myinfo",
            headers: {"x-access-token": localStorage.token},
            success: function(data) {
                initMypage();
                $("#footer > span").html(`${data.nickname}님 환영합니다!&nbsp<a href="#mypage" rel="modal:open">마이페이지</a>&nbsp<a href="#" onclick="logout()">로그아웃</a>`);
                $("#account").val(data.account);
            },
            error: function() {
                localStorage.token = null;
            }
        });
    }
});