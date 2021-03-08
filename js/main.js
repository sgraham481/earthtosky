var isMobile = false;

$(function(){
	console.log("jquery ready");
	checkMobile();
	if (isMobile){
		console.log("adding html class");
		$('html').addClass('mobile');
	}
});

function checkMobile(){
  // (A) CHECK FOR MOBILE
  isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
 
  // (B) DO SOMETHING...
  if (isMobile) {
    console.log("Is mobile device");
  } else {
    console.log("Not mobile device");
  }
};