// --------------------------------------------
// UI 
// --------------------------------------------

(function($) {
    var $window,
        $body,
        config = {
            selector: {
                toggleClass:    "[data-toggle='class']",
                smoothScroll:   ".js-smooth-scroll",
                tableRowLink:   "[data-row-href] td"
            }
        };

    $(function() {
        $body = $(document.body);
        $window = $(window);

        setup();

        // Setup UI
        function setup() {
            listeners();

            // When our page loads, check to see if it contains and anchor
            window.setTimeout(scrollToAnchor, 300);
        }

        // Event bindings
        function listeners() {
            $window
                .on("hashchange", scrollToAnchor);

            $body
                .on("click", config.selector.toggleClass, toggleClass)
                .on("click", config.selector.smoothScroll, smoothScroll)
                .on("click", config.selector.tableRowLink, tableRowClick);
        }

        // Toggle class on element
        // ---------------------------------
        function toggleClass() {
            var $this       = $(this),
                className   = $this.data("class") || "in",
                $target     = $($this.data("target"));

            if(!!$target.length) {
                $target.toggleClass(className);
            }
        }

        // Scroll offset on anchors
        // ---------------------------------
        function scrollToAnchor() {
            // Re-use for below

            var hash = window.location.hash,
                hashFormat = new RegExp(/^[a-z0-9-_]+$/i);

            if(hash.indexOf("#") === 0 && hashFormat.test(hash.replace("#", ""))) {
                // Calculate offset
                var $target = $(hash);

                if($target.length) {
                    $("html, body").animate({
                        scrollTop: $target.offset().top
                    }, 300, "swing");
                }
            }
        }

        function smoothScroll(e) {
            e.preventDefault();
            var $this   = $(this),
                hash    = $this.attr("href").split("#")[1];

            // Calculate destination place
            var dest = 0;

            if($("#" + hash).offset().top > $(document).height()-$window.height()) {
                dest = $(document).height() - $window.height();
            }
            else {
                dest = $("#" + hash).offset().top - ($this.data("offset") || ($this.data("offset-target") ? $($this.data("offset-target")).outerHeight() : 0));
            }
            //go to destination
            $("html, body").animate({
                scrollTop: dest
            }, 300, "swing");
        }

        // Row click
        // ---------------------------------
        function tableRowClick(event) {
            // If the click event is on the td and it's not from text selection, redirect the user
            if (!$(event.target).is("a, button, input") && !window.getSelection().toString()) {
                window.location.href = $(this).closest("tr").data("row-href");
            }
        }
    });
})(jQuery);