import Image from "next/image";
import React from "react";


export default function Home() {
  return (
    <>
        <h1>Home</h1>
        <Image src="/logo.webp" alt="logo" height={200} width={400} />
    </>
  )
}
