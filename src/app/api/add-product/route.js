import { NextResponse } from "next/server";
import { fetchFile,updateFile } from "@/lib/github";

export async function POST(req) {
  try {
    const body = await req.json();
    const fileData = await fetchFile();
    const content = Buffer.from(fileData.content, "base64").toString();
    const products = JSON.parse(content);

    const newProduct = { id: Date.now(), ...body };
    products.push(newProduct);

    await updateFile(products, fileData.sha, "Add product");

    return NextResponse.json(newProduct);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
