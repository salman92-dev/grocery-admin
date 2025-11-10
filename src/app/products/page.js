'use client'
import { useState,useEffect } from "react";

export default function ProductPage() {
  const [status, setStatus] = useState(null)
  const [data, setData] =useState([])
 
  useEffect(() =>{
    const fetchdata = async () =>{
      try{
        if(!navigator.online){
          setStatus(500);
        }
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
          setStatus(res.status);
          // if (!res.ok) {
          //   throw new Error("Failed to fetch data from GitHub");
          // }
          const file = await res.json();

            // GitHub API gives base64 encoded content
            const content = Buffer.from(file.content, "base64").toString("utf-8");
            const products = JSON.parse(content);
            setData(products);
          }
          catch(err){
            console.log(err)
          }
          }
          fetchdata();
      },[])

if(status === 500){
  return(
    <div>
      failed to fetch data
    </div>
  )
}
if(status=== 200){
 return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <ul className="space-y-2">
        {data.map((p, i) => (
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
 
}
