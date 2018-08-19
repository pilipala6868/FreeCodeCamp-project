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


	//点击增加/减少时间
	$(".setupBt").click(function(e) {
		if (!start)
		{
			//增加时间
			if (e.target.id == 'addsession' || e.target.id == 'addbreak')
			{
				var origTime = $(this).prev().text();
				$(this).prev().text(++origTime);
			}
			//减少时间
			else
			{
				var origTime = $(this).next().text();
				if (origTime > 1)
					$(this).next().text(--origTime);
			}
			
			//在session时改变session
			if (!onbreak && (e.target.id == 'addsession' || e.target.id == 'subsession'))
			{
				//改变表盘session数字
				$("#curminute_num").text(origTime);
				$("#cursecond_num").text('0');
				//清空已过时间
				$("polyline").attr('points', '');
				passangle = [0, 0];
				//tip改为start
				$("#tip_left").html("<i class='fa fa-wheelchair-alt'></i>Start");
				//新开始标记
				newstart = true;
			}
			//在break阶段改变break
			if (onbreak && (e.target.id == 'addbreak' || e.target.id == 'subbreak'))
			{
				//改变表盘break数字
				$("#curminute_num").text(origTime);
				$("#cursecond_num").text('0');
				//清空已过时间
				$("polyline").attr('points', '');
				passangle = [0, 0];
				//tip改为start
				$("#tip_left").html("<i class='fa fa-wheelchair-alt'></i>Start");
				//新开始标记
				newstart = true;
			}
		}
	});


	var start = false;
	var newstart = true;
	var onbreak = false;
	//点击左时钟 开始/暂停
	$('#clock_left').click(function() {
		var sessionMin = $("#sessionnum").text();
		var breakMin = $("#breaknum").text();

		if (start)
		{
			start = false;
			stopConfig();
			//暂停时间运转
			clearInterval(timetravel[0]);
			clearInterval(timetravel[1]);
		}
		else
		{
			start = true;
			if (newstart)  //新开始
			{
				var temp = $("#curminute_num").text();
				$("#curminute_num").text(--temp);
				$("#cursecond_num").text('60');
				newstart = false;
			}
			startConfig();

			//启动运转
			if (onbreak)
				goround(0, breakMin * 60);
			else
				goround(0, sessionMin * 60);
			goround(1, 60);
		}
	});

	//点击右时钟 重置
	$('#clock_right').click(function() {
		var sessionMin = $("#sessionnum").text();

		//停止时间运转
		clearInterval(timetravel[0]);
		clearInterval(timetravel[1]);

		//标记重置
		start = false;
		newstart = true;
		onbreak = false;

		//调整界面显示
		$("#timeslot").text('SESSION');
		$("#timeslot, #sloticon").css('color', '#343a40');
		$("#sloticon").html("<i class='fa fa-free-code-camp'></i>");
		stopConfig();

		//改变表盘session数字
		$("#curminute_num").text(sessionMin);
		$("#cursecond_num").text('0');
		//清空已过时间
		$("polyline").attr('points', '');
		passangle = [0, 0];
	});


	//鼠标移到时钟
	$(".clock").mouseenter(function(e) {
		if (e.target.id == "clock_left")
			$(".tip:eq(0)").fadeTo(200, 1);
		else
			$(".tip:eq(1)").fadeTo(200, 1);
	});
	$(".clock").mouseleave(function(e) {
		if (e.target.id == "clock_left")
			$(".tip:eq(0)").stop(true).fadeTo(100, 0);
		else
			$(".tip:eq(1)").stop(true).fadeTo(100, 0);
	});


	//开始暂停的打包设置
	function stopConfig()
	{
		//设置区可选
		$('.setupBt').css('cursor', 'pointer');
		$(".setup_num").css('color', '#343a40');
		//tip改为start
		$("#tip_left").html("<i class='fa fa-wheelchair-alt'></i>Start");
	}
	function startConfig()
	{
		//设置区不可选
		$('.setupBt').css('cursor', 'default');
		$(".setup_num").css('color', '#6c757d');
		//tip改为stop
		$("#tip_left").html("<i class='fa fa-hand-paper-o'></i>Stop");
	}


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


	var timetravel = []; //定时器变量
	var passangle = [0, 0];  //已经转过多少角度，为暂停继续而用，因为要分别加减而用两个，否则一次会加减两倍

	//设置弧线转动 (which: 0为left/1为right, time: 总时间 xxs)
	function goround(which, time)
	{
		//定时器间隔时间（1度）
		var intervalTime = 60 * 1000 / 360;

		//时间轴选择器
		var polyElem = which? "#arc_right polyline": "#arc_left polyline";
		//表盘数字选择器
		var clockNumElm = which? "#cursecond_num": "#curminute_num";

		var pointnum = $(polyElem).attr('points');  //polyline的points属性值
		var radius = parseInt($("#clock_left").css('width')) / 2;  //半径为时钟半径
		var x, y, radian;

		//每多少角度表盘过1格
		var everylattice = which? 1: time/60;
		//每多少角度数字-1
		var everynumber = which? 6: 360;

		//调整弧线位置
		adjustArcPosi();

		//时间轴流动
		timetravel[which] = setInterval(function() {

			passangle[which]++;  //时刻记录当前已过角度
			//这轮时间到
			if (passangle[which] > time*6)
			{
				//清除时间轨道
				passangle[which] = 0;
				pointnum = "";

				//分钟
				if (which == 0)
				{
					//进入break
					if (!onbreak)
					{
						//调整界面显示
						$("#timeslot").text('BREAK');
						$("#timeslot, #sloticon").css('color', '#ffc107');
						$("#sloticon").html("<i class='fa fa-s15'></i>");
						var breaknum = $("#breaknum").text();
						$("#curminute_num").text(breaknum);
						onbreak = true;
						//调整time
						time = breaknum * 60;
						everylattice = time / 60;
					}
					//再进入sesson
					else
					{
						//调整界面显示
						$("#timeslot").text('SESSION');
						$("#timeslot, #sloticon").css('color', '#343a40');
						$("#sloticon").html("<i class='fa fa-free-code-camp'></i>");
						var sessionnum = $("#sessionnum").text();
						$("#curminute_num").text(sessionnum);
						onbreak = false;
						//调整time
						time = sessionnum * 60;
						everylattice = time / 60;
					}
				}
				//秒钟
				else
				{
					$('#cursecond_num').text('60');
				}
			}

			//角度转弧度
			radian = (passangle[which] / everylattice) * (Math.PI / 180);  
			//计算x,y坐标值
			x = (radius + Math.sin(radian) * radius + 10).toFixed(1);
			y = (radius - Math.cos(radian) * radius + 10).toFixed(1);

			//时间轴运转
			if (passangle[which] % everylattice == 0)
			{
				//增加points属性值
				pointnum += x + ',' + y + ' ';
				$(polyElem).attr('points', pointnum);
			}

			//表盘数字变化
			if (passangle[which] % everynumber == 0)
			{
				var origTime = $(clockNumElm).text();
				$(clockNumElm).text(--origTime);
			}

		}, intervalTime);
	}

});