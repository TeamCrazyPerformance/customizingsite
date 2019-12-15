function getMyAlbumInfo() {
    $.ajax({
        url: "http://cs.kuvh.kr/api/album",
        headers: {"x-access-token": localStorage.token},
        success: function(data) {
            initIEPopup(data);

            $(".handwritten").text(data.handwritten);
            $(".side-text").text(data.description);

            $.each(data.items, function(i, obj) {
                const itemId = obj.itemId;
                const imgKey = obj.imgKey;
                const title = obj.title;
                const description = obj.description;
                const d = new Date(obj.date);
                const date = d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();

                $(".gg-box").append(`<div class=\"gg-element\" data-id=\"${itemId}\" style=\"background-image:url(https://customizingsite.s3.ap-northeast-2.amazonaws.com/${imgKey})"\><div><br><br><span>${date}</span><h3>${title}</h3><p>${description}</p></div></div>`);
            });
        },
        error: function() {
            alert("로그인이 필요합니다.");
            location.href="/login.html?backUrl=/album.html";
        }
    });
}

function initIEPopup(data) {
    $("#handwritten").val(data.handwritten);
    $("#description").val(data.description);
    $("#isPublic").attr('checked', data.isPublic);

    $("#ieform").submit(function(event){
        event.preventDefault();
        var data = {
            handwritten: $("#handwritten").val(),
            description: $("#description").val(),
            isPublic: $("#isPublic").is(":checked")
        };

        $.ajax({
            type: "POST",
            url: "http://cs.kuvh.kr/api/album",
            contentType: 'application/json',
            headers: {"x-access-token": localStorage.token},
            data: JSON.stringify(data),
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
    getMyAlbumInfo();
});