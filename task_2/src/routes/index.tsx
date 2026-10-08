import { createFileRoute } from '@tanstack/react-router'
import LibAuth from "../lib/LibAuth"
import React, { useState , useEffect } from 'react';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

export default function RouteComponent() {
  useEffect(() => {
    LibAuth.isValidLogin();
  }, []);
  
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <hr />
      <button onClick={()=>{LibAuth.logout()}}>[ Logout ]</button>
    </div>
  )
}
