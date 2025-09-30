import { NextResponse } from "next/server";
import { fetchFile, updateFile, deleteFile } from "@/lib/github"; // ✅ add deleteFile helper

export async function DELETE(req, { params }) {
  try {
    const id = Number(params.id);

    // Fetch products file
    const fileData = await fetchFile();
    const content = Buffer.from(fileData.content, "base64").toString();
    let products = JSON.parse(content);

    // Find product to delete
    const productToDelete = products.find((p) => p.id === id);
    if (!productToDelete) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Remove product from array
    products = products.filter((p) => p.id !== id);

    // ✅ Delete image file from GitHub if it exists
    if (productToDelete.image) {
      // Example: https://raw.githubusercontent.com/username/repo/branch/public/uploads/abc.png
      // → extract path after /public/
      const imageUrl = productToDelete.image;
      const match = imageUrl.match(/\/public\/(.*)$/);
      if (match) {
        const imagePath = `public/${match[1]}`;
        try {
          await deleteFile(imagePath, "Delete product image");
        } catch (err) {
          console.error("⚠️ Failed to delete image:", err.message);
        }
      }
    }

    // Update products.json file
    await updateFile(products, fileData.sha, "Delete product");

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
