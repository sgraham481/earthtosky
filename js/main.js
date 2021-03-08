window.addEventListener("load", function(){
  // (A) CHECK FOR MOBILE
  var isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
 
  // (B) DO SOMETHING...
  if (isMobile) {
    console.log("Is mobile device");
  } else {
    console.log("Not mobile device");
  }
});

$(function(){
	console.log("jquery ready");
	if (isMobile){
		$('html').addClass('mobile');
	}
}); 