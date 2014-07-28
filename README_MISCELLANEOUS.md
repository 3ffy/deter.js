Deter.js : Miscellaneous utilies functions
==========================================

For is own process, Deter need some utilities function. Some of them could be usefull outside the plugin so i decided to pack them into the `$.extend` jQuery method.

Packed plugins
--------------

As deter use dependencies, you can ofc use these plugins. (They are included in the packaged version).

####`$.md5` : Calculate the md5 hash of a string

```javascript
var md5 = $.md5(string);
```

*[More info about md5 algorithm]<http://en.wikipedia.org/wiki/MD5>*

####`$.fn.identicon` : Generate a canevas with identicon inside a dom element

```javascript
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
$(selector).identicon(md5, color, options);
```

> Of course you can use the original identicon5 plugin directly, but deter offer a nice gateway with fallback. It's the same, but bulletproof.

Color calculations
------------------

####Convert hexadecimal color to rgb color

```javascript
/**
 * Convert hexadecimal color to RGB color.
 *
 * @param {string} hex The hexadecimal color with or without #, normal (#ddeeff) or combined (#def) format.
 * @return {array} The results array on success, null on failure.
 */
var rgb = $.hexToRgb(hex);
```

####Convert rgb color to xyz color

```javascript
/**
 * Convert rgb color to xyz color.
 *
 * @param {object} rgb The rgb color.
 * @return {object} The xyz color.
 */
var xyz = $.rgbToXyz(rgb);
```

*[More info about xyz color space]<http://en.wikipedia.org/wiki/CIE_1931_color_space>*

####Convert xyz color to cie lab color

```javascript
/**
 * Convert xyz color to clab color (CIE LAB).
 *
 * @param {object} rgb The rgb color.
 * @return {object} The xyz color.
 */
var lab = $.xyzToLab(xyz);
```
*[More info about lab color space]<http://en.wikipedia.org/wiki/Lab_color_space>*

####Get the complementary color of a given one

```javascript
/**
 * Get the complementary color of a given one.
 * (Light complementary color, not Pigment one = blue->yellow).
 *
 * @param {object} rgb     The seed rgb color.
 * @param {bool}   pygment True to calculate the pygment complementary color, false to calculate the light one.
 * @return {object} The rgb complementary color.
 */
var rgb = $.getComplementaryColor(rgb, pygment);
```

####Get the closest color from 2 candidates ones

```javascript
/**
 * Get the closest color of a seed color from 2 candidate ones.
 *
 * @param {object} rgb           The seed rgb color used for calculations.
 * @param {object} rgbCandidate1 [optional] The first candidate rgb color (default = black).
 * @param {object} rbgcandidate2 [optional] The second candidate rgb color (default = white).
 * @return {object} The candidate rgb color picked.
 */
var rgb = $.getClosestColor(rgb, rgbCandidate1, rbgcandidate2);
```

####Get the durther color from 2 candidates ones

```javascript
/**
 * Return determinist color from a dynamic text. (one string = one color, always the same one).
 *
 * @param {string} val      The value to convert.
 * @param {float}  opacity  [optional] (default = 1) The opacity of the color wished. Only relevant with rgba results.
 * @param {bool}   sequence [optional] (default = false) True if you want to get a full sequence of all the md5 letter by letter, false for just the final result.
 * @return {mixed} sequence = false : Json object with the calculated determinist values : {md5, hexRaw, hex, rgbRaw, rgb, rgbaRaw, rgba}, sequence = true : an array of the json objects sequence.
 */
var deter = $.strToColor(val, opacity, sequence);
```