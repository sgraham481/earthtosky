var isMobile = false;

$(function(){
	//console.log("jquery ready");
	checkMobile();
	if (isMobile){
		//console.log("adding html class");
		$('html').addClass('mobile');
	}
});

window.addEventListener("orientationchange", function(event) {
  console.log("the orientation of the device is now " + event.target.screen.orientation.angle);
  if (event.target.screen.orientation.angle){ /* 0 = portrait, 90 = landscape */
  	closeFullscreen();
  } else {
  	openFullscreen();
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

/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
	if (isMobile){
	  if (elem.requestFullscreen) {
	    elem.requestFullscreen();
	  } else if (elem.webkitRequestFullscreen) { /* Safari */
	    elem.webkitRequestFullscreen();
	  } else if (elem.msRequestFullscreen) { /* IE11 */
	    elem.msRequestFullscreen();
	  }
	}
}

/* Close fullscreen */
function closeFullscreen() {
	if (isMobile){
	  if (document.exitFullscreen) {
	    document.exitFullscreen();
	  } else if (document.webkitExitFullscreen) { /* Safari */
	    document.webkitExitFullscreen();
	  } else if (document.msExitFullscreen) { /* IE11 */
	    document.msExitFullscreen();
	  }
	}
}