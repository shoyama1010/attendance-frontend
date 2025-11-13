"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    // 👇 DockerのNginxが公開しているポート（8080）を指定！
    fetch("http://localhost:80/api/test")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("API connection failed"));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Laravel API Test
      </h1>
      <p className="text-lg text-blue-600">{message}</p>
    </main>
  );
}
