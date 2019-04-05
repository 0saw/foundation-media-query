# Foundation Media Query

Small little nifty utility to help you work with foundation-sites media queries.

No dependencies. Except for foundation (Da-a-ah). Adds CustomEvent polyfill.

## Usage
```javascript
import mq from "@0saw/foundation-media-query";

document.addEventListener('breakpoint-change', breakpointEventListener);

function breakpointEventListener() {
    if (mq.is('large only')) {
        console.log("You've hit the right spot");
    }
}
```

You are not obligated to import `mq` to your scope. Instead you can use `event.detail` like so:
```javascript
import "@0saw/foundation-media-query";

document.addEventListener('breakpoint-change', breakpointEventListener);

function breakpointEventListener(event) {
    let mq = event.detail;

    switch (mq.current) {
        case 'medium':
            alert("You've hit the right spot");
            break;
        case 'large':
            alert("Too far");
            break;
        default:
            break;
    }
}
```


## API
mq object contains a few usefull things.

### Getters
* mq.`current` - Gives you the name of current breakpoint
* mq.`currentFull` - Gives you all of the breakpoint info that we have. (I.e `mq.currentFull.matchMedia` will give you matchMedia object. In case you want to do something naughty)
* mq.`landscape` - Analog of CSS's `(orientation: landscape)`
* mq.`portrait` - Pretty straigh forward
* mq.`retina` - DPI is atleast 2x

### Methods
* mq.`is` - Allows you to quickly check current breakpoint
```javascript
// Either true or false
mq.is('xlarge');

// Won't return true when next breakpoint is active. ([small -> medium] -> large)
mq.is('medium only');

// portrait/ladscape/retina
mq.is('portrait');
```


## FAQ
* We obliviosly need foundation to operate. But if you are using mixin version of foundation-sites - make sure to [`@include foundation-global-styles;`](https://github.com/zurb/foundation-sites/blob/92b2f187cd8f9c6b243bf06756beac960dae22df/scss/_global.scss#L136)
