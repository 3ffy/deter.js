/* deter - version: 2.1 - author: 3ffy (Aurélien Gy) - aureliengy@gmail.com - http://www.aureliengy.com - licence: BSD 3-Clause Licence (@see licence file or https://raw.githubusercontent.com/3ffy/deter/master/LICENSE). Note that the plugins "JQuery.Identicon5" by Francis Shanahan (http://archive.plugins.jquery.com/project/identicon5) and "JQuery.MD5" by Gabriele Romanato (http://blog.gabrieleromanato.com) are separated project and get their own licence. */
(function($) {

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
	 * Deter utilities packaged as jquery functions to let you use it outside the deter plugin.
	 */
	$.extend({

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
	 * @param {function} callback   The callback to use when the result will be calculated.
	 * @param {object}   options    [optional] Json object with the options of that plugin call.
	 * @param {function} getContent [optional] The way to get the value from your selector. (Default is the value (.val()) of the element, but if you use a div content you have to call .text() or something else.)
	 * @return {object}  The jquery object you used to call the plugin
	 */
	$.fn.deter = function(callback, options, getContent) {
		//default values
		var settings = jQuery.extend({
			sequence: false,
			opacity: 1,
			events: 'keyup',
			selectorDelegated: null,
			selectorDescendant: null
		}, options);

		//attach the wished event on each element of the selector
		this.each(function() {
			var selector = (settings.selectorDelegated === null) ? this : settings.selectorDelegated;
			$(selector)
				.on(settings.events, settings.selectorDescendant, function(e) {
					//use the user custom function to get the value of the ellement or just grab the element value if no function given
					var val = (typeof getContent == 'function') ? getContent.call(this) : $(this)
						.val();
					//calculate the determinist md5 & color values from the val
					var deter = $.strToColor(val, settings.opacity, settings.sequence);
					//call the callback
					callback.call(this, deter, val);
				});
		});
		//don't break the jquery event chain
		return this;
	};

	//TODO : modifier le nom et les params pour pouvoir choisir le type de génération dans le canevas (identicon ou graph de séquence, et donc les options qui vont avec type de graph etc.)

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
		//create canvas and check if the creation is successful or not
		var canvas = document.createElement('canvas');
		var canvasSupported = canvas.getContext ? true : false;
		//create the canvas for each element
		if (canvasSupported) {
			this.each(function() {
				var $this = $(this);
				if (typeof md5 == 'string') {
					$this
						.text(md5)
						.identicon5(options);
				} else {
					$this
						.text('');
				}
			});
		} else {
			//default settings
			settings = $.extend({
				size: 65
			}, options);
			//use background color of a span if canevas not supported		
			this.each(function() {
				var $this = $(this);
				if (typeof md5 == 'string') {
					var $fakeCanvas = $this.html('<span class="deter-canevas"></span>');
					$fakeCanvas
						.css('width', settings.size)
						.css('height', settings.size)
						.css('background-color', color);
				} else {
					$this
						.html('');
				}
			});
		}
		//don't break the jquery event chain
		return this;
	};

})(jQuery);