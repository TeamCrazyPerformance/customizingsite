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

function getMyAlbumInfo() {
    $.ajax({
        url: "http://cs.kuvh.kr/api/album",
        headers: {"x-access-token": localStorage.token},
        success: function(data) {
            $("nav > ul").append("<li><a href=\"#iepopup\" rel=\"modal:open\" class=\"fas fa-edit\"></a></li>\n" +
                "                <li><a href=\"#addpopup\" rel=\"modal:open\" class=\"fas fa-plus\"></a></li>");

            initIEPopup(data);
            initAddPopup();

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

function getAccountAlbumInfo(account) {
    $.ajax({
        url: `http://cs.kuvh.kr/api/album/${account}`,
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

                $(".gg-box").append(`<div class=\"gg-element\" data-id=\"${itemId}\" style=\"background-image:url(https://customizingsite.s3.ap-northeast-2.amazonaws.com/${imgKey})"\><div><br><br><span>${date}</span><h3>${title}</h3><p>${description}</p></div></div>`);
            });
        },
        error: function() {
            alert("존재하지 않는 사용자거나 비공개 상태입니다.");
            history.back();
        }
    });
}

function delAlbumItem(itemId) {
    $.ajax({
        type: "DELETE",
        url: `http://cs.kuvh.kr/api/album/${itemId}`,
        contentType: 'application/json',
        headers: {"x-access-token": localStorage.token},
        success: function(data) {
            alert("정상적으로 삭제되었습니다.");
            location.reload();
        },
        error: function() {
            alert("잠시 후 다시 시도해주세요.");
        }
    });
}

function initIEPopup(data) {
    $("#ieform input[name='handwritten']").val(data.handwritten);
    $("#ieform input[name='description']").val(data.description);
    $("#ieform input[name='isPublic']").attr('checked', data.isPublic);

    $("#ieform").submit(function(event){
        event.preventDefault();
        var data = {
            handwritten: $("#ieform input[name='handwritten']").val(),
            description: $("#ieform input[name='description']").val(),
            isPublic: $("#ieform input[name='isPublic']").is(":checked")
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

function initAddPopup() {
    $("#datepicker").datepicker({ dateFormat: "yy-mm-dd" }).val()

    $("#addform").submit(function(event){
        event.preventDefault();

        var form = $('#addform')[0];
        var data = new FormData(form);

        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "http://cs.kuvh.kr/api/album/upload",
            headers: {"x-access-token": localStorage.token},
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function(data) {
                alert("사진이 추가되었습니다.");
                location.reload();
            },
            error: function() {
                alert("잠시 후 다시 시도해주세요.");
            }
        });
    });
}

$(document).ready(function() {
    const account = getUrlVars()['account'];
    if(account) {
        getAccountAlbumInfo(account);
    } else {
        getMyAlbumInfo();
    }
});