
$(document).ready(function() {

  //动态显示模块
  $("#wiki_ball, #searchBox").slideDown(1000);

  //鼠标移到wiki_ball
  $("#wiki_ball img").mouseenter(function() {
    $(this).animate({width: '330px'}, 300);
  });
  $("#wiki_ball img").mouseleave(function() {
    $(this).stop(true).animate({width: '300px'}, 200);
  });


  //搜索
  $("#search button").click(function() {
    var inputText = $.trim($("#inputDiv input").val());
    //输入为空
    if (inputText == "")
    {
      $("#inputDiv input").val("").focus();
      return;
    }
    getWiki(inputText);
    $("#wiki_ball, #notFound").hide(400);
    $("#searchBox").css("margin-top", '30px');
  });

  //回车搜索
  $("#inputDiv input").keydown(function(){     
    if (event.keyCode == "13")
      $("#search button").trigger('click');
  });


  //Wiki API获取信息
  function getWiki(keyword)
  {
    $.ajax({
      type: 'post',
      url: "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + keyword + "&prop=info&inprop=url&utf8=&format=json",
      dataType: 'jsonp',
      success: function(data) {
        //先移除已有结果
        $(".infoBox").remove();
        //添加新信息
        fillInfo(data.query.search);
      }
    });
  }

  //填入显示信息
  function fillInfo(data)
  {
    //无搜索结果
    if (data.length == 0)
    {
      $("#notFound").show(600);
      $('body').css('background-size', '2000px 1000px');  //body高度小于窗口高度，需调整背景高度
      return;
    }

    $('body').css('background-size', 'auto');

    for (var i=0; i<data.length; i++)
    {
      var title = data[i].title;
      var link = "https://en.wikipedia.org/?curid=" + data[i].pageid;
      var content = data[i].snippet;
      var htmlText = "<div class='infoBox'>\
                        <a href='" + link + "' target='_blank'>\
                          <div class='searchTitle'>" + title + "</div>\
                          <div class='searchText'>" + content + "</div>\
                        </a>\
                      </div>";
      $(htmlText).appendTo("#allInfo");
    }

    //鼠标移到infoBox
    $(".infoBox").mouseenter(function() {
      $(this).animate({borderLeftWidth: '5px'}, 200);
    });
    $(".infoBox").mouseleave(function() {
      $(this).stop(true).animate({borderLeftWidth: '2px'}, 100);
    });
  }

});