/*
1. home => 사진 및 프로필 설정
2. resume => 파일 업로드
3. projects => 수정, 추가, 삭제
4. contacts => 수정, 연락 전송
 */


/*
1. home => 사진 및 프로필 설정
 */
const browseBtn = document.querySelector('.browse-btn');
const realInput = document.querySelector('#real-input');

browseBtn.addEventListener('click',()=>{
    realInput.click();
});




        // 사진파일 미리보기
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#img-preview').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$("#real-input").change(function() {
    readURL(this);
});
/*
2. resume => 파일 업로드
*/
// 이력서 수정


function saveEdits(num) {
    var editEle =$("#edit_"+num);
    var userVersion = editEle.innerHTML;

    localStorage.userEdits = userVersion;
}

/*
3. projects => 수정, 추가, 삭제
*/
// 삭제

function openPop()  {
    document.getElementById("registerPop").style.display="inline-block";
    document.getElementById("registerPop").style.position="relative";
    document.getElementById("registerPop").style.left="60%";

}
function addContent()   {

    var title = document.getElementById("title_add").value;
    var content = document.getElementById("content_add").value;
    var url = document.getElementById("url_add").value;



    if (title === "")    {
        alert("제목을 입력해주세요.");
        return;
    }
    if (url === "")    {
        alert("URL을 입력해주세요.");
        return;
    }

    if (content === "")    {
        alert("내을 입력해주세요.");
        return;
    }

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



function removePop(type) {
    $("#delete_" + type).remove();
}
/*
4. contacts => 수정, 연락 전송
*/