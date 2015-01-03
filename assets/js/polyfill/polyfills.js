// ==========================================================================
// Polyfills for features
// ==========================================================================

// Modernizr
// ---------------------------------
if(typeof Modernizr !== "undefined") {
    // Detect features
    Modernizr.addTest("pointerevents", function() {
        var a = document.createElement("x");
        a.style.cssText = "pointer-events:auto";
        return a.style.pointerEvents === "auto";
    });

    Modernizr.addTest("inputgeneratedcontent", function() {
        // Generate an input and style the psuedo element
        var i = document.createElement("input");
        i.type = "checkbox";
        i.id = "test-input";
        document.body.innerHTML += "<style id='test-style'>#test-input:after{content:':-)';color:rgb(2,3,4)}</style>";
        document.body.appendChild(i);

        // Check if the color is as authored
        var success = window.getComputedStyle(i, ":after").getPropertyValue("color").replace(/ /g,"") == "rgb(2,3,4)";

        // Remove test elements
        i.parentElement.removeChild(i);
        var s = document.getElementById("test-style");
        s.parentElement.removeChild(s);

        return success;
    });

    // Fallbacks
    Modernizr.load({
        test: Modernizr.input.placeholder,
        nope: ["assets/js/polyfill/input.placeholder.js"]
    });
}

// Date.now for older browsers
// ---------------------------------
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); };
}

// Trim a string
// ---------------------------------
if (!String.prototype.trim) {
    String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ""); };
}
if (!String.prototype.trimLeft) {
    String.prototype.trimLeft = function() { return this.replace(/^\s+/, ""); };
}
if (!String.prototype.trimRight) {
    String.prototype.trimRight = function() { return this.replace(/\s+$/, ""); };
}