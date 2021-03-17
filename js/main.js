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
	//setUpCarouselNavigation();
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
	var x = xmlobj.documentElement.childNodes;
	/*xmlobj = xml;
    $xml = $(xml);*/
    //console.log();
    //console.log($xml.find("part").length);
    //console.log($xml.find("part").length);
    var totalslides = 2;
    for (i = 0; i < x.length; i++) {
		console.log(x[i].nodeName); //+ ": " + x[i].childNodes[0].nodeValue + "<br>";
		//console.log(" children: "+x[i].childNodes.length);
		if (x[i].nodeName === "part"){
			/*
			SET PART VAR;
			*/
			var part = x[i];
			if (part.childNodes.length){
				for (j = 0; j < part.childNodes.length; j++) {
					
					if (part.childNodes[j].nodeName === "slide"){
						console.log("  >  " + "slide node");
						/*
						SET SLIDE VAR;
						*/
						var slide = part.childNodes[j];

						console.log("    children: "+slide.childNodes.length);
						// has children;

						var slideHtmlText = "";
						var carouselTocEl = "";
						var carouselIndicator = "";
						// has params;
						if (slide.getElementsByTagName('params').length){

							var params = slide.getElementsByTagName('params')[0];

							// has the slideType which defines the layout of the slide;
							if (params.attributes["slideType"]){

								console.log(params.attributes["slideType"].nodeValue);

								var slideType = params.attributes["slideType"].nodeValue;

								// SETTING WRAPPER FOR THE SLIDE;
								slideHtmlText += '<div class="item'+(totalslides === 0 ? ' active' : '')+'" data-id="'+totalslides+'" data-background="'+slideType+'">';

								console.log("fullsize image slide? "+slide.getElementsByTagName('full-size-image').length);
									// if full-size-image, then stand in;
									
									if (slide.getElementsByTagName('full-size-image').length){
										var imgsrc = slide.getElementsByTagName('full-size-image')[0].attributes['src'].nodeValue;
										slideHtmlText += '<img src="'+imgsrc+'" alt="'+''+'" style="width:100%;">';
									} else {
										// into the type of side from the params;
										if ( slideType === "blue-vert-50-50"){
											
							            } else if ( slideType === "blue-circle-right"){
											
							            }
							        }

					            slideHtmlText += '</div>';

					            carouselIndicator = "<li data-target='#myCarousel' data-slide-to='"+totalslides+"' class='"+(totalslides === 0 ? 'active' : '')+"'></li>";
					            carouselTocEl = "<li data-target='#myCarousel' data-slide-to='"+totalslides+"'><img src='img/assets/nav_pointer.svg'>Slide #"+totalslides+"</li>";

					            if (slide.getElementsByTagName('full-size-image').length){
					            	$(".carousel-inner").append( $(slideHtmlText) );
					            	$(".carousel-indicators").append( $(carouselIndicator) );
					            	$(".carousel-table-of-contents").append( $(carouselTocEl) );
					            }
					            console.log(slideHtmlText);
					            console.log(carouselIndicator);
					            console.log(carouselTocEl);

					            totalslides ++;
							}
						} else {
							console.log("no params");
						}
					}
				}
			}
		}
	}

	setUpCarouselNavigation();
}
/**********************************************************
BUILD CAROUSEL OPTIONS
**********************************************************/



