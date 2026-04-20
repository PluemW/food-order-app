"use client";
import { useState } from "react";

export default function ChatBox() {
  const [msg, setMsg] = useState("");

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20 }}>
      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="พิมพ์ข้อความ..."
      />
    </div>
  );
}