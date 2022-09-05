export function editExpirationDate() {
    var now = new Date();
    var month = String(now.getUTCMonth());
    var year = String(now.getUTCFullYear() + 5).substring(2);
    if (month.length === 1)
        return "0".concat(month, "/").concat(year);
    return "".concat(month, "/").concat(year);
}
export function editTodayDate() {
    var now = new Date();
    var month = String(now.getUTCMonth());
    if (month.length === 1)
        return "0".concat(month, "/").concat(String(now.getUTCFullYear()).substring(2));
    return "".concat(month, "/").concat(String(now.getUTCFullYear()).substring(2));
}
export function editNameToCard(fullName) {
    var cardString = fullName
        .replaceAll(/\b(da?o?s?)\W/g, "")
        .trim()
        .toUpperCase()
        .split(" ");
    if (cardString.length >= 3)
        cardString.splice(1, cardString.length - 2, cardString[1].substring(0, 1));
    return cardString.join(" ");
}
