
/**
 * 0で桁埋め
 * @param keta
 * @param num
 * @returns {String}
 */
//function formatNum(keta, num) {
//	  var src = new String(num);
//	  var cnt = keta - src.length;
//	  if (cnt <= 0) return src;
//	  while (cnt-- > 0) src = "0" + src; return src;
//}
function formatNum(num, keta)
{

	var src = num + ''
		, cnt = keta - src.length;
	if (cnt <= 0)
		return src;
	while (cnt-- > 0)
	src = "0" + src;
	return src;
}

/**
 * 指定文字数の空きを文字でうめる
 * default STR_PAD_RIGHT
 * @param input
 * @param pad_length
 * @param pad_string
 * @param pad_type
 * @returns
 */
function str_pad(input, pad_length, pad_string, pad_type)
{
	if(typeof(input) == "number"){
		input = input + "";
	}else if(typeof(input) != "string"){
		return "";
	}
	if(input.length == 0){
		return "";
	}
	if(pad_length != null && input.length >= pad_length){
		if(pad_type == "STR_PAD_LEFT"){
			input = input.slice(input.length - pad_length);
		}else{
			input = input.slice(0, pad_length);
		}
		return input;
	}

	var addcount = pad_length - input.length;
	var addstr = "";

	for(var i = 0; i < addcount; i++){
		addstr += pad_string;
	}

	if(pad_type == "STR_PAD_LEFT"){
		input = addstr + input;
	}else{
		input = input + addstr;
	}

	return input;

//	dulog(charArray);
}