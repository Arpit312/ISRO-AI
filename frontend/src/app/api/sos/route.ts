import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import SOS from "@/models/SOS";
import fs from "fs";
import path from "path";

const FALLBACK_DB_PATH = path.join(process.cwd(), "sos_db.json");

// Fallback: local JSON file when MongoDB is unavailable
function getFallbackDB(): any[] {
  try {
    if (!fs.existsSync(FALLBACK_DB_PATH)) {
      fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(FALLBACK_DB_PATH, "utf8") || "[]");
  } catch {
    return [];
  }
}

function writeFallbackDB(data: any[]) {
  fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify(data, null, 2));
}

export async function GET() {
  // Try MongoDB first
  try {
    await connectToDatabase();
    const data = await SOS.find({}).sort({ timestamp: -1 });
    const formattedData = data.map((doc) => {
      const obj = doc.toObject();
      obj.id = obj._id.toString();
      delete obj._id;
      delete obj.__v;
      return obj;
    });
    return NextResponse.json({ success: true, data: formattedData });
  } catch (mongoErr) {
    console.warn("[SOS GET] MongoDB unavailable, falling back to local JSON:", (mongoErr as Error).message);
    // Fallback to local JSON
    try {
      const data = getFallbackDB();
      return NextResponse.json({ success: true, data });
    } catch (error) {
      return NextResponse.json({ success: false, error: "Failed to read database" }, { status: 500 });
    }
  }
}

export async function POST(req: Request) {
  const body = await req.json();

  // Try MongoDB first
  try {
    await connectToDatabase();
    const newSOS = new SOS({
      timestamp: new Date().toISOString(),
      ...body,
    });

    await newSOS.save();

    const obj = newSOS.toObject();
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;

    return NextResponse.json({ success: true, data: obj });
  } catch (mongoErr) {
    console.warn("[SOS POST] MongoDB unavailable, falling back to local JSON:", (mongoErr as Error).message);
    // Fallback to local JSON
    try {
      const data = getFallbackDB();
      const newSOS = {
        id: `sos-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...body,
      };
      data.push(newSOS);
      writeFallbackDB(data);
      return NextResponse.json({ success: true, data: newSOS });
    } catch (error) {
      return NextResponse.json({ success: false, error: "Failed to write database" }, { status: 500 });
    }
  }
}
