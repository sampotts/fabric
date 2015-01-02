// --------------------------------------------
// UI 
// --------------------------------------------

(function($) {
    var $body,
        config = {
            selector: {
                toggleClass: "[data-toggle='class']"
            }
        };

    $(function() {
        $body = $(document.body);

        setup();

        // Setup UI
        function setup() {
            listeners();
        }

        // Event bindings
        function listeners() {
            $body
                .on("click", config.selector.toggleClass, toggleClass);
        }

        function toggleClass() {
            var $this       = $(this),
                className   = $this.data("class") || "in",
                $target     = $($this.data("target"));

            if(!!$target.length) {
                $target.toggleClass(className);
            }
        }
    });
})(jQuery);