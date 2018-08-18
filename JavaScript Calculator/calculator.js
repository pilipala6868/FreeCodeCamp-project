
$(document).ready(function() {

	//鼠标移到按键
	$(".key").mouseover(function() {
		$(this).css('background-color', '#cfd9df');
	});
	$(".key").mouseleave(function() {
		$(this).stop(true).css('background-color', '#dee7ec');
	});


	//点击按键
	$(".key").click(function(e) {
		var content = $("#formula").text();
		//上次刚运算完
		if (operated)
		{
			//上次结果为NaN或Infinity
			if (content == 'NaN' || content == 'Infinity')
			{
				if (/[+\-×÷%]/.test(e.target.innerText))
					return;
			}
			
			operated = false;
			//点击数字
			if (/\d/.test(e.target.id))
			{
				$("#formula").text(e.target.id);
				return;
			}
			//点击小数点
			else if (e.target.id == "point")
			{
				$("#formula").text("0.");
				return;
			}
			//点击等于
			else if (e.target.id == "equal")
			{
				return;
			}
		}

		switch(e.target.id)
		{
			//清除功能
			case "ac":
				$("#formula").text("0");
				break;

			//清除单个
			case "ce":
				if (content.length == 1)
					$("#formula").text("0");
				else
					$("#formula").text(content.slice(0, -1));
				break;

			//数字
			case "0": case "1": case "2": case "3": case "4": 
			case "5": case "6": case "7": case "8": case "9":
				var pressNum = e.target.id;
				if (content == "0")
					content = "";
				if (content.slice(-1) != 'π')
					$("#formula").text(content + pressNum);
				break;

			//运算符
			case "add": case "sub": case "mul": case "div": case "mod":
				var operator = e.target.innerText;
				//最后是小数点
				if (content.slice(-1) == '.')
					$("#formula").text(content.slice(0, -1) + operator);
				//最后是数字
				else if (/\d/.test(content.slice(-1)) == true || content.slice(-1) == 'π')
					$("#formula").text(content + operator);
				break;

			//π
			case "pi":
				if (/[+\-×÷%]/.test(content.slice(-1)) == true)
					$("#formula").text(content + 'π');
				else if (content == "0")
					$("#formula").text('π');
				break;

			//小数点
			case "point":
				if (/\d/.test(content.slice(-1)) == true)
					$("#formula").text(content + '.');
				else if (content.slice(-1) != '.' && content.slice(-1) != 'π')
					$("#formula").text(content + '0.');
				break;

			//等于
			case "equal":
				//最后不是运算符才可以
				if (/\d/.test(content.slice(-1)) == true || content.slice(-1) == 'π' || content.slice(-1) == '.')
				{
					var result = run(content);
					$("#formula").text(result);
				}
				break;
		}
	});


	//点击键盘
	$(document).keydown(function(e) {
		var keycode = e.keyCode;
		switch(keycode)
		{
			//数字键
			case 96: case 97: case 98: case 99: case 100: 
			case 101: case 102: case 103: case 104: case 105:
				$("#"+(keycode-96)).trigger("click");
				break;
			//小数点
			case 110:
				$("#point").trigger("click");
				break;
			//符号键
			case 107:
				$("#add").trigger("click");
				break;
			case 109: case 189:
				$("#sub").trigger("click");
				break;
			case 106:
				$("#mul").trigger("click");
				break;
			case 111:
				$("#div").trigger("click");
				break;
			case 111:
				$("#div").trigger("click");
				break;
			//CE
			case 8:
				$("#ce").trigger("click");
				break;
			//AC
			case 27:
				$("#ac").trigger("click");
				break;
			//回车等于
			case 13: case 187:
				$("#equal").trigger("click");
				break;
		}
	});


	var operated = false;  //是否刚运算完毕
	//执行运算
	function run(content)
	{
		operated = true;
		//最后是点
		if (content.slice(-1) == '.')
			content.slice(0, -1);
		//没有运算符
		if (/[+\-×÷%]/.test(content) == false)
		{
			if (content == 'π')
				return Math.PI;
			else
				return content;
		} 
		//处理π
		var piindex = content.search(/[π]/)
		if (piindex != -1)
			content = content.slice(0, piindex) + '3.1416' + content.slice(piindex+1);

		//处理乘除运算符
		content = content.replace(/[×]/g, '*');
		content = content.replace(/[÷]/g, '/');

		//运算
		var result = eval(content);
		return result;
	}

});