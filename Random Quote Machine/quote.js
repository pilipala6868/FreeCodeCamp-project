$(document).ready(function() {
  //颜色列表
  var colorList = ['rgb(22, 160, 133)', 'rgb(39, 174, 96)', 'rgb(44, 62, 80)', 'rgb(243, 156, 18)', 'rgb(231, 76, 60)', 'rgb(155, 89, 182)', 'rgb(251, 105, 100)', 'rgb(52, 34, 36)', "rgb(71, 46, 50)", "rgb(189, 187, 153)", "rgb(119, 177, 169)", "rgb(115, 168, 87)"];
  //当前颜色
  var currentColor;

  //更新内容
  function updateContent()
  {
    //随机颜色
    currentColor = colorList[Math.floor(Math.random()*colorList.length)];
    while (currentColor == $('body').css('color'))
      currentColor = colorList[Math.floor(Math.random()*colorList.length)];

    var firstAnimate = true;  //使animate回调函数只执行一次，否则回调函数会执行两次，奇怪

    //隐藏文段
    $("#sentence, #source").animate({opacity: 0}, 500, function() {

      if (firstAnimate)
      {
        firstAnimate = false;

        //更改文段内容
        $.getJSON("https://api.lwl12.com/hitokoto/v1?encode=realjson", function(data) {
          $("#sentence span").text(data.text);
          if (data.source == "")
            data.source = "风里雨里";
          $("#source").text("—— " + data.source);
          //更改分享链接title
          var shareHref = "http://service.weibo.com/share/share.php?appkey=752983629&title=" + data.text + "&language=zh_cn";
          $("#share").attr("href", shareHref);
        });

        //更改文段颜色
        $('#sentence, #source').css('color', currentColor);
        //显示文段
        $("#sentence, #source").animate({opacity: 1}, 1000);
        //更改背景颜色
        $('body, .bts').animate({backgroundColor: currentColor}, 1000);
      }
    });
  }

  updateContent();
  
  //点击随风飘散
  $('#getSent').click(function() {
    updateContent();
  });

  //鼠标移到按钮
  $("#share, #getSent").mouseenter(function() {
    //计算高亮后颜色
    var currentRGB = $(this).css('backgroundColor').slice(4, -1).split(", ");
    currentRGB = currentRGB.map(function(val) {
      val = parseInt(val);
      return val += 30;
    });
    currentRGB = "rgb(" + currentRGB.join(", ") + ")";
   
    $(this).css('background-color', currentRGB);
  });
  //鼠标移开按钮
  $("#share, #getSent").mouseleave(function() {
    $(this).css('background-color', currentColor);
  });
});