import { createFileRoute } from '@tanstack/react-router'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import { fetchPosts, loginPost , deletePost , getUserPost } from '../utils/login'
import Config from "../config"
import LibAuth from "../lib/LibAuth"

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    // 実際のログイン処理はここに実装します
    console.log('ログイン試行:', { email, password });
    const sendData = {
      email: email,
      password: password,
    }
    try{
      const resp = await loginPost({ data: sendData })
      console.log(resp)
      //
      if(resp.ret >= 200 && resp.ret <= 209){
        //set-cookie   Config.COOKIE_KEY_UID
        const userGet = {
          email: email,
        }
        const res2 = await getUserPost({data:userGet })
        console.log(res2.data)
        if(res2.data && res2.data.data){
          const j1 = res2.data.data[0]
          console.log("uid=", j1.id)
          LibAuth.setCookie(Config.COOKIE_KEY_UID, j1.id, 30)
          setTimeout(() => {
            location.href = "/";
          }, 500);          
        }
      }
      else{
        if(resp.ret >= 400 && resp.ret <= 409){ alert("Error , email or password") }
        else{  alert("Error , Internal Server Error")}
      }

    }catch(e){console.log(e)}
    return;    
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Login</h1>
          <p className="text-neutral-500 text-sm">アカウントにログインしてください</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* メールアドレス入力 */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700" htmlFor="email">
              メールアドレス
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                id="email"
                type="email"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 sm:text-sm transition-colors outline-none"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* パスワード入力 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-neutral-700" htmlFor="password">
                パスワード
              </label>
              {/*
              <a href="#" className="text-sm font-medium text-neutral-900 hover:underline">
                お忘れですか？
              </a>
              */}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                id="password"
                type="password"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 sm:text-sm transition-colors outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* ログインボタン */}
          <button
            type="submit"
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 transition-colors mt-2"
          >
            <LogIn className="h-4 w-4 mr-2" />
            ログイン
          </button>
        </form>

        {/* text-lg */}
        <div className="mt-8 text-center  text-neutral-500">
          アカウントをお持ちでないですか？{' '}
          <a href="/signup" className="font-medium text-lg text-neutral-900 hover:underline">
            [ Signup ]
          </a>
        </div>
      </div>
    </div>
  );
}
