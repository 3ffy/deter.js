Deter
=====

UX Experiment : get a client size determinist color or identicon to improve login form experience

The problem
-----------
//todo

Deter solution
--------------
How to provide an easy way for a user to know if his password is well typed or not ? The idea is to use colors or identicons to let him get a decent idea about what he typed "blind" mode. This is not 100% trustable but if he got the habit to get a "blue" login box, if that box became red he knows he has misspelled.

The idea itself is not new, a lot of other example do the same thing, but this one got the particularity to be full client side (full javascript). So there is no latency and more of that 0 communication cost (no http request).

The JQuery plugin himself is only a "bridge" (= an easy way) to call and use some identicon plugin. The most important is how to integrate it in a real use case (see the demo part).

Is it bulletproof?
------------------
//todo

(Live) Demo
-----------

<http://codepen.io/3ffy/pen/HxEet>

[![A screenshot of Deter in action](https://raw.githubusercontent.com/3ffy/deter/master/demo/screenshot.jpg)](http://codepen.io/3ffy/pen/HxEet)

*(or get a look into the `demo/` folder to find the static version)*

Usage
-----

*Deter is made to be easy to use !*

### Normal usage

Just call it as a normal JQuery plugin and use the callback to do something when the user will fire the keyup event.

```javascript
/**
 * Modify background color of a sibling box.
 */
$('#testPassword2').deter(function(deter, value){
    //if no value, come back to the initial state (transparent background)
    $(this).siblings('.colorBox')
        .css('background-color', (value == '')? '' : deter.hex);
});
```

> Note that `deter` is the result of the `$.strToColor` function (see below) and `value` the value of the input when the event (keyup) occured.
> Therefore, the callback is called on the this context, so you can use `$(this)` to refer to the element who fire the event.

### Use options to customize the plugin

```javascript
//pass an object as second param to customise the behaviour.
$('#testPassword2').deter(function(deter, value){
    //if no value, come back to the initial state (transparent background)
    $(this).siblings('.colorBox')
        .css('background-color', (value == '')? '' : deter.hex);
}, {
    //options
    events: 'click',
    opacity: 0.5
});
```

*Options description (and default values):*

```javascript
//true if you want the result as a sequence (see below)
sequence: false,

//the opacity of the rgba value in results
opacity: 1,

//the events whose will fire the plugin. You can use multiple events separing them by a space
events: 'keyup',

//as all JQuery events you can use delegated events (attach the fire event to another element rather than $(this)).
//it's really usefull when your element is created dynamically and can't be found by the selector at the initialization.
selectorDelegated: null,

//if you used selectorDelegated, you have to precise how to get back your element corresponding to $(this) in the callback. (Can be identical to the selector used during the initialization of the plugin).
selectorDescendant: null
```

**Please get a look into the [demo](https://github.com/3ffy/deter#live-demo) to find more advanced examples.**


--------------
------------

*In addition, there is 2 handy utilities packaged into jquery $ method.*

### $.hexToRgb

```javascript
/**
 * Convert hexadecimal color to RGB color.
 *
 * @param {string} hex The hexadecimal color with or without #, normal (#ddeeff) or combined (#def) format.
 * @return {array} The results array on success, null on failure.
 */

//example:
var hex = 'ddeeff';
var rgb = $.hexToRgb(hex);
console.log(rgb);

//result:    
/*
    Object {r: 221, g: 238, b: 255} 
 */
```

### $.strToColor

```javascript
/**
 * Return determinist color from a dynamic text. (one string = one color, always the same one).
 *
 * @param {string} val      The value to convert.
 * @param {float}  opacity  [optional] (default = 1) The opacity of the color wished. Only relevant with rgba results.
 * @param {bool}   sequence [optional] (default = false) True if you want to get a full sequence of all the md5 letter by letter, false for just the final result.
 * @return {mixed} sequence = false : Json object with the calculated determinist values : {md5, hexRaw, hex, rgbRaw, rgb, rgbaRaw, rgba}, sequence = true : an array of the json objects sequence.
 */

//example:
var val = 'a string to convert into a determinist color';
var color = $.strToColor(val);
console.log(color);

//result:    
/*
    Object {
        hex: "#a20235"
        hexRaw: "a20235"
        md5: "a20235aa53b5b3a9759ac25a7d1d7ed8"
        rgb: "rgb(162, 2, 53)"
        rgbRaw: Object {
            a: 1
            b: 53
            g: 2
            r: 162
        }
        rgba: "rgba(162, 2, 53, 1)"
        rgbaRaw: Object {
            a: 1
            b: 53
            g: 2
            r: 162
        }
    }
*/
```

You can also use `$.strToColor` to get the full sequence of result.

**NB:** This sequence is not a result char by char so a spy can't detect what the user as typed !

*ex: azerty will produce a color for 'a', then for 'az', then for 'aze', etc. until color for 'azerty'.*

```javascript
//example:
var val = 'azerty';
var color = $.strToColor(val, 1, true);
console.log(color);

//result:    
/*
    [
        //a
        0: Object {
            hex: "#0cc175"
            hexRaw: "0cc175"
            md5: "0cc175b9c0f1b6a831c399e269772661"
            rgb: "rgb(12, 193, 117)"
            rgbRaw: Object
            rgba: "rgba(12, 193, 117, 1)"
            rgbaRaw: Object
        }
        //az
        1: Object {
            hex: "#cc8c0a"
            hexRaw: "cc8c0a"
            md5: "cc8c0a97c2dfcd73caff160b65aa39e2"
            rgb: "rgb(204, 140, 10)"
            rgbRaw: Object
            rgba: "rgba(204, 140, 10, 1)"
            rgbaRaw: Object
        }
        
        //etc.

        //azerty
        5: Object {
            hex: "#ab4f63"
            hexRaw: "ab4f63"
            md5: "ab4f63f9ac65152575886860dde480a1"
            rgb: "rgb(171, 79, 99)"
            rgbRaw: Object
            rgba: "rgba(171, 79, 99, 1)"
            rgbaRaw: Object
        }
        length: 6
    ]
*/
```

Licence
-------

The library is under the Open Source Licence BSD3 as defined to the LICENCE file provided. In a nutshell this licence is one of the most permissive : you can use the library in your commercial project, modify it and redistributing it. The only constraint is to respect the author patent (one line comment is enought providing a link to the library repository and its licence file. Basically, you have to let the comment included inside the library).

**Exceptions:** 

The plugin `JQuery.Identicon5` by Francis Shanahan (http://francisshanahan.com/) is used to render identicons.
@see: <http://archive.plugins.jquery.com/project/identicon5>. 
Deter plugin only provide a plugin to use it,
(it is not a part of it, and you can easily modify Deter to use another identicon generator librairy.)
 
The plugin `JQuery.MD5` by Gabriele Romanato is used to calculate md5 hashes.
@see: <http://blog.gabrieleromanato.com>. 
(Deter plugin only use it but it's not a part of it, you can easily replace it by another md5 generator librairy.)

What's next ?
-------------

The plugin is ready to handle sequence, but the gateway plugin used to generated canevas is not made to provide multiple kind of results. I need to improve that part to be able to "plug" multiple solution and not only the `identicon5` one. With the sequence result, i would like to generate a mini graph so the user will be able to see more clearly if the password is misstyped or not than with identicons.

> This plugin is made with love, please give it some love back !