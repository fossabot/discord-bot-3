/* eslint-disable camelcase */
/* eslint-disable no-prototype-builtins */
/**
 *
 * @param {Number} number number to shorten
 */
function shortNumber(number) {
    if(number < 1000) return number.toString();
    if(number > 1000000) {
        return Math.round(number / 100000) / 10 + "m";
    }
    return Math.round(number / 100) / 10 + "k";
}

function insertAt(a, b, position) {
    return a.substring(0, position) + b + a.substring(position);
}

function suffix(i) {
    var j = i % 10;
    var k = i % 100;
    if(j === 1 && k !== 11) {
        return i + "st";
    }
    if(j === 2 && k !== 12) {
        return i + "nd";
    }
    if(j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}

// eslint-disable-next-line no-extend-native
Number.prototype.withCommas = function() {
    return this.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

function withCommas() {
    return this.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function timestampToDate(timestamp, unix = false) {
    if(unix) timestamp *= 1000;
    const dt = new Date(timestamp);
    const day = dt.getDate();
    const month = dt.toLocaleString("en-us", {
        month: "short"
    });
    const year = dt.getFullYear().toString().substr(-2);
    return `${month} ${day}, '${year}`;
}

function compareArr(arr1, arr2) {
    if(!arr1 || !arr2) return false;
    if(arr1.length !== arr2.length) return false;
    for(var i = 0, l = arr1.length; i < l; i++) {
        // Check if we have nested arrays
        if(arr1[i] instanceof Array && arr2[i] instanceof Array) {
            // recurse into the nested arrays
            if(!arr1[i].equals(arr2[i])) return false;
        } else if(arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

function merge() {
    const target = {};
    const merger = (obj) => {
        for(const prop in obj) {
            if(obj.hasOwnProperty(prop)) {
                if(Object.prototype.toString.call(obj[prop]) === "[object Object]") {
                    target[prop] = merge(target[prop], obj[prop]);
                } else {
                    target[prop] = obj[prop];
                }
            }
        }
    };
    for(let i = 0; i < arguments.length; i++) {
        merger(arguments[i]);
    }
    return target;
};

var colors = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    gold: "#ffd700",
    goldenrod: "#daa520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavender: "#e6e6fa",
    lavenderblush: "#fff0f5",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgrey: "#d3d3d3",
    lightgreen: "#90ee90",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370d8",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#d87093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32",

    toHex: function(c) {
        if(typeof this[c.toLowerCase()] !== "undefined") return colors[c.toLowerCase()];
        return false;
    }
};

function hslToRgb(h, s, l) {
    var r, g, b;

    if(s === 0) {
        r = g = b = l;
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1 / 6) return p + (q - p) * 6 * t;
            if(t < 1 / 2) return q;
            if(t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hslToHex(h, s, l) {
    return hslToRgb(h, s, l).map(ch => parseInt(ch).toString(16).padStart(2, "0"))
        .join("");
}

function pieChart(labels, values) {
    const data = {
        labels,
        datasets: [{
            data: values
        }]
    };

    return chart(JSON.stringify({
        data,
        type: "pie"
    }));
}

function chart(args) {
    return "https://quickchart.io/chart?width=512&height=512&c=" + encodeURI(args);
}

function escapeRegExp(string) { // https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function capitalizeFirstLetter(s) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

// For reference, see https://wiki.aztec.bot/en/developers/flags
const flags = {
    owner: 1,
    developer: 1<<1,
    admin: 1<<2,
    bug_hunter: 1<<3,
    beta_tester: 1<<4
};

module.exports = {
    flags,
    shortNumber,
    insertAt,
    suffix,
    timestampToDate,
    compareArr,
    Number,
    String,
    withCommas,
    merge,
    colors,
    hslToRgb,
    hslToHex,
    pieChart,
    chart,
    escapeRegExp,
    capitalizeFirstLetter
};
