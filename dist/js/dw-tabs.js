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
    if(typeof this.opts.onShow === 'function') {
      this.opts.onShow(targetName, e);
    }
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
    this.$tabNav.off('click', this.opts.navSelector, this.show);
    this.$tabNav.removeData('dwTab');
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