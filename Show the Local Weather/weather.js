
$(document).ready(function() {
  //将body宽度设为窗口宽度，以让渐变色充满屏幕
  $('body').height($(document).height());
  
  //动态显示各模块
  $(".wBox-left").animate({opacity: 1}, 1000);
  $(".wBox-right").delay(500).animate({opacity: 1}, 1000);
  
  //检测有无城市cookie
  if ($.cookie('city'))
  {
    //隐藏输入框
    $("#cityInput, #cityBtn").css('display', 'none');
    //显示城市
    $("#citySpan").text($.cookie('city'));
    $("#cityX").css('display', 'inline');
    //获取天气
    getWeather($.cookie('city'));
  }
  else
  {
    //先默认显示北京的天气
    getWeather('北京');
  }
  
  //填入城市
  $("#cityBtn").click(function() {
    var cityVal = $.trim($("#cityInput").val());
    if (cityVal != "")
    {
      //记录cookie
      $.cookie('city', cityVal);
      //隐藏输入框
      $("#cityInput, #cityBtn").css('display', 'none');
      //显示城市
      $("#citySpan").text(cityVal);
      $("#citySpan, #cityX").css('display', 'inline');
      //获取天气
      getWeather(cityVal);
    }
  });
  //回车查询城市
  $("#cityInput").keydown(function(){     
    if (event.keyCode == "13")
      $("#cityBtn").trigger('click');
  });


  //鼠标移到城市X
  $("#cityX").mouseenter(function() {
    $(this).css('color', '#c33');
  });
  $('#cityX').mouseleave(function() {
    $(this).css('color', '#333');
  });
  
  //鼠标点击城市X，更换城市
  $("#cityX").click(function() {
    //隐藏城市
    $("#citySpan, #cityX").css('display', 'none');
    //显示输入框
    $("#cityInput, #cityBtn").css('display', 'inline');
  });

  
  var weekdays = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thur.', 'Fri.', 'Sat.'];

  //通过API获取天气
  function getWeather(city)
  {
    var weatherURL = "https://api.map.baidu.com/telematics/v3/weather?location=" + city + "&output=json&ak=H7W5CxI0BPzKtwGcBHmpGPAz50xP1Qjw";

    $.ajax({
        url: weatherURL,
        dataType: "jsonp",
        jsonpCallback: "admin_cross",
        success:function(data){
          if (data.error == 0)
            fillInfo(data);
          else
          {
            alert("请求错误，请输入正确的城市名");
            //隐藏城市
            $("#citySpan, #cityX").css('display', 'none');
            //显示输入框
            $("#cityInput, #cityBtn").css('display', 'inline');
            //先默认显示北京的天气  
            getWeather('北京');
          }
        }
    });
  }

  //根据json填充信息
  function fillInfo(data) 
  {
    var today_info = data.results[0]['index'];
    var weather_data = data.results[0]['weather_data'];

    //今日日期
    var d = new Date();
    var todayDate = d.getMonth()+1 + '月';
    if (d.getDate() < 10)
      todayDate += '0';
    todayDate += d.getDate() + '日';
    //星期几
    var todayWeekday = weekdays[d.getDay()];
    //实时温度
    var temperNow = weather_data[0].date.match(/\d+℃/)[0];
    //所在地
    var city = data.results[0]['currentCity'];
    //今日图片链接
    var picToday = [weather_data[0].dayPictureUrl, weather_data[0].nightPictureUrl];

    //今日天气信息
    var today_weather = weather_data[0].weather;
    var today_wind = weather_data[0].wind;
    var today_temperature = weather_data[0].temperature;
    var today_pm25 = data.results[0].pm25;

    //today-left
    $("#main-temper").text(temperNow);
    $("#main-date span:eq(0)").text(todayDate);
    $("#main-date span:eq(1)").text(todayWeekday);
    $("#main-below span").text(city);
    $("#main-below img:eq(0)").attr('src', picToday[0]);
    $("#main-below img:eq(1)").attr('src', picToday[1]);

    //today-right
    $(".rightList:eq(0) span").text(today_weather);
    $(".rightList:eq(1) span").text(today_temperature);
    $(".rightList:eq(2) span").text(today_wind);
    $(".rightList:eq(3) span").text('pm:' + today_pm25);

    //todayItem
    $(".todayItem tr:eq(0) .itemBody").text(today_info[0].des);
    $(".todayItem tr:eq(1) .itemBody").text(today_info[2].des);
    $(".todayItem tr:eq(2) .itemBody").text(today_info[3].des);

    //wBox-right
    for(var i=1; i<4; i++)
    {
      //日期
      var dd = new Date();
      dd.setDate(dd.getDate() + i);
      var theDate = dd.getMonth()+1 + '月';
      if (dd.getDate() < 10)
        theDate += '0';
      theDate += dd.getDate() + '日';
      //星期几
      var theWeekday = weekdays[dd.getDay()];
      //各项信息
      var the_weather = weather_data[i].weather;
      var the_wind = weather_data[i].wind;
      var the_temperature = weather_data[i].temperature;
      //图片链接
      var thePic = [weather_data[i].dayPictureUrl, weather_data[i].nightPictureUrl]

      //填值 左
      $(".wBox-right:eq("+(i-1)+") .right-date span:eq(0)").text(theDate);
      $(".wBox-right:eq("+(i-1)+") .right-date span:eq(1)").text(theWeekday);
      $(".wBox-right:eq("+(i-1)+") .right-temper").text(the_temperature);
      //填值 中
      $(".wBox-right:eq("+(i-1)+") .right-item:eq(0) span").text(the_weather);
      $(".wBox-right:eq("+(i-1)+") .right-item:eq(1) span").text(today_wind);
      //填值 右
      $(".right-image img:eq(0)").attr('src', thePic[0]);
      $(".right-image img:eq(1)").attr('src', thePic[1]);
    }
  }


  //鼠标移到各个块
  $("#today-left, #today-right, .todayItem tr, .wBox-right").mouseenter(function() {
    $(this).animate({backgroundColor: "#ffc"}, 200);
  });
  $("#today-left, #today-right, .todayItem tr, .wBox-right").mouseleave(function() {
    $(this).animate({backgroundColor: "#fff"}, 100);
  });


  //时间持续变化
  function setTimeStr()
  {
    var d = new Date();
    //年
    var timeNow = d.getFullYear() + '-';
    //月
    if (d.getMonth() + 1 < 10)
      timeNow += '0';
    timeNow += (d.getMonth()+1) + '-';
    //日
    if (d.getDate() < 10)
      timeNow += '0';
    timeNow += d.getDate() + ' ';
    //时
    if (d.getHours() < 10)
      timeNow += '0';
    timeNow += d.getHours() + ':';
    //分
    if (d.getMinutes() < 10)
      timeNow += '0';
    timeNow += d.getMinutes();

    $("#headline-right").text(timeNow);
  }
  setTimeStr();
  setInterval(function(){setTimeStr();}, 8000);


  //背景图片持续渐变 (图片路径，图片总数，变化间隔时间)
  var bgUrls = [
    "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-678072.jpg",
    "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-672834.jpg",
    "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-643549.jpg",
    "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-571024.jpg",
    "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-555769.jpg",
    "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-535624.jpg"
  ];

  //背景图片预加载
  for(var i=0; i<bgUrls.length; i++)
  {
    $("<img />").attr('src', bgUrls[i]);
  }

  function bgChanging(bgUrls, sumOfBg, changeTime)  
  {
    var lastnum = randomBg(0);  //上一个背景序数
    $("<img id='backgroundImage1' />").appendTo('body').css('opacity', '0');
    $("<img id='backgroundImage2' />").appendTo('body').css('opacity', '0');
    //显示背景
    $("#backgroundImage1").attr('src', bgUrls[lastnum]).fadeTo(300, 1);

    setInterval(function()
    {
        var b1 = $('#backgroundImage1');
        var b2 = $('#backgroundImage2');
        lastnum = randomBg(lastnum);
        
        if (b1.css('opacity') == '1')
        {
            b1.fadeTo(800, 0);
            b2.attr('src', bgUrls[lastnum]).fadeTo(800, 1);
        }
        else 
        {
            b2.fadeTo(800, 0);
            b1.attr('src', bgUrls[lastnum]).fadeTo(800, 1);
        }
    }, changeTime);

    //随机返回背景序数
    function randomBg(lastnum)
    {
        var randomnum = Math.ceil(Math.random()*sumOfBg);
        //防止生成的数字跟原背景序数一样
        while (randomnum == lastnum)
            randomnum = Math.ceil(Math.random()*sumOfBg);
        return randomnum;
    }
  }

  bgChanging(bgUrls, bgUrls.length, 8000);
});