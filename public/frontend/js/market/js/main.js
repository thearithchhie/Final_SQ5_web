
(() => { var e = document.getElementById("top"), t = document.getElementById("show-side-bar"), n = document.getElementById("cancel"), l = window.document.getElementById("side-bar"), o = document.getElementsByClassName("drop_down_btn"), d = document.getElementById("nav_bar"); window.onscroll = function () { d && (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50 ? (d.style.display = "none", document.body.scrollTop > 500 || document.documentElement.scrollTop > 500 ? (d.style.display = "flex", d.classList.add("navbar-v2"), d.classList.remove("navbar")) : (d.style.display = "none", d.classList.add("navbar"), d.classList.remove("navbar-v2"))) : d.style.display = "flex"), document.body.scrollTop > 100 || document.documentElement.scrollTop > 100 ? e.style.display = "block" : e.style.display = "none" }, e && e.addEventListener("click", (function (e) { document.body.scrollTop = 0, document.documentElement.scrollTop = 0 })), t && t.addEventListener("click", (function (e) { l.style.marginLeft = 0 })), n && n.addEventListener("click", (function (e) { l.style.marginLeft = "-1000px" })), o && Array.from(o).forEach((function (e) { e.addEventListener("click", (function (t) { e.classList.toggle("active"), e.nextElementSibling.classList.toggle("show") })) })); var c = document.getElementById("phone_filter"), s = document.getElementById("btn_phone_filter"); s && c && s.addEventListener("click", (function (e) { c.classList.toggle("hidden") })); var a = $("#distance"), i = $(".bar .fill"), m = document.getElementById("distance_value"); if (a && i && m) { var r = function () { i.css("width", a.val() + "%"), m.textContent = a.val() }; a.on("input", r), r() } })();
(() => {
    var e = document.getElementById("top"),
        t = document.getElementById("show-side-bar"),
        n = document.getElementById("cancel"),
        l = window.document.getElementById("side-bar"),
        o = document.getElementsByClassName("drop_down_btn"),
        d = document.getElementById("nav_bar");
    window.onscroll = function() { d && (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50 ? (d.style.display = "none", document.body.scrollTop > 500 || document.documentElement.scrollTop > 500 ? (d.style.display = "flex", d.classList.add("navbar-v2"), d.classList.remove("navbar")) : (d.style.display = "none", d.classList.add("navbar"), d.classList.remove("navbar-v2"))) : d.style.display = "flex"), document.body.scrollTop > 100 || document.documentElement.scrollTop > 100 ? e.style.display = "block" : e.style.display = "none" }, e && e.addEventListener("click", (function(e) { document.body.scrollTop = 0, document.documentElement.scrollTop = 0 })), t && t.addEventListener("click", (function(e) { l.style.marginLeft = 0 })), n && n.addEventListener("click", (function(e) { l.style.marginLeft = "-1000px" })), o && Array.from(o).forEach((function(e) { e.addEventListener("click", (function(t) { e.classList.toggle("active"), e.nextElementSibling.classList.toggle("show") })) }));
    var c = document.getElementById("phone_filter"),
        s = document.getElementById("btn_phone_filter");
    s && c && s.addEventListener("click", (function(e) { c.classList.toggle("hidden") }));
    var a = $("#distance"),
        i = $(".bar .fill"),
        m = document.getElementById("distance_value");
    if (a && i && m) {
        var r = function() { i.css("width", a.val() + "%"), m.textContent = a.val() };
        a.on("input", r), r()
    }
})();
