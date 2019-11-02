$(document).ready(function(){
    $(".register-form").validate({
    rules: {
        nickname: {
            required: true,
            minlength: 4
        },
        email: {
            required: true,
            email: true
        },
        password: {
            required: true,
            minlength: 5
        },
        cpassword: {
            required: true,
            minlength: 5,
            equalTo: "#password"
        }
    },
    //For custom messages
    messages: {
        nickname: {
            required: "Enter a nickname",
            minlength: "Enter at least 4 characters"
        }
    },
    errorElement: 'div',
    errorPlacement: function (error, element) {
        var placement = $(element).data('error');
        if (placement) {
            $(placement).append(error)
        } else {
            error.insertAfter(element);
        }
    },
    submitHandler : function(){
            $.ajax({
                cache: false,
                type: "POST",
                url: "http://cs.kuvh.kr/user/register",
                data: {
                    nickname: $('input#nickname').val(),
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
    }
});
});