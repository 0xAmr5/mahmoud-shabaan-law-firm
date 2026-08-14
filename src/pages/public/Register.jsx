import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  UserPlus, 
  Scale, 
  AlertCircle, 
  RefreshCw, 
  Briefcase, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { authService } from '../../services/authService';

export const Register = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('CLIENT'); // CLIENT أو LAWYER

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    specialization: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('يرجى ملء جميع الحقول الإجبارية');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب ألا تقل عن 6 أحرف');
      return;
    }

    setLoading(true);
    setError('');

    const { user, error: regError } = await authService.register(
      formData.email,
      formData.password,
      {
        name: formData.name,
        phone: formData.phone,
        role: accountType,
        specialization: accountType === 'LAWYER' ? (formData.specialization || 'محامٍ بالاستئناف') : '',
      }
    );

    if (regError) {
      setError(regError);
      setLoading(false);
    } else {
      if (accountType === 'LAWYER') {
        navigate('/lawyer', { replace: true });
      } else {
        navigate('/client-portal', { replace: true });
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 transition-colors duration-300" dir="rtl">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
        
        {/* الهيدر */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
            <Scale className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            إنشاء حساب جديد بالمنظومة
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            اختر نوع الحساب للمتابعة والوصول لبوابتك الإلكترونية
          </p>
        </div>

        {/* التبديل بين نوع الحساب */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAccountType('CLIENT')}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              accountType === 'CLIENT'
                ? 'bg-amber-600 text-white shadow-md font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>حساب موكل</span>
          </button>

          <button
            type="button"
            onClick={() => setAccountType('LAWYER')}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              accountType === 'LAWYER'
                ? 'bg-amber-600 text-white shadow-md font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>حساب محامٍ</span>
          </button>
        </div>

        {/* رسالة الخطأ */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {accountType === 'LAWYER' ? 'اسم المحامي بالكامل *' : 'اسم الموكل بالكامل *'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                required
                placeholder={accountType === 'LAWYER' ? 'مثال: أ. أحمد محمد علي' : 'مثال: أحمد محمد علي'}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">البريد الإلكتروني *</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-right"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">رقم الهاتف (واتساب)</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
              <input
                type="tel"
                placeholder="010xxxxxxxx"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-right"
                dir="ltr"
              />
            </div>
          </div>

          {accountType === 'LAWYER' && (
            <div className="space-y-1 animate-in fade-in">
              <label className="text-xs font-bold text-amber-600 dark:text-amber-500">التخصص والدرجة القضائية</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="مثال: استئناف عالي - قضايا مدنية وجنائية"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">كلمة المرور *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-right"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">تأكيد كلمة المرور *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-right"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black shadow-lg shadow-amber-950/20 cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            <span>{loading ? 'جاري إنشاء الحساب...' : `إنشاء ${accountType === 'LAWYER' ? 'حساب محامٍ' : 'حساب موكل'}`}</span>
          </button>

          <div className="text-center pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span>لديك حساب بالفعل؟ </span>
            <Link to="/login" className="text-amber-600 hover:text-amber-500 font-black">
              تسجيل الدخول
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Register;