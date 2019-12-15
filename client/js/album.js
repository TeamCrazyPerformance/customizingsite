function getMyAlbumInfo() {
    $.ajax({
        url: "http://cs.kuvh.kr/api/album",
        headers: {"x-access-token": localStorage.token},
        success: function(data) {
            $(".handwritten").text(data.handwritten);
            $(".side-text").text(data.description);

            $.each(data.items, function(i, obj) {
                const itemId = obj.itemId;
                const imgKey = obj.imgKey;
                const title = obj.title;
                const description = obj.description;
                const d = new Date(obj.date);
                const date = d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();

                $(".gg-box").append(`<div class=\"gg-element\" data-id=\"${itemId}\"><img src=\"https://customizingsite.s3.ap-northeast-2.amazonaws.com/${imgKey}\"></div>`); //<div class="cover">${title} ${description} ${date}</div>
            });
        },
        error: function() {
            //TODO Login Check
            alert("Fail to load data");
        }
    });
}

$(document).ready(function() {
    getMyAlbumInfo();
});