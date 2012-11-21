$(document).ready(function() {

	$('.system_menu li a').bind('click', function(e){
		e.preventDefault();
		$(this).toggleClass('selected');
	});

	$('.system_menu li.menu a').bind('click', function(e){
		$('body').toggleClass('has_menu');
	});

	$('.system_menu li.info a').bind('click', function(e){
	});

	$('.main_menu li a').bind('click', function(e){
		e.preventDefault();
		$(this).toggleClass('selected');
	});

	// reset font size
	var originalFontSize = $('.article_body').css('font-size');
	$('a[href="#resetfontsize"]').click(function(){
		//$('.article_body').css('font-size', originalFontSize);
		$('.article_body').removeAttr('style');
	});
	// increase font size
	$('a[href="#increasefontsize"]').click(function(){
		var currentFontSize = $('.article_body').css('font-size');
		var currentFontSizeNum = parseFloat(currentFontSize, 10);
		var newFontSize = currentFontSizeNum*1.125;
		if (newFontSize < 21) {
			$('.article_body').css('font-size', newFontSize);
		}
		return false;
	});
	// decrease font size
	$('a[href="#reducefontsize"]').click(function(){
		var currentFontSize = $('.article_body').css('font-size');
		var currentFontSizeNum = parseFloat(currentFontSize, 10);
		var newFontSize = currentFontSizeNum*0.875;
		if (newFontSize > 12) {
			$('.article_body').css('font-size', newFontSize);
		}
		return false;
	});

});
