/* global WebFontConfig : true */

var Core = Core || {};

Core = {
    constructor : function () {
        this.bodyTag = $('body');
        this.defaultPage = this.bodyTag.find('.default-page');
        this.directAccess = this.bodyTag.find('.direct-access');
        this.vars = this.getUrlVars().string;
        this.fontChoice = this.getUrlVars().fontPicker;
        this.fontStyle = this.getUrlVars().fontStyle;
        this.fontColor = this.getUrlVars().fontColor;
        this.tag = $('<h1></h1>');
        this.inputField = this.bodyTag.find('input[type="text"]');
        this.fontPicker = this.bodyTag.find('select[name="fontPicker"]');
        this.submitBtn = this.bodyTag.find('input[type="submit"]');
        this.pageHeight = this.bodyTag.height();
        this.pageWidth = this.bodyTag.width();
    },

    init : function () {
        var o = this;
        o.constructor();
        o.detectPageType();
        o.validate();
        o.fitToParent();
        //As js is enabled, remove the no-js warning
        o.bodyTag.find('.notify').remove();
    },

    getUrlVars : function () {
        // Thanks to Roshambo for this method
        // http://snipplr.com/users/Roshambo/
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },

    defaultVars : function () {
        var o = this;
        o.defaultValue = "Type the text you want to be biggerer ";
        o.inputField.val(o.defaultValue).focus( function() {
            $(this).val('');
        });
        o.inputField.val(o.defaultValue).blur( function() {
            if (!$(this).val()) {
                $(this).val(o.defaultValue);
            }
        });
    },

    applyOptions: function() {
        var o = this;
        if (o.fontChoice) o.loadFonts(o.fontChoice, o.fontChoice.replace('+', ' '));
        if (o.fontStyle) o.tag.addClass(o.fontStyle);
        if (o.fontColor) o.tag.css('color', '#'+o.fontColor);
    },

    detectPageType : function () {
        var o = this;
        if (o.vars) {
            // The page has been accessed via a query string so display the biggerized text
            o.defaultPage.remove();
            o.vars = o.vars.replace(/\+/g, ' ');
            o.tag.text(decodeURIComponent(o.vars)).appendTo(o.directAccess);
            o.applyOptions();
        } else {
            // The page has been accessed without a query string. Display the default page content
            o.directAccess.remove();
            o.defaultVars();
            o.bodyTag.find('footer').appendTo(o.bodyTag); // Move footer into body
        }
    },

    validate : function () {
        var o = this;

        o.submitBtn.bind('click', function(e) {
            var error = $('<div class="error"></div>'),
                message = '',
                valid = false;

            if (o.inputField.val().trim() === '') {
                message = 'You want me to make NOTHING bigger? Were you dropped on your head as a child?';
            } else if (o.inputField.val() === o.defaultValue) {
                message = 'I\'m not making the default text bigger, that\'s just boring';
            } else {
                valid = true;
            }

            if (!valid) {
                e.preventDefault();
                o.defaultPage.find('.error').remove();
                error.insertAfter(o.submitBtn).text(message);
            }
        });
    },

    loadFonts : function (familyName, fontName) {
        fontName = fontName || familyName; // If the font name is the same as the family name, no need to set it twice.
        var o = this;
        // Google fonts JavaScript API
        WebFontConfig = {
            google: { families: [ familyName ] }
        };
        (function() {
            var wf = document.createElement('script');
            wf.src = ('https:' === document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
            wf.type = 'text/javascript';
            wf.async = 'true';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(wf, s);
        })();
        if (o.vars) o.tag.css('font-family', fontName +'\'sans-serif');
    },

    fitToParent : function () {
        var o = this,
            container = o.directAccess && o.defaultPage,
            padding = parseInt(container.css('padding')),
            footerHeight = o.bodyTag.find('footer').outerHeight(true);

       if (!/\s/.test(o.tag.text())) o.tag.css('word-break', 'break-all'); // Text has no spaces so allow word breaks

        container.css({
            height : o.pageHeight - footerHeight - (padding*2) + 'px'
        });
        if (!this.vars) return;
        container.css( {
            width : o.pageWidth - (padding*2) + 'px'
        });
        if (o.pageWidth > 450) {
            // is desktop
            if (o.tag.text().length < 4) {
                o.tag.fitText(1, { minFontSize: '600px' });
            } else if (o.tag.text().length < 7) {
                o.tag.fitText(1, { minFontSize: '500px' });
            } else if (o.tag.text().length < 8) {
                o.tag.fitText(1, { minFontSize: '350px' });
            } else if (o.tag.text().length < 13) {
                o.tag.fitText(1, { minFontSize: '250px' });
            } else {
                o.tag.fitText(0.9);
            }
        } else {
            // is mobile
            if (o.tag.text().length > 5) {
                o.tag.fitText(1, { MaxFontSize: '100px' });
            } else {
                o.tag.fitText(0.2, { MinFontSize: '100px' });
            }
        }

    }
};
// Thanks to http://fittextjs.com/ for this awesome function
(function( $ ){
  $.fn.fitText = function( kompressor, options ) {
    // Setup options
    var compressor = kompressor || 1,
        settings = $.extend({
          'minFontSize' : Number.NEGATIVE_INFINITY,
          'maxFontSize' : Number.POSITIVE_INFINITY
        }, options);
    return this.each(function(){
      // Store the object
      var $this = $(this);
      // Resizer() resizes items based on the object width divided by the compressor * 10
      var resizer = function () {
        $this.css('font-size', Math.max(Math.min($this.width() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
      };
      // Call once to set.
      resizer();
      // Call on resize. Opera debounces their resize by default.
      $(window).on('resize.fittext orientationchange.fittext', resizer);
    });
  };
})( jQuery );

$( function() {
    Core.init();
});
