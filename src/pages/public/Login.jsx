import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserCheck, Lock, LogIn, Scale, AlertCircle, RefreshCw, Eye, EyeOff, Smartphone } from 'lucide-react';
import { authService } from '../../services/authService';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    identifier: '', // بريد أو هاتف
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identifier.trim() || !formData.password) {
      setError('يرجى إدخال البريد الإلكتروني / رقم الهاتف وكلمة المرور');
      return;
    }

    setLoading(true);
    setError('');

    const { user, error: loginError } = await authService.login(formData.identifier, formData.password);

    if (loginError) {
      setError(loginError);
      setLoading(false);
    } else {
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate('/admin', { replace: true });
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 transition-colors duration-300" dir="rtl">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
        
        {/* أيقونة المنظومة */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
            <Scale className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            تسجيل الدخول للمنظومة
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            أدخل البريد الإلكتروني أو رقم الهاتف المسجل للوصول لحسابك
          </p>
        </div>

        {/* رسالة الخطأ */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              البريد الإلكتروني أو رقم الهاتف *
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                required
                placeholder="name@example.com أو 010xxxxxxxx"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-right"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              كلمة المرور *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pr-10 pl-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-right"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-500 dark:text-slate-400">
              <input
                type="checkbox"
                className="rounded border-slate-300 dark:border-slate-800 text-amber-600 focus:ring-amber-500"
              />
              <span>تذكرني</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-amber-600 hover:text-amber-500 font-bold transition-colors"
            >
              نسيت كلمة السر؟
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black shadow-lg shadow-amber-950/20 cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            <span>{loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}</span>
          </button>

          <div className="text-center pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span>ليس لديك حساب بعد؟ </span>
            <Link to="/register" className="text-amber-600 hover:text-amber-500 font-black">
              إنشاء حساب جديد
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Login;