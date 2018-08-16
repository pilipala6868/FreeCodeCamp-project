$(document).ready(function() {
  var allBullet = [];  //所有弹幕
  var colorList = ['red', 'black', 'orange', 'blue', 'green', 'purple', 'brown', '#99CC99', '#FFFF00', '#FF6666', '#006633', '#00CC00', '#663300', '#CCCCCC'];
  var moveTime = [8, 25];  //弹幕移动时间范围
  var fontSize = [20, 30];  //字体大小范围
  var maxBulletNum = 30;  //屏幕上最多弹幕数
  var randomSendTime = 3000;  //随机弹幕发送时间
  
  var wallTop = $("#wall").offset().top + 20;
  var wallHeight = parseInt($("#wall").css("height")) - 60;
  var wallLeft = $("#wall").offset().left;
  var wallRight = wallLeft + parseInt($("#wall").css("width"));
  
  //弹幕遮蔽窗大小
  var coverWidth = ($(window).width() - parseFloat($("#wall").css("width"))) / 2;
  var coverHeight = parseFloat($("#wall").css("height"));
  var coverTop = $("#wall").offset().top;
  var coverRightLeft = coverWidth + parseFloat($("#wall").css("width"));
  $("#coverLeft, #coverRight").css(
  {
    "left": 0,
    "top": coverTop,
    "width": coverWidth,
    "height": coverHeight
  });
  $("#coverRight").css("left", coverRightLeft);

  //发送弹幕
  $("#sendBt").click(function() 
  {
    var inputText = $.trim($("#inputText").val());
    $("#inputText").val("");  //清空输入框
    
    if (inputText == "")
      return 0;
    //弹出当前弹幕
    sendBullet(inputText)
    //加入弹幕组
    allBullet.push(inputText);
  });
  
  //回车发送弹幕
  $("#inputText").keydown(function(){	    
    if (event.keyCode == "13")
      $("#sendBt").trigger('click');
  });
  
  //清屏
  $("#clearBt").click(function() 
  {
    allBullet = [];
    //清除当前屏上所有弹幕元素
    $(".bullet").remove();
    //重新开始定时弹幕
    clearInterval(myInterval);
    myInterval = setInterval(randomlySend(), randomSendTime);
  });

  //发送一个弹幕
  function sendBullet(sendText)
  {
    var bullet = $("<div class='bullet'>" + sendText + "<//div>");
    var time = (moveTime[0] + (moveTime[1]-moveTime[0]) * Math.random()) * 1000;
    var top = wallTop + wallHeight * Math.random();
    var color = colorList[Math.floor(colorList.length * Math.random())];
    var fontsize = fontSize[0] + (fontSize[1]-fontSize[0]) * Math.random();
    
    //弹幕显示
    bullet.css({
      'top': top,
      'left': wallRight,
      'color': color,
      'font-size': fontsize
    });
    $("body").append(bullet);
    
    //弹幕移动
    $(bullet).animate({left: "-200px"}, time, "linear", function() {
      $(this).remove();
    });
  }
  
  //随机弹出已有弹幕
  function randomlySend()
  {
    var bulletNow = $(".bullet").length;
    if (allBullet.length == 0 || maxBulletNum - bulletNow < 3)
      return 0;
    
    if (allBullet.length < 3)
      var loopTime = Math.floor(2 * Math.random());
    else
      var loopTime = Math.floor((allBullet.length-2) * Math.random());
    
    for(var i=0; i<loopTime; i++)
    {
      setTimeout(function(){
        sendBullet(allBullet[Math.floor(allBullet.length * Math.random())]);
      }, i*1000 + 5000*Math.random());
    }
  }
  
  var myInterval = setInterval(function(){ randomlySend(); }, randomSendTime);
});