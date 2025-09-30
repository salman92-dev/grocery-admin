// src/app/api/upload-image/route.js
import { NextResponse } from "next/server";
import { Buffer } from "buffer";

const repo = process.env.GITHUB_REPO;   // "username/repo"
const token = process.env.GITHUB_TOKEN;
const branch = process.env.GITHUB_BRANCH || "main";

// sanitize filename: remove directories and replace unsafe chars
function sanitizeName(name) {
  const base = String(name).split("/").pop().split("\\").pop();
  return base.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeName = sanitizeName(file.name);
    const filename = `${Date.now()}-${safeName}`; // e.g. 1696...-salman.png
    const repoPath = `public/${filename}`;         // GitHub expects path without leading slash

    // Upload file to GitHub at repoPath
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(repoPath)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Upload image ${filename}`,
          content: buffer.toString("base64"),
          branch, // optional: commit to a non-default branch if you want
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `GitHub upload failed (${res.status})`);
    }

    // public path you asked for (leading slash)
    const publicPath = `/${filename}`; // e.g. "/1696...-salman.png"
    const rawUrl = `https://raw.githubusercontent.com/${repo}/${branch}/public/${filename}`;

    return NextResponse.json({ path: publicPath, url: rawUrl });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
