import { connection } from "../databases/database.js";

export interface Payment {
  id: number;
  cardId: number;
  businessId: number;
  timestamp: Date;
  amount: number;
}
export type PaymentWithBusinessName = Payment & { businessName: string };
export type PaymentInsertData = Omit<Payment, "id" | "timestamp">;

export async function findByCardId(cardId: number) {
  const result = await connection.query<PaymentWithBusinessName, [number]>(
    `SELECT 
      payments.*,
      businesses.name as "businessName"
     FROM payments 
      JOIN businesses ON businesses.id=payments."businessId"
     WHERE "cardId"=$1
    `,
    [cardId]
  );

  return result.rows;
}

export async function insert(paymentData: PaymentInsertData) {
  const { cardId, businessId, amount } = paymentData;

  const { rowCount } = await connection.query<any, [number, number, number]>(
    `INSERT INTO 
    payments ("cardId", "businessId", amount) 
    SELECT $1, $2, $3 
    WHERE 
    (
      SELECT 
      COALESCE(SUM(amount) , 0) balance 
      FROM 
      (
        SELECT r."cardId", 
        SUM(amount) amount 
        FROM recharges r 
        WHERE r."cardId"=$1 
        GROUP BY r."cardId" 
        UNION ALL 
        SELECT p."cardId", 
        -SUM(amount) - $3::INTEGER amount 
        FROM payments p 
        WHERE p."cardId"=$1 
        GROUP BY 
        p."cardId"
        ) AS result 
        GROUP BY "cardId"
    ) >= 0
    ;`,
    [cardId, businessId, amount]
  );
  return rowCount;
}
