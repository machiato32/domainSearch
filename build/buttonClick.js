"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onClick = exports.getPosition = exports.onOpenDomain = exports.loadHistory = exports.onDeleteDomain = void 0;
var domain_1 = require("./domain");
var fs = __importStar(require("fs"));
var fuzzball_1 = require("fuzzball");
function onDeleteDomain(name, date, id) {
    var _a;
    // console.log(domains.join('\n'));
    var domains = [];
    var historyText = fs.readFileSync(__dirname + '/history.txt', 'utf-8');
    // console.log(historyText);
    historyText.split('\n').forEach(function (line) {
        var splittedLine = line.split(';,;');
        if (splittedLine[1] != undefined) {
            var domain = new domain_1.Domain(splittedLine[0], splittedLine[1], new Date(Date.parse(splittedLine[2])), splittedLine[3], splittedLine[4]);
            domains.push(domain);
        }
    });
    var index = domains.findIndex(function (value) { return value.name == name && value.sendDate.toString() == date; });
    console.log(index);
    (_a = document.getElementById('card' + id.toString())) === null || _a === void 0 ? void 0 : _a.remove();
    if (index > -1) {
        domains.splice(index, 1);
    }
    fs.writeFileSync(__dirname + '/history.txt', domains.join('\n'), { flag: 'w' });
}
exports.onDeleteDomain = onDeleteDomain;
function loadHistory() {
    // console.log('start');
    // var history : Domain[] = [];
    var domains = [];
    var historyText = fs.readFileSync(__dirname + '/history.txt', 'utf-8');
    // console.log(historyText);
    historyText.split('\n').forEach(function (line) {
        var splittedLine = line.split(';,;');
        if (splittedLine[1] != undefined) {
            var domain = new domain_1.Domain(splittedLine[0], splittedLine[1], new Date(Date.parse(splittedLine[2])), splittedLine[3], splittedLine[4]);
            domains.push(domain);
        }
    });
    var index = 0;
    domains.forEach(function (domain) {
        var _a;
        var inner = "\n        <div class=\"card-content black-text\">\n            <span class=\"card-title\">" + domain.name + "</span>\n            <blockquote>\n                <p>Bek\u00FCld\u0151: " + domain.sender + "</p>\n                <p>Regisztr\u00E1ci\u00F3 id\u0151pontja: " + domain.sendDate.toDateString() + "</p>\n                <p>Panasz beny\u00FAjt\u00E1s\u00E1nak hat\u00E1rideje: " + domain.deadlineDate.toDateString() + "</p>\n                <p>Kulcssz\u00F3: " + domain.matchingKey + "</p>\n            </blockquote>\n            <div class=\"row\">\n                <a class=\"waves-effect waves-light btn-flat\" onclick=\"onOpenDomain('" + domain.url + "')\">R\u00E9szletek</a>\n                <a class=\"waves-effect waves-light btn-flat\" onclick=\"onDeleteDomain('" + domain.name + "', '" + domain.sendDate + "', " + index + ")\">T\u00F6rl\u00E9s</a>\n            </div>\n        </div>\n    ";
        var element = document.createElement('div');
        element.classList.add('card');
        element.id = "card" + index.toString();
        element.innerHTML = inner;
        (_a = document.getElementById('result-column')) === null || _a === void 0 ? void 0 : _a.appendChild(element);
        index++;
    });
}
exports.loadHistory = loadHistory;
function onOpenDomain(url) {
    var shell = require('electron').shell;
    shell.openExternal('https://info.domain.hu/' + url);
}
exports.onOpenDomain = onOpenDomain;
function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
}
exports.getPosition = getPosition;
function onClick() {
    var domains = [];
    var loader = document.getElementById('loadingDiv');
    if (loader) {
        loader.style.visibility = "visible";
    }
    var request = new XMLHttpRequest();
    // request.open('GET', 'http://www.domain.hu/domain/varolista/ido.html', true);
    request.open('GET', 'https://info.domain.hu/varolista/hu/ido.html', true);
    request.overrideMimeType('text/html; charset=UTF8');
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            console.log(this.response);
            var element = document.createElement('html');
            element.innerHTML = this.response;
            var elements = element.getElementsByTagName('table')[0].getElementsByTagName('tr');
            var alreadyFoundDomains = [];
            var alreadyFound = fs.readFileSync(__dirname + '/alreadyFound.txt', 'utf-8');
            alreadyFound.split('\n').forEach(function (line) {
                var splittedLine = line.split(';,;');
                var domain = new domain_1.Domain(splittedLine[0], splittedLine[1], new Date(Date.parse(splittedLine[2])), splittedLine[3], splittedLine[4]);
                alreadyFoundDomains.push(domain);
            });
            var keywords = [];
            fs.readFileSync(__dirname + '/keywords.txt', 'utf-8').split(';').forEach(function (keyword) {
                keywords.push(keyword);
            });
            var _loop_1 = function (i) {
                var element_1 = elements[i];
                var tds = element_1.getElementsByTagName('td');
                first = tds[4].innerHTML.indexOf('"');
                // var last = tds[4].innerHTML.lastIndexOf('"');
                last = getPosition(tds[4].innerHTML, '"', 2);
                keywords.forEach(function (keyword) {
                    var needs = 100;
                    if (keyword.length > 3) {
                        needs = (keyword.length - 1) * 100 / keyword.length;
                    }
                    if (fuzzball_1.partial_ratio(keyword, tds[1].innerText) > needs &&
                        !alreadyFoundDomains.some(function (value) { return (value.name == tds[1].innerText && value.sendDate.toDateString() == (new Date(Date.parse(tds[3].innerText)).toDateString())); })) {
                        var domain = new domain_1.Domain(tds[1].innerText, tds[2].innerText, new Date(Date.parse(tds[3].innerText)), tds[4].innerHTML.substring(first + 1, last), keyword);
                        domains.push(domain);
                    }
                });
            };
            var first, last;
            for (var i = 1; i < elements.length; i++) {
                _loop_1(i);
            }
            console.log(domains.join('\n'));
            var index_1 = 0;
            domains.forEach(function (domain) {
                var _a;
                var inner = "\n                  <div class=\"card-content black-text\">\n                      <span class=\"card-title\">" + domain.name + "</span>\n                      <blockquote>\n                          <p>Bek\u00FCld\u0151: " + domain.sender + "</p>\n                          <p>Regisztr\u00E1ci\u00F3 id\u0151pontja: " + domain.sendDate.toDateString() + "</p>\n                          <p>Fellebbez\u00E9s hat\u00E1rideje: " + domain.deadlineDate.toDateString() + "</p>\n                          <p>Kulcssz\u00F3: " + domain.matchingKey + "</p>\n                      </blockquote>\n                      <div class=\"row\">\n                          <a class=\"waves-effect waves-light btn-flat\" onclick=\"onOpenDomain('" + domain.url + "')\">R\u00E9szletek</a>\n                          <a class=\"waves-effect waves-light btn-flat\" onclick=\"onDeleteDomain('" + domain.name + "', '" + domain.sendDate + "', " + index_1 + ")\">T\u00F6rl\u00E9s</a>\n                      </div>\n                  </div>\n              ";
                //<a class="waves-effect waves-light btn-flat" href="https://info.domain.hu/${domain.url}" target="_blank">Részletek</a>
                var element = document.createElement('div');
                element.classList.add('card');
                element.id = "card" + index_1.toString();
                element.innerHTML = inner;
                (_a = document.getElementById('result-column')) === null || _a === void 0 ? void 0 : _a.appendChild(element);
                index_1++;
            });
            if (domains.length > 0) {
                fs.appendFile(__dirname + '/alreadyFound.txt', domains.join('\n'), function (err) {
                    if (err)
                        return console.error(err);
                    console.log('Saved!');
                });
                fs.appendFile(__dirname + '/history.txt', domains.join('\n'), function (err) {
                    if (err)
                        return console.error(err);
                    console.log('Saved!');
                });
            }
            if (loader) {
                loader.style.visibility = "hidden";
            }
        }
        else {
        }
    };
    request.send();
}
exports.onClick = onClick;
