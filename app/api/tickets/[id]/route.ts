import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ticketId = params.id;

    if (!ticketId) {
      return NextResponse.json(
        { error: "ID tiket diperlukan" },
        { status: 400 }
      );
    }

    // Delete the ticket from the database
    const [result]: any = await pool.query(
      `DELETE FROM tickets WHERE id = ?`,
      [ticketId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Tiket tidak ditemukan" },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error DELETE /api/tickets/[id]:", error);
    return NextResponse.json(
      { error: "Gagal menghapus tiket" },
      { status: 500 }
    );
  }
}