import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Scale, Mail, Lock, LogIn, AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react';
import { authService } from '../../services/authService';
import { OFFICE_INFO } from '../../constants/theme';

export const Login = () => {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanId = identifier.trim();

    if (!cleanId || !password) {
      return setError('يرجى إدخال البريد الإلكتروني أو رقم الهاتف وكلمة المرور');
    }

    try {
      setError('');
      setLoading(true);

      const { user, profile, error: loginError } = await authService.loginWithEmailOrPhone(cleanId, password);

      if (loginError || !user) {
        return setError(loginError || 'بيانات الدخول غير صحيحة.');
      }

      const role = (profile?.role || 'CLIENT').toString().trim().toUpperCase();

      if (role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (role === 'LAWYER') {
        navigate('/lawyer', { replace: true });
      } else {
        navigate('/client-portal', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-950 p-4 sm:p-6" dir="rtl">
      <div className="w-full max-w-md p-8 sm:p-10 space-y-8 bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl relative overflow-hidden text-white">
        
        {/* الهيدر */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner group-hover:scale-105 transition-transform">
              <Scale className="w-8 h-8" />
            </div>
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            تسجيل الدخول - {OFFICE_INFO?.name || 'مكتب المحاماة'}
          </h1>
          <p className="text-xs text-slate-400">
            أدخل البريد الإلكتروني أو رقم الهاتف وكلمة المرور
          </p>
        </div>

        {/* رسالة الخطأ */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block px-1">
              البريد الإلكتروني أو رقم الهاتف
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute right-4 top-3.5 text-slate-500" />
              <input
                type="text"
                required
                placeholder="example@mail.com أو 010xxxxxxxx"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={loading}
                className="w-full pr-11 pl-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-60 text-right"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block px-1">كلمة المرور</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute right-4 top-3.5 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full pr-11 pl-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-60"
                dir="ltr"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-950/50 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري التحقق...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول</span>
              </>
            )}
          </button>
        </form>

        {/* الفوتر */}
        <div className="border-t border-slate-800/80 pt-6 space-y-3 text-center">
          <p className="text-xs text-slate-400">
            ليس لديك حساب بعد؟{' '}
            <Link to="/register" className="text-amber-500 hover:text-amber-400 font-bold underline underline-offset-4">
              إنشاء حساب جديد
            </Link>
          </p>

          <div>
            <Link to="/" className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-400 font-medium">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة للصفحة الرئيسية</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;