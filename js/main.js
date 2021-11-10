var isMobile = false;
var xmlobj;
var $xml;
var jqready = false;
var ytready = false;
$(function(){
	jqready = true;

	console.log("jquery ready, is youtube? "+ytready);
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

document.addEventListener('keydown', (event) => {
  const keyName = event.key;
  if (keyName === 'ArrowRight' || keyName === 'ArrowLeft') {
  		console.log("arrow button pressed");
    	setBackground();
  }
}, false);

function getXML(){
	//console.log("getXML()");
	$.ajax({
        type: "GET",
        url: "xml/carousel.xml",
        dataType: "xml",
        success: parseDATAXml
    });
}

function parseDATAXml(xml) {
    //console.log(xml);
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

	//createYoutubeEmbeds();

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

	$(".carousel-table-of-contents li button").click(function(){
		//console.log("click");
		//console.log($(this).attr("id"));
		if ( !$(this).hasClass("active") ){
			var num = $(this).attr("data-slide-to");
			goCarouselItem(Number(num));
			//setTimeout(function(){ setBackground(); }, 50);
		}
		
		
		//setTOCActiveSlide($(this).attr("id"));
	});

	setCarouselInterval(duration);

	// Enable Carousel Controls
	$(".left").click(function(){
		//console.log("click");
		goCarouselItem("prev");
		resetInterval();
	});
	$(".right").click(function(){
		goCarouselItem("next");
		resetInterval();
	});

	// for initial set up, first carousel item check for video;
	checkYoutubeOnPage(0);
};
function goCarouselItem(item){
	//console.log("goCarouselItem");
	$("#myCarousel").carousel(item);
	setBackground();
};
function setBackground(){
	//console.log("setBackground()");
	
	var nextprev = "";
	if ($(".item.next").length){
		nextprev = "next";
	} else if ($(".item.prev").length){
		nextprev = "prev";
	}
	if (nextprev != ""){
		$(".slide-backgrounds.on").removeClass("on geo hydro bio cryo atmo");
		var $bkgd = $(".item."+nextprev).attr("data-background");
		var $slidebkgd = $(".slide-backgrounds."+$bkgd);
		if ($bkgd === "sphere-bkgds"){
			$slidebkgd.addClass($(".item."+nextprev).attr("data-sphere"));
			setTimeout(function(){ $slidebkgd.addClass("on"); }, 50);
		} else {
			$slidebkgd.addClass("on");
		}
		setHeader($(".item."+nextprev));
		setTimeout(function(){ 
			setTOCActiveSlide($(".carousel-indicators li.active").attr("data-slideid"));
		}, 200);
	}
};
function setHeader($item){
	var partnum = "Part 1";
	if ($item.hasClass("part-2")){
		var partnum = "Part 2";
	} else if ($item.hasClass("part-3")){
		var partnum = "Part 3";
	}
	$(".header-title").html("A Context For Climate Change: "+partnum);
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
var hasvideo = false;

function setTOCActiveSlide(slideid){

	// stop player;
	if (hasvideo){
		player.stopVideo();
		$(".videoWrapper iframe").each(function( index ) {
			$( this ).closest(".videoWrapper").append("<div id='"+$( this ).closest(".videoWrapper").attr("data-id")+"'></div>");
			$( this ).remove();
			
		});
		hasvideo = false;
	}
	// remove embed;

	//console.log("setTOCActiveSlide = "+slideid);
	$(".carousel-table-of-contents li button").removeClass("active");
	$(".carousel-table-of-contents li button#"+slideid).addClass("active");
	var pagenum = $(".carousel-indicators li.active").attr("data-slide-to");
	$(".carousel-pagination .this-page").html(Number(pagenum)+1);
	if (!$("#hamburger-menu").hasClass('collapsed')){
		toggleHamburger();
	}
	//console.log(".carousel-inner .item.active data-id = "+$(".carousel-inner .item.active").length);
	//console.log(".carousel-inner .item.active data-id = "+pagenum);
	//console.log(".videoWrapper total"+$(".carousel-inner .item").eq(pagenum).find(".videoWrapper").length);

	checkYoutubeOnPage(pagenum);
	
	setTimeout(function(){
		console.log(".notes.answer ?"+$(".notes.answer").length); 
		$(".notes.answer").each(function( index ) {
			console.log("button?"+$( this ).children("button").length);
		  	console.log("button height ?"+$( this ).children("button").outerHeight());
		  	$( this ).css({
		  		height: $( this ).children("button").outerHeight()
		  	})
		});
		
	}, 200);

}

function checkYoutubeOnPage(pagenum){

	$(".carousel-inner .item").eq(pagenum).find(".videoWrapper").each(function( index ) {

		hasvideo = true;
		/*
		data-params
		data-ytid="rWWsTuLICRY"
		id="ytplayer0"
		*/
		//console.log("data-params: "+$( this ).attr("data-params"));
		//console.log("data-ytid: "+$( this ).attr("data-ytid"));
		//console.log("id: "+$( this ).attr("data-id"));
		//var yt = '<iframe aria-label="youtube video" class="yt_player_iframe" id="'+$(this).children("div").eq(0).attr("id")+'" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/'+$( this ).children("div").eq(0).attr("data-ytid")+'?playlist='+$( this ).children("div").eq(0).attr("data-ytid")+'&amp;'+params+'" frameborder="0" allowfullscreen="true" allowscriptaccess="always"></iframe></div>';
		
		let paramsString = $( this ).attr("data-params");
		const paramsList = paramsString.split("&");
		let param = "";

		let controls = 1;
		let autoplay = 0;
		let loop = 0;
		let mute = 0;

		for (let x of paramsList) {
			if (x.split("=")[0] === "controls"){
				controls = isNaN(x.split("=")[1]) ? controls : Number(x.split("=")[1]);
		    } else if (x.split("=")[0] === "autoplay"){
		    	autoplay = isNaN(x.split("=")[1]) ? autoplay : Number(x.split("=")[1]);
		    } else if (x.split("=")[0] === "loop"){
				loop = isNaN(x.split("=")[1]) ? loop : Number(x.split("=")[1]);
		    } else if (x.split("=")[0] === "mute"){
		    	mute = isNaN(x.split("=")[1]) ? mute : Number(x.split("=")[1]);
		    }
		}
		
		player = new YT.Player($( this ).attr("data-id"), {
          height: '360',
          width: '640',
          videoId: $( this ).attr("data-ytid"),
          playerVars: { 
          	'controls': controls,
          	'autoplay': autoplay,
          	'loop': loop,
          	'mute': mute,
          	'playlist' : $( this ).attr("data-ytid")
          },

          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });

	});

}

/**********************************************************
BUILD CAROUSEL OPTIONS
**********************************************************/
function populateCarousel(){
	var x = xmlobj.documentElement.childNodes;
	var partnum = 1;
    var totalslides = 0;
    for (i = 0; i < x.length; i++) {
		//console.log(x[i].nodeName);
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
						//console.log("  >  " + "slide node");
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
										var imageSrc = "";
										var layoutType = "";
										if (params.attributes["layout"]){
											layoutType = params.attributes["layout"].nodeValue;
										}
										if (params.attributes["image"]){
											imageSrc = params.attributes["image"].nodeValue;
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
														slideHtmlText += "<div class='item-container half-height absolute-align-top'><div class='title-wrapper'>";
														//console.log("hasEls(slide, 'top') = "+hasEls(slide, 'top'));

														for (var c = 0; c < slide.childNodes.length; c++) {
											            	//console.log(slide.childNodes[c].nodeName);
											                if (slide.childNodes[c].nodeName === "top"){

											                	for (var d = 0; d < slide.childNodes[c].childNodes.length; d++) {

											                		slideHtmlText += returnElementHTML(slide.childNodes[c].childNodes[d], totalslides);

											                    }
											                }
											            }
														slideHtmlText += '</div></div>';

			          									/*
															LOOP ON BOTTOM
															IF NO BOTTOM, LOG;
			          									*/
														slideHtmlText += '<div class="item-container half-height absolute-align-bottom">';
															if (slide.getElementsByTagName('bottom')[b].attributes['elemType'] === undefined){
																for (var q=0; q<slide.getElementsByTagName('bottom')[b].childNodes.length; q++ ){

																	slideHtmlText += returnElementHTML(slide.getElementsByTagName('bottom')[b].childNodes[q], totalslides);

											                	}
															} else {
																var elementType = slide.getElementsByTagName('bottom')[b].attributes['elemType'].nodeValue;
																if (elementType === "quote"){
																	slideHtmlText += '<div class="d-flex w-100 h-100 py-5">';
																		slideHtmlText += '<div class="quote">';
																		//console.log("===========bottom quote object================");
																		for (var q=0; q<slide.getElementsByTagName('bottom')[b].childNodes.length; q++ ){
																			//console.log(slide.getElementsByTagName('bottom')[b].childNodes[q].nodeName);

																			slideHtmlText += returnElementHTML(slide.getElementsByTagName('bottom')[b].childNodes[q], totalslides);

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

																slideHtmlText += returnElementHTML(slide.childNodes[c].childNodes[d], totalslides);

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

																slideHtmlText += returnElementHTML(slide.childNodes[c].childNodes[d], totalslides);

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

																slideHtmlText += returnElementHTML(slide.childNodes[c].childNodes[d], totalslides);

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

																slideHtmlText += returnElementHTML(slide.childNodes[c].childNodes[d], totalslides);

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

																slideHtmlText += returnElementHTML(slide.childNodes[c].childNodes[d], totalslides);

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

																slideHtmlText += returnElementHTML(slide.childNodes[c].childNodes[d], totalslides);

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

											if (slideType === "background-image"){
												slideHtmlText = '<div style="background-image:url('+imageSrc+');" class="item '+partclass+' '+slideType+(totalslides === 0 ? ' active' : '')+'" data-id="'+totalslides+'" data-background="'+slideType+'">';
											} else {
												slideHtmlText = '<div class="item '+partclass+' '+slideType+(totalslides === 0 ? ' active' : '')+'" data-id="'+totalslides+'" data-background="'+slideType+'">';
											}

												slideHtmlText += '<div class="item-container d-flex">';
							            			for (var c = 0; c < slide.childNodes.length; c++) {
														if (slide.childNodes[c].nodeName === "element"){
															var width = slide.childNodes[c].attributes['width'] === undefined ? ' w-50' : ' '+slide.childNodes[c].attributes['width'].nodeValue;
															var height = slide.childNodes[c].attributes['height'] === undefined ? '' : ' '+slide.childNodes[c].attributes['height'].nodeValue;
															var padding = slide.childNodes[c].attributes['padding'] === undefined ? '' : ' '+slide.childNodes[c].attributes['padding'].nodeValue;
															var classes = slide.childNodes[c].attributes['classes'] === undefined ? '' : ' '+slide.childNodes[c].attributes['classes'].nodeValue;
															slideHtmlText += '<div class="item-element'+width+height+padding+classes+'">';
															for (var d = 0; d < slide.childNodes[c].childNodes.length; d++) {
																if (slide.childNodes[c].childNodes[d].nodeName === "element"){
																	width = slide.childNodes[c].childNodes[d].attributes['width'] === undefined ? ' w-50' : ' '+slide.childNodes[c].childNodes[d].attributes['width'].nodeValue;
																	height = slide.childNodes[c].childNodes[d].attributes['height'] === undefined ? '' : ' '+slide.childNodes[c].childNodes[d].attributes['height'].nodeValue;
																	padding = slide.childNodes[c].childNodes[d].attributes['padding'] === undefined ? '' : ' '+slide.childNodes[c].childNodes[d].attributes['padding'].nodeValue;
																	classes = slide.childNodes[c].childNodes[d].attributes['classes'] === undefined ? '' : ' '+slide.childNodes[c].childNodes[d].attributes['classes'].nodeValue;
																	slideHtmlText += '<div class="item-element'+width+height+padding+classes+'">';
																		for (var e = 0; e < slide.childNodes[c].childNodes[d].childNodes.length; e++) {
																			slideHtmlText += returnElementHTML(slide.childNodes[c].childNodes[d].childNodes[e], totalslides);
																		}
																	slideHtmlText += '</div>';
																} else {
																	slideHtmlText += returnElementHTML(slide.childNodes[c].childNodes[d], totalslides);
																}

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
function returnElementHTML(node, totalslides){

	var slideHtmlText = "";
	var classes = "";
	var imgalt = "no description provided";
	if (node.nodeName === 'section'){
   		slideHtmlText += '<h1 tabindex="0" class="h1 section-header">'+node.childNodes[0].nodeValue+'</h1>';
   	} else if (node.nodeName === 'main'){
   		slideHtmlText += '<h1 tabindex="0" class="h1 main-header">'+node.childNodes[0].nodeValue+'</h1>';
    } else if (node.nodeName === 'h2subheader'){
		slideHtmlText += '<h2 tabindex="0" class="h2 sub-header">'+node.childNodes[0].nodeValue+'</h2>';
	} else if (node.nodeName === 'h3subheader'){
		slideHtmlText += '<h3 tabindex="0" class="h3 sub-header">'+node.childNodes[0].nodeValue+'</h3>';
	} else if (node.nodeName === 'p'){
		if (node.attributes["classes"]){
			classes = " "+node.attributes["classes"].nodeValue;
		}
    	slideHtmlText += '<p tabindex="0" class="main-content'+classes+'">'+node.childNodes[0].nodeValue+'</p>';
    } else if (node.nodeName === "quote"){
		slideHtmlText += '<p tabindex="0" class="quote-body">'+node.childNodes[0].nodeValue+'</p>';
	} else if (node.nodeName === "byline"){
			slideHtmlText += '<p tabindex="0" class="quote-attribution">'+node.childNodes[0].nodeValue+'</p>';
		slideHtmlText += '</div>';
    } else if (node.nodeName === 'video'){
    	slideHtmlText += '<p tabindex="0" class="main-content" data-src="'+node.childNodes[0].nodeValue+'">'+'ADD VIDEO ELEMENT'+'</p>';
    } else if (node.nodeName === 'caption'){
    	slideHtmlText += '<p tabindex="0" class="caption">'+node.childNodes[0].nodeValue+'</p>';
    } else if (node.nodeName === 'image'){
    	if (node.attributes["alt"]){
			imgalt = node.attributes['alt'].nodeValue;
		}
		slideHtmlText += (node.attributes["linktoslide"] ? '<a href="#myCarousel" data-slide-to="'+node.attributes['linktoslide'].nodeValue+'">' : '')+'<img tabindex="0" src="'+node.childNodes[0].nodeValue+'" alt="'+imgalt+'">'+(node.attributes["linktoslide"] ? '</a>' : '');
    } else if (node.nodeName === 'displayimage'){
    	if (node.attributes["alt"]){
			imgalt = node.attributes['alt'].nodeValue;
		}
    	slideHtmlText += '<div class="display-image">';
			slideHtmlText += '<img tabindex="0" src="'+node.childNodes[0].nodeValue+'" alt="'+imgalt+'">';
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
			var imgalt = "no description provided";
			for (var e = 0; e < node.childNodes.length; e++) {
				if (node.childNodes[e].nodeName === "quote"){
					quote = node.childNodes[e].childNodes[0].nodeValue;
				} else if (node.childNodes[e].nodeName === "byline"){
					byline = node.childNodes[e].childNodes[0].nodeValue;
				} else if (node.childNodes[e].nodeName === "displayimage"){
					img = node.childNodes[e].childNodes[0].nodeValue;
					if (node.attributes["alt"]){
						imgalt = node.attributes['alt'].nodeValue;
					}
				}
			}
			slideHtmlText += '<div class="quote">';
				slideHtmlText += '<p tabindex="0" class="quote-body">'+quote+'</p>';
				slideHtmlText += '<p tabindex="0" class="quote-attribution">'+byline+'</p>';
			slideHtmlText += '</div>';
			slideHtmlText += '<div class="display-image">';
				slideHtmlText += '<img tabindex="0" src="'+img+'" alt="'+imgalt+'">';
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
				slideHtmlText += '<li><p tabindex="0">'+node.childNodes[e].childNodes[0].nodeValue+'</p></li>';
			}
		}
		slideHtmlText += '</'+listtype+'>';
	} else if (node.nodeName === 'youtube'){
		var yturlsplitarray = node.childNodes[0].nodeValue.split('/');
		var params = "";
		if (node.attributes["params"]){
			params = node.attributes['params'].nodeValue;
		}
		//console.log("video");
		//console.log(node.childNodes[0].nodeValue);
		//console.log("yturlsplitarray length = "+yturlsplitarray.length);
		slideHtmlText += '<div class="videoWrapper" data-params="'+params+'" data-ytid="'+yturlsplitarray[(yturlsplitarray.length-1)]+'" data-id="ytplayer'+totalslides+'"><div id="ytplayer'+totalslides+'"></div></div>';
		//'<iframe aria-label="youtube video" class="yt_player_iframe" id="ytplayer'+totalslides+'" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/'+yturlsplitarray[(yturlsplitarray.length-1)]+'?playlist='+yturlsplitarray[(yturlsplitarray.length-1)]+'&amp;'+params+'" frameborder="0" allowfullscreen="true" allowscriptaccess="always"></iframe></div>';
	} else if (node.nodeName === 'hint'){
		slideHtmlText += '<div class="hints"><button class="btn seehint" onclick="toggleHints(this)"><span>(hint)</span><div><img src="img/assets/hint_hand.svg"></div></button><p tabindex="0" class="hint">'+node.childNodes[0].nodeValue+'</p></div>';
	} else if (node.nodeName === 'note'){
		var img_orange = "";
		var button_label = "Notes";
		var jsclickevt = "toggleNotes";
		if (node.attributes["classes"]){
			classes = " "+node.attributes["classes"].nodeValue;
			img_orange = classes.includes("answer") ? "_orange" : "";
			button_label = classes.includes("answer") ? "Answer" : "Notes";
			jsclickevt = classes.includes("answer") ? "toggleAnswer" : "toggleNotes";
		}
		slideHtmlText += '<div class="notes'+classes+'"><button class="btn seenotes" onclick="'+jsclickevt+'(this)"><img src="img/assets/nav_pointer'+img_orange+'.svg"><span>'+button_label+'</span></button><p tabindex="0" class="note">'+node.childNodes[0].nodeValue+'</p></div>';
	}

	return slideHtmlText;

}
function hasEls(el, name){
	//console.log("has "+name+"?"+el.getElementsByTagName(name).length);
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
	//console.log("addNewTOCItem: "+thisslidenum);
	var isFirstSlide = thisslidenum === 0 ? true : false;
	var el = "<li><button id='"+slideid+"' class='btn"+(isFirstSlide ? " first-slide-of-part" : "")+((isFirstSlide && tocpage) ? " " : "")+(tocpage === 1 ? "active" : "")+"' data-target='#myCarousel' data-page='"+tocpage+"' data-slide-to='"+totalslides+"'><img role='presentation' src='img/assets/nav_pointer.svg'>"+title+"</button></li>";
	$(".carousel-table-of-contents").append( $(el) );
	tocpage++;

}
/**********************************************************
BUILD CAROUSEL OPTIONS
**********************************************************/
function toggleNotes(el) {
	var isclosing = $(el).parent().hasClass('shownotes');
	$(el).parent().toggleClass('shownotes');
	if (isclosing){
		$(el).siblings('p').css({
			height: $(el).siblings('p').outerHeight(),
			opacity: '0'
		});
		setTimeout(function(){
			$(el).siblings('p').css({
				height: '0px',
				margin: '0px',
			});
			setTimeout(function(){
				$(el).siblings('p').removeAttr("style");
			}, 500);
		}, 50);
	} else {
		$(el).siblings('p').css({
			display: 'block',
		});
		setTimeout(function(){
			// set the height;
			var h = $(el).siblings('p').outerHeight();
			// set style to 0;

			$(el).siblings('p').css({
				height: '0px',
				position: 'relative',
				opacity: '1'
			});
			setTimeout(function(){
				$(el).siblings('p').css({
					height: h,
					margin: '.5rem 0'
				});
				setTimeout(function(){
					$(el).siblings('p').css({
						height: 'auto',
					});
				}, 500);
			}, 50);
		}, 50);
	};
};
function toggleAnswer(el) {
	$(el).parent().toggleClass('shownotes');

	setTimeout(function(){
		console.log("open? "+$(el).parent().hasClass("shownotes"));
		console.log("button height: "+$(el).outerHeight());
		var h = $(el).outerHeight();
		if ($(el).parent().hasClass("shownotes")){
			console.log("p height: "+$(el).siblings('p').outerHeight());
			h += $(el).siblings('p').outerHeight();
		}
		$(el).parent().css({
			height: h
		});
	}, 50);
};
function toggleHints(el) {
	$(el).parent().toggleClass('showhints');
};
// https://developers.google.com/youtube/iframe_api_reference

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
var playerObjList = [[]];
function onYouTubeIframeAPIReady() {
	ytready = true;
	//console.log("youtube ready, is youtube? "+jqready);
	//console.log("onYouTubeIframeAPIReady()");
	//createYoutubeEmbeds();
	
}
// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	//console.log("onPlayerReady");
	//playerObjList[0][0].playVideo();
	//setTimeout(stopVideo, 4000);
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  	//console.log("onPlayerStateChange");
    if (event.data == YT.PlayerState.PLAYING && !done) {
      done = true;
    }
}

function stopVideo() {
  	//console.log("stopVideo");
    playerObjList[0][0].stopVideo();
    setTimeout(startVideo, 4000);
}
function startVideo() {
	//console.log("startVideo");
	playerObjList[0][0].playVideo();
}