"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playedCardModel = exports.userModel = exports.chatModel = exports.cardModel = exports.playerModel = exports.gameModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var cardSchema = new Schema({
    value: Number,
    color: String,
    isSpecial: Boolean,
});
var playerSchema = new Schema({
    cards: [cardSchema],
    name: String,
    index: Number,
    playerId: String,
    drawCard: Number,
    canEnd: Boolean,
    socketId: String,
    score: Number,
});
var chatSchema = new Schema({
    playerName: String,
    message: String,
});
var userSchema = new Schema({
    pastGames: [{ id: String }],
    _id: String,
});
var playedCardSchema = new Schema({
    card: cardSchema,
    user: userSchema,
});
var gameSchema = new Schema({
    players: [playerSchema],
    currentPlayerTurn: Number,
    currentCard: cardSchema,
    currentColor: String,
    isReversed: Boolean,
    gameStart: Boolean,
    numberOfPlayers: Number,
    chat: [chatSchema],
    cards: [playedCardSchema],
    date: String,
});
var gameModel = mongoose_1.default.model("Game", gameSchema);
exports.gameModel = gameModel;
var playerModel = mongoose_1.default.model("Player", playerSchema);
exports.playerModel = playerModel;
var cardModel = mongoose_1.default.model("Card", cardSchema);
exports.cardModel = cardModel;
var chatModel = mongoose_1.default.model("Chat", chatSchema);
exports.chatModel = chatModel;
var userModel = mongoose_1.default.model("User", userSchema);
exports.userModel = userModel;
var playedCardModel = mongoose_1.default.model("PlayedCard", playedCardSchema);
exports.playedCardModel = playedCardModel;
