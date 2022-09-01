import { connection } from "../databases/database.js";
import { mapObjectToUpdateQuery } from "../../valex/utils/sqlUtils.js";

export type TransactionTypes =
  | "groceries"
  | "restaurant"
  | "transport"
  | "education"
  | "health";

export interface Card {
  id: number;
  employeeId: number;
  number: string;
  cardholderName: string;
  securityCode: string;
  expirationDate: string;
  password?: string;
  isVirtual: boolean;
  originalCardId?: number;
  isBlocked: boolean;
  type: TransactionTypes;
}

export type CardInsertData = Omit<Card, "id">;
export type CardUpdateData = Partial<Card>;

export async function find() {
  const result = await connection.query<Card>("SELECT * FROM cards");
  return result.rows;
}

export async function findById(id: number) {
  const result = await connection.query<Card, [number]>(
    "SELECT * FROM cards WHERE id=$1",
    [id]
  );

  return result.rows[0];
}

export async function findByTypeAndEmployeeId(
  type: TransactionTypes,
  employeeId: number
) {
  const result = await connection.query<Card, [TransactionTypes, number]>(
    `SELECT * FROM cards WHERE type=$1 AND "employeeId"=$2`,
    [type, employeeId]
  );

  return result.rows[0];
}

export async function findByCardDetails(
  number: string,
  cardholderName: string,
  expirationDate: string
) {
  const result = await connection.query<Card, [string, string, string]>(
    ` SELECT 
        * 
      FROM cards 
      WHERE number=$1 AND "cardholderName"=$2 AND "expirationDate"=$3`,
    [number, cardholderName, expirationDate]
  );

  return result.rows[0];
}

export async function insert(cardData: CardInsertData) {
  const {
    employeeId,
    number,
    cardholderName,
    securityCode,
    expirationDate,
    password,
    isVirtual,
    originalCardId,
    isBlocked,
    type,
  } = cardData;

  return await connection.query(
    `
    INSERT INTO cards ("employeeId", number, "cardholderName", "securityCode",
      "expirationDate", password, "isVirtual", "originalCardId", "isBlocked", type)
    SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10 WHERE NOT EXISTS (SELECT id FROM cards WHERE type=$10 AND "employeeId"=$1);
  `,
    [
      employeeId,
      number,
      cardholderName,
      securityCode,
      expirationDate,
      password,
      isVirtual,
      originalCardId,
      isBlocked,
      type,
    ]
  );
}

export async function update(id: number, cardData: CardUpdateData) {
  const { objectColumns: cardColumns, objectValues: cardValues } =
    mapObjectToUpdateQuery({
      object: cardData,
      offset: 2,
    });

  return await connection.query(
    `
    UPDATE cards
      SET ${cardColumns}
    WHERE $1=id AND password IS NULL;
  `,
    [id, ...cardValues]
  );
}

export async function toggleBlock(id: number, cardData: CardUpdateData) {
  const { objectColumns: cardColumns, objectValues: cardValues } =
    mapObjectToUpdateQuery({
      object: cardData,
      offset: 2,
    });

  return await connection.query(
    `
    UPDATE cards
      SET ${cardColumns}
    WHERE $1=id;
  `,
    [id, ...cardValues]
  );
}

export async function remove(id: number) {
  connection.query<any, [number]>("DELETE FROM cards WHERE id=$1", [id]);
}
