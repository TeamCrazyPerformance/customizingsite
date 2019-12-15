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
                url: "http://cs.kuvh.kr/api/user/register",
                data: {
                    nickname: $('input#nickname').val(),
                    email: $('input#email').val(),
                    password: $('input#password').val()
                },
                success: function(data) {
                    alert("회원가입을 완료하였습니다.");
                    location.href="/";
                },
                error: function() {
                    alert("회원가입에 실패하였습니다.\n입력 내용을 확인해 주세요.");
                }
            });
            return false;
    }
});
});
