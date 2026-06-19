const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<div slidesperview="2" autoplaydisableoninteraction=""></div>`);
const el = dom.window.document.querySelector("div");
console.log("slidesPerView:", el.getAttribute("slidesPerView"));
console.log("autoplayDisableOnInteraction:", el.getAttribute("autoplayDisableOnInteraction"));
console.log("hasAttr loop:", el.getAttribute("loop"));
