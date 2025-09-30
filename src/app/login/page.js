'use client'
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
const Login = () => {
    const [username, setuserName] =useState("");
    const [password, setPassword] =useState("");
    const [error, setError] =useState(null);
    const router = useRouter();
    // static credentials
    const user = "@salman"
    const userpass = "12345678"
    const handleSubmit = async (e)=>{
        e.preventDefault();
        // const res = await fetch("/api/login",{
        //     method : "Post",
        //     headers : {
        //         "content-Type" : "application/json"
        //     },
        //     body : JSON.stringify({username,password})
        // });
        if(username === user && password === userpass){
            router.push("/");
        } else {
            // const data = await res.json();
            setError("invalid credentials");
        }
    };

    return (
        <section>
            <div className="max-w-xl mx-auto">
                <h1>Login</h1>
                <form className="flex flex-col">
                    <label>UserName</label>
                    <input 
                        type="text" 
                        name="user" 
                        autoComplete="true" 
                        id="user" 
                        placeholder="username" 
                        value={username} 
                        onChange={(e)=>{setuserName(e.target.value)}}
                    />
                    <label>Password</label>
                    <input 
                      type="password" 
                      name="password" 
                      autoComplete="true" 
                      id="password" 
                      placeholder="Password" 
                      value={password} 
                      onChange={(e) => {setPassword(e.target.value)}}
                      />
                    <button type="submit" onClick={handleSubmit}>
                        Login
                    </button>
                </form>
                {error && <p className="text-red-500">{error}</p>}
            </div>
        </section>
    )
}
export default Login;