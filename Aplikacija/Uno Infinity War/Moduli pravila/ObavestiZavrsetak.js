"use strict";
//ukoliko je doslo do kraja igre, obavestavac ce ovu funkciju da pozove
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obavestiZavrsetak = void 0;
var obavestiZavrsetak = function (rezultat, io, igra, podaci, igraKontroler) {
    return __awaiter(this, void 0, void 0, function* () {
        igra.zavrsenaIgra = 1;
        yield igra.save();
        io.sockets.emit("zavrsetakPartije", {
            idPartije: podaci.idPartije,
            indeks: podaci.indexIgraca,
            idIgraca: podaci.idIgraca,
            success: "Kraj igre",
        });
    });
};
exports.obavestiZavrsetak = obavestiZavrsetak;
