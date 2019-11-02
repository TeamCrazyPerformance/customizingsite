function openPop()  {
    document.getElementById("registerPop").style.display="block";
    document.getElementById("registerPop").style.position="relative";
    document.getElementById("registerPop").style.left="40%";
}
function addContent()   {

    var color_add = document.getElementById("color_add").value;
    var url_add = document.getElementById("url_add").value;
    var title_add = document.getElementById("title_add").value;
    var initial_add = document.getElementById("initial_add").value;

    if (color_add == "")    {
        alert("색상을 입력해주세요.");
        return;
    }
    if (url_add == "")    {
        alert("URL을 입력해주세요.");
        return;
    }
    if (title_add == "")    {
        alert("타이틀을 입력해주세요.");
        return;
    }
    if (initial_add == "")    {
        alert("이니셜을 입력해주세요.");
        return;
    }
    $("#add_button").remove();
    document.getElementById("registerPop").style.display="none";
    var disp = "";

    disp = disp+'<a href="'+url_add+'">';
    disp = disp+'<div class="bookmark-item G">';
    disp = disp+'<div class="bookmark-icon" style="background-color:'+color_add+'">';
    disp = disp+initial_add;
    disp = disp+'<span class="bookmark-desc">';
    disp = disp+title_add;
    disp = disp+'</span> </div> </div></a>';

    disp = disp+'<a href="javascript:openPop()" id ="add_button">';
    disp = disp+'<div class="bookmark-item"> <div class="bookmark-icon"> + </div> </div> </a>';


    $("#container_add").append(disp);

    popupClear();
}
function popupClear()   {
    $("#color_add").val("");
    $("#url_add").val("");
    $("#title_add").val("");
    $("#initial_add").val("");

}

/* 혜민 할일
 1. 팝업 스타일
 2. 흰색 배경 -> 까망이 글씨 (rgb )
 3. 이메일 유효하지 않은 주소 처리
*/