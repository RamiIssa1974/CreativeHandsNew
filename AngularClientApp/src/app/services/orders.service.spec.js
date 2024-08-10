"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var orders_service_1 = require("./orders.service");
describe('OrdersService', function () {
    beforeEach(function () { return testing_1.TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = testing_1.TestBed.get(orders_service_1.OrdersService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=orders.service.spec.js.map