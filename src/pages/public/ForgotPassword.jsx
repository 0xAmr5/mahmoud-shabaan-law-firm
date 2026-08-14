import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Scale, RefreshCw, KeyRound } from 'lucide-react';
import { authService } from '../../services/authService';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    const { success: isSent, error: err } = await authService.resetPassword(email.trim());

    if (isSent) {
      setSuccess(true);
    } else {
      setError(err || 'تعذر إرسال رابط الاستعادة، يرجى المحاولة لاحقاً.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 transition-colors duration-300" dir="rtl">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
        
        {/* أيقونة الهيدر */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            استعادة كلمة المرور
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            أدخل بريدك الإلكتروني المسجل بالمنظومة وسنرسل لك رابطاً آمناً لتعيين كلمة مرور جديدة فوراً.
          </p>
        </div>

        {/* رسائل التنبيه والخطأ */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-center space-y-3 animate-in fade-in">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
            <h3 className="text-sm font-black">تم إرسال رابط الاستعادة!</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              يرجى مراجعة صندوق الوارد (أو مجلد Spam/الرسائل غير المرغوبة) في بريدك الإلكتروني: 
              <strong className="block text-amber-500 mt-1" dir="ltr">{email}</strong>
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-black text-amber-600 hover:text-amber-500 underline underline-offset-4"
              >
                <span>العودة لتسجيل الدخول</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                البريد الإلكتروني المسجل *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-right"
                  dir="ltr"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black shadow-lg shadow-amber-950/20 cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              <span>{loading ? 'جاري إرسال الرابط...' : 'إرسال رابط الاستعادة'}</span>
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <span>تذكرت كلمة المرور؟ العودة لتسجيل الدخول</span>
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;