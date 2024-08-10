"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiredFileType = void 0;
function requiredFileType(type) {
    return function (control) {
        var file = control.value;
        if (file) {
            var extension = file.name.split('.')[1].toLowerCase();
            if (type.toLowerCase() !== extension.toLowerCase()) {
                return {
                    requiredFileType: true
                };
            }
            return null;
        }
        return null;
    };
}
exports.requiredFileType = requiredFileType;
//# sourceMappingURL=fileValidator.js.map