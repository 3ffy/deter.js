Deter.js
========

UX Experiment : provide a client sided password graphical fingerprint.

The problem
-----------
Simple : as a user you don't wan't somebody (or a spyware taking screenshots) be able to look (and know) what is your password on a website. That's why all browsers use the well known dots instead of letting you look what you are typing. But there is a problem to type in blind mode : how many time did you misstyped a password, then validated it with an http request wait for the result and finally get busted by an annoying server message? 

The solution
------------

1. **Easy, just make password field visible !**
  - Thanks but no thanks. There is only one thing i hate more than misstying : when somebody is able to steal my password and my data :rage2:.

2. **Some big company with a stupid apple logo got a nice idea : the character you typed is only visible for few sec, then transform to a dot like in a regular password field ! They should be right about that and it's handy for the user !**
  - Each time i saw that, i know why i don't and won't never buy one of their phone :trollface:. Seriously what is the difference with the first solution? Ok i admit it's a bit harder for somebody close from you to see and memorize the password. But what if he is not dumb as fuck and can remember your 8 letter password? Therefore, what if a spyware just take a screenshot from your password field before the char is transformer to dot? The answer is simple : you are fucked :finnadie:.

3. **Oh i saw something not too stupid where a remote server generate an image based on your password to give you a nice idea if you misstyped or not.**
  - Yes i thing it's not too bad too. But each time i saw that kind of system i'm a bit sad : you have to do one http request to send your password to the server, ask him to generate a picture (hard cpu cost), then wait for his answer with another http request and that each time you hit a character. Well i know that client/server communication are pretty fast nowadays, but i still think that's pretty stupid. Most of them are based directly on Gravatar, so if the gravatar server got latencies for some reason, your own website will look broken or slow. The problem is client sided only, why should you solve it with a remote solution :suspect:?

The Deter.js approach
---------------------

What is we could provide to the user a visual way to know if the password is the good one, without expose him to spys and with a client sided solution? I think all we need is the user himself and a touch of css / canvas. 

Let's give a color to the user, like a tone of blue, each time he writte his password on our website. If one day he see a tone of red, he can be sure that he misstyped. No need to go further, no server calls required : he can correct himself before the form submission. In fact, all we need is to be able to convert a string into a determinist hexadecimal 6 digit number. But this is pure mathematics and javascript is nice for that: let's convert locally our string to md5 and keep only 6 char, we get our color !

Furthermore, canvas modern browser are now able to draw pictures. With the good drawing library and our md5 determinist string, it's easy to convert it to an identicon canvas. As we are also able to get a determinist color, we can even provide a nice old browser fallback.

This Deter JQuery plugin is focused around to do all that things in one unique easy way.

Is it bulletproof?
------------------
Yes... and no :stuck_out_tongue_closed_eyes: !

1. The whole system is based on a finite number. So there is a finite number of solution. If you already worked with hash you should know that different string could get the same result. In other words, deter can provide the same color or identicon with two different strings. But don't be affraid, the entropy to get the same color between your misstyped password and the real one is almost the same that the number of stars in the sky.

2. The real problem is the human eyes and brain. Maybe you will remember that your password produced a blue color, but what tone of blue? If you misstyped and got a `deep blue` instead of a `marine blue`, will you able to understand you misstyped? But the good news is : at least if it is red, you know your are wrong ^^ !

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

**Options description (and default values):**

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

> Please get a look into the [demo](https://github.com/3ffy/deter#live-demo) to find more advanced examples.

--------------

:cookie: :coffee: :cookie: :coffee: :cookie: :coffee: :cookie: :coffee: :cookie: :coffee: :cookie: :coffee: :cookie: :coffee: :cookie: :coffee: :cookie: :coffee: :cookie: :coffee: :cookie: :coffee: :cookie: :coffee: :cookie: :coffee: :cookie: :coffee: :cookie: :coffee: :cookie: :coffee: :cookie: :coffee: :cookie: :coffee: 

------------

*In addition, there is 2 handy utilities packaged into JQuery `$` method.*

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

The library is under the Open Source Licence **BSD 3-Clause** as defined to the LICENCE file provided. In a nutshell this licence is one of the most permissive : you can use the library in your commercial project, modify it and redistributing it. The only constraint is to respect the author patent (one line comment is enought providing a link to the library repository and its licence file. Basically, you have to let the comment included inside the library).

**Exceptions:** 

The plugin `JQuery.Identicon5` by Francis Shanahan (http://francisshanahan.com/) is used to render identicons.
@see: <http://archive.plugins.jquery.com/project/identicon5>. 
Deter plugin only provide a plugin to use it,
(it is not a part of it, and you can easily modify Deter to use another client sided identicon generator library.)
 
The plugin `JQuery.MD5` by Gabriele Romanato is used to calculate md5 hashes.
@see: <http://blog.gabrieleromanato.com>. 
(Deter plugin only use it but it's not a part of it, you can easily replace it by another md5 generator library.)

What's next ?
-------------

The plugin is ready to handle sequence, but the gateway plugin used to generated canevas is not made to provide multiple kind of results. I need to improve that part to be able to "plug" multiple solution and not only the `identicon5` one. With the sequence result, i would like to generate a mini graph so the user will be able to see more clearly if the password is misstyped or not than with identicons.

> :heart: This plugin is made with love, please give it some love back ! - 3ffy