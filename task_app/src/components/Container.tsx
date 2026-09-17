import React, { useState } from 'react';
import { Home, Settings, Search, UserCircle, X } from 'lucide-react';
//import {Link, Route, Routes } from 'react-router-dom';
import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

function Container({ children }) {
  return (
  <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
    <header className="bg-white border-b border-gray-200 h-12 flex items-center justify-center font-medium text-gray-700">
      <Link to="/">Home</Link>
    </header>   
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col overflow-y-auto hidden md:flex shrink-0">
        <div className="p-4 flex items-center gap-2 text-lg font-bold text-gray-900">
          <Home className="text-blue-600" size={20} />
          <h2>home</h2>
        </div>
        
        <div className="flex-1 py-4">
          <div className="text-xs text-gray-400 mb-2 px-4 uppercase tracking-wider">Main Menu</div>
          <nav className="space-y-1 px-3">
            {/* bg-blue-600 text-white  */}
            <Link to="/task_item" className="flex items-center gap-3 px-3 py-2.5 bg-blue-100 hover:bg-gray-100 rounded-md">
              <Home size={18} />
              <span className="font-medium text-sm">Dashboard</span>
            </Link>
            <Link to="/gantt" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-md">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-600 ml-1.5"></div>
              <span className="text-sm">Gantt</span>
            </Link>
          </nav>

          <div className="text-xs text-gray-400 mt-8 mb-2 px-4 uppercase tracking-wider">Preferences</div>
          <nav className="space-y-1 px-3">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-md">
              <Settings size={18} />
              <span className="text-sm">Settings</span>
            </a>
          </nav>
        </div>
      </aside>
      {/* Main Content */}  
      {children}
    </div> 
  </div>
  )
}
export default Container;

