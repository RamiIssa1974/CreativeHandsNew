"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var filter_service_1 = require("./filter.service");
describe('FilterService', function () {
    beforeEach(function () { return testing_1.TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = testing_1.TestBed.get(filter_service_1.FilterService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=filter.service.spec.js.map