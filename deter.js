/* deter - version: 3.7 - author: 3ffy (Aurélien Gy) - aureliengy@gmail.com - http://www.aureliengy.com - licence: BSD 3-Clause Licence (@see licence file or https://raw.githubusercontent.com/3ffy/deter/master/LICENSE). Note that the plugins "JQuery.Identicon5" by Francis Shanahan (http://archive.plugins.jquery.com/project/identicon5) and "JQuery.MD5" by Gabriele Romanato (http://blog.gabrieleromanato.com) are separated project and get their own licence. */

//TODO: $.fn.deter.settings.target if relevant only in few cases, it should be relevant in all the case and let the user specify the visual target by himself in all cases.

(function($) {

	//create canvas and check if the creation is successful or not to detect html5 canevas support
	var canvas = document.createElement('canvas');
	var canvasSupported = canvas.getContext ? true : false;

	//package settings to let the user change them from outside the plugin
	var deter = {};
	//the default title for identicon boxes
	deter.boxTitle = 'If this picture is not the one you use to see, your password is misspelled.';
	//if true, deter will draw the identicon when autofill is set on the input (consume some ressources). If false, only when the user will type content manually.
	deter.autofillDrawIdenticon = true;

	/**
	 * Add deter extra markups.
	 *
	 * @param {string} elemSelector The selector representing dom elements to affect.
	 * @param {string} mode         The mode choosen for deter.
	 * @param {string} addClass     [optional] The eventual extra classes to add to the deter-container element.
	 */
	deter.wrapWithMarkup = function(elemSelector, mode, addClass) {
		if (typeof mode != 'string') {
			throw 'Param \'mode\' is mandatory.';
		} else if (mode == 'default') {
			mode = 'box-identicon';
		}
		if (typeof addClass != 'string') {
			addClass = '';
		}
		//get the element to wrap
		$elem = $(elemSelector);
		//wrap the element
		classbox = ' ' + addClass + ' deter-mode-' + mode;
		if (mode == 'box-identicon' || mode == 'box-color') {
			classbox += ' deter-behaviour-box';
		}
		$elem
			.addClass('deter-password')
			.wrap('<div class="deter-container' + classbox + '"></div>');
		if (mode != 'body' && mode != 'border' && mode != 'background') {
			$('<span class="deter-fingerprint"></span>')
				.insertAfter($elem);
		}
	};

	/**
	 * Return determinist color from a dynamic text. (one string = one color, always the same one).
	 * (Private function used into the $.strToColor one).
	 *
	 * @param {string} val      The value to convert.
	 * @param {float}  opacity  [optional] (default = 1) The opacity of the color wished. Only relevant with rgba results.
	 * @return {object} Json object with the calculated determinist values : {md5, hexRaw, hex, rgbRaw, rgb, rgbaRaw, rgba}.
	 */
	var strToColorProcess = function(val, opacity) {
		var res = {};
		//calculate md5 hash and add the result
		res.md5 = $.md5(val);
		//calculate hexadecimal color only if needed
		res.hexRaw = res.md5.substr(0, 6);
		res.hex = '#' + res.hexRaw;
		//calculate rgb color
		res.rgbRaw = $.hexToRgb(res.hexRaw, true);
		res.rgb = 'rgb(' + res.rgbRaw.r + ', ' + res.rgbRaw.g + ', ' + res.rgbRaw.b + ')';
		//calculate rgba color
		var alpha = (typeof opacity == 'number') ? opacity : 1;
		res.rgbaRaw = res.rgbRaw;
		res.rgbaRaw.a = alpha;
		res.rgba = 'rgba(' + res.rgbaRaw.r + ', ' + res.rgbaRaw.g + ', ' + res.rgbaRaw.b + ', ' + res.rgbaRaw.a + ')';
		return res;
	};

	/**
	 * Manage the different deter behaviours.
	 *
	 * @param {object} event JQuery event.
	 */
	var behaviourMeta = function(event) {
		var settings = event.data;
		//use the user custom function to get the value of the ellement or just grab the element value if no function given
		var val = (typeof settings.getContent == 'function') ? settings.getContent.call(this) : $(this)
			.val();
		//calculate the determinist md5 & color values from the val
		var deter = $.strToColor(val, settings.opacity, settings.sequence);
		//call the callback
		settings.callback.call(this, settings, deter, val);
	};

	/**
	 * Predefined border/box-shadow deter behaviour.
	 * (Change the box-shadow color & border color relative to the element value).
	 * The setting.opacity param will affect the box-shadow only, borders are solid.
	 *
	 * @param {object} settings The settings of the deter plugin as given by the user.
	 * @param {object} deter    The deter calculations based on the value of the element when the deter event was fired.
	 * @param {string} value    The value of the input when the deter event was fired.
	 */
	var behaviourBorder = function(settings, deter, value) {
		$elem = (typeof settings.target == 'string') ? $(settings.target) : $(this);
		if (value == '') {
			$elem
				.css('-webkit-box-shadow', '')
				.css('-moz-box-shadow', '')
				.css('box-shadow', '')
				.css('border-color', '');
		} else {
			var boxShadowValue = 'inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px ' + deter.rgba;
			$elem
				.css('-webkit-box-shadow', boxShadowValue)
				.css('-moz-box-shadow', boxShadowValue)
				.css('box-shadow', boxShadowValue)
				.css('border-color', deter.hex);
		}
	};

	/**
	 * Predefined background deter behaviour.
	 * (Change the background color relative to the element value).
	 *
	 * @param {object} settings The settings of the deter plugin as given by the user.
	 * @param {object} deter    The deter calculations based on the value of the element when the deter event was fired.
	 * @param {string} value    The value of the input when the deter event was fired.
	 */
	var behaviourBackground = function(settings, deter, value) {
		$elem = (typeof settings.target == 'string') ? $(settings.target) : $(this);
		//if no value, come back to the initial state (transparent background)
		$elem
			.css('background-color', (value == '') ? '' : deter.hex);
		if (settings.textColorMode == 'complementary') {
			var rgbComp = $.getComplementaryColor(deter.rgbRaw);
			$elem
				.css('color', 'rgb(' + rgbComp.r + ',' + rgbComp.g + ',' + rgbComp.b + ')');
		} else if (settings.textColorMode == 'monochrome') {
			var rgbMono = $.getFurtherColor(deter.rgbRaw);
			$elem
				.css('color', 'rgb(' + rgbMono.r + ',' + rgbMono.g + ',' + rgbMono.b + ')');
		}
	};

	/**
	 * Predefined box-color deter behaviour.
	 * (Change the background color of a sibling box, relative to the element value).
	 *
	 * @param {object} settings The settings of the deter plugin as given by the user.
	 * @param {object} deter    The deter calculations based on the value of the element when the deter event was fired.
	 * @param {string} value    The value of the input when the deter event was fired.
	 */
	var behaviourBoxColor = function(settings, deter, value) {
		var $deterFingerprint = $(this)
			.siblings('span.deter-fingerprint');
		$deterFingerprint
			.css('background-color', (value == '') ? '' : deter.hex);
	};

	/**
	 * Predefined box-identicon deter behaviour.
	 * (Create a canevas with identicon into a sibling box, relative to the element value).
	 *
	 * @param {object} settings The settings of the deter plugin as given by the user.
	 * @param {object} deter    The deter calculations based on the value of the element when the deter event was fired.
	 * @param {string} value    The value of the input when the deter event was fired.
	 */
	var behaviourBoxIdenticon = function(settings, deter, value) {
		var $deterFingerprint = $(this)
			.siblings('span.deter-fingerprint');
		//if no value, come back to the initial state (destroy canevas)
		if (value == '') {
			$deterFingerprint
				.text('');
		} else {
			$deterFingerprint
				.identicon(
					deter.md5,
					deter.hex, {
						rotate: true,
						size: settings.canevasSize
					});
		}
	};

	/**
	 * Deter utilities packaged as jquery functions to let you use it outside the deter plugin.
	 */
	$.extend({

		/**
		 * Deter packaged global settings.
		 */
		deter: deter,

		/**
		 * Convert hexadecimal color to RGB color.
		 *
		 * @param {string} hex The hexadecimal color with or without #, normal (#ddeeff) or combined (#def) format.
		 * @return {array} The results array on success, null on failure.
		 */
		hexToRgb: function(hex) {
			// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
			var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			hex = hex.replace(shorthandRegex, function(m, r, g, b) {
				return r + r + g + g + b + b;
			});
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			} : null;
		},

		/**
		 * Convert rgb color to xyz color.
		 *
		 * @param {object} rgb The rgb color.
		 * @return {object} The xyz color.
		 */
		rgbToXyz: function(rgb) {
			var xyz = {};
			//convert to percentage
			var r = parseFloat(rgb.r / 255);
			var g = parseFloat(rgb.g / 255);
			var b = parseFloat(rgb.b / 255);
			//calculate values into the xyz space
			r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
			g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
			b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
			//get back solid values
			r = r * 100;
			g = g * 100;
			b = b * 100;
			//apply xyz constants : Observer. = 2°, Illuminant = D65
			xyz.x = r * 0.4124 + g * 0.3576 + b * 0.1805;
			xyz.y = r * 0.2126 + g * 0.7152 + b * 0.0722;
			xyz.z = r * 0.0193 + g * 0.1192 + b * 0.9505;
			return xyz;
		},

		/**
		 * Convert xyz color to clab color (CIE LAB).
		 *
		 * @param {object} rgb The rgb color.
		 * @return {object} The xyz color.
		 */
		xyzToLab: function(xyz) {
			var lab = {};
			//apply clab constants
			var x = xyz.x / 95.047;
			var y = xyz.y / 100.000;
			var z = xyz.z / 108.883;
			//calculate values into clab space
			x = (x > 0.008856) ? Math.pow(x, (1 / 3)) : (7.787 * x) + (16 / 116);
			y = (y > 0.008856) ? Math.pow(y, (1 / 3)) : (7.787 * y) + (16 / 116);
			z = (z > 0.008856) ? Math.pow(z, (1 / 3)) : (7.787 * z) + (16 / 116);
			//applie clab constants
			lab.l = (116 * y) - 16;
			lab.a = 500 * (x - y);
			lab.b = 200 * (y - z);
			return lab;
		},

		/**
		 * Get the complementary color of a given one.
		 * (Light complementary color, not Pigment one = blue->yellow).
		 *
		 * @param {object} rgb     The seed rgb color.
		 * @param {bool}   pygment True to calculate the pygment complementary color, false to calculate the light one.
		 * @return {object} The rgb complementary color.
		 */
		getComplementaryColor: function(rgb, pygment) {
			var rgbComp = {};
			rgbComp.r = Math.abs(255 - rgb.r);
			rgbComp.g = (pygment == true) ? Math.abs(255 - ((rgb.r + rgb.b) / 2)) : Math.abs(255 - rgb.g);
			rgbComp.b = Math.abs(255 - rgb.b);
			return rgbComp;
		},

		/**
		 * Get the closest color of a seed color from 2 candidate ones.
		 *
		 * @param {object} rgb           The seed rgb color used for calculations.
		 * @param {object} rgbCandidate1 [optional] The first candidate rgb color (default = black).
		 * @param {object} rbgcandidate2 [optional] The second candidate rgb color (default = white).
		 * @return {object} The candidate rgb color picked.
		 */
		getClosestColor: function(rgb, rgbCandidate1, rbgcandidate2) {
			//use black and white as default candidates
			if (typeof rgbCandidate1 != 'object') {
				rbgcandidate1 = {
					r: 0,
					g: 0,
					b: 0
				};
			}
			if (typeof rbgcandidate2 != 'object') {
				rbgcandidate2 = {
					r: 255,
					g: 255,
					b: 255
				};
			}
			//get lab color values
			var xyz = $.rgbToXyz(deter.rgbRaw);
			var lab = $.xyzToLab(xyz);
			var xyzSeed1 = $.rgbToXyz(rgbCandidate1);
			var labSeed1 = $.xyzToLab(xyzSeed1);
			var xyzSeed2 = $.rgbToXyz(rbgcandidate2);
			var labSeed2 = $.xyzToLab(xyzSeed2);
			//calculate global approx for both candidate colors relative to our seed one
			var $res1 = Math.abs(labSeed1.l - lab.l) + Math.abs(labSeed1.a - lab.a) + Math.abs(labSeed1.b - lab.b);
			var $res2 = Math.abs(labSeed2.l - lab.l) + Math.abs(labSeed2.a - lab.a) + Math.abs(labSeed2.b - lab.b);
			//return the closest color from candidates
			return ($res1 <= $res2) ? rgbCandidate1 : rbgcandidate2;
		},

		/**
		 * Get the further color of a seed color from 2 candidate ones.
		 * (Usefull to improve readability : you can decide if it's better to writte black or white depending of the background color).
		 *
		 * @param {object} rgb           The seed rgb color used for calculations.
		 * @param {object} rgbCandidate1 [optional] The first candidate rgb color (default = black).
		 * @param {object} rbgcandidate2 [optional] The second candidate rgb color (default = white).
		 * @return {object} The candidate rgb color picked.
		 */
		getFurtherColor: function(rgb, rgbCandidate1, rbgcandidate2) {
			//use black and white as default candidates
			if (typeof rgbCandidate1 != 'object') {
				rgbCandidate1 = {
					r: 0,
					g: 0,
					b: 0
				};
			}
			if (typeof rbgcandidate2 != 'object') {
				rbgcandidate2 = {
					r: 255,
					g: 255,
					b: 255
				};
			}
			//get lab color values
			var xyz = $.rgbToXyz(rgb);
			var lab = $.xyzToLab(xyz);
			var xyzSeed1 = $.rgbToXyz(rgbCandidate1);
			var labSeed1 = $.xyzToLab(xyzSeed1);
			var xyzSeed2 = $.rgbToXyz(rbgcandidate2);
			var labSeed2 = $.xyzToLab(xyzSeed2);
			//calculate global approx for both candidate colors relative to our seed one
			var $res1 = Math.abs(labSeed1.l - lab.l) + Math.abs(labSeed1.a - lab.a) + Math.abs(labSeed1.b - lab.b);
			var $res2 = Math.abs(labSeed2.l - lab.l) + Math.abs(labSeed2.a - lab.a) + Math.abs(labSeed2.b - lab.b);
			//return the further color from candidates
			return ($res1 > $res2) ? rgbCandidate1 : rbgcandidate2;
		},

		/**
		 * Return determinist color from a dynamic text. (one string = one color, always the same one).
		 *
		 * @param {string} val      The value to convert.
		 * @param {float}  opacity  [optional] (default = 1) The opacity of the color wished. Only relevant with rgba results.
		 * @param {bool}   sequence [optional] (default = false) True if you want to get a full sequence of all the md5 letter by letter, false for just the final result.
		 * @return {mixed} sequence = false : Json object with the calculated determinist values : {md5, hexRaw, hex, rgbRaw, rgb, rgbaRaw, rgba}, sequence = true : an array of the json objects sequence.
		 */
		strToColor: function(val, opacity, sequence) {
			var res;
			if (sequence !== true) {
				res = strToColorProcess(val, opacity);
			} else {
				res = [];
				//get the result for each char position (azety = value for a + value for az + value for aze, etc.)
				var valSize = val.length;
				var i;
				var tmpVal;
				for (i = 0; i < valSize; i++) {
					tmpVal = val.substr(0, i + 1);
					res.push(strToColorProcess(tmpVal, opacity));
				}
			}
			return res;
		}

	});

	/**
	 * Deter plugin.
	 * Call the $.strToColor each time the condition given in the options param is filled.
	 *
	 * @param {mixed}  mode    [optional] A string corresponding to the behaviour wished or a callback function (default = 'box-identicon').
	 * @param {object} options [optional] Json object with the options of that plugin call.
	 * @return {object} The jquery object you used to call the plugin.
	 */
	$.fn.deter = function(mode, options) {
		//default values
		var settings = $.extend({
			sequence: false,
			opacity: 1,
			canevasSize: 'auto',
			addDeterExtraMarkups: true,
			getContent: null,
			events: 'keyup',
			selectorDelegated: null,
			addClass: '',
			textColorMode: 'default', //values are 'default', 'monochrome', 'complementary'
			target: null
		}, options);
		//clean behaviour mode
		var behaviour;
		if (typeof mode == 'function') {
			behaviour = 'custom';
			settings.sequence = false;
		} else if (typeof mode == 'string' && mode != 'default') {
			behaviour = mode;
		} else {
			behaviour = 'box-identicon';
		}
		//fallback old browsers
		if (behaviour == 'box-identicon' && canvasSupported == false) {
			behaviour = 'box-color';
		}
		//add deter extra markups
		if (settings.selectorDelegated === null && settings.addDeterExtraMarkups == true) {
			$.deter.wrapWithMarkup(this, behaviour, settings.addClass);
		}
		//attach the behaviour & events wished to the elements
		switch (behaviour) {
			case 'custom':
				settings.callback = mode;
				break;
			case 'border':
				settings.callback = behaviourBorder;
				break;
			case 'background':
				settings.callback = behaviourBackground;
				break;
			case 'box-color':
				settings.callback = behaviourBoxColor;
				break;
				// = box-identicon // = default
			default:
				settings.callback = behaviourBoxIdenticon;
		}
		//attach the events to the behaviours
		$(this)
			.on(settings.events, settings.selectorDelegated, settings, behaviourMeta);
		//don't break jQuery chain events
		return this;
	};

	/**
	 * Deter to Identicon5 gateway plugin.
	 * Generate a canevas with identicon if canevas supported, otherwise a determinist background color.
	 * It intercept the identicon5 plugin to use remote call to gravatar to stay 100% client side.
	 *
	 * @param {string} md5     The md5 string to use as seed for the canvas. If md5 = null, the canevas will be suppressed (usefull to come back to the initial state).
	 * @param {string} color   The color to use if the canevas is not supported (for old browsers).
	 * @param {object} options The options used in the identicon5 plugin itself.
	 * @return {[type]} [description]
	 */
	$.fn.identicon = function(md5, color, options) {
		//default settings
		settings = $.extend({
			size: 65
		}, options);
		if (settings.size == 'auto') {
			var $container = $(this);
			var containerWidth = $container.width();
			var containerHeight = $container.height();
			if (containerWidth == 0) {
				settings.size = containerHeight;
			} else if (containerHeight == 0) {
				settings.size = containerWidth;
			} else {
				settings.size = Math.min(containerWidth, containerHeight);
			}
		}
		//create the canvas for each element
		if (canvasSupported) {
			this.each(function() {
				var $this = $(this);
				if (typeof md5 == 'string') {
					$this
						.text(md5)
						.identicon5(settings);
				} else {
					$this
						.text('');
				}
			});
		} else {
			//use background color of a span if canevas not supported       
			this.each(function() {
				var $this = $(this);
				if (typeof md5 == 'string') {
					var $fakeCanvas = $this.html('<span class="deter-fake-canevas"></span>');
					$fakeCanvas
						.css('width', settings.size)
						.css('height', settings.size)
						.css('background-color', color);
				} else {
					$this
						.text('');
				}
			});
		}
		//don't break the jquery event chain
		return this;
	};

	$(document)
		.ready(function() {

			//add globals deter events
			$('body')
				.on('click', 'div.deter-container.deter-behaviour-box', function(e) {
					var $deterPassword = $(this)
						.children('.deter-password');
					$deterPassword
						.focus();
				})
				.on('focus', 'div.deter-container.deter-behaviour-box > .deter-password', function(e) {
					//add a fancy box shadow effect on the canvas if the input is focused
					if ($(this)
						.val() != '') {
						var $deterContainer = $(this)
							.parent('div.deter-container.deter-behaviour-box');
						$deterContainer
							.addClass('focused');
					}
				})
				.on('blur', 'div.deter-container.deter-behaviour-box > .deter-password', function(e) {
					var $deterContainer = $(this)
						.parent('div.deter-container.deter-behaviour-box');
					$deterContainer
						.removeClass('focused');
				})
				.on('keyup', 'div.deter-container.deter-behaviour-box > .deter-password', function(e) {
					var $deterContainer = $(this)
						.parent('div.deter-container.deter-behaviour-box');
					var $deterFingerprint = $(this)
						.siblings('span.deter-fingerprint');
					//add a fancy box shadow effect on the canvas if the input is focused
					if ($(this)
						.val() != '') {
						$deterContainer
							.addClass('focused');
						$deterFingerprint
							.addClass('visible')
							.attr('title', $.deter.boxTitle);
					} else {
						$deterContainer
							.removeClass('focused');
						$deterFingerprint
							.removeClass('visible')
							.removeAttr('title');
					}
				})
				.on('repaint', 'div.deter-container.deter-mode-box-identicon > .deter-password', function(event, data) {
					$(this)
						.siblings('.deter-fingerprint')
						.trigger('repaint', data);
				})
				.on('repaint', '.deter-fingerprint', function(event, data) {
					var $this = $(this);
					//handle default values
					data = (typeof data == 'object') ? data : {};
					var val = (typeof data.value == 'undefined') ? $this.siblings('.deter-password')
						.val() : data.value;
					var opacity = (typeof data.opacity == 'undefined') ? 1 : data.opacity;
					var sequence = (typeof data.sequence == 'undefined') ? false : data.sequence;
					var canevasSize = (typeof data.canevasSize == 'undefined') ? 'auto' : data.canevasSize;
					//calculate deter values
					var deter = $.strToColor(val, opacity, sequence);
					//redraw the identicon
					$this
						.identicon(
							deter.md5,
							deter.hex, {
								rotate: true,
								size: canevasSize
							});
				});

		});

	if ($.deter.autofillDrawIdenticon == true) {

		$(window)
			.load(function() {

				//detect if the browser is webkit based
				var isWebkit = /webkit/.test(navigator.userAgent.toLowerCase());

				//bugfix browser autofill : if autofilled, the value of the input is not accessible when the dom is loaded, it is only after few millisec.
				// On Webkit browsers (as chrome), the behaviour is the same on the first loading of the page, but when the page is cached the autofilled input passwords got a value only when they became visible on the screen.
				$('div.deter-container.deter-mode-box-identicon > .deter-password')
					.each(function() {
						var $this = $(this);
						//special behaviour about chrome (we need to test if the navigator is webkit based because the filter `:-webkit-autofill` will throw a syntaxError on other browsers)
						if (isWebkit == true && $this.filter(':-webkit-autofill')) {
							//test all the 300 millisec if the input is visible, if it is, fire deter repaint then destruct the interval
							var intervalListener = setInterval(function() {
								//if the element is visible
								if ($this.is(':visible') == true) {
									//we need to wait the browser fills the input
									setTimeout(function() {
										//only if the input is empty
										if ($this.val() != '') {
											$this
												.trigger('repaint');
										}
										window.clearInterval(intervalListener);
									}, 100);
								}
							}, 300);
						} else {
							//we need to wait the browser fills the input
							setTimeout(function() {
								//only if the input is empty
								if ($this.val() != '') {
									$this
										.trigger('repaint');
								}
							}, 100);

						}
					});

			});

	}

})(jQuery);