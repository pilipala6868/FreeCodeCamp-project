$(document).ready(function() {

	//窗口大小变化
	$(window).resize(function() {
		//调整弧线位置
		adjustArcPosi();
	});

	//设置svg的宽高
	$('svg').css({
		'height': parseInt($("#clock_left").css('height')) + 20,
		'width': parseInt($("#clock_left").css('width')) + 20
	});


	//点击增加时间
	$("#addbreak, #addsession").click(function(e) {
		var origTime = $(this).prev().text();
		$(this).prev().text(++origTime);
		if (e.target.id == 'addsession')
			$("#curminute span:eq(0)").text(origTime);
	});
	//点击减少时间
	$("#subbreak, #subsession").click(function(e) {
		var origTime = $(this).next().text();
		if (origTime != 1)
			$(this).next().text(--origTime);
		if (e.target.id == 'subsession')
			$("#curminute span:eq(0)").text(origTime);
	});


	var start = false;
	//点击时钟
	$('.clock').click(function() {
		var currentMin = $("#curminute span:eq(0)").text();
		var currentSec = $("#cursecond span:eq(0)").text();
		if (start)
		{
			start = false;
		}
		else
		{
			start = true;////////////////////////////////////////////////////////////////////
			goround('left', currentMin * 60);
			goround('right', currentSec);
		}

		//开始途中没法改session length
		//开始后暂停 改session length 重来，改break则不会
		//到break时间，时钟字改break，右边改图标
		//session时全用绿色？break红色
		//时间轴颜色改亮些？
	});


	//调整弧线位置
	function adjustArcPosi()
	{
		var clocklist = ['#clock_left', '#clock_right'];
		var arclist = ["#arc_left", "#arc_right"];

		for (var i=0; i<2; i++)
		{
			//时钟位置
			var clockLeft = $(clocklist[i]).offset().left;
			var clockTop = $(clocklist[i]).offset().top;

			//设置弧线位置
			$(arclist[i]).css({
				'top': clockTop - 10,  //让弧线偏移它的宽度大小，防止最顶部和最左部被遮挡到
				'left': clockLeft - 10
			});
		}
	}
	adjustArcPosi();


	//设置弧线转动一圈 (which: left/right, time: 总时间 xxs, already: 已经过去多少角度)
	function goround(which, time, passangle)
	{
		//定时器间隔时间
		var passangle = passangle | 0;
		var intervalTime = time * 1000 / 360;

		//选择器
		var polyElem = "#arc_" + which + " polyline";

		var pointnum = "";  //polyline的points属性值
		var radius = parseInt($("#clock_left").css('width')) / 2;  //半径为时钟半径
		var x, y, radian;

		//调整弧线位置
		adjustArcPosi();

		var angle = passangle;
		var timetravel = setInterval(function() {
			//角度转弧度
			radian = angle * (Math.PI / 180);  
			//计算x,y坐标值
			x = (radius + Math.sin(radian) * radius + 10).toFixed(1);
			y = (radius - Math.cos(radian) * radius + 10).toFixed(1);

			//增加points属性值
			pointnum += x + ',' + y + ' ';
			$(polyElem).attr('points', pointnum);

			angle++;
			if (angle > 360)
				clearInterval(timetravel);
		}, intervalTime);
	}

});