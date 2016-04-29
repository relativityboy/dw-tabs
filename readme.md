DW-Tabs

Tabs, the right way. Finally.

And Because Global Ids Break Reusability

The above explains why most frontend Javascript libraries have limited
brittle, if not outright broken. DW-Tabs, and the rest of
the DW family of plugins, addresses this issue while giving you something
that's as easy to use, mixes well with your preferred layout engine, be it
Bootstrap, Foundation, or something else (ex:that weird google thing)

At it's minimum, all you need is a container for your tabs, a container for
your content, and a line of javascript - $('.w-navbar').dwTabs('.w-navcontent');

dw-tabs does web-tabbing the right way.
* javascript access & control of all your tabs (if you want it)
* chaining
* automatic recognition of new tabs (you can add/remove tab html on the fly)
* built-in 'destroy' functionality
* tab layouts are nestable
* tab content can be in a different location from the tabs themselves
* tab - events
  * .on(event, fn) & .off - (.on is passed tabName, domEvent, tabInstance)
  * .onShow(fn) - (called on every tab change.)
* tabs are router-friendly
  * can listen to router events by .setRouter(router, events) events arg can be
    * 'events': a string (name of the event)
    * {events}: object with 'eventName':'tabName' key/value pairs
    * {events}: object with 'eventName':function() pairs (function returns correct tab name)
    * {events}: - a combination of the previous two.
  * routers can tell tabs which content element to show on initialization (or anytime after)
* requirejs aware (coming soon)

The Examples are a work in progress. Those with a !! at the beginning aren't done or don't exist yet.
1. Is the simplest use of tabs I could think of. Essentially a one-liner (assuming you have your html written)
2. Uses Bootstrap tab styles to show compatibility.
3. !!Here we let you add html for tabs dynamically and watch dwTabs handle them with grace
4. !!We provide a select element and choose which tabs to show programatically
5. !!A simple router example using links in a sidebar to change tabs;
