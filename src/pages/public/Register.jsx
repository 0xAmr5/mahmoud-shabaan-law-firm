import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Scale,
  Mail,
  Lock,
  User,
  Phone,
  UserPlus,
  Briefcase,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { OFFICE_INFO } from '../../constants/theme';

export const Register = () => {
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState('CLIENT'); // 'CLIENT' أو 'LAWYER'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('كلمتا المرور غير متطابقتين.');
    }
    if (formData.password.length < 6) {
      return setError('كلمة المرور يجب ألا تقل عن 6 أحرف أو أرقام.');
    }
    if (accountType === 'LAWYER' && !formData.specialization.trim()) {
      return setError('يرجى تحديد التخصص القانوني للمحامي.');
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim().toLowerCase(),
        formData.password
      );
      const uid = userCredential.user.uid;

      const userProfile = {
        uid: uid,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        role: accountType,
        status: 'ACTIVE',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (accountType === 'LAWYER') {
        userProfile.specialization = formData.specialization.trim();
        userProfile.activeCasesCount = 0;
        userProfile.pendingTasksCount = 0;
      }

      await setDoc(doc(db, 'users', uid), userProfile);

      if (accountType === 'LAWYER') {
        navigate('/lawyer', { replace: true });
      } else {
        navigate('/client-portal', { replace: true });
      }
    } catch (err) {
      console.error('Register error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('هذا البريد الإلكتروني مسجل به حساب بالفعل.');
      } else if (err.code === 'auth/invalid-email') {
        setError('صيغة البريد الإلكتروني غير صحيحة.');
      } else if (err.code === 'auth/weak-password') {
        setError('كلمة المرور ضعيفة جداً.');
      } else {
        setError('حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-950 p-4 sm:p-6" dir="rtl">
      <div className="w-full max-w-lg p-6 sm:p-10 space-y-6 bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl relative text-white">
        
        {/* الرأس */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner group-hover:scale-105 transition-transform">
              <Scale className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            إنشاء حساب جديد بالمنظومة
          </h1>
          <p className="text-xs text-slate-400">
            {OFFICE_INFO?.name || 'مكتب المحاماة والاستشارات القانونية'}
          </p>
        </div>

        {/* اختيار نوع الحساب */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setAccountType('CLIENT')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              accountType === 'CLIENT'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>حساب موكل</span>
          </button>
          <button
            type="button"
            onClick={() => setAccountType('LAWYER')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              accountType === 'LAWYER'
                ? 'bg-slate-800 text-amber-400 border border-slate-700 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>محامٍ بالمكتب</span>
          </button>
        </div>

        {/* رسالة الخطأ */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* نموذج التسجيل */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block px-1">
              {accountType === 'LAWYER' ? 'اسم المحامي بالكامل *' : 'اسم الموكل بالكامل *'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute right-4 top-3.5 text-slate-500" />
              <input
                type="text"
                required
                placeholder={accountType === 'LAWYER' ? 'أ. أحمد محمود علي' : 'أحمد محمد علي'}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={loading}
                className="w-full pr-11 pl-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {accountType === 'LAWYER' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-amber-400 block px-1">
                التخصص القانوني والدرجة القضائية *
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 absolute right-4 top-3.5 text-amber-500" />
                <input
                  type="text"
                  required
                  placeholder="مثال: محامٍ بالاستئناف - قضايا مدنية وجنائية"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  disabled={loading}
                  className="w-full pr-11 pl-4 py-2.5 bg-slate-950 border border-amber-500/40 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block px-1">البريد الإلكتروني *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute right-4 top-3.5 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="example@mail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading}
                  className="w-full pr-11 pl-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 text-right"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block px-1">رقم الهاتف *</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute right-4 top-3.5 text-slate-500" />
                <input
                  type="tel"
                  required
                  placeholder="010xxxxxxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={loading}
                  className="w-full pr-11 pl-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 text-right"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block px-1">كلمة المرور *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute right-4 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={loading}
                  className="w-full pr-10 pl-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block px-1">تأكيد كلمة المرور *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute right-4 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  disabled={loading}
                  className="w-full pr-10 pl-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-950/50 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري إنشاء الحساب والتفعيل...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{accountType === 'LAWYER' ? 'تسجيل وتفعيل حساب محامٍ' : 'إنشاء حساب موكل جديد'}</span>
              </>
            )}
          </button>
        </form>

        {/* الفوتر */}
        <div className="border-t border-slate-800/80 pt-4 space-y-2 text-center">
          <p className="text-xs text-slate-400">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-amber-500 hover:text-amber-400 font-black underline underline-offset-4">
              تسجيل الدخول
            </Link>
          </p>

          <div className="pt-1">
            <Link to="/" className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300 font-medium">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة للصفحة الرئيسية</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;