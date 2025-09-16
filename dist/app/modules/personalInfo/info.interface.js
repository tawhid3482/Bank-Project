"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.Gender = void 0;
var Gender;
(function (Gender) {
    Gender["Male"] = "male";
    Gender["Female"] = "female";
    Gender["Other"] = "other";
})(Gender || (exports.Gender = Gender = {}));
var Status;
(function (Status) {
    Status["approved"] = "approved";
    Status["pending"] = "pending";
    Status["rejected"] = "rejected";
})(Status || (exports.Status = Status = {}));
