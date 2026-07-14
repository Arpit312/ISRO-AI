import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "sos_db.json");

// Helper to get DB
function getDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
  }
  const data = fs.readFileSync(DB_PATH, "utf8");
  return JSON.parse(data || "[]");
}

export async function GET() {
  try {
    const data = getDB();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to read database" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = getDB();
    
    const newSOS = {
      id: `sos-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...body
    };
    
    data.push(newSOS);
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true, data: newSOS });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to write database" }, { status: 500 });
  }
}
