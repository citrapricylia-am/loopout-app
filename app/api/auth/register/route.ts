import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, phone, department, password } = await req.json();
   console.log("Register request:", { name, email, phone, department }); // debug
    if (!name || !email || !phone || !department || !password) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
    }

    // Cek apakah email sudah ada
    const [rows]: any = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (rows.length > 0) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const [result]: any = await pool.query(
      "INSERT INTO users (name,email,phone,department,role,password_hash) VALUES (?,?,?,?, 'user', ?)",
      [name, email, phone, department, password_hash]
    );

    return NextResponse.json({ id: result.insertId, name, email, phone, department, role: "user" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
