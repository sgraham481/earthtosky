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
	//console.log("item: "+item);
	//console.log("current active: "+$(".item.active").attr("data-id"));
	
	$("#myCarousel").carousel(item);
	//console.log("new active: "+$(".item.next").length);
	//console.log("new active: "+$(".item.prev").length);

	if ($(".item.next").length){
		$(".slide-backgrounds.on").removeClass("on");
		$(".slide-backgrounds."+$(".item.next").attr("data-background")).addClass("on");
	} else if ($(".item.prev").length){
		$(".slide-backgrounds.on").removeClass("on");
		$(".slide-backgrounds."+$(".item.prev").attr("data-background")).addClass("on");
	}
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
    var totalslides = 0;
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

						//console.log("    children: "+slide.childNodes.length);
						// has children;

						var slideHtmlText = "";
						var carouselTocEl = "";
						var carouselIndicator = "";


						//console.log("fullsize image slide? "+slide.getElementsByTagName('full-size-image').length);
						// if full-size-image, then stand in;
						
						if (slide.getElementsByTagName('full-size-image').length > 0){
							slideHtmlText += '<div class="item'+(totalslides === 0 ? ' active' : '')+'" data-id="'+totalslides+'" data-background="'+slideType+'">';
								var imgsrc = slide.getElementsByTagName('full-size-image')[0].attributes['src'].nodeValue;
								slideHtmlText += '<img src="'+imgsrc+'" alt="'+''+'" style="width:100%;">';
							slideHtmlText += '</div>';
							$(".carousel-inner").append( $(slideHtmlText) );
							addNewIndicator(totalslides);
							addNewTOCItem(totalslides);
							totalslides ++;
						} else if (slide.getElementsByTagName('params').length){
							// has params;
							var params = slide.getElementsByTagName('params')[0];

							// has the slideType which defines the layout of the slide;
							if (params.attributes["slideType"]){

										var slideType = params.attributes["slideType"].nodeValue;

										/*
							            <top>
											<header>
												<![CDATA[
													Part 1: About Earth System Science
												]]>
											</header>
											<p>
												<![CDATA[
													Earth system scientists take a holistic view of planet Earth, working to gain understanding of the influence of major and minor processes on Earth’s past, current and future conditions. Much of Earth systems science is focused on understanding what drives Earth’s global, regional and local climate patterns, including human activity. A major goal is to improve predictions of future climate under various scenarios of human actions and other variables.
												]]>
											</p>
											<p>
												<![CDATA[
													Thinking about nature being interconnected is not unique to Earth system scientists.
												]]>
											</p>
										</top>

										*/

										/*
										<params slideType="blue-vert-50-50"></params>

							            Attribute by Name: console.log(slide.getElementsByTagName('params')[0].attributes["slideType"]);
							            Attribute Value: console.log(slide.getElementsByTagName('params')[0].attributes["slideType"].nodeValue);

							            // can use .length with .getElementsByTagName to se if something exists;
								            if (slide.getElementsByTagName('params').length === 0){
								            	console.log("no params");
								            }

								        // can use undefined value with .attributes["attrName"] to see if something exists;
							            	if (slide.getElementsByTagName('params')[0].attributes["slideType"] === undefined){
							                	console.log("no attribute name");
							                }

										*/

										// into the type of side from the params;
										if ( slideType === "blue-vert-50-50"){

											//console.log("hasEls(slide, 'bottom') = "+hasEls(slide, 'bottom'));
											if (hasEls(slide, 'bottom') != true){

								            	console.log("no bottom");

								            } else {

								            	for (var b=0; b<getTotalEls(slide, 'bottom'); b++){

													slideHtmlText = '<div class="item blue-bkgd blue-vert-50-50'+(totalslides === 0 ? ' active' : '')+'" data-id="'+totalslides+'" data-background="'+slideType+'">';
														/*
															GET 'TOP' NODE;
															IF NO TOP NODE, LOG;
														*/
														slideHtmlText += "<div class='item-container half-height absolute-align-top'>";
														//console.log("hasEls(slide, 'top') = "+hasEls(slide, 'top'));

														for (var c = 0; c < slide.childNodes.length; c++) {
											            	//console.log(slide.childNodes[c].nodeName);
											                if (slide.childNodes[c].nodeName === "top"){
											                	//console.log("in top");
											                    //console.log(slide.childNodes[c]);
											                    //console.log(slide.childNodes[c].childNodes.length);
											                    //console.log("==============");
											                	//var top = xmlDoc = parser.parseFromString(slide.getElementsByTagName('top')[0],"text/xml");
											                    //console.log(top);
											                	for (var d = 0; d < slide.childNodes[c].childNodes.length; d++) {
											                	    //console.log("top nodeName = "+slide.childNodes[c].childNodes[d].nodeName);
											                	    if (slide.childNodes[c].childNodes[d].nodeName === 'section'){
											                	   		//console.log("header present? = "+slide.childNodes[c].getElementsByTagName('header').length);
											                	   		//console.log("header nodeValue = "+slide.childNodes[c].childNodes[d].nodeValue);
											                	   		//console.log("header nodeValue = "+slide.childNodes[c].childNodes[d].childNodes[0].nodeValue);
											                	   		slideHtmlText += "<h1 class='h1 section-header'>"+slide.childNodes[c].childNodes[d].childNodes[0].nodeValue+"</h1>";
											                	   	} else if (slide.childNodes[c].childNodes[d].nodeName === 'main'){
											                	   		slideHtmlText += "<h1 class='h1 main-header'>"+slide.childNodes[c].childNodes[d].childNodes[0].nodeValue+"</h1>";
											                	    } else if (slide.childNodes[c].childNodes[d].nodeName === 'p'){
											                	    	slideHtmlText += "<p class='main-content'>"+slide.childNodes[c].childNodes[d].childNodes[0].nodeValue+"</p>";
											                	    }
											                       //console.log("top nodeValue = "+slide.childNodes[c].childNodes[d].childNodes[0].nodeValue);

											                      /*if (slide.childNodes[c].childNodes[d].nodeName === 'header'){
													            		slideHtmlText += "<div class='h1'>"+slide.childNodes[c].childNodes[d].childNodes[0].nodeValue+"</div>";
													            	} else if (slide.childNodes[c].nodeName === 'p') {
													            		slideHtmlText += "<div class='main-content'>"+slide.childNodes[c].childNodes[d].childNodes[0].nodeValue+"</div>";
													            	}*/


											                    }
											                }
											            }
														slideHtmlText += '</div>';

			          									/*
															LOOP ON BOTTOM
															IF NO BOTTOM, LOG;
			          									*/
														slideHtmlText += '<div class="item-container half-height absolute-align-bottom">';
															if (slide.getElementsByTagName('bottom')[b].attributes['elemType'] === undefined){
																for (var q=0; q<slide.getElementsByTagName('bottom')[b].childNodes.length; q++ ){
																	if (slide.getElementsByTagName('bottom')[b].childNodes[q].nodeName === 'section'){
											                	   		slideHtmlText += '<h1 class="h1 section-header">'+slide.getElementsByTagName('bottom')[b].childNodes[q].childNodes[0].nodeValue+'</h1>';
											                	   	} else if (slide.getElementsByTagName('bottom')[b].childNodes[q].nodeName === 'main'){
											                	   		slideHtmlText += '<h1 class="h1 main-header">'+slide.getElementsByTagName('bottom')[b].childNodes[q].childNodes[0].nodeValue+'</h1>';
											                	    } else if (slide.getElementsByTagName('bottom')[b].childNodes[q].nodeName === 'p'){
											                	    	slideHtmlText += '<p class="main-content">'+slide.getElementsByTagName('bottom')[b].childNodes[q].childNodes[0].nodeValue+'</p>';
											                	    } else if (slide.getElementsByTagName('bottom')[b].childNodes[q].nodeName === 'video'){
											                	    	slideHtmlText += '<p class="main-content" data-src="'+slide.getElementsByTagName('bottom')[b].childNodes[q].childNodes[0].nodeValue+'">'+'ADD VIDEO ELEMENT'+'</p>';
											                	    } else if (slide.getElementsByTagName('bottom')[b].childNodes[q].nodeName === 'image'){
											                	    	slideHtmlText += '<div class="display-image">';
																			slideHtmlText += '<img src="'+slide.getElementsByTagName('bottom')[b].childNodes[q].childNodes[0].nodeValue+'">';
																		slideHtmlText += '</div>';
																	}
											                	}
															} else {
																var elementType = slide.getElementsByTagName('bottom')[b].attributes['elemType'].nodeValue;
																if (elementType === "quote"){
																	slideHtmlText += '<div class="d-flex w-100 h-100">';
																		slideHtmlText += '<div class="quote">';
																		console.log("===========bottom quote object================");
																		for (var q=0; q<slide.getElementsByTagName('bottom')[b].childNodes.length; q++ ){
																			console.log(slide.getElementsByTagName('bottom')[b].childNodes[q].nodeName);
																			if (slide.getElementsByTagName('bottom')[b].childNodes[q].nodeName === "quote"){
																				slideHtmlText += '<span class="quote-body">'+slide.getElementsByTagName('bottom')[b].childNodes[q].childNodes[0].nodeValue+'</span>';
																			} else if (slide.getElementsByTagName('bottom')[b].childNodes[q].nodeName === "byline"){
																					slideHtmlText += '<span class="quote-attribution">'+slide.getElementsByTagName('bottom')[b].childNodes[q].childNodes[0].nodeValue+'</span>';
																				slideHtmlText += '</div>';
																			} else if (slide.getElementsByTagName('bottom')[b].childNodes[q].nodeName === "image"){
																				slideHtmlText += '<div class="display-image">';
																					slideHtmlText += '<img src="'+slide.getElementsByTagName('bottom')[b].childNodes[q].childNodes[0].nodeValue+'">';
																				slideHtmlText += '</div>';
																			}
																		}

																	slideHtmlText += '</div>';
																}
															}



														/*
															CLOSE BOTTOM (item-container);
			              								*/
			          									slideHtmlText += '</div>';

			          								/*
													CLOSE SLIDE ITEM;
			          								*/
			          								slideHtmlText += '</div>';

			          								//console.log(slideHtmlText);

			          								$(".carousel-inner").append( $(slideHtmlText) );
													addNewIndicator(totalslides);
													addNewTOCItem(totalslides);
			          								totalslides++;
			          								//console.log("==============================");
			          								//console.log(" ");
			          								//console.log("==============================");
			          							}
		          							}
							            } else if ( slideType === "blue-circle-right"){
											
							            	slideHtmlText = '<div class="item blue-bkgd blue-circle-right'+(totalslides === 0 ? ' active' : '')+'" data-id="'+totalslides+'" data-background="'+slideType+'">';
							            		slideHtmlText += '<div class="item-container d-flex">';

							            			for (var c = 0; c < slide.childNodes.length; c++) {
														if (slide.childNodes[c].nodeName === "element"){
															var width = slide.childNodes[c].attributes['width'] === undefined ? ' w-50' : ' '+slide.childNodes[c].attributes['width'].nodeValue;
															var height = slide.childNodes[c].attributes['height'] === undefined ? '' : ' '+slide.childNodes[c].attributes['height'].nodeValue;
															var padding = slide.childNodes[c].attributes['padding'] === undefined ? '' : ' '+slide.childNodes[c].attributes['padding'].nodeValue;
															var classes = slide.childNodes[c].attributes['classes'] === undefined ? '' : ' '+slide.childNodes[c].attributes['classes'].nodeValue;
															slideHtmlText += '<div class="item-element'+width+height+padding+classes+'">';
															for (var d = 0; d < slide.childNodes[c].childNodes.length; d++) {
																if (slide.childNodes[c].childNodes[d].nodeName === 'section'){
																	slideHtmlText += '<h1 class="h1 section-header">'+slide.childNodes[c].childNodes[d].childNodes[0].nodeValue+'</h1>';
																} else if (slide.childNodes[c].childNodes[d].nodeName === 'h2subheader'){
																	slideHtmlText += '<h2 class="h2 sub-header">'+slide.childNodes[c].childNodes[d].childNodes[0].nodeValue+'</h2>';
																} else if (slide.childNodes[c].childNodes[d].nodeName === 'p'){
																	slideHtmlText += '<p class="main-content">'+slide.childNodes[c].childNodes[d].childNodes[0].nodeValue+'</p>';
																} else if (slide.childNodes[c].childNodes[d].nodeName === 'image'){
																	slideHtmlText += '<img src="'+slide.childNodes[c].childNodes[d].childNodes[0].nodeValue+'">';
																} else if (slide.childNodes[c].childNodes[d].nodeName === 'list'){
																	var listtype = "ul";
																	if (slide.childNodes[c].childNodes[d].attributes["type"]){
																		listtype = slide.childNodes[c].childNodes[d].attributes['type'].nodeValue === "numbered" ? "ol" : "ul";
																	}
																	slideHtmlText += '<'+listtype+'>';
																	for (var e = 0; e < slide.childNodes[c].childNodes[d].childNodes.length; e++) {
																		if (slide.childNodes[c].childNodes[d].childNodes[e].nodeName === "item"){
																			slideHtmlText += '<li>'+slide.childNodes[c].childNodes[d].childNodes[e].childNodes[0].nodeValue+'</li>';
																		}
																	}
																	slideHtmlText += '</'+listtype+'>';
																} else if (slide.childNodes[c].childNodes[d].nodeName === 'youtube'){
																	var yturlsplitarray = slide.childNodes[c].childNodes[d].childNodes[0].nodeValue.split('/');
																	console.log("video");
																	console.log(slide.childNodes[c].childNodes[d].childNodes[0].nodeValue);
																	console.log("yturlsplitarray length = "+yturlsplitarray.length);
																	slideHtmlText += '<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/'+yturlsplitarray[(yturlsplitarray.length-1)]+'?autoplay=1&amp;origin='+slide.childNodes[c].childNodes[d].childNodes[0].nodeValue+'" frameborder="0" allowfullscreen></iframe>';
																} else if (slide.childNodes[c].childNodes[d].nodeName === 'hint'){
																	slideHtmlText += '<button class="btn seenotes"><img src="img/assets/nav_pointer.svg"><span>See Notes</span></button>';
																}
															}
															slideHtmlText += '</div>';
														}
													}

													/*
													    <div class="w-50">
													        <h1 class="h1 section-header">Part 1: About Earth System Science</h1>
															<p class="main-content">Earth system scientists take a holistic view of planet Earth, working to gain understanding of the influence of major and minor processes on Earth’s past, current and future conditions.</p>
													    </div>
													    <div class="w-50">
													        <img src="img/assets/gears3.svg">
													    </div>

													*/
												slideHtmlText += '</div>';
											/*
											CLOSE SLIDE ITEM;
	          								*/
	          								slideHtmlText += '</div>';

	          								$(".carousel-inner").append( $(slideHtmlText) );
											addNewIndicator(totalslides);
											addNewTOCItem(totalslides);
	          								totalslides++;
							            }
							       /* } */

					            //slideHtmlText += '</div>';

					            /*
					            THIS SHOULD PROBABLY BE SOMETHING WE PUT TOGETHER IN A SEPERATE FUNCTION.
					            MAYBE THEY ALL SHOULD BE...?
					            
					            */
					            //carouselIndicator = "<li data-target='#myCarousel' data-slide-to='"+totalslides+"' class='"+(totalslides === 0 ? 'active' : '')+"'></li>";
					            //carouselTocEl =     "<li data-target='#myCarousel' data-slide-to='"+totalslides+"'><img src='img/assets/nav_pointer.svg'>Slide #"+totalslides+"</li>";

					            /*if (slide.getElementsByTagName('full-size-image').length){
					            	$(".carousel-inner").append( $(slideHtmlText) );
					            	$(".carousel-indicators").append( $(carouselIndicator) );
					            	$(".carousel-table-of-contents").append( $(carouselTocEl) );
					            }*/
					            //console.log(slideHtmlText);
					            //console.log(carouselIndicator);
					            //console.log(carouselTocEl);

					            
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
function hasEls(el, name){
	console.log("has "+name+"?"+el.getElementsByTagName(name).length);
	return el.getElementsByTagName(name).length > 0 ? true : false;
}
function getEl(el, name, num){
	// could add hasEls here.;
	return el.getElementsByTagName(name)[num];
}
function getElValue(el, name, num){
	return el.getElementsByTagName(name)[num].childNodes[0].nodeValue;
}
function getTotalEls(el, name){
	// could add hasEls here.;
	return el.getElementsByTagName(name).length;
}
function addNewIndicator(num){
	var el = "<li data-target='#myCarousel' data-slide-to='"+num+"' class='"+(num === 0 ? 'active' : '')+"'></li>";
	$(".carousel-indicators").append( $(el) );
}

function addNewTOCItem(num){
	var el = "<li data-target='#myCarousel' data-slide-to='"+num+"'><img src='img/assets/nav_pointer.svg'>Slide #"+num+"</li>";
	$(".carousel-table-of-contents").append( $(el) );
}
/**********************************************************
BUILD CAROUSEL OPTIONS
**********************************************************/



