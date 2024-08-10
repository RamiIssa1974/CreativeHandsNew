"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var videos_service_1 = require("./videos.service");
describe('VideosService', function () {
    beforeEach(function () { return testing_1.TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = testing_1.TestBed.get(videos_service_1.VideosService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=videos.service.spec.js.map