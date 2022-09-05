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
) {
  const result = await connection.query<Card, [string, string]>(
    ` SELECT 
        * 
      FROM cards 
      WHERE number=$1 AND "cardholderName"=$2`,
    [number, cardholderName]
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
    INSERT INTO 
    cards (
      "employeeId", number, "cardholderName",
       "securityCode", "expirationDate", password, 
       "isVirtual", "originalCardId", "isBlocked", type
      )
    SELECT 
      $1, $2, $3, 
      $4, $5, $6, 
      $7, $8, $9, $10 
    WHERE 
      NOT EXISTS (
        SELECT id 
        FROM cards 
        WHERE type=$10 
        AND "employeeId"=$1 
      ) OR
      $7=true
      ;
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

export async function findCardHistory(cardId: number) {
  const queryParams = [cardId];
  const queryString = `
  SELECT 
    COALESCE(SUM(amount) , 0) balance, 
    ARRAY(
      SELECT json_build_object
      (
        'id', payments.id,
        'businessId', "businessId",
        'timestamp', timestamp,
        'amount', amount,
        'businessName', b.name
      )
      FROM payments
      JOIN businesses b
      ON b.id="businessId"
      WHERE payments."cardId"=$1
      GROUP BY payments.id, b.id
    ) transactions,
    ARRAY(
      SELECT 
      json_build_object
      (
        'id', id,
        'timestamp', timestamp,
        'amount', amount
      )
      FROM recharges
      WHERE recharges."cardId"=$1
    ) recharges
  FROM 
  (
    SELECT r."cardId", 
    SUM(amount) amount 
    FROM recharges r 
    WHERE r."cardId"=$1 
    GROUP BY r."cardId" 
    UNION ALL 
    SELECT p."cardId", 
    -SUM(amount) amount 
    FROM payments p 
    WHERE p."cardId"=$1 
    GROUP BY 
    p."cardId"
    ) AS result 
    GROUP BY "cardId"
  ;`;
  const { rows } = await connection.query(queryString, queryParams);
  return rows;
}
