import { NextResponse } from 'next/server';
// import Buffer from 'buffer';/
const repo = process.env.GITHUB_REPO;     // e.g. "salman92-dev/grocery-data"
const file = process.env.GITHUB_FILE;     // e.g. "products.json"
const token = process.env.GITHUB_TOKEN;   // GitHub personal access token

// GET: fetch products.json from GitHub
 export async function GET() {
  try {
    const url = `https://api.github.com/repos/${repo}/contents/${file}`;
    const res = await fetch(url, {
      headers: { Authorization: `token ${token}` },
      cache: 'no-store'
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('GitHub error:', res.status, text);
      return NextResponse.json(
        { error: `GitHub fetch failed (${res.status})` },
        { status: 500 }
      );
    }

    const fileData = await res.json();
    const content = Buffer.from(fileData.content, 'base64').toString();
    const products = JSON.parse(content);

    return NextResponse.json(products);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
