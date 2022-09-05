var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { stripHtml } from "string-strip-html";
export default function clearData(req, res, next) {
    var data = [req.headers, req.params, req.query, req.body];
    var output = __spreadArray([], data, true);
    for (var i = 0; i < data.length; i++) {
        for (var param in data[i]) {
            if (typeof output[i][param] === "string") {
                output[i][param] = stripHtml(data[i][param]).result.trim();
            }
        }
    }
    next();
}
;
