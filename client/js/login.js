function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

$(document).ready(function(){
    $('#login').click(function() {

        $.ajax({
            cache: false,
            type: "POST",
            url: "http://cs.kuvh.kr/api/auth/login",
            data: {
                email: $('input#email').val(),
                password: $('input#password').val()
            },
            success: function(data) {
                localStorage.token = data.token;
                const backUrl = getUrlVars()['backUrl'];
                if(backUrl)
                    location.href=backUrl;
                else
                    location.href="/";
            },
            error: function() {
                alert("아이디 또는 비밀번호를 확인하세요.");
            }
        });
        return false;
    });
});