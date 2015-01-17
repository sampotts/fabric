/*!
*  Sharrre.com - Make your sharing widget!
*  Version: beta 1.3.5
*  Author: Sam (originally - Julien Hany sharrre.com)
*/

;(function ($, window, document, undefined) {

    /* Defaults
    ================================================== */
    var pluginName = 'sharer',
    defaults = {
        className: 'sharer',
        share: {
            googlePlus: false,
            facebook: false,
            twitter: false,
            digg: false,
            delicious: false,
            stumbleupon: false,
            linkedin: false,
            pinterest: false
        },
        shareTotal: 0,
        template: '',
        title: '',
        url: document.location.href,
        text: document.title,
        urlCurl: 'countproxy.php',  // PHP proxy for no JSONP support
        count: {}, //counter by social network
        total: 0,  //total of sharing
        shorterTotal: true, //show total by k or M when number is to big
        enableHover: true, //disable if you want to personalize hover event with callback
        enableCounter: true, //disable if you just want use buttons
        enableTracking: false, //tracking with google analitycs
        hover: function(){}, //personalize hover event with this callback function
        hide: function(){}, //personalize hide event with this callback function
        click: function(){}, //personalize click event with this callback function
        render: function(){}, //personalize render event with this callback function
        buttons: {  //settings for buttons
            googlePlus : {  //http://www.google.com/webmasters/+1/button/
                url: '',  //if you need to personnalize button url
                urlCount: false,  //if you want to use personnalize button url on global counter
                lang: 'en-US',
                annotation: ''
            },
            facebook: { //http://developers.facebook.com/docs/reference/plugins/like/
                url: '',  //if you need to personalize url button
                urlCount: false,  //if you want to use personnalize button url on global counter
                action: 'like',
                lang: 'en_US'
            },
            twitter: {  //http://twitter.com/about/resources/tweetbutton
                url: '',  //if you need to personalize url button
                urlCount: false,  //if you want to use personnalize button url on global counter
                hashtags: '',
                via: '',
                related: '',
                lang: 'en'
            },
            digg: { //http://about.digg.com/downloads/button/smart
                url: '',  //if you need to personalize url button
                urlCount: false  //if you want to use personnalize button url on global counter
            },
            delicious: {
                url: '',  //if you need to personalize url button
                urlCount: false  //if you want to use personnalize button url on global counter
            },
            stumbleupon: {  //http://www.stumbleupon.com/badges/
                url: '',  //if you need to personalize url button
                urlCount: false  //if you want to use personnalize button url on global counter
            },
            linkedin: {  //http://developer.linkedin.com/plugins/share-button
                url: '',  //if you need to personalize url button
                urlCount: false  //if you want to use personnalize button url on global counter
            },
            pinterest: { //http://pinterest.com/about/goodies/
                url: '',  //if you need to personalize url button
                media: '',
                description: ''
            }
        }
    },
    
    /* Json URL to get count number
    ================================================== */
    urlJson = {
        googlePlus: "",
        facebook: "https://graph.facebook.com/fql?q=SELECT%20url,%20normalized_url,%20share_count,%20like_count,%20comment_count,%20total_count,commentsbox_count,%20comments_fbid,%20click_count%20FROM%20link_stat%20WHERE%20url=%27{url}%27&callback=?",        
        twitter: "https://cdn.api.twitter.com/1/urls/count.json?url={url}&callback=?",
        digg: "https://services.digg.com/2.0/story.getInfo?links={url}&type=javascript&callback=?",
        delicious: 'https://feeds.delicious.com/v2/json/urlinfo/data?url={url}&callback=?',
        //stumbleupon: "http://www.stumbleupon.com/services/1.01/badge.getinfo?url={url}&format=jsonp&callback=?",
        stumbleupon: "",
        linkedin: "https://www.linkedin.com/countserv/count/share?format=jsonp&url={url}&callback=?",
        pinterest: "https://api.pinterest.com/v1/urls/count.json?url={url}&callback=?"
    },
  
    /* Popup for each social network
    ================================================== */
    popup = {
        googlePlus: function(opt){
            window.open("https://plus.google.com/share?hl="+opt.buttons.googlePlus.lang+"&url="+encodeURIComponent((opt.buttons.googlePlus.url !== '' ? opt.buttons.googlePlus.url : opt.url)), "", "toolbar=0, status=0, width=900, height=500");
        },
        facebook: function(opt){
            window.open("http://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent((opt.buttons.facebook.url !== '' ? opt.buttons.facebook.url : opt.url))+"&t="+opt.text+"", "", "toolbar=0, status=0, width=900, height=500");
        },
        twitter: function(opt){
            window.open("https://twitter.com/intent/tweet?text="+encodeURIComponent(opt.text)+"&url="+encodeURIComponent((opt.buttons.twitter.url !== '' ? opt.buttons.twitter.url : opt.url))+(opt.buttons.twitter.via !== '' ? '&via='+opt.buttons.twitter.via : ''), "", "toolbar=0, status=0, width=650, height=360");
        },
        digg: function(opt){
            window.open("http://digg.com/tools/diggthis/submit?url="+encodeURIComponent((opt.buttons.digg.url !== '' ? opt.buttons.digg.url : opt.url))+"&title="+opt.text+"&related=true&style=true", "", "toolbar=0, status=0, width=650, height=360");
        },
        delicious: function(opt){
            window.open('http://www.delicious.com/save?v=5&noui&jump=close&url='+encodeURIComponent((opt.buttons.delicious.url !== '' ? opt.buttons.delicious.url : opt.url))+'&title='+opt.text, 'delicious', 'toolbar=no,width=550,height=550');
        },
        stumbleupon: function(opt){
            window.open('http://www.stumbleupon.com/badge/?url='+encodeURIComponent((opt.buttons.delicious.url !== '' ? opt.buttons.delicious.url : opt.url)), 'stumbleupon', 'toolbar=no,width=550,height=550');
        },
        linkedin: function(opt){
            window.open('https://www.linkedin.com/cws/share?url='+encodeURIComponent((opt.buttons.delicious.url !== '' ? opt.buttons.delicious.url : opt.url))+'&token=&isFramed=true', 'linkedin', 'toolbar=no,width=550,height=550');
        },
        pinterest: function(opt){
            window.open('http://pinterest.com/pin/create/button/?url='+encodeURIComponent((opt.buttons.pinterest.url !== '' ? opt.buttons.pinterest.url : opt.url))+'&media='+encodeURIComponent(opt.buttons.pinterest.media)+'&description='+opt.buttons.pinterest.description, 'pinterest', 'toolbar=no,width=700,height=300');
        }
    };

    /* Plugin constructor
    ================================================== */
    function Plugin (element, options) {
        this.element = element;
        
        this.options = $.extend( true, {}, defaults, options);
        this.options.share = options.share; //simple solution to allow order of buttons
        
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
    };
  
    /* Initialization method
    ================================================== */
    Plugin.prototype.init = function () {
        var self = this;
        if(this.options.urlCurl !== ''){
            urlJson.googlePlus = this.options.urlCurl + '?url={url}&type=googlePlus'; // PHP script for GooglePlus...
            urlJson.stumbleupon = this.options.urlCurl + '?url={url}&type=stumbleupon'; // PHP script for Stumbleupon...
        }
        $(this.element).addClass(this.options.className);
        
        // HTML5 Custom data
        if(typeof $(this.element).data('title') !== 'undefined'){
          this.options.title = $(this.element).attr('data-title');
        }
        if(typeof $(this.element).data('url') !== 'undefined'){
          this.options.url = $(this.element).data('url');
        }
        if(typeof $(this.element).data('text') !== 'undefined'){
          this.options.text = $(this.element).data('text');
        }
        
        // How many social website have been selected
        $.each(this.options.share, function(name, val) {
            if(val === true){
                self.options.shareTotal ++;
            }
        });
        
        // If for some reason you don't need counter
        if(self.options.enableCounter === true) {  
            // Get count of social share that have been selected
            $.each(this.options.share, function(name, val) {
                if(val === true){
                    try {
                        self.getSocialJson(name);
                    } catch(e){}
                }
            });
        }
        else if(self.options.template !== '') {  //for personalized button (with template)
            this.options.render(this, this.options);
        }
        
        // Click event
        $(this.element).click(function(){
            self.options.click(self, self.options);
            return false;
        });
    };
  
    /* getSocialJson method
    ================================================== */
    Plugin.prototype.getSocialJson = function (name) {
        var self = this,
        count = 0,
        url = urlJson[name].replace('{url}', encodeURIComponent(this.options.url));
        
        if(this.options.buttons[name].urlCount === true && this.options.buttons[name].url !== ''){
            url = urlJson[name].replace('{url}', this.options.buttons[name].url);
        }

        if(url != '' && self.options.urlCurl !== ''){  
            $.getJSON(url, function (json) {
            
                // GooglePlus, Stumbleupon, Twitter, Pinterest and Digg
                if(typeof json.count !== "undefined") {
                    var temp = json.count + '';
                    temp = temp.replace('\u00c2\u00a0', '');  // Remove google plus special chars
                    count += parseInt(temp, 10);
                }
                // Get the FB total count (shares, likes and more)
                else if(json.data && json.data.length > 0 && typeof json.data[0].total_count !== "undefined") { 
                    count += parseInt(json.data[0].total_count, 10);
                }
                // Delicious
                else if(typeof json[0] !== "undefined") {
                    count += parseInt(json[0].total_posts, 10);
                }
                // Stumbleupon 
                /*else if(typeof json[0] !== "undefined") {  
                    
                }*/
                
                self.options.count[name] = count;
                self.options.total += count;
                self.renderer();
                self.rendererPerso();
            }).error(function() { 
                self.options.count[name] = 0;
                self.rendererPerso();
            });
        }
        else {
            self.renderer();
            self.options.count[name] = 0;
            self.rendererPerso();
        }
    };
    
    /* Launch render method
    ================================================== */
    Plugin.prototype.rendererPerso = function () {
    
        // Check if this is the last social website to launch render
        var shareCount = 0;
        for (e in this.options.count) { 
            shareCount++; 
        }
        if(shareCount === this.options.shareTotal) {
            this.options.render(this, this.options);
        }
    };
    
    /* Render method
    ================================================== */
    Plugin.prototype.renderer = function () {
        var total = this.options.total,
        template = this.options.template;
        
        // Format number like 1.2k or 5M 
        if(this.options.shorterTotal === true) {
            total = this.shorterTotal(total);
        }
        
        // If there is a template
        if(template !== '') {  
            template = template.replace('{total}', total);
            $(this.element).html(template);
        }
        // Default template
        else { 
            $(this.element).html('<button type="button" class="btn btn-small">' + (this.options.title !== '' ? this.options.title : 'Share') + '</button><span class="btn-count">' + total + '</span>');
        }
    };
  
    /* Format total numbers like 1.2k or 5M
    ================================================== */
    Plugin.prototype.shorterTotal = function (num) {
        if (num >= 1e6){
            num = (num / 1e6).toFixed(2) + "M"
        } else if (num >= 1e3){ 
            num = (num / 1e3).toFixed(1) + "k"
        }
        return num;
    };
    
    /* Method for open popup
    ================================================== */
    Plugin.prototype.openPopup = function (site) {
        popup[site](this.options);
        
        // Tracking
        if(this.options.enableTracking === true) {
            var tracking = {
                googlePlus: {site: 'Google', action: '+1'},
                facebook: {site: 'facebook', action: 'like'},
                twitter: {site: 'twitter', action: 'tweet'},
                digg: {site: 'digg', action: 'add'},
                delicious: {site: 'delicious', action: 'add'},
                stumbleupon: {site: 'stumbleupon', action: 'add'},
                linkedin: {site: 'linkedin', action: 'share'},
                pinterest: {site: 'pinterest', action: 'pin'}
            };
            _gaq.push(['_trackSocial', tracking[site].site, tracking[site].action]);
        }
    };
    
    /* Method for add +1 to a counter
    ================================================== */
    Plugin.prototype.simulateClick = function () {
            var html = $(this.element).html();
            $(this.element).html(html.replace(this.options.total, this.options.total+1));
    };
  
    /* Method for add +1 to a counter
    ================================================== */
    Plugin.prototype.update = function (url, text) {
        if(url !== ''){
            this.options.url = url;
        }
        if(text !== ''){
            this.options.text = text;
        }
    };

    /* A really lightweight plugin wrapper around the constructor, preventing against multiple instantiations
    ================================================== */
    $.fn[pluginName] = function ( options ) {
        var args = arguments;
        
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
                }
            });
        } 
        else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            return this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);
                
                if (instance instanceof Plugin && typeof instance[options] === 'function') {
                    instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }
            });
        }
    };
    
})(jQuery, window, document);