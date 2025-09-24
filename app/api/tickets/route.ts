import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const isAdmin = searchParams.get("all");

  try {
    let tickets;
    if (isAdmin === "1") {
      // ✅ Ambil tiket + data user sekaligus
     const [rows]: any = await pool.query(`
  SELECT 
    t.*,
    u.name AS userName,
    u.email AS userEmail,
    u.phone AS userPhone,
    u.department AS userDepartment
  FROM tickets t
  JOIN users u ON u.id = t.user_id
  ORDER BY t.created_at DESC
`);


      tickets = rows;
    } else {
      if (!userId) {
        return NextResponse.json({ error: "userId diperlukan" }, { status: 400 });
      }

      const [rows]: any = await pool.query(
        `
        SELECT 
          t.*, 
          u.name AS userName, 
          u.email AS userEmail, 
          u.phone AS userPhone, 
          u.department AS userDepartment
        FROM tickets t
        JOIN users u ON u.id = t.user_id
        WHERE t.user_id = ?
        ORDER BY t.created_at DESC
      `,
        [userId]
      );
      tickets = rows;
    }

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error GET /api/tickets:", error);
    return NextResponse.json({ error: "Gagal memuat tiket" }, { status: 500 });
  }
}
export async function PATCH(req: Request) {
  try {
    const { ticketId, updates } = await req.json();

    if (!ticketId || !updates) {
      return NextResponse.json({ error: "ticketId dan updates diperlukan" }, { status: 400 });
    }

    // Buat query dinamis sesuai field yang mau diupdate
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updates);

    await pool.query(
      `UPDATE tickets SET ${fields}, updated_at = NOW() WHERE id = ?`,
      [...values, ticketId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error PATCH /api/tickets:", error);
    return NextResponse.json({ error: "Gagal memperbarui tiket" }, { status: 500 });
  }
}
