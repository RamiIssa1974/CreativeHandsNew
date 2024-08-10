"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var purchase_service_1 = require("./purchase.service");
describe('PurchaseService', function () {
    beforeEach(function () { return testing_1.TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = testing_1.TestBed.get(purchase_service_1.PurchaseService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=purchase.service.spec.js.map