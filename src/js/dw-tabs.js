(function($) {

  var defaults = {
    navSelector:'.w-dwtab', //css expression that finds tab
    targetAttr:'dwtarget', // <-- a two way binder that tells the tab what to link to
    showFirst:'', //
    onShow:false, //if this is
    activeClass:'active', // <-- defaults to active
    contentSelector:'.w-dwcontent', //
    contentIsChild:false, //true if the content elements are children of the main element found by jQuery
    preventDefault:true, //if true, prevents the default action from happening
    navSurfParents:true //if true, nav will surf 'up' the parent tree useful for bootstrap styled tabs
  };

  var DWTabs = function($tabNav, contentContainer, opts) {
    $tabNav.data('dwTab', this);
    this.opts = opts;
    this.$tabNav = $tabNav;
    this.$tabContent = contentContainer;

    this.router = false;
    this.show = $.proxy(this.show, this);
    this.destroy = $.proxy(this.destroy, this);
    this.hasTarget = $.proxy(this.hasTarget, this);

    if(typeof this.$tabContent === 'string') {
      if(opts.contentIsChild) {
        this.$tabContent = this.$tabNav.find(this.$tabContent + ':first')
      } else {
        this.$tabContent = this.$tabNav.nextAll(this.$tabContent + ':first')
      }
    } else {
      this.$tabContent = $(contentContainer);
    }

    this.$tabNav.on('click', this.opts.navSelector, this.show);
    if(this.opts.showFirst.length > 0) {
      this.show(this.opts.showFirst);
    }
  };

  DWTabs.prototype.setRouter = function(router, events) {
    var self = this;
    this.router = router;

    this.routerEvents = {};
    this.routerMappedEvents = {};
    this.listeners = {all:[]};
    switch(typeof events) {
      case 'string' :
        this.routerEvents[events] = this.show;
        break;
      case 'function' :
        this.routerEvents['all'] = events;
        break;
      case 'undefined' :
        this.routerEvents['all'] = this.show;
        break;
      case 'object' :
        this.routerEvents = events;

    }
    $.each(this.routerEvents,function(event, action) {
      switch(typeof action) {
        case 'function' :
          self.routerMappedEvents[event] = function(val) {
            self.show(action(val));
          };
          self.router.on(event, self.routerMappedEvents[event]);
          break;
        case 'string' :
          self.routerMappedEvents[event] =  function() {
            self.show(action);
          };
          self.router.on(event,self.routerMappedEvents[event]);
      }
    });
    return this;
  };

  DWTabs.prototype.on = function(eventName, fn) {
    if(!this.listeners.hasOwnProperty(eventName)) {
      this.listeners[eventName] = [];
    };
    if(this.listeners[eventName].indexOf(fn) === -1) {
      this.listeners[eventName].push(fn);
    }
    return this;
  };
  
  DWTabs.prototype.onShow = function(fn) {
    this.opts.onShow = fn;
  };

  DWTabs.prototype.off = function(eventName, fn) {
    if(eventName !== null) {
      this.listeners[eventName].splice(this.listeners[eventName].indexOf(fn), 1);
    } else {
      console.log("Error when removing an event handler from dwTab. Event" + eventName + " does not exist");
    }
    return this;
  }
  
  DWTabs.prototype.trigger = function(eventName, arg) {
    $.each(this.listeners[eventName], function(i, fn) {
      fn(arg, eventName, this);
    });
    $.each(this.listeners.all, function(i, fn) {
      fn(arg, eventName, this);
    });
    return this;
  }

  DWTabs.prototype.show = function(e) {
    var targetName;
    if(typeof e === 'object') {
      if(this.opts.preventDefault) {
        e.preventDefault();
      }
      e = $(e.target);
      if(!e.data(this.opts.targetAttr)) {
        e = e.parents('[data-' + this.opts.targetAttr + ']');
      }
      targetName = e.data(this.opts.targetAttr);
    } else {
      targetName = e;
    }
    this.$tabNav.find(this.opts.navSelector).removeClass(this.opts.activeClass);
    this.$tabNav.find(this.opts.navSelector + '[data-' + this.opts.targetAttr + '="' + targetName + '"]').addClass(this.opts.activeClass);
    this.$tabContent.find(this.opts.contentSelector).removeClass(this.opts.activeClass);
    this.$tabContent.find(this.opts.contentSelector + '[data-' + this.opts.targetAttr + '="' + targetName + '"]').addClass(this.opts.activeClass);
    this.currentTab = targetName; //for use by others.
    if(typeof this.opts.onShow === 'function') {
      this.opts.onShow(targetName, e);
    } 
    this.trigger(targetName, e);
    return this;
  };

  /**
   * Returns the $ matched set for tab or content element(s) for <targetName> as specified by opts.targetAttr.
   * @param targetName - name of the target for which you want the tab or the content element
   * @param findTab - boolean (set true if you want the tab)
   * @returns {*|{}}
   */
  DWTabs.prototype.hasTarget = function(targetName, findTab) {
    if(findTab) {
      return this.$tabNav.find(this.opts.navSelector + '[data-' + this.opts.targetAttr + '="' + targetName + '"]');
    }
    return this.$tabContent.find(this.opts.contentSelector + '[data-' + this.opts.targetAttr + '="' + targetName + '"]');
  };

  /**
   * returns $(el) of the content
   */
  DWTabs.prototype.destroy = function() {
    var self = this;
    this.$tabNav.off('click', this.opts.navSelector, this.show);
    this.$tabNav.removeData('dwTab');
    if(this.router && this.router.off) {
      $.each(this.routerMappedEvents, function(key, fn) {
        self.router.off(key, fn)
      });
    }
  };

  $.fn.dwTabs = function(containerOrCommand, options) {
    var opts = $.extend({}, defaults, options);
    switch(containerOrCommand) {
      case 'show' :
        this.each(function() {
          var dwTab = $(this).data('dwTab');
          if(dwTab) {
            dwTab.show(options);
          }
        });
        break;
      case 'destroy' :
        this.each(function() {
          var dwTab = $(this).data('dwTab');
          if(dwTab) {
            dwTab.destroy();
          }
        });
        break;
      case 'setDefaults' :
        defaults = $.extend({}, defaults, options);
        return null;
        break;
      default : //create dwTab instances
        this.each(function() {
          var $tabNav = $(this);
          if(!$tabNav.data('dwTab')) {
            new DWTabs($tabNav, containerOrCommand, opts)
          }
        });
    }

    return this;
  };
}(jQuery));