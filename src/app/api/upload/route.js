
// ----------
// 14) app/api/upload/route.ts – Image upload (Cloudinary or GitHub)
// ----------
import { NextRequest, NextResponse } from 'next/server';

// Choose one mode via .env.local
// UPLOAD_MODE=cloudinary  (recommended)
//   CLOUDINARY_CLOUD_NAME=xxxx
//   CLOUDINARY_UPLOAD_PRESET=unsigned_preset   // or handle signed on server if you prefer
// UPLOAD_MODE=github
//   (reuses GITHUB_* envs) and commits to images/<timestamp>-<name>

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const mode = process.env.UPLOAD_MODE || 'cloudinary';

    if (mode === 'cloudinary') {
      const cloud = process.env.CLOUDINARY_CLOUD_NAME;
      const preset = process.env.CLOUDINARY_UPLOAD_PRESET;
      if (!cloud || !preset) throw new Error('Cloudinary env not set');

      const f = new FormData();
      f.set('file', new Blob([await file.arrayBuffer()], { type: file.type }), file.name);
      f.set('upload_preset', preset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body: f });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Cloudinary upload failed');
      return NextResponse.json({ url: data.secure_url });
    }

    // mode === 'github'
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';
    const token = process.env.GITHUB_TOKEN;

    const bytes = new Uint8Array(await file.arrayBuffer());
    const base64 = Buffer.from(bytes).toString('base64');
    const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const path = `images/${Date.now()}-${safeName}`;

    const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        message: `feat(images): add ${safeName}`,
        content: base64,
        branch
      })
    });
    const ghData = await ghRes.json();
    if (!ghRes.ok) throw new Error(ghData?.message || 'GitHub upload failed');

    // Use jsDelivr for CDN-style raw file access
    const url = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${path}`;
    return NextResponse.json({ url });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
