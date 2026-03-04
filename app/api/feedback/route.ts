import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_PATH = join(process.cwd(), "data", "feedback.json");

interface FeedbackEntry {
  id: string;
  name: string;
  email?: string;
  type: "feedback" | "feature" | "bug";
  message: string;
  createdAt: string;
}

function readFeedback(): FeedbackEntry[] {
  try {
    const raw = readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function GET() {
  const feedback = readFeedback();
  return NextResponse.json(feedback);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, type, message } = body;

    if (!name || !type || !message) {
      return NextResponse.json(
        { error: "Name, type, and message are required" },
        { status: 400 }
      );
    }

    if (!["feedback", "feature", "bug"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be feedback, feature, or bug" },
        { status: 400 }
      );
    }

    const feedback = readFeedback();
    const entry: FeedbackEntry = {
      id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: String(name).slice(0, 100),
      email: email ? String(email).slice(0, 200) : undefined,
      type,
      message: String(message).slice(0, 2000),
      createdAt: new Date().toISOString(),
    };

    feedback.push(entry);
    writeFileSync(DATA_PATH, JSON.stringify(feedback, null, 2));

    return NextResponse.json({ success: true, id: entry.id });
  } catch {
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}
