"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProveriNormalnuVrednost = exports.praviloNormalnaVrednost = void 0;
const IPravilo_1 = __importDefault(require("./IPravilo"));
class ProveriNormalnuVrednost extends IPravilo_1.default {
    constructor(pravilo) {
        super();
        this._pronalazacPravlia = pravilo;
    }
    OdrediPravilo() {
        if (!this._pronalazacPravlia.karta2.specijalna && (this._pronalazacPravlia.trenutnaBoja == this._pronalazacPravlia.karta2.boja || (!this._pronalazacPravlia.karta1.specijalna && this._pronalazacPravlia.karta1.vrednost == this._pronalazacPravlia.karta2.vrednost)))
            return 1;
        else
            return 0;
    }
}
exports.ProveriNormalnuVrednost = ProveriNormalnuVrednost;
var praviloNormalnaVrednost = function (igra, pointerNaIgru) {
    return __awaiter(this, void 0, void 0, function* () {
        igra.igraci[igra.igracNaPotezu].poeni += 20;
        if (igra.igraci[igra.igracNaPotezu].poeni >= igra.poeniZaPobedu) {
            yield igra.save();
            return 7;
        }
        pointerNaIgru.sledeciPotez(igra);
        yield igra.save();
        return 1;
    });
};
exports.praviloNormalnaVrednost = praviloNormalnaVrednost;
