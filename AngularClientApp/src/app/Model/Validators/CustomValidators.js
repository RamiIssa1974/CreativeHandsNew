"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomValidator = void 0;
var CustomValidator = /** @class */ (function () {
    function CustomValidator() {
    }
    // Number only validation
    CustomValidator.numeric = function (control) {
        var val = control.value;
        if (val === null || val === '')
            return null;
        if (!val.toString().match(/^[0-9]+(\.?[0-9]+)?$/))
            return { 'invalidNumber': true };
        return null;
    };
    CustomValidator.MinOneImage = function (array) {
        //console.log("number of images:" + array.value.length);
        if (array.value.length == 0)
            return { 'no-images': true };
        return null;
    };
    CustomValidator.MinOneCategory = function (array) {
        //console.log("number of cats:" + array.value.length);
        if (array.value.length == 0)
            return { 'no-categories': true };
        return null;
    };
    CustomValidator.MinOneVariation = function (array) {
        //console.log("number of cats:" + array.value.length);
        if (array.value.length == 0)
            return { 'no-variations': true };
        return null;
    };
    return CustomValidator;
}());
exports.CustomValidator = CustomValidator;
//# sourceMappingURL=CustomValidators.js.map