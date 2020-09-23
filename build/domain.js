"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Domain = void 0;
var Domain = /** @class */ (function () {
    function Domain(name, sender, sendDate, url, matchingKey) {
        if (matchingKey === void 0) { matchingKey = ''; }
        this.name = name;
        this.sender = sender;
        this.sendDate = sendDate;
        this.deadlineDate = this.addDays(sendDate, 7);
        this.url = url;
        this.matchingKey = matchingKey;
    }
    Domain.prototype.toString = function () {
        return this.name + ';,;' + this.sender + ';,;' + this.sendDate.toString() + ';,;' + this.url + ';,;' + this.matchingKey;
    };
    Domain.prototype.addDays = function (date, days) {
        var newDate = new Date(date.getTime());
        newDate.setDate(date.getDate() + days);
        return newDate;
    };
    return Domain;
}());
exports.Domain = Domain;
