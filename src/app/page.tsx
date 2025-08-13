"use client";

import { signOut } from "next-auth/react";

export default function App() {
  return (
    <>
      <h1>Hello World</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </>
  );
}
