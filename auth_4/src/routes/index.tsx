import { createFileRoute , redirect } from '@tanstack/react-router'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import React, { useState , useEffect } from 'react';
import Config from "../config"
import LibAuth from "../lib/LibAuth"

export const Route = createFileRoute('/')({
  /*
  beforeLoad: async () => {
    const session = getCookie(Config.COOKIE_KEY)
    if (!session) {
      throw redirect({
        to: '/login',
      })
    }
  },
  */
  component: Home,
})

function Home() {
  useEffect(() => {
    LibAuth.isValidLogin();
  }, []);

  return (
    <div className="p-2">
      <h3>Welcome Home </h3>
    </div>
  )
}
