import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Strip HTML/script tags and trim whitespace
function sanitize(value: string, maxLen: number): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[<>'"`;]/g, "")
    .trim()
    .slice(0, maxLen);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;

  // ── Validate required fields ──────────────────────────────────────────────
  const nombre = typeof raw.nombre === "string" ? sanitize(raw.nombre, 120) : "";
  const tipo = raw.tipo;
  const asiste = raw.asiste;
  const transporte = raw.transporte;

  if (!nombre) {
    return NextResponse.json({ error: "nombre is required" }, { status: 422 });
  }
  if (tipo !== "amigo" && tipo !== "familia") {
    return NextResponse.json({ error: "tipo must be amigo or familia" }, { status: 422 });
  }
  if (asiste !== "si" && asiste !== "no") {
    return NextResponse.json({ error: "asiste must be si or no" }, { status: 422 });
  }

  const asistion = asiste === "si";
  const isFamilia = tipo === "familia";

  const cantidad_personas =
    isFamilia && asistion
      ? Math.min(Math.max(1, Math.floor(Number(raw.cantidad) || 1)), 30)
      : 1;

  const nombres_acompañantes =
    isFamilia && asistion && typeof raw.acompanantes === "string"
      ? sanitize(raw.acompanantes, 500) || null
      : null;

  const necesita_transporte = transporte === "si";

  // ── Insert via service role (server-side only) ────────────────────────────
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const supabase = createClient(url, key);

  const { error } = await supabase.from("confirmaciones").insert([{
    nombre,
    tipo,
    asiste: asistion,
    cantidad_personas,
    "nombres_acompañantes": nombres_acompañantes,
    transporte: necesita_transporte,
  }]);

  if (error) {
    console.error("Supabase insert error:", error.message);
    return NextResponse.json({ error: "Could not save confirmation" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
