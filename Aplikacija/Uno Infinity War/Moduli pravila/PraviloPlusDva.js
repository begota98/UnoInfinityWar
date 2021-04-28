"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obavestiPlusDva = exports.ProveriPlusDvaPravilo = exports.praviloPlusDva = void 0;
var IPravilo_1 = __importDefault(require("./IPravilo"));
var ProveriPlusDvaPravilo = /** @class */ (function (_super) {
    __extends(ProveriPlusDvaPravilo, _super);
    function ProveriPlusDvaPravilo(rule) {
        var _this = _super.call(this) || this;
        _this._pronalazacPravila = rule;
        return _this;
    }
    ProveriPlusDvaPravilo.prototype.OdrediPravilo = function () {
        if (this._pronalazacPravila.karta2.specijalna && (this._pronalazacPravila.karta2.boja != "black" && (this._pronalazacPravila.karta2.boja == this._pronalazacPravila.trenutnaBoja || (this._pronalazacPravila.karta1.specijalna && this._pronalazacPravila.karta1.vrednost == this._pronalazacPravila.karta2.vrednost && this._pronalazacPravila.karta1.boja != "black")) && this._pronalazacPravila.karta2.vrednost == 2))
            return 2;
        else
            return 0;
    };
    return ProveriPlusDvaPravilo;
}(IPravilo_1.default));
exports.ProveriPlusDvaPravilo = ProveriPlusDvaPravilo;
var praviloPlusDva = function (igra, pointerNaIgru) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    igra.igraci[igra.igracNaPotezu].poeni += 20;
                    if (!(igra.igraci[igra.igracNaPotezu].poeni >= igra.poeniZaPobedu)) return [3 /*break*/, 2];
                    return [4 /*yield*/, igra.save()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, 7];
                case 2:
                    pointerNaIgru.sledeciPotez(igra);
                    // +2
                    pointerNaIgru.dodajKartu(igra, pointerNaIgru.spil.vuciKartu());
                    pointerNaIgru.dodajKartu(igra, pointerNaIgru.spil.vuciKartu());
                    return [4 /*yield*/, igra.save()];
                case 3:
                    _a.sent();
                    return [2 /*return*/, 2];
            }
        });
    });
};
exports.praviloPlusDva = praviloPlusDva;
var obavestiPlusDva = function (rezultat, io, igra, podaci, igraKontroler) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log(igra.igracNaPotezu + " " + igra.igraci[igra.igracNaPotezu].soketId);
            io.to(igra.igraci[igra.igracNaPotezu].soketId).emit("vuciDve", {
                idPartije: podaci.idPartije,
            });
            return [2 /*return*/];
        });
    });
};
exports.obavestiPlusDva = obavestiPlusDva;
