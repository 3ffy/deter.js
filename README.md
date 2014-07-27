Deter.js
========

UX Experiment : provide a client sided password graphical fingerprint.

Deter main aim is to provide to the user a way to determine if he misspelled his password or not, before make a request to the server, and without reveal his password to a pirate.

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
$.fn.deter = function(mode, options);
```
#### mode

| Name                                   | Type     | Info                                                                                       |
|----------------------------------------|----------|--------------------------------------------------------------------------------------------|
| box-identicon (or default, or nothing) | string   | Generate a canevas with identicon into a sibling box                                       |
| box-color                              | string   | Modify the background color of a sibling box                                               |
| background                             | string   | Modify the background of the element (default) or another one (ex: the body of the page)   |
| border                                 | string   | Modify the borders color and the box-shadow of the element (default) or another one        |
| custom                                 | function | Use a custom callback to create your own behaviour (see the  [Advanced Usage](#advanced-usage) section bellow) |



#### options

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