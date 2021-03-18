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

								//console.log(params.attributes["slideType"].nodeValue);

								

								/*
								DECIDE HOW TO SHOW THE MULTIPLE BOTTOMS WITH THE STATIC TOP SLIDE TYPE.;

								
								
								*/
								// SETTING WRAPPER FOR THE SLIDE;
								
									/*
									console.log("fullsize image slide? "+slide.getElementsByTagName('full-size-image').length);
									// if full-size-image, then stand in;
									
									if (slide.getElementsByTagName('full-size-image').length){
										slideHtmlText += '<div class="item'+(totalslides === 0 ? ' active' : '')+'" data-id="'+totalslides+'" data-background="'+slideType+'">';
											var imgsrc = slide.getElementsByTagName('full-size-image')[0].attributes['src'].nodeValue;
											slideHtmlText += '<img src="'+imgsrc+'" alt="'+''+'" style="width:100%;">';
										slideHtmlText += '</div>';
										$(".carousel-inner").append( $(slideHtmlText) );
										addNewIndicator(totalslides);
										addNewTOCItem(totalslides);
										totalslides ++;
									} else {
										*/

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

													slideHtmlText = '<div class="item'+(totalslides === 0 ? ' active' : '')+'" data-id="'+totalslides+'" data-background="'+slideType+'">';
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
											                	    if (slide.childNodes[c].childNodes[d].nodeName === 'header'){
											                	   		//console.log("header present? = "+slide.childNodes[c].getElementsByTagName('header').length);
											                	   		//console.log("header nodeValue = "+slide.childNodes[c].childNodes[d].nodeValue);
											                	   		//console.log("header nodeValue = "+slide.childNodes[c].childNodes[d].childNodes[0].nodeValue);
											                	   		slideHtmlText += "<div class='h1'>"+slide.childNodes[c].childNodes[d].childNodes[0].nodeValue+"</div>";
											                	    } else if (slide.childNodes[c].childNodes[d].nodeName === 'p'){
											                	    	slideHtmlText += "<div class='main-content'>"+slide.childNodes[c].childNodes[d].childNodes[0].nodeValue+"</div>";
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



											            /*
														if ( hasEls(slide, 'top') != true ){
															// 'top' element is missing;
															slideHtmlText += "<div class='h1'>"+'=NO DATA='+"</div>";
															slideHtmlText += "<div class='main-content'>"+'=NO DATA='+"</div>";
														} else {
															// 'top' element present;
															//var top = slide.getElementsByTagName('top')[0];
															//for (var c = 0; c < top.childNodes.length; c++) {
																//console.log("top nodeName = "+slide.childNodes[c].nodeName);
															//}
															console.log("in top...");
															for (var c = 0; c < slide.getElementsByTagName('top')[0].childNodes.length; c++) {

												            	console.log("top nodeName = "+slide.getElementsByTagName('top')[0].childNodes[c].nodeName);

												            	if (slide.getElementsByTagName('top')[0].childNodes[c].nodeName === 'header'){
												            		slideHtmlText += "<div class='h1'>"+slide.getElementsByTagName('top')[0].childNodes[c].childNodes[0].nodeValue+"</div>";
												            	} else if (slide.childNodes[c].nodeName === 'p') {
												            		slideHtmlText += "<div class='main-content'>"+slide.getElementsByTagName('top')[0].childNodes[c].childNodes[0].nodeValue+"</div>";
												            	}
												            }
															

															//var header = hasEls(top, 'header') ? getElValue(top, 'header', 0) : false;
															//if (!header){
															//	slideHtmlText += "<div class='h1'>"+header+"</div>";
															//}

															//var header = hasEls(top, 'header') ? getElValue(top, 'header', 0) : '=NO DATA=';
															//slideHtmlText += "<div class='h1'>"+'=NO DATA='+"</div>";
															//slideHtmlText += "<div class='main-content'>"+'=NO DATA='+"</div>";


														}*/
														slideHtmlText += '</div>';


														// are we missing 'top' element?
														//var hasTop = hasEls(slide, 'top');
														// assign the top element to the top var or null;
														//var top = hasTop ? getEl(slide, 'top', 0) : null;
														//var header = ((hasTop && top.getElementsByTagName('header').length > 0) ? top.getElementsByTagName('header')[0].childNodes[0].nodeValue
														//var header = 

														//slideHtmlText += "<div class='item-container half-height absolute-align-top'>";

															/*
																LOOK FOR HEADER;
															
															if (hasTop){
																slideHtmlText += "<div class='h1'>"+((hasTop && top.getElementsByTagName('header').length === 0 ? top. : '=NO DATA=')+"</div>";
															} else {
																slideHtmlText += "<div class='h1'>"+'=NO DATA='+"</div>";
															}
															*/

															/*
																LOOP ON LOOK FOR P;
															*/
				              								//slideHtmlText += "<div class='main-content'>"+'=NO DATA='+"</div>";

			              								/*
															CLOSE TOP (item-container);
			              								*/
			          									//slideHtmlText += '</div>';


			          									/*
															LOOP ON BOTTOM
															IF NO BOTTOM, LOG;
			          									*/
														slideHtmlText += '<div class="item-container half-height absolute-align-bottom">';

															/*
															HAS QUOTE?

															<div class="d-flex w-100 h-100">
												                <div class="quote">
												                    <span class="quote-body">“Learn how to see. Realize that everything is connected to everything else.”</span>
												                    <span class="quote-attribution">- Leonardo Da Vinci, 1452-1519</span>
												                </div>
												                <div class="display-image">
												                    <img src="img/assets/davinci.png">
												                </div>
												            </div>
															*/

															console.log("===========bottom quote object================");
															for (var q=0; q<slide.getElementsByTagName('bottom')[b].childNodes.length; q++ ){
																console.log(slide.getElementsByTagName('bottom')[b].childNodes[q].nodeName);
															}

															slideHtmlText += '<div class="d-flex w-100 h-100">';
																slideHtmlText += '<div class="quote">';
																	slideHtmlText += '<span class="quote-body">'+'=NO DATA='+'</span>';
																	slideHtmlText += '<span class="quote-attribution">'+'=NO DATA='+'</span>';
																slideHtmlText += '</div>';
																slideHtmlText += '<div class="display-image">';
																	slideHtmlText += '<img src="'+'=NO DATA='+'">';
																slideHtmlText += '</div>';
															slideHtmlText += '</div>';


														/*
															CLOSE BOTTOM (item-container);
			              								*/
			          									slideHtmlText += '</div>';

			          								/*
													CLOSE SLIDE ITEM;
			          								*/
			          								slideHtmlText += '</div>';

			          								/*
													$(".carousel-inner").append( $(slideHtmlText) );
													addNewIndicator(totalslides);
													addNewTOCItem(totalslides);
													totalslides ++;
			          								*/
			          								console.log(slideHtmlText);

			          								$(".carousel-inner").append( $(slideHtmlText) );
													addNewIndicator(totalslides);
													addNewTOCItem(totalslides);
			          								totalslides++;
			          								console.log("==============================");
			          								console.log(" ");
			          								console.log("==============================");
			          							}
		          							}
							            } else if ( slideType === "blue-circle-right"){
											
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



