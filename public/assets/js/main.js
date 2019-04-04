/*
	Hielo by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/

var settings = {

	banner: {

		// Indicators (= the clickable dots at the bottom).
			indicators: true,

		// Transition speed (in ms)
		// For timing purposes only. It *must* match the transition speed of "#banner > article".
			speed: 1500,

		// Transition delay (in ms)
			delay: 5000,

		// Parallax intensity (between 0 and 1; higher = more intense, lower = less intense; 0 = off)
			parallax: 0.25

	}

};

(function($) {

	skel.breakpoints({
		xlarge:	'(max-width: 1680px)',
		large:	'(max-width: 1280px)',
		medium:	'(max-width: 980px)',
		small:	'(max-width: 736px)',
		xsmall:	'(max-width: 480px)'
	});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = (skel.vars.browser == 'ie' || skel.vars.mobile) ? function() { return $(this) } : function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				on, off;

			on = function() {

				$t.css('background-position', 'center 100%, center 100%, center 0px');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$t.css('background-position', 'center ' + (pos * (-1 * intensity)) + 'px');

					});

			};

			off = function() {

				$t
					.css('background-position', '');

				$window
					.off('scroll._parallax');

			};

			skel.on('change', function() {

				if (skel.breakpoint('medium').active)
					(off)();
				else
					(on)();

			});

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	/**
	 * Custom banner slider for Slate.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._slider = function(options) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._slider(options);

			return $this;

		}

		// Vars.
			var	current = 0, pos = 0, lastPos = 0,
				slides = [], indicators = [],
				$indicators,
				$slides = $this.children('article'),
				intervalId,
				isLocked = false,
				i = 0;

		// Turn off indicators if we only have one slide.
			if ($slides.length == 1)
				options.indicators = false;

		// Functions.
			$this._switchTo = function(x, stop) {

				if (isLocked || pos == x)
					return;

				isLocked = true;

				if (stop)
					window.clearInterval(intervalId);

				// Update positions.
					lastPos = pos;
					pos = x;

				// Hide last slide.
					slides[lastPos].removeClass('top');

					if (options.indicators)
						indicators[lastPos].removeClass('visible');

				// Show new slide.
					slides[pos].addClass('visible').addClass('top');

					if (options.indicators)
						indicators[pos].addClass('visible');

				// Finish hiding last slide after a short delay.
					window.setTimeout(function() {

						slides[lastPos].addClass('instant').removeClass('visible');

						window.setTimeout(function() {

							slides[lastPos].removeClass('instant');
							isLocked = false;

						}, 100);

					}, options.speed);

			};

		// Indicators.
			if (options.indicators)
				$indicators = $('<ul class="indicators"></ul>').appendTo($this);

		// Slides.
			$slides
				.each(function() {

					var $slide = $(this),
						$img = $slide.find('img');

					// Slide.
						$slide
							.css('background-image', 'url("' + $img.attr('src') + '")')
							.css('background-position', ($slide.data('position') ? $slide.data('position') : 'center'));

					// Add to slides.
						slides.push($slide);

					// Indicators.
						if (options.indicators) {

							var $indicator_li = $('<li>' + i + '</li>').appendTo($indicators);

							// Indicator.
								$indicator_li
									.data('index', i)
									.on('click', function() {
										$this._switchTo($(this).data('index'), true);
									});

							// Add to indicators.
								indicators.push($indicator_li);

						}

					i++;

				})
				._parallax(options.parallax);

		// Initial slide.
			slides[pos].addClass('visible').addClass('top');

			if (options.indicators)
				indicators[pos].addClass('visible');

		// Bail if we only have a single slide.
			if (slides.length == 1)
				return;

		// Main loop.
			intervalId = window.setInterval(function() {

				current++;

				if (current >= slides.length)
					current = 0;

				$this._switchTo(current);

			}, options.delay);

	};

	$(function() {

		var	$window 	= $(window),
			$body 		= $('body'),
			$header 	= $('#header'),
			$banner 	= $('.banner');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Banner.
			$banner._slider(settings.banner);

		// Menu.
			$('#menu')
				.append('<a href="#menu" class="close"></a>')
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right'
				});

		// Header.
			if (skel.vars.IEVersion < 9)
				$header.removeClass('alt');

			if ($banner.length > 0
			&&	$header.hasClass('alt')) {

				$window.on('resize', function() { $window.trigger('scroll'); });

				$banner.scrollex({
					bottom:		$header.outerHeight(),
					terminate:	function() { $header.removeClass('alt'); },
					enter:		function() { $header.addClass('alt'); },
					leave:		function() { $header.removeClass('alt'); $header.addClass('reveal'); }
				});

			}

	});

})(jQuery);

$(document).ready(function() {
	// executes when HTML-Document is loaded and DOM is ready
   console.log("document is ready");
	 
   
	 $( ".card" ).hover(
	 function() {
	   $(this).addClass('shadow-lg').css('cursor', 'pointer'); 
	 }, function() {
	   $(this).removeClass('shadow-lg');
	 }
   );
	 
   // document ready  
   });
   
   class Slider {
	constructor(props) {
	  this.rootElement = props.element;
	  this.slides = Array.from(
		this.rootElement.querySelectorAll(".slider-list__item")
	  );
	  this.slidesLength = this.slides.length;
	  this.current = 0;
	  this.isAnimating = false;
	  this.direction = 1; // -1
	  this.baseAnimeSettings = {
		rotation: 45,
		duration: 750,
		easing: 'easeInOutCirc'
	  };
	  this.baseAnimeSettingsBack = {
		rotation: 45,
		duration: 1850,
		elasticity: function(el, i, l) {
		  return (200 + i * 200);
		}
	  };
	  this.baseAnimeSettingsFront = {
		rotation: 45,
		duration: 2250,
		elasticity: function(el, i, l) {
		  return (200 + i * 200);
		}
	  };
	  this.baseAnimeSettingsTitle = {
		rotation: 45,
		duration: 1750,
		elasticity: function(el, i, l) {
		  return (200 + i * 200);
		}
	  };
	  
	  this.navBar = this.rootElement.querySelector(".slider__nav-bar");
	  this.thumbs = Array.from(this.rootElement.querySelectorAll(".nav-control"));
	  this.prevButton = this.rootElement.querySelector(".slider__arrow_prev");
	  this.nextButton = this.rootElement.querySelector(".slider__arrow_next");
  
	  this.slides[this.current].classList.add("slider-list__item_active");
	  this.thumbs[this.current].classList.add("nav-control_active");
  
	  this._bindEvents();
	}
  
	goTo(index, dir) {
	  if (this.isAnimating) return;
	  var self = this;
	  let prevSlide = this.slides[this.current];
	  let nextSlide = this.slides[index];
  
	  self.isAnimating = true;
	  self.current = index;
	  nextSlide.classList.add("slider-list__item_active");
  
	  anime(Object.assign({}, self.baseAnimeSettings, {
		targets: nextSlide,
		rotate: [90 * dir + 'deg', 0],
		translateX: [90 * dir + '%', 0]
	  }));
  
	  anime(Object.assign({}, self.baseAnimeSettingsBack, {
		targets: nextSlide.querySelectorAll('.back__element'),
		rotate: [90 * dir + 'deg', 0],
		translateX: [90 * dir + '%', 0]
	  }));
  
	  anime(Object.assign({}, self.baseAnimeSettingsFront, {
		targets: nextSlide.querySelectorAll('.front__element'),
		rotate: [90 * dir + 'deg', 0],
		translateX: [90 * dir + '%', 0]
	  }));
	  
	  anime(Object.assign({}, self.baseAnimeSettingsTitle, {
		targets: nextSlide.querySelectorAll('.title__element'),
		rotate: [90 * dir + 'deg', 0],
		translateX: [90 * dir + '%', 0]
	  }));
  
	  anime(Object.assign({}, self.baseAnimeSettings, {
		targets: prevSlide,
		rotate: [0, -90 * dir + 'deg'],
		translateX: [0, -100 * dir + '%'],
		complete: function(anim) {
		  self.isAnimating = false;
		  prevSlide.classList.remove("slider-list__item_active");
		  self.thumbs.forEach((item, index) => {
			var action = index === self.current ? "add" : "remove";
			item.classList[action]("nav-control_active");
		  });
		}
	  }))
  
	  anime(Object.assign({}, self.baseAnimeSettingsBack, {
		targets: prevSlide.querySelectorAll('.back__element'),
		rotate: [0, -90 * dir + 'deg'],
		translateX: [0, -100 * dir + '%']
	  }));
  
	  anime(Object.assign({}, self.baseAnimeSettingsFront, {
		targets: prevSlide.querySelectorAll('.front__element'),
		rotate: [0, -90 * dir + 'deg'],
		translateX: [0, -100 * dir + '%']
	  }));
  
	  anime(Object.assign({}, self.baseAnimeSettingsTitle, {
		targets: prevSlide.querySelectorAll('.title__element'),
		rotate: [0, -90 * dir + 'deg'],
		translateX: [0, -100 * dir + '%']
	  }));
	  
	}
  
	goStep(dir) {
	  let index = this.current + dir;
	  let len = this.slidesLength;
	  let currentIndex = (index + len) % len;
	  this.goTo(currentIndex, dir);
	}
  
	goNext() {
	  this.goStep(1);
	}
  
	goPrev() {
	  this.goStep(-1);
	}
  
	_navClickHandler(e) {
	  var self = this;
	  if (self.isAnimating) return;
	  let target = e.target.closest(".nav-control");
	  if (!target) return;
	  let index = self.thumbs.indexOf(target);
	  if (index === self.current) return;
	  let direction = index > self.current ? 1 : -1;
	  self.goTo(index, direction);
	}
  
	_bindEvents() {
	  var self = this;
	  ["goNext", "goPrev", "_navClickHandler"].forEach(method => {
		self[method] = self[method].bind(self);
	  });
	  self.nextButton.addEventListener("click", self.goNext);
	  self.prevButton.addEventListener("click", self.goPrev);
	  self.navBar.addEventListener("click", self._navClickHandler);
	}
  }
  
  // ===== init ======
  let slider = new Slider({
	element: document.querySelector(".slider")
  });
  