"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editNameToCard = exports.editTodayDate = exports.editExpirationDate = void 0;
function editExpirationDate() {
    const now = new Date();
    const month = String(now.getUTCMonth());
    const year = String(now.getUTCFullYear() + 5).substring(2);
    if (month.length === 1)
        return `0${month}/${year}`;
    return `${month}/${year}`;
}
exports.editExpirationDate = editExpirationDate;
function editTodayDate() {
    const now = new Date();
    const month = String(now.getUTCMonth());
    if (month.length === 1)
        return `0${month}/${String(now.getUTCFullYear()).substring(2)}`;
    return `${month}/${String(now.getUTCFullYear()).substring(2)}`;
}
exports.editTodayDate = editTodayDate;
function editNameToCard(fullName) {
    const cardString = fullName
        .replaceAll(/\b(da?o?s?)\W/g, "")
        .trim()
        .toUpperCase()
        .split(" ");
    if (cardString.length >= 3)
        cardString.splice(1, cardString.length - 2, cardString[1].substring(0, 1));
    return cardString.join(" ");
}
exports.editNameToCard = editNameToCard;
