Deter.js
========

UX Experiment : provide a client sided password graphical fingerprint.

Deter main aim is to provide to the user a way to determine if he misspelled his password or not, before make a request to the server, and without reveal his password to an eventual pirate.

(Live) Demo
-----------

<http://codepen.io/3ffy/pen/HxEet>

[![A screenshot of Deter in action](https://raw.githubusercontent.com/3ffy/deter/master/demo/screenshot.jpg)](http://codepen.io/3ffy/pen/HxEet)

*(or get a look into the `demo/` folder to find the static version)*

Usage (predefined behaviours)
-----------------------------

### Normal usage (generate identicon into a sibling box)

*Deter is made to be easy to use !*

```html
<html>
    <head>
        <script src="../deter.packaged.min.js"></script> 
        
        <script>

            $(document).ready(function(){

                //it's all you need, deter will add extra markup and events for you
                $('#deter-password').deter();

            });

        </script>
    </head>
    <body>
        <input id="deter-password" type="password"></input>
    </body>
</html>
```
> Note that the minified packaged version include deter and all dependencies into a single file : it's all you need in production.
> If the browser don't support html5 canevas, the fallback box-background behaviour will be used instead the default one (aka: box-identicon).


API
---

```javascript
/**
 * Deter plugin.
 * Call the $.strToColor each time the condition given in the options param is filled.
 *
 * @param {mixed}  mode    [optional] A string corresponding to the behaviour wished or a callback function (default = 'box-identicon').
 * @param {object} options [optional] Json object with the options of that plugin call.
 * @return {object} The jquery object you used to call the plugin.
 */
$.fn.deter = function(mode, options);
```
#### mode

| Name                                   | Type     | Description                                                                                |
|----------------------------------------|----------|--------------------------------------------------------------------------------------------|
| box-identicon (or default, or nothing) | string   | Generate a canevas with identicon into a sibling box                                       |
| box-color                              | string   | Modify the background color of a sibling box                                               |
| background                             | string   | Modify the background of the element (default) or another one (ex: the body of the page)   |
| border                                 | string   | Modify the borders color and the box-shadow of the element (default) or another one        |
| custom                                 | function | Use a custom callback to create your own behaviour (see the  [Advanced Usage](#advanced-usage) section bellow) |



#### options

| Name                 | Type               | Default   | Description | Info |
|----------------------|--------------------|-----------|-------------|------|
| sequence             | bool               | false     | The type of deter object to serve to the callback | Sequence = calculate all the colors of string offset. You will never need it instead you try to generate a graph or something similar (+ the cpu cost is bigger relative to the number of calculation) |
| opacity              | float              | 1         | If the deter mode is based on rgba, it will use the opacity value into the result ( = alpha) | Note that the `border` mode will use the opacity for the box-shadow and ignore it for the border color |
| canevasSize          | mixed (int/string) | 'auto'    | The size of the canevas to generate (in pixel) | If set to 'auto', the size of the `.deter-fingerprint` parent will be used. |
| addDeterExtraMarkups | bool               | true      | If set to true, element will added to facilited css customisation and correspond to the predifined deter behaviour events | |
| getContent           | function           | null      | A callback to use to know how to get the text value of the element who will trigger deter | Usefull if you use something different than an input ($(this).val() is used by default) |
| events               | string             | 'keyup'   | One or more space-separated event types and optional namespaces, such as "click" or "keydown.myPlugin" | You can even use custom events |
| selectorDelegated    | string             | null      | A selector string to filter the descendants of the selected elements that trigger the event. If the selector is null or omitted, the event is always triggered when it reaches the selected element. | Cf. <http://api.jquery.com/on/> param selector |
| selectorDescendant   | string             | null      | The selector to elements who will fire the deter event | If null, the current element is used. Usefull if you want to attach deter to element created dynamically |
| addClass             | string             | ''        | The classes to add to the deter-container element (separate them with a space) | Only relevant if the `addDeterExtraMarkups` option is set to `true` |
| textColorMode        | string             | 'default' | Will change the value of the text color to improve readibility. | Only relevant with the `background` mode. Values are 'default' (= always black), 'complementary' (= the opposite color), 'monochrome' (= white if the background is dark, black if the backround is bright) |
| target               | string             | null      | The target element for the modifications | Only relevant in `background` and `border` modes (default = the current element) |

> Note that if you use the custom mode, the settings are passed as a callback argument, so you can add your own values into settings and use it later inside the callback.

Advanced Usage
--------------

//TODO

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

1. Export colors utilities into a dedicated library.

2. The plugin is ready to handle sequence, but the gateway plugin used to generated canevas is not made to provide multiple kind of results. I need to improve that part to be able to "plug" multiple solution and not only the `identicon5` one. With the sequence result, i would like to generate a mini graph so the user will be able to see more clearly if the password is misstyped or not than with identicons.

> :heart: This plugin is made with love, please give it some love back ! - 3ffy