import { findAndInsertUserCard } from "../repositories/companyRepositories.js";


export function createUserCard() {
    findAndInsertUserCard();
    return;
}