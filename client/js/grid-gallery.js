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

$(document).on('click','.gg-element',function(){
  var selected=$(this);
  var prev=$(this).prev().first();
  var next=$(this).next().first();
  $('#gg-screen').show();
  var l=$(".gg-element").length-1;
  var p=$(".gg-element").index(selected);
  function buttons(){
      const account = getUrlVars()['account'];
      if(account) {
          if (l > 1) {
              if (p == 0){
                  return '<div class="gg-close gg-bt">&times</div><div class="gg-nxt gg-bt">&rarr;</div>';
              }
              else if (p == l) {
                  return '<div class="gg-close gg-bt">&times</div><div class="gg-prev gg-bt">&larr;</div>';
              }
              else{
                  return '<div class="gg-close gg-bt">&times</div><div class="gg-nxt gg-bt">&rarr;</div><div class="gg-prev gg-bt">&larr;</div>';
              }
          }
          else{
              return '<div class="gg-close gg-bt">&times</div>';
          }
      } else {
          if (l > 1) {
              if (p == 0){
                  return '<div class="gg-close gg-bt">&times</div><div class="gg-nxt gg-bt">&rarr;</div><div class="gg-del gg-bt fas fa-trash"></div>';
              }
              else if (p == l) {
                  return '<div class="gg-close gg-bt">&times</div><div class="gg-prev gg-bt">&larr;</div><div class="gg-del gg-bt fas fa-trash"></div>';
              }
              else{
                  return '<div class="gg-close gg-bt">&times</div><div class="gg-nxt gg-bt">&rarr;</div><div class="gg-prev gg-bt">&larr;</div><div class="gg-del gg-bt fas fa-trash"></div>';
              }
          }
          else{
              return '<div class="gg-close gg-bt">&times</div><div class="gg-del gg-bt">&rarr;</div>';
          }
      }
  }
  buttons();
  var content=buttons();
  $("#gg-screen").html('<div class="gg-image"></div>' + content);
  $(".gg-image").html('<img src="'+ $(this).css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1') +'">');
  //$("body").css('overflow','hidden');
  $(document).on('click','.gg-close',function(){
    $("#gg-screen").hide();
    //$("body").css('overflow','auto');
  });
  $("#gg-screen").on('click', function(e) {
    if (e.target == this){
      $("#gg-screen").hide();
      //$("body").css('overflow','auto');
    }
  });
  $(document).on('click','.gg-prev',function(){
    selected=selected.prev();
    prev=selected.first();
    var previmg='<img src="'+ prev.css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1') +'">';
    $(".gg-image").html(previmg);
    p=$(".gg-element").index(selected);
    buttons();
    content=buttons();
    $("#gg-screen").html('<div class="gg-image">'+ previmg + '</div>' + content);
  });
  $(document).on('click','.gg-nxt',function(){
    selected=selected.next();
    next=selected.first();
    var nxtimg='<img src="'+ next.css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1') +'">';
    $(".gg-image").html(nxtimg);
    p=$(".gg-element").index(selected);
    buttons();
    content=buttons();
    $("#gg-screen").html('<div class="gg-image">'+ nxtimg + '</div>' + content);
  });
  $(document).on('keydown',function(e) {
    if(e.keyCode == 37 && p>0) {
      selected=selected.prev();
      prev=selected.first();
      var previmg='<img src="'+ prev.css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1') +'">';
      $(".gg-image").html(previmg);
      p=$(".gg-element").index(selected);
      buttons();
      content=buttons();
      $("#gg-screen").html('<div class="gg-image">'+ previmg + '</div>' + content);
    }
    else if(e.keyCode == 39 && p < l) {
      selected=selected.next();
      next=selected.first();
      var nxtimg='<img src="'+ next.css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1') +'">';
      $(".gg-image").html(nxtimg);
      p=$(".gg-element").index(selected);
      buttons();
      content=buttons();
      $("#gg-screen").html('<div class="gg-image">'+ nxtimg + '</div>' + content);
    }
  });
  $(document).off('click', '.gg-del');
  $(document).on('click', '.gg-del', function() {
    if (confirm("정말 삭제하시겠습니까?")) {
      delAlbumItem(selected.first().attr('data-id'));
    }
  });
  $(document).off('click', '.gg-edit');
  $(document).on('click', '.gg-edit', function() {
    editAlbumItem(selected.first().attr('data-id'));
  });
});
