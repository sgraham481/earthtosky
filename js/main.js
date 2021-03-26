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
	$(".carousel-indicators li").click(function(){
		//console.log("click");
		//console.log($(this).attr("data-slideid"));
		if ( !$(this).hasClass("active") ){
			setTimeout(function(){ setBackground(); }, 50);
		}
		//setTOCActiveSlide($(this).attr("data-slideid"));
		
	});
	$(".carousel-table-of-contents li").click(function(){
		//console.log("click");
		//console.log($(this).attr("id"));
		if ( !$(this).hasClass("active") ){
			setTimeout(function(){ setBackground(); }, 50);
		}
		
		
		//setTOCActiveSlide($(this).attr("id"));
		
	});

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
	$("#myCarousel").carousel(item);
	setBackground();
};
function setBackground(){
	$(".slide-backgrounds.on").removeClass("on geo hydro bio cryo atmo");
	var nextprev = "";
	if ($(".item.next").length){
		nextprev = "next";
	} else if ($(".item.prev").length){
		nextprev = "prev";
	}
	var $bkgd = $(".item."+nextprev).attr("data-background");
	var $slidebkgd = $(".slide-backgrounds."+$bkgd);
	if ($bkgd === "sphere-bkgds"){
		$slidebkgd.addClass("on "+$(".item."+nextprev).attr("data-sphere"));
	} else {
		$slidebkgd.addClass("on");
	}
	setHeader($(".item."+nextprev));
	setTimeout(function(){ setTOCActiveSlide($(".carousel-indicators li.active").attr("data-slideid")); }, 200);
};
function setHeader($item){
	var partnum = "Part 1";
	if ($item.hasClass("part-2")){
		var partnum = "Part 2";
	} else if ($item.hasClass("part-3")){
		var partnum = "Part 3";
	}
	$(".header-title").html("Earth to Sky Tutorial: "+partnum);
}
function resetInterval(){
	clearInterval(carouselInterval);
	setCarouselInterval(duration);
};
function setCarouselInterval(duration) {
	if (isAuto) {
		carouselInterval = setInterval(function(){ goCarouselItem("next"); }, duration);
	}
};
function setTOCActiveSlide(slideid){
	console.log("setTOCActiveSlide = "+slideid);
	$(".carousel-table-of-contents li").removeClass("active");
	$(".carousel-table-of-contents li#"+slideid).addClass("active");
	var pagenum = $(".carousel-indicators li.active").attr("data-slide-to");
	$(".carousel-pagination .this-page").html(Number(pagenum)+1);
	if (!$("#hamburger-menu").hasClass('collapsed')){
		toggleHamburger();
	}
}
/**********************************************************
BUILD CAROUSEL OPTIONS
**********************************************************/
function populateCarousel(){
	var x = xmlobj.documentElement.childNodes;
	var partnum = 1;
    var totalslides = 0;
    for (i = 0; i < x.length; i++) {
		console.log(x[i].nodeName);
		//console.log(" children: "+x[i].childNodes.length);
		if (x[i].nodeName === "part"){
			/*
			SET PART VAR;
			*/
			var part = x[i];
			var slideid = "";
			var partclass = "part-"+partnum;
			var slideinpartnum = -1;
			partnum++;

			if (part.childNodes.length){

				for (j = 0; j < part.childNodes.length; j++) {
					if (part.childNodes[j].nodeName === "slide"){
						console.log("  >  " + "slide node");
						/*
						SET SLIDE VAR;
						*/
						slideinpartnum++;
						var slide = part.childNodes[j];

						//console.log("    children: "+slide.childNodes.length);
						// has children;

						var slideHtmlText = "";
						var carouselTocEl = "";
						var carouselIndicator = "";
						
						if (slide.getElementsByTagName('toc').length){
							slideid = "slide-"+slide.attributes['data-slideid'].nodeValue;
							var toctitle = slide.getElementsByTagName('toc')[0].childNodes[0].nodeValue;
							addNewTOCItem(toctitle, slideid, totalslides, slideinpartnum);
						}

						//console.log("fullsize image slide? "+slide.getElementsByTagName('full-size-image').length);
						// if full-size-image, then stand in;
						
						if (slide.getElementsByTagName('full-size-image').length > 0){
							slideHtmlText += '<div class="item '+partclass+(totalslides === 0 ? ' active' : '')+'" data-id="'+totalslides+'" data-background="'+slideType+'">';
								var imgsrc = slide.getElementsByTagName('full-size-image')[0].attributes['src'].nodeValue;
								slideHtmlText += '<img src="'+imgsrc+'" alt="'+''+'" style="width:100%;">';
							slideHtmlText += '</div>';
							$(".carousel-inner").append( $(slideHtmlText) );
							addNewIndicator(slideid, totalslides);
							//addNewTOCItem(totalslides);
							totalslides ++;
						} else if (slide.getElementsByTagName('params').length){
							
							
							// has params;
							var params = slide.getElementsByTagName('params')[0];

							// has the slideType which defines the layout of the slide;
							if (params.attributes["slideType"]){

										var slideType = params.attributes["slideType"].nodeValue;
										var layoutType = "";
										if (params.attributes["layout"]){
											layoutType = params.attributes["layout"].nodeValue;
										}
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
										if ( slideType === "blue-vert-50-50" ){

											//console.log("hasEls(slide, 'bottom') = "+hasEls(slide, 'bottom'));
											if (hasEls(slide, 'bottom') != true){

								            	console.log("no bottom");

								            } else {

								            	for (var b=0; b<getTotalEls(slide, 'bottom'); b++){

													slideHtmlText = '<div class="item '+partclass+' blue-bkgd blue-vert-50-50'+(totalslides === 0 ? ' active' : '')+'" data-id="'+totalslides+'" data-background="'+slideType+'">';
														/*
															GET 'TOP' NODE;
															IF NO TOP NODE, LOG;
														*/
														slideHtmlText += "<div class='item-container half-height absolute-align-top'>";
														//console.log("hasEls(slide, 'top') = "+hasEls(slide, 'top'));

														for (var c = 0; c < slide.childNodes.length; c++) {
											            	//console.log(slide.childNodes[c].nodeName);
											                if (slide.childNodes[c].nodeName === "top"){

											                	for (var d = 0; d < slide.childNodes[c].childNodes.length; d++) {

											                		slideHtmlText += returnElementHTML(slide.childNodes[c].childNodes[d]);

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

																	slideHtmlText += returnElementHTML(slide.getElementsByTagName('bottom')[b].childNodes[q]);

											                	}
															} else {
																var elementType = slide.getElementsByTagName('bottom')[b].attributes['elemType'].nodeValue;
																if (elementType === "quote"){
																	slideHtmlText += '<div class="d-flex w-100 h-100">';
																		slideHtmlText += '<div class="quote">';
																		//console.log("===========bottom quote object================");
																		for (var q=0; q<slide.getElementsByTagName('bottom')[b].childNodes.length; q++ ){
																			console.log(slide.getElementsByTagName('bottom')[b].childNodes[q].nodeName);

																			slideHtmlText += returnElementHTML(slide.getElementsByTagName('bottom')[b].childNodes[q]);

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

			          								$(".carousel-inner").append( $(slideHtmlText) );
													addNewIndicator(slideid, totalslides);
													
			          								totalslides++;
			          								//console.log("==============================");
			          								//console.log(" ");
			          								//console.log("==============================");
			          							}
		          							}
							            } else if ( slideType === "blue-circle-right"){
											
							            	slideHtmlText = '<div class="item '+partclass+' blue-bkgd blue-circle-right'+(totalslides === 0 ? ' active' : '')+'" data-id="'+totalslides+'" data-background="'+slideType+'">';
							            		slideHtmlText += '<div class="item-container d-flex">';

							            			for (var c = 0; c < slide.childNodes.length; c++) {
														if (slide.childNodes[c].nodeName === "element"){
															var width = slide.childNodes[c].attributes['width'] === undefined ? ' w-50' : ' '+slide.childNodes[c].attributes['width'].nodeValue;
															var height = slide.childNodes[c].attributes['height'] === undefined ? '' : ' '+slide.childNodes[c].attributes['height'].nodeValue;
															var padding = slide.childNodes[c].attributes['padding'] === undefined ? '' : ' '+slide.childNodes[c].attributes['padding'].nodeValue;
															var classes = slide.childNodes[c].attributes['classes'] === undefined ? '' : ' '+slide.childNodes[c].attributes['classes'].nodeValue;
															slideHtmlText += '<div class="item-element'+width+height+padding+classes+'">';
															for (var d = 0; d < slide.childNodes[c].childNodes.length; d++) {

																slideHtmlText += returnElementHTML(slide.childNodes[c].childNodes[d]);

															}
															slideHtmlText += '</div>';
														}
													}

												slideHtmlText += '</div>';
	          								slideHtmlText += '</div>';

	          								$(".carousel-inner").append( $(slideHtmlText) );

											addNewIndicator(slideid, totalslides);
											//addNewTOCItem(totalslides);
	          								totalslides++;
							            
							            } else if ( slideType === "geosphere"){
											slideHtmlText = '<div class="item '+partclass+' '+slideType+(totalslides === 0 ? ' active' : '')+'" data-id="'+totalslides+'" data-background="sphere-bkgds" data-sphere="geo">';
							            		slideHtmlText += '<div class="item-container d-flex">';
							            			for (var c = 0; c < slide.childNodes.length; c++) {
														if (slide.childNodes[c].nodeName === "element"){
															var width = slide.childNodes[c].attributes['width'] === undefined ? ' w-50' : ' '+slide.childNodes[c].attributes['width'].nodeValue;
															var height = slide.childNodes[c].attributes['height'] === undefined ? '' : ' '+slide.childNodes[c].attributes['height'].nodeValue;
															var padding = slide.childNodes[c].attributes['padding'] === undefined ? '' : ' '+slide.childNodes[c].attributes['padding'].nodeValue;
															var classes = slide.childNodes[c].attributes['classes'] === undefined ? '' : ' '+slide.childNodes[c].attributes['classes'].nodeValue;
															slideHtmlText += '<div class="item-element'+width+height+padding+classes+'">';
															for (var d = 0; d < slide.childNodes[c].childNodes.length; d++) {

																slideHtmlText += returnElementHTML(slide.childNodes[c].childNodes[d]);

															}
															slideHtmlText += '</div>';
														}
													}
							            		slideHtmlText += '</div>';
	          								slideHtmlText += '</div>';

	          								$(".carousel-inner").append( $(slideHtmlText) );

											addNewIndicator(slideid, totalslides);
	          								totalslides++;
										} else if ( slideType === "cryosphere"){
											slideHtmlText = '<div class="item '+partclass+' '+slideType+(totalslides === 0 ? ' active' : '')+'" data-id="'+totalslides+'" data-background="sphere-bkgds" data-sphere="cryo">';
							            		slideHtmlText += '<div class="item-container d-flex">';
							            			for (var c = 0; c < slide.childNodes.length; c++) {
														if (slide.childNodes[c].nodeName === "element"){
															var width = slide.childNodes[c].attributes['width'] === undefined ? ' w-50' : ' '+slide.childNodes[c].attributes['width'].nodeValue;
															var height = slide.childNodes[c].attributes['height'] === undefined ? '' : ' '+slide.childNodes[c].attributes['height'].nodeValue;
															var padding = slide.childNodes[c].attributes['padding'] === undefined ? '' : ' '+slide.childNodes[c].attributes['padding'].nodeValue;
															var classes = slide.childNodes[c].attributes['classes'] === undefined ? '' : ' '+slide.childNodes[c].attributes['classes'].nodeValue;
															slideHtmlText += '<div class="item-element'+width+height+padding+classes+'">';
															for (var d = 0; d < slide.childNodes[c].childNodes.length; d++) {

																slideHtmlText += returnElementHTML(slide.childNodes[c].childNodes[d]);

															}
															slideHtmlText += '</div>';
														}
													}



							            		slideHtmlText += '</div>';
	          								slideHtmlText += '</div>';

	          								$(".carousel-inner").append( $(slideHtmlText) );

											addNewIndicator(slideid, totalslides);
	          								totalslides++;
										} else if ( slideType === "hydrosphere"){
											slideHtmlText = '<div class="item '+partclass+' '+slideType+(totalslides === 0 ? ' active' : '')+'" data-id="'+totalslides+'" data-background="sphere-bkgds" data-sphere="hydro">';
							            		slideHtmlText += '<div class="item-container d-flex">';
							            			for (var c = 0; c < slide.childNodes.length; c++) {
														if (slide.childNodes[c].nodeName === "element"){
															var width = slide.childNodes[c].attributes['width'] === undefined ? ' w-50' : ' '+slide.childNodes[c].attributes['width'].nodeValue;
															var height = slide.childNodes[c].attributes['height'] === undefined ? '' : ' '+slide.childNodes[c].attributes['height'].nodeValue;
															var padding = slide.childNodes[c].attributes['padding'] === undefined ? '' : ' '+slide.childNodes[c].attributes['padding'].nodeValue;
															var classes = slide.childNodes[c].attributes['classes'] === undefined ? '' : ' '+slide.childNodes[c].attributes['classes'].nodeValue;
															slideHtmlText += '<div class="item-element'+width+height+padding+classes+'">';
															for (var d = 0; d < slide.childNodes[c].childNodes.length; d++) {

																slideHtmlText += returnElementHTML(slide.childNodes[c].childNodes[d]);

															}
															slideHtmlText += '</div>';
														}
													}



							            		slideHtmlText += '</div>';
	          								slideHtmlText += '</div>';

	          								$(".carousel-inner").append( $(slideHtmlText) );

											addNewIndicator(slideid, totalslides);
	          								totalslides++;
											
										} else if ( slideType === "biosphere"){
											 slideHtmlText = '<div class="item '+partclass+' '+slideType+(totalslides === 0 ? ' active' : '')+'" data-id="'+totalslides+'" data-background="sphere-bkgds" data-sphere="bio">';
							            		slideHtmlText += '<div class="item-container d-flex">';
							            			for (var c = 0; c < slide.childNodes.length; c++) {
														if (slide.childNodes[c].nodeName === "element"){
															var width = slide.childNodes[c].attributes['width'] === undefined ? ' w-50' : ' '+slide.childNodes[c].attributes['width'].nodeValue;
															var height = slide.childNodes[c].attributes['height'] === undefined ? '' : ' '+slide.childNodes[c].attributes['height'].nodeValue;
															var padding = slide.childNodes[c].attributes['padding'] === undefined ? '' : ' '+slide.childNodes[c].attributes['padding'].nodeValue;
															var classes = slide.childNodes[c].attributes['classes'] === undefined ? '' : ' '+slide.childNodes[c].attributes['classes'].nodeValue;
															slideHtmlText += '<div class="item-element'+width+height+padding+classes+'">';
															for (var d = 0; d < slide.childNodes[c].childNodes.length; d++) {

																slideHtmlText += returnElementHTML(slide.childNodes[c].childNodes[d]);

															}
															slideHtmlText += '</div>';
														}
													}



							            		slideHtmlText += '</div>';
	          								slideHtmlText += '</div>';

	          								$(".carousel-inner").append( $(slideHtmlText) );

											addNewIndicator(slideid, totalslides);
	          								totalslides++;
											
										} else if ( slideType === "atmosphere"){
											slideHtmlText = '<div class="item '+partclass+' '+slideType+(totalslides === 0 ? ' active' : '')+'" data-id="'+totalslides+'" data-background="sphere-bkgds" data-sphere="atmo">';
							            		slideHtmlText += '<div class="item-container d-flex">';
							            			for (var c = 0; c < slide.childNodes.length; c++) {
														if (slide.childNodes[c].nodeName === "element"){
															var width = slide.childNodes[c].attributes['width'] === undefined ? ' w-50' : ' '+slide.childNodes[c].attributes['width'].nodeValue;
															var height = slide.childNodes[c].attributes['height'] === undefined ? '' : ' '+slide.childNodes[c].attributes['height'].nodeValue;
															var padding = slide.childNodes[c].attributes['padding'] === undefined ? '' : ' '+slide.childNodes[c].attributes['padding'].nodeValue;
															var classes = slide.childNodes[c].attributes['classes'] === undefined ? '' : ' '+slide.childNodes[c].attributes['classes'].nodeValue;
															slideHtmlText += '<div class="item-element'+width+height+padding+classes+'">';
															for (var d = 0; d < slide.childNodes[c].childNodes.length; d++) {

																slideHtmlText += returnElementHTML(slide.childNodes[c].childNodes[d]);

															}
															slideHtmlText += '</div>';
														}
													}



							            		slideHtmlText += '</div>';
	          								slideHtmlText += '</div>';

	          								$(".carousel-inner").append( $(slideHtmlText) );

											addNewIndicator(slideid, totalslides);
	          								totalslides++;
										} else if (slideType === "pt2-intro-bkgd" || layoutType === "horiz-50-50"){

											slideHtmlText = '<div class="item '+partclass+' '+slideType+(totalslides === 0 ? ' active' : '')+'" data-id="'+totalslides+'" data-background="'+slideType+'">';
							            		slideHtmlText += '<div class="item-container d-flex">';
							            			for (var c = 0; c < slide.childNodes.length; c++) {
														if (slide.childNodes[c].nodeName === "element"){
															var width = slide.childNodes[c].attributes['width'] === undefined ? ' w-50' : ' '+slide.childNodes[c].attributes['width'].nodeValue;
															var height = slide.childNodes[c].attributes['height'] === undefined ? '' : ' '+slide.childNodes[c].attributes['height'].nodeValue;
															var padding = slide.childNodes[c].attributes['padding'] === undefined ? '' : ' '+slide.childNodes[c].attributes['padding'].nodeValue;
															var classes = slide.childNodes[c].attributes['classes'] === undefined ? '' : ' '+slide.childNodes[c].attributes['classes'].nodeValue;
															slideHtmlText += '<div class="item-element'+width+height+padding+classes+'">';
															for (var d = 0; d < slide.childNodes[c].childNodes.length; d++) {

																slideHtmlText += returnElementHTML(slide.childNodes[c].childNodes[d]);

															}
															slideHtmlText += '</div>';
														}
													}



							            		slideHtmlText += '</div>';
	          								slideHtmlText += '</div>';

	          								$(".carousel-inner").append( $(slideHtmlText) );

											addNewIndicator(slideid, totalslides);
	          								totalslides++;



										}
							       /* } */

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
function returnElementHTML(node){

	var slideHtmlText = "";
	var classes = "";
	if (node.nodeName === 'section'){
   		slideHtmlText += '<h1 class="h1 section-header">'+node.childNodes[0].nodeValue+'</h1>';
   	} else if (node.nodeName === 'main'){
   		slideHtmlText += '<h1 class="h1 main-header">'+node.childNodes[0].nodeValue+'</h1>';
    } else if (node.nodeName === 'h2subheader'){
		slideHtmlText += '<h2 class="h2 sub-header">'+node.childNodes[0].nodeValue+'</h2>';
	} else if (node.nodeName === 'h3subheader'){
		slideHtmlText += '<h3 class="h3 sub-header">'+node.childNodes[0].nodeValue+'</h3>';
	} else if (node.nodeName === 'p'){
		if (node.attributes["classes"]){
			classes = " "+node.attributes["classes"].nodeValue;
		}
    	slideHtmlText += '<p class="main-content'+classes+'">'+node.childNodes[0].nodeValue+'</p>';
    } else if (node.nodeName === "quote"){
		slideHtmlText += '<span class="quote-body">'+node.childNodes[0].nodeValue+'</span>';
	} else if (node.nodeName === "byline"){
			slideHtmlText += '<span class="quote-attribution">'+node.childNodes[0].nodeValue+'</span>';
		slideHtmlText += '</div>';
    } else if (node.nodeName === 'video'){
    	slideHtmlText += '<p class="main-content" data-src="'+node.childNodes[0].nodeValue+'">'+'ADD VIDEO ELEMENT'+'</p>';
    } else if (node.nodeName === 'image'){
		slideHtmlText += '<img src="'+node.childNodes[0].nodeValue+'">';
    } else if (node.nodeName === 'displayimage'){
    	slideHtmlText += '<div class="display-image">';
			slideHtmlText += '<img src="'+node.childNodes[0].nodeValue+'">';
		slideHtmlText += '</div>';
	} else if (node.nodeName === "quoteElement"){
		slideHtmlText += '<div class="quote-element d-flex">';
			
		/*
		<div class="quote-element d-flex" style="">
			<div class="quote">
				<span class="quote-body"></span>
				<span class="quote-attribution"></span>
			</div>
			<div class="display-image">
				<img src="img/assets/davinci.png">
			</div>
		</div>

					<quote><![CDATA[Look deep into nature, and then you will understand everything better.]]></quote>
					<byline><![CDATA[- Albert Einstein]]></byline>
					<displayimage><![CDATA[img/assets/davinci.png]]></displayimage>
		*/	var quote = "";
			var byline = "";
			var img = "";
			for (var e = 0; e < node.childNodes.length; e++) {
				if (node.childNodes[e].nodeName === "quote"){
					quote = node.childNodes[e].childNodes[0].nodeValue;
				} else if (node.childNodes[e].nodeName === "byline"){
					byline = node.childNodes[e].childNodes[0].nodeValue;
				} else if (node.childNodes[e].nodeName === "displayimage"){
					img = node.childNodes[e].childNodes[0].nodeValue;
				}
			}
			slideHtmlText += '<div class="quote">';
				slideHtmlText += '<span class="quote-body">'+quote+'</span>';
				slideHtmlText += '<span class="quote-attribution">'+byline+'</span>';
			slideHtmlText += '</div>';
			slideHtmlText += '<div class="display-image">';
				slideHtmlText += '<img src="'+img+'">';
			slideHtmlText += '</div>';
		slideHtmlText += '</div>';
	} else if (node.nodeName === 'list'){
		var listtype = "ul";
		if (node.attributes["type"]){
			listtype = node.attributes['type'].nodeValue === "numbered" ? "ol" : "ul";
			listtype = node.attributes['type'].nodeValue === "no-list-style" ? (listtype+" class='no-list-style'") : listtype;
		}
		slideHtmlText += '<'+listtype+'>';
		for (var e = 0; e < node.childNodes.length; e++) {
			if (node.childNodes[e].nodeName === "item"){
				slideHtmlText += '<li>'+node.childNodes[e].childNodes[0].nodeValue+'</li>';
			}
		}
		slideHtmlText += '</'+listtype+'>';
	} else if (node.nodeName === 'youtube'){
		var yturlsplitarray = node.childNodes[0].nodeValue.split('/');
		//console.log("video");
		//console.log(node.childNodes[0].nodeValue);
		//console.log("yturlsplitarray length = "+yturlsplitarray.length);
		slideHtmlText += '<div class="videoWrapper"><iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/'+yturlsplitarray[(yturlsplitarray.length-1)]+'?autoplay=0&amp;origin='+node.childNodes[0].nodeValue+'" frameborder="0" allowfullscreen></iframe></div>';
	} else if (node.nodeName === 'hint'){
		slideHtmlText += '<div class="notes"><button class="btn seenotes" onclick="toggleNotes(this)"><img src="img/assets/nav_pointer.svg"><span>See Notes</span></button><p class="note">'+node.childNodes[0].nodeValue+'</p></div>';
	} else if (node.nodeName === 'note'){
		slideHtmlText += '<div class="notes"><button class="btn seenotes" onclick="toggleNotes(this)"><img src="img/assets/nav_pointer.svg"><span>See Notes</span></button><p class="note">'+node.childNodes[0].nodeValue+'</p></div>';
	}

	return slideHtmlText;

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
function addNewIndicator(slideid, num){
	var el = "<li data-target='#myCarousel' data-slide-to='"+num+"' data-slideid='"+slideid+"' class='"+(num === 0 ? 'active' : '')+"'></li>";
	$(".carousel-indicators").append( $(el) );
	$(".carousel-pagination .total-pages").html(((num)+1));
}
var tocpage = 1;
//addNewTOCItem(toctitle, slideid, totalslides);
function addNewTOCItem(title, slideid, totalslides, thisslidenum){
	console.log("addNewTOCItem: "+thisslidenum);
	var isFirstSlide = thisslidenum === 0 ? true : false;
	var el = "<li id='"+slideid+"' class='"+(isFirstSlide ? "first-slide-of-part" : "")+((isFirstSlide && tocpage) ? " " : "")+(tocpage === 1 ? "active" : "")+"' data-target='#myCarousel' data-page='"+tocpage+"' data-slide-to='"+totalslides+"'><img src='img/assets/nav_pointer.svg'>"+title+"</li>";
	$(".carousel-table-of-contents").append( $(el) );
	tocpage++;

}
/**********************************************************
BUILD CAROUSEL OPTIONS
**********************************************************/
function toggleNotes(el) {
	$(el).parent().toggleClass('shownotes');
};


