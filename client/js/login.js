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
                alert('Got a token from the server! Token: ' + data.token);
            },
            error: function() {
                alert("Login Failed");
            }
        });
        return false;
    });
});