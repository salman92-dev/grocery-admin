const repo = process.env.GITHUB_REPO;   // e.g. "salman92-dev/grocery-data"
const file = process.env.GITHUB_FILE;   // e.g. "products.json"
const token = process.env.GITHUB_TOKEN; // GitHub PAT
const branch = process.env.GITHUB_BRANCH || "main"; // default branch

// ✅ Fetch products.json
export async function fetchFile() {
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${file}`, {
    headers: { Authorization: `token ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch file");
  return res.json();
}

// ✅ Update products.json
export async function updateFile(newData, sha, message = "update products") {
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${file}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(JSON.stringify(newData, null, 2)).toString("base64"),
      sha,
      branch,
    }),
  });
  if (!res.ok) throw new Error("Failed to update file");
  return res.json();
}

// ✅ Delete any file (e.g. uploaded image)
export async function deleteFile(path, message = "delete file") {
  const sha = await getFileSha(path);

  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: "DELETE",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      sha,
      branch,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete file from GitHub");
  }

  return res.json();
}

// ✅ Helper: get SHA of a file before deletion
async function getFileSha(path) {
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`, {
    headers: { Authorization: `token ${token}` },
  });

  if (!res.ok) throw new Error("Failed to get file SHA");
  const data = await res.json();
  return data.sha;
}
