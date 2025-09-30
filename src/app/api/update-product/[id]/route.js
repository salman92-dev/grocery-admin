import { NextResponse } from "next/server";
import { fetchFile, updateFile } from "@/lib/github";

export async function PUT(req, { params }) {
  try {
    const id = Number(params.id);
    const body = await req.json();

    const fileData = await fetchFile();
    const content = Buffer.from(fileData.content, "base64").toString();
    let products = JSON.parse(content);

    products = products.map((p) => (p.id === id ? { ...p, ...body } : p));

    await updateFile(products, fileData.sha, "Edit product");

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
