// src/app/product/page.js

export default async function ProductPage() {
  const res = await fetch(
    "https://api.github.com/repos/salman92-dev/grocery-data/contents/products.json",
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store", // disable caching, always fresh (like getServerSideProps)
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data from GitHub");
  }

  const file = await res.json();

  // GitHub API gives base64 encoded content
  const content = Buffer.from(file.content, "base64").toString("utf-8");
  const products = JSON.parse(content);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <ul className="space-y-2">
        {products.map((p, i) => (
          <li key={i} className="p-2 border rounded">
            {p.name} – ${p.price} - {p.category}
            <br />
            <img src={p.image} alt={p.name} className="h-16 mt-1" />
          </li>
        ))}
      </ul>
    </main>
  );
}
