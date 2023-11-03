import fs from 'fs/promises';
import path from 'path';
import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest) {
  try {
    const dir = "src/app/(pages)/test"
    const filesAndDirs = await fs.readdir(dir);
    const directories = [];

    for (const item of filesAndDirs) {
      const itemPath = path.join(dir, item);
      const stats = await fs.stat(itemPath);

      if (stats.isDirectory()) {
        directories.push(item);
      }
    }

    return NextResponse.json({result: directories})
  } catch (err) {
    console.error('Error reading directory:', err);
    return NextResponse.json({error: "failed"})
  }



}