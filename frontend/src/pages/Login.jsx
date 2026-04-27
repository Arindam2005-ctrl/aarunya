import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#080e1c] flex items-center justify-center">
      <div className="bg-[#0d1526] border border-blue-900/30 rounded-2xl p-10 w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-blue-400 font-medium text-lg">MarineGuard AI</span>
        </div>
        <h1 className="text-white text-2xl font-semibold mb-1">Sign in</h1>
        <p className="text-slate-500 text-sm mb-6">Maritime risk intelligence platform</p>
        <input className="w-full bg-white/5 border border-blue-900/30 rounded-lg px-4 py-3 text-slate-300 text-sm mb-3 outline-none" placeholder="Email address" type="email" />
        <input className="w-full bg-white/5 border border-blue-900/30 rounded-lg px-4 py-3 text-slate-300 text-sm mb-6 outline-none" placeholder="Password" type="password" />
        <button onClick={() => navigate('/dashboard')} className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-3 text-sm font-medium transition-colors">
          Sign in
        </button>
      </div>
    </div>
  )
}