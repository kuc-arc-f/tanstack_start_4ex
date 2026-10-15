import { createFileRoute } from '@tanstack/react-router'
import React, { useState , useEffect } from 'react';
import LibAuth from "../lib/LibAuth"

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  useEffect(() => {
    LibAuth.isValidLogin();
  }, []);

  return (
    <div className="p-2">
      <h3>Welcome Home TODO</h3>
      <hr />
      <button onClick={()=>{LibAuth.logout()}}>[ Logout ]</button>
    </div>
  )
}
