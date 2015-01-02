// --------------------------------------------
// Switches
// --------------------------------------------

(function($) {
    $.fn.toggleSwitch = function(options){
        var $this = $(this),
            defaults = {
                selector: {
                    switch: ".checkbox-switch"
                }
            };

        $this.each(function(){
            var $this = $(this);

            // Set defaults and extend with user settings
            options = $.extend(defaults, options);            

            $this
                .on("click", options.selector.switch, function () {
                    var $trigger = $(this),
                        $checkbox = $(":checkbox", $trigger);

                    // Toggle "on" state
                    $trigger.toggleClass("active");

                    // Check the checkbox if need be
                    $checkbox
                        .prop("checked", $trigger.hasClass("active"))
                        .trigger("change");
                })
                // Handle form resets
                .on("reset", "form", function () {
                    var $form = $(this);
                    setTimeout(function() {
                        $(".checkbox-switch", $form).each(function() {
                            var $checkbox = $(":checkbox", this);

                            // Toggle class hook on wrapper
                            $(this).toggleClass("active", $checkbox.is(":checked"));

                            // Trigger event for other bindings
                            $checkbox.trigger("change");
                        });
                    }, 250);
                })
                .on("focus", ".checkbox-switch :checkbox", function() {
                    $(this).parent().addClass("focus");
                })
                .on("blur", ".checkbox-switch :checkbox", function() {
                    $(this).parent().removeClass("focus");
                });
            
        });

        return $this;
    };

    $("body").toggleSwitch();
})(jQuery);