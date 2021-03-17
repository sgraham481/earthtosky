var isMobile = false;
var xmlobj;
var $xml;

$(function(){
	//console.log("jquery ready");
	getXML();
	checkMobile();
	if (isMobile){
		//console.log("adding html class");
		$('html').addClass('mobile');
		setMobileOrientationViaWHCompare();
	}
	setUpCarouselNavigation();
});
function getXML(){
	console.log("getXML()");
	$.ajax({
        type: "GET",
        url: "xml/carousel.xml",
        dataType: "xml",
        success: parseDATAXml
    });
}

function parseDATAXml(xml) {
    console.log(xml);
    xmlobj = xml;
    $xml = $(xml);
    populateCarousel();
};

window.addEventListener("orientationchange", function(event) {
	//console.log("the orientation event change " + event.target.screen.orientation.angle);
    if (isMobile) {
  	    var orientationDetected = false;
  	    // has to be a value;
  	    if (event.target.screen.orientation.angle != null || event.target.screen.orientation.angle != undefined){
			if (event.target.screen.orientation.angle === 0){ /* 0 = portrait, 90 = landscape */
				orientationDetected = true;
				$('html').removeClass('landscape').addClass('portrait');
			} else if (event.target.screen.orientation.angle === 90){
				orientationDetected = true;
				$('html').removeClass('portrait').addClass('landscape');
			}
		}
		// if not set, default to height width comparison;
	    if (!orientationDetected){
	    	setMobileOrientationViaWHCompare();
		}
	}
});

function setMobileOrientationViaWHCompare(){
	if(window.innerHeight > window.innerWidth){
	    $('html').removeClass('landscape').addClass('portrait');
	} else {
		$('html').removeClass('portrait').addClass('landscape');
	}
}
function checkMobile(){
  // (A) CHECK FOR MOBILE
  isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
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
function toggleHamburger(){
	var isCollapsed = $("#hamburger-menu").hasClass('collapsed');
	isCollapsed ? $("#hamburger-menu").removeClass('collapsed') : $("#hamburger-menu").addClass('collapsed');
	isCollapsed ? $(".carousel-table-of-contents").removeClass('collapsed') : $(".carousel-table-of-contents").addClass('collapsed');
};
var carouselInterval;
var duration = 3000;
var isAuto = false;
function setUpCarouselNavigation() {
	// Activate Carousel
 	$("#myCarousel").carousel();

	// Enable Carousel Indicators
	$("li").click(function(){
		//console.log("click");
		console.log($(this).attr("data-slide-to"));
		setTOCActiveSlide(Number($(this).attr("data-slide-to")));
		
	});
	/*$(".item2").click(function(){
		$("#myCarousel").carousel(1);
	});
	$(".item3").click(function(){
		$("#myCarousel").carousel(2);
	});
	$(".item4").click(function(){
		$("#myCarousel").carousel(3);
	});*/

	setCarouselInterval(duration);

	// Enable Carousel Controls
	$(".left").click(function(){
		goCarouselItem("prev");
		resetInterval();
	});
	$(".right").click(function(){
		goCarouselItem("next");
		resetInterval();
	});
};
function goCarouselItem(item){
	//$("#myCarousel").toggleClass("carousel-fade");
	console.log("item: "+item);
	console.log("current active: "+$(".item.active").attr("data-id"));
	
	$("#myCarousel").carousel(item);
	setTimeout(function(){ setTOCActiveSlide(Number($(".carousel-indicators li.active").attr("data-slide-to"))); }, 200);
};
function resetInterval(){
	clearInterval(carouselInterval);
	setCarouselInterval(duration);
};
function setCarouselInterval(duration) {
	if (isAuto) {
		carouselInterval = setInterval(function(){ goCarouselItem("next"); }, duration);
	}
};
function setTOCActiveSlide(num){
	$(".carousel-table-of-contents li").removeClass("active");
	$(".carousel-table-of-contents li").eq(num).addClass("active");
}
/**********************************************************
BUILD CAROUSEL OPTIONS
**********************************************************/
function populateCarousel(){
	/*xmlobj = xml;
    $xml = $(xml);*/
    for (i = 0; i < x.length ;i++) {
		console.log(x[i].nodeName); +  //+ ": " + x[i].childNodes[0].nodeValue + "<br>";
		console.log(" children: "+x[i].childNodes.length);
		if (x[i].nodeName === "part"){
			/*
			SET PART VAR;
			*/
			var part = x[i];
			if (part.childNodes.length){
				for (j = 0; j < part.childNodes.length; j++) {
					console.log("  >  " + part.childNodes[j].nodeName);
					if (part.childNodes[j].nodeName === "slide"){
						/*
						SET SLIDE VAR;
						*/
						var slide = part.childNodes[j];

						console.log("    children: "+slide.childNodes.length);
						// has children;
						if (slide.childNodes.length){
							for (k = 0; k < slide.childNodes.length; k++) {
								if (slide.childNodes[k].nodeName === "params"){
							    	// ;
							    } else if (slide.childNodes[k].nodeName === "params"){
							    	// ;
							    } else if (slide.childNodes[k].nodeName === "params"){
							    	// ;
							    }
							    console.log("    >  " + slide.childNodes[k].nodeName);
							    console.log("      attributes: "+slide.childNodes[k].attributes[0].nodeName+":"+slide.childNodes[k].attributes.length);
							    console.log("      children: "+slide.childNodes[k].childNodes.length);
							    if (slide.childNodes[k].nodeName === "params"){
							        var params = slide.childNodes[k];
							        console.log(params.attributes[0].nodeName+":"+params.attributes[0].nodeValue);
							    }
							}
						}
					}
				}
			}
		}
	}
}
/**********************************************************
BUILD CAROUSEL OPTIONS
**********************************************************/




























