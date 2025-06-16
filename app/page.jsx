"use client";
import Link from "next/link";
import React, { useState } from "react";

const page = () => {
  const [id, setId] = useState("");

  return (
    <div className="h-[100vh] flex flex-col gap-20 justify-center items-center text-5xl font-mono">
      Lets Play!
      <div className="flex flex-col gap-5 items-center">
        <input
          className="bg-gray-900 rounded-2xl text-center"
          type="text"
          onChange={(e) => setId(e.target.value)}
        />
        <Link href={`https://zerocross.vercel.app/${id}`}>GO</Link>
      </div>
    </div>
  );
};

export default page;
