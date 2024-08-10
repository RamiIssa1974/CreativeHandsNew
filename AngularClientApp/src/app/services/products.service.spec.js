"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var products_service_1 = require("./products.service");
describe('ProductsService', function () {
    beforeEach(function () { return testing_1.TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = testing_1.TestBed.get(products_service_1.ProductsService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=products.service.spec.js.map