



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


    if (color_add === "")    {
        alert("색상을 입력해주세요.");
        return;
    }
    if (url_add === "")    {
        alert("URL을 입력해주세요.");
        return;
    }

    if (title_add === "")    {
        alert("타이틀을 입력해주세요.");
        return;
    }
    if (initial_add === "")    {
        alert("이니셜을 입력해주세요.");
        return;
    }
    var font_color = idealTextColor(color_add);
    $("#add_button").remove();
    document.getElementById("registerPop").style.display="none";
    var disp = "";

    disp = disp+'<a href="'+url_add+'">';
    disp = disp+'<div class="bookmark-item G">';
    disp = disp+'<div class="bookmark-icon" style="background-color:'+color_add+'">';
    disp = disp+'<span style="color:'+font_color+'">'+initial_add+'</span>';
    disp = disp+'<span class="bookmark-desc">';
    disp = disp+title_add;
    disp = disp+'</span> </div> </div></a>';

    disp = disp+'<a href="javascript:openPop()" id ="add_button">';
    disp = disp+'<div class="bookmark-item"> <div class="bookmark-icon"> + </div> </div> </a>';


    $("#container_add").append(disp);

    popupClear();
}
function removePop(type)    {
    $("#delete_"+type).remove();
}
function getRGBComponents(color) {

    var r = color.substring(1, 3);
    var g = color.substring(3, 5);
    var b = color.substring(5, 7);

    return {
        R: parseInt(r, 16),
        G: parseInt(g, 16),
        B: parseInt(b, 16)
    };
}
function popupClear()   {
    $("#color_add").val("");
    $("#url_add").val("");
    $("#title_add").val("");
    $("#initial_add").val("");

}
function idealTextColor(bgColor) {

    var nThreshold = 105;
    var components = getRGBComponents(bgColor);
    var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);

    return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
}
/* 혜민 할일
0. 첫번째 추가 누르면 개행되는 것
 1. 팝업 스타일 tnwjd
 2. 흰색 배경 -> 까망이 글씨 (rgb )
 3. 유효하지 않은 주소 처리
*/