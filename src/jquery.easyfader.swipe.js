/*
* EASYFADER - "SWIPE" EXTENSION
* Version: 1.1
* License: Creative Commons Attribution 3.0 Unported - CC BY 3.0
* http://creativecommons.org/licenses/by/3.0/
* This software may be used freely on commercial and non-commercial projects with attribution to the author/copyright holder.
* Author: Patrick Kunka
* Copyright 2013 Patrick Kunka, All Rights Reserved
*/

(function($){
	if(typeof EasyFader === 'function'){
		$.extend(EasyFader.prototype.handlers,{
			swipe: function(){
				var self = this,
					$body = $('body'),
					swipe = false,
					swipeX = false,
					startX,
					startY,
					endX,
					endY,
					vectorX,
					vectorY,
					distanceX,
					firstE = true,
					getEvent = function(e){
						var eData = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
						return eData;
					};

				self.$container.on('touchstart',function(e){
					swipe = true;
					e = getEvent(e);
					startX = e.pageX;
					startY = e.pageY;
				});

				$body.on('touchmove',function(e){
					if(!self.changing && swipe){
						self.pause();

						var newE = getEvent(e);

						endX = newE.pageX;
						distanceX = endX - startX;
						vectorX = distanceX > 0 ? -distanceX : distanceX;
						
						if(firstE){
							endY = newE.pageY;
							firstE = false;
							vectorY = endY - startY > 0 ? -(endY - startY) : endY - startY;
							angle = vectorY/vectorX;
							if(angle < 1){
								e.preventDefault();
								swipeX = true;
							};
						} else if(self.effect == 'carousel'){
							var transformCSS = self.getPrefixedCSS('transform', 'translateX('+distanceX+'px)');
							self.$scrollWrapper.css(transformCSS);
						};
					};
				});

				$body.on('touchend',function(e){
					if(swipeX){
						swipe = false,
						swipeX = false;
						
						var target;
						
						if(self.effect == 'carousel'){
							var slideWidth = self.$slides.eq(0).outerWidth(self.includeMargin),
								slidesSwiped = -Math.round(distanceX / slideWidth);
								slidesSwiped = slidesSwiped ? slidesSwiped : (distanceX < 0 ? 1 : -1);
								
							self.preOffset = (slideWidth * slidesSwiped) + distanceX;
								
							target = self.activeIndex + slidesSwiped;
						} else {
							target = distanceX > 15 ? 'prev' : distanceX < -15 ? 'next' : false;
						};
					
						if(target) self.changeSlides(target);
					};
					firstE = true;
				});
			}
		});
	} else {
		console.error('EasyFader core not found');
	};
})(jQuery);