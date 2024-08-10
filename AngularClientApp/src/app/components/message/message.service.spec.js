"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var message_service_1 = require("./message.service");
describe('MessageService', function () {
    beforeEach(function () { return testing_1.TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = testing_1.TestBed.get(message_service_1.MessageService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=message.service.spec.js.map