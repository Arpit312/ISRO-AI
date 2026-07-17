import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, email, displayName } = body;

    if (!uid) {
      return NextResponse.json({ success: false, error: "Missing uid" }, { status: 400 });
    }

    try {
      await connectToDatabase();
      // Upsert user in MongoDB
      const user = await User.findOneAndUpdate(
        { uid },
        { uid, email, displayName },
        { new: true, upsert: true }
      );
      return NextResponse.json({ success: true, data: user });
    } catch (dbErr) {
      // If MongoDB is unavailable, still return success (auth is handled by Firebase)
      console.warn("[AUTH SYNC] MongoDB unavailable, skipping DB sync:", (dbErr as Error).message);
      return NextResponse.json({ success: true, data: { uid, email, displayName }, note: "DB sync skipped" });
    }
  } catch (error) {
    console.error("[AUTH SYNC] Error:", error);
    return NextResponse.json({ success: false, error: "Failed to sync user" }, { status: 500 });
  }
}
