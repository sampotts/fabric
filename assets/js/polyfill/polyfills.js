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
        var i = document.createElement("input"),
            d = document.createElement("div");
        i.type = "checkbox";
        i.id = "test-input";
        d.appendChild(i);

        // Append test elements
        document.body.innerHTML += "<style id='test-style'>#test-input{margin:0;padding:0}#test-input::after{content:':-)';display:block;height:50px;width:50px}</style>";
        document.body.appendChild(d);

        // Check if the scroll height is equal to or larger than 50px
        var success = d.scrollHeight >= 50;

        // Clean up test elements
        d.parentElement.removeChild(d);
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