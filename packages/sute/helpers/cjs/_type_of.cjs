"use strict";

exports._ = exports._type_of = _type_of;
function _type_of(obj) {
    "@swc/helpers - typeof";

    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
