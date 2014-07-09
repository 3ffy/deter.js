Deter
=====

UX Experiment : get a client size determinist color or identicon to improve login form experience

How to provide an easy way for a user to know if his password is well typed or not ? The idea is to use colors or identicons to let him get a decent idea about what he typed "blind" mode. This is not 100% trustable but if he got the habit to get a "blue" login box, if that box became red he knows he has misspelled.

The idea itself is not new, a lot of other example do the same thing, but this one got the particularity to be full client side (full javascript). So there is no latency and more of that 0 communication cost (no http request).

The JQuery plugin himself is only a "bridge" (= an easy way) to call and use some identicon plugin. The most important is how to integrate it in a real use case (see the demo part).

Working (live) example
----------------------

[![A screenshot of Deter in action](https://raw.githubusercontent.com/3ffy/deter/master/demo/screenshot.jpg)](http://codepen.io/3ffy/pen/HxEet)

<http://codepen.io/3ffy/pen/HxEet>

Usage
-----
todo (see the demo for the moment)


Licence
-------

The library is under the Open Source Licence BSD3 as defined to the LICENCE file provided. In a nutshell this licence is one of the most permissive : you can use the library in your commercial project, modify it and redistributing it. The only constraint is to respect the author patent (one line comment is enought providing a link to the library repository and its licence file. Basically, you have to let the comment included inside the library).

Exceptions : 

The plugin "JQuery.Identicon5" by Francis Shanahan (http://francisshanahan.com/) is used to render identicons.
@see: <http://archive.plugins.jquery.com/project/identicon5>. 
Deter plugin only provide a plugin to use it,
(it is not a part of it, and you can easily modify Deter to use another identicon generator librairy.)
 
The plugin "JQuery.MD5" by Gabriele Romanato is used to calculate md5 hashes.
@see: <http://blog.gabrieleromanato.com>. 
(Deter plugin only use it but it's not a part of it, you can easily replace it by another md5 generator librairy.)