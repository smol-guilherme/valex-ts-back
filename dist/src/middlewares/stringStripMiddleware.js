"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const string_strip_html_1 = require("string-strip-html");
function clearData(req, res, next) {
    const data = [req.headers, req.params, req.query, req.body];
    const output = [...data];
    for (let i = 0; i < data.length; i++) {
        for (const param in data[i]) {
            if (typeof output[i][param] === "string") {
                output[i][param] = (0, string_strip_html_1.stripHtml)(data[i][param]).result.trim();
            }
        }
    }
    next();
}
exports.default = clearData;
;
