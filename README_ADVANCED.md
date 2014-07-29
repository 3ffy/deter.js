Deter.js : Advanced Uses
========================

Change boxes title
----------------------

```javascript
$(document).ready(function(){
   
   //modify the title of all elements 
   $.deter.boxTitle = 'new title for identicon boxes';

   //... later ...

   $('selector').deter();

});
```
Improve text readability with `deter.settings.mode` = `background`
-----------------------------------------------------------------

When the background is dark and the text color bright (or the opposite), it can be really difficult to read the text of the input. To improve the user experience you can ask to deter to modify the text color. 

####Default

![background2](https://raw.githubusercontent.com/3ffy/deter/master/demo/background1.jpg)

```javascript
//background = blue, color = black
$('#selector1')
    .deter('background');
```

####Complementary

![background2](https://raw.githubusercontent.com/3ffy/deter/master/demo/background2.jpg)

```javascript
//background = blue, color = orange
$('#selector2')
    .deter('background', { textColorMode: 'complementary' });
```

####Monochrome

![background2](https://raw.githubusercontent.com/3ffy/deter/master/demo/background3.jpg)

```javascript
//background = blue, color = white
$('#selector3')
    .deter('background', { textColorMode: 'monochrome' });
```

>Monochrome is really handy and is probably the only one you will need.

Don't use a predefined deter behaviour 
--------------------------------------

*To simplify, i did something similiar than the predefined behaviour box-color.*

```javascript
//In that case deter can't help you, the value has to be extracted from a span, not an input.
$('#testSpan1').deter(function(settings, deter, value){
    //if no value, come back to the initial state (transparent background)
    $(this).siblings('.colorBox')
        .css('background-color', (value == '')? '' : deter.hex);
},{
    events: 'click',
    addDeterExtraMarkups : false,
    getContent: function(){
        return $(this).text();
    }
});
```

Force to redraw the identicon canevas
-------------------------------------

You only have to fire a custom jQuery event named `repaint` and deter will catch it

```javascript
//The value option is mandatory
$('#deter-password1')
    .trigger('repaint', {'value': $('#deter-password1').val()});
```

Delegate events
---------------

When the input password is created dynamically, you are not able to attach deter to the element. You need to attach events to an element already existing inside the dom (as `$(body)` or the future container of the elements).

```javascript
//delegate 
$('body').deter('box-identicon', { selectorDelegated: '.dynamicInputsPassword' })

// ... later ...

//create the elements 
$('#dynamicContainer')
  .append('<input type="password" id="dynamicPassword1" class="dynamicInputsPassword"></input>')
  .append('<input type="password" id="dynamicPassword2" class="dynamicInputsPassword"></input>');
//add deter extra markups     
$.deter.wrapWithMarkup('.dynamicInputsPassword', 'box-identicon');
```

> `$.deter.wrapWithMarkup` let you ask deter to wrap the element with the extra markups (as $.fn.deter.settings.addDeterExtraMarkups = true). You have to call it by yourself in this case because the element don't exist when deter is initialized.