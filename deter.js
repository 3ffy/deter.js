/* deter - version: 1.0 - author: 3ffy (Aurélien Gy) - aureliengy@gmail.com - http://www.aureliengy.com - licence: BSD 3-Clause Licence (@see licence file or https://raw.githubusercontent.com/3ffy/deter/master/LICENSE). Note that the plugins "JQuery.Identicon5" by Francis Shanahan (http://archive.plugins.jquery.com/project/identicon5) and "JQuery.MD5" by Gabriele Romanato (http://blog.gabrieleromanato.com) are separated project and get their own licence. */
var deter = {}; //internal function packager

(function($) {

	/**
	 * Convert hexadecimal color to RGB color.
	 * 
	 * @param string hex The hexadecimal color with or without #, normal (#ddeeff) or combined (#def) format.
	 * @return array The results array on success, null on failure.
	 */
	deter.hexToRgb = function (hex)
	{
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
	};

	$.extend({
		
		/**
		 * Return determinist color from a dynamic text. (one string = one color, always the same one).
		 * 
		 * @param string val            The value to convert.
		 * @param bool ignoreNullValues False by default, true if an empty string should return null result.
		 * @param json options          Define witch value you want to get in return, 
		 * 								if you want only the raw value (ddeeff) or the ready to print value (#ddeeff),
		 * 								To use the rgba output, set a numeric value relative to the alpha wished.
		 * @return json Json object with the calculated values.
		 */
		deter: function(val, ignoreNullValues, options)
		{
			// default options
			settings = jQuery.extend(
			{ hex:true, hexRaw:false, rgb:false, rgbRaw:false, rgba:false, rgbaRaw:false }, options);
			
			var ret={};
			
			//return empty tab if ignoreNullValues is set to true (usefull to restore default input behaviour)
			if(ignoreNullValues && (val == '' || val == null))
			{
				return ret;
			}
			
			//calculate md5 hash and add the result
			var md5 = $.md5(val);
			ret.md5 = md5;
			
			//calculate hexadecimal color only if needed
			if(settings.hex || settings.rgb || settings.rgba)
			{
				var hex = md5.substr(0,6);
				if(!settings.hexRaw)
				{
					hex = '#' + hex;
				}
								
				//add hexa result if wished
				if(settings.hex)
				{
					ret.hex = hex;
				}
			
				//calculate rgb color if needed
				if(settings.rgb || settings.rgba)
				{
					var rgb = deter.hexToRgb(hex, true); //convert for hexa value only once
					
					//add rgb result if wished
					if(settings.rgb)
					{
						ret.rgb = (settings.rgbRaw)? rgb : 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
					}
					
					//add rgba result if wished
					if(settings.rgba)
					{
						var alpha = (settings.rgba === true)? 1 : settings.rgba;
						var rgba =  jQuery.extend({a:alpha}, rgb);
				
						ret.rgba = (settings.rgbaRaw)? rgba : 'rgba('+rgba.r+','+rgba.g+','+rgba.b+','+rgba.a+')';
					}

				}
			}
			
			return ret;
		}
	});
	
	/**
	 * Deter to Identicon5 plugin.
	 */
	$.fn.identicon = function(md5, hex, options)
	{ 
		//Intercept html5 canevas support to forbide identicon5 to make gravatar requests.
		//(a background color is used instead of the identicon to still 100% client side).
		var canvas = document.createElement('canvas');			
		var canvasSupported = canvas.getContext? true : false;					

		//canvasSupported = false; //uncomment to test behaviour on old browsers.
			
		if(canvasSupported)
		{		
			this.each(function() {

				if(md5)
				{
					$(this)
						.text(md5)
						.identicon5(options);
				}
				else
				{
					$(this).text('');
				}
			});
		}
		else
		{
			//get options size from identicon5 options
			settings = jQuery.extend(
							{ size:65 }, options);
			
			//keep canevas behaviour			
			this.each(function() {

				if(hex)
				{
					$(this)
						.html('<div class="deter-canevas"></div>');
					
					$(this)
						.find('div.deter-canevas')
							.css('width', settings.size)
							.css('height', settings.size)
							.css('background-color', hex);

				}
				else
				{
					$(this)
						.html('');
				}
			});
		}
		
		return this;
	};

})(jQuery); 
