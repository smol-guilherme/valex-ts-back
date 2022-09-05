"use strict";
exports.__esModule = true;
exports.mapObjectToUpdateQuery = void 0;
function mapObjectToUpdateQuery(_a) {
    var object = _a.object, _b = _a.offset, offset = _b === void 0 ? 1 : _b;
    var objectColumns = Object.keys(object)
        .map(function (key, index) { return "\"".concat(key, "\"=$").concat(index + offset); })
        .join(",");
    var objectValues = Object.values(object);
    return { objectColumns: objectColumns, objectValues: objectValues };
}
exports.mapObjectToUpdateQuery = mapObjectToUpdateQuery;
