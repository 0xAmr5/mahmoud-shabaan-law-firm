import React, { useState } from 'react';
import { Scale, Send, CheckCircle2, AlertCircle, RefreshCw, Phone } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const Consultation = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'استشارة مدنية',
    details: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.details.trim()) {
      return alert('يرجى ملء جميع الحقول المطلوبة');
    }

    try {
      setLoading(true);
      await addDoc(collection(db, 'consultations'), {
        ...formData,
        status: 'PENDING',
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setFormData({ name: '', phone: '', email: '', type: 'استشارة مدنية', details: '' });
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إرسال الاستشارة، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8" dir="rtl">
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">طلب استشارة قانونية عاجلة</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          اطرح استفسارك بسرية تامة وسيقوم الفريق القانوني بدراسة الموضوع والرد عليك مباشرة.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs">
        {success ? (
          <div className="text-center py-10 space-y-4 animate-in fade-in">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white">تم استلام طلب الاستشارة بنجاح!</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              شكراً لتواصلك معنا. سيقوم المستشار المسؤول بدراسة التفاصيل والتواصل معك هاتفياً أو عبر الواتساب في أقرب وقت.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-2.5 bg-amber-600 text-white text-xs font-black rounded-xl cursor-pointer"
            >
              إرسال استشارة أخرى
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الاسم بالكامل *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: محمد أحمد"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">رقم الهاتف (واتساب) *</label>
                <input
                  type="tel"
                  required
                  placeholder="010xxxxxxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-right"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">البريد الإلكتروني</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-right"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">نوع الاستشارة</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="استشارة مدنية وعقود">استشارة مدنية وعقود</option>
                  <option value="استشارة جنائية">استشارة جنائية</option>
                  <option value="استشارة أسرية وميراث">استشارة أسرية وميراث</option>
                  <option value="استشارة شركات وأعمال">استشارة شركات وأعمال</option>
                  <option value="قضاء إداري ومجلس دولة">قضاء إداري ومجلس دولة</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">تفاصيل وموضوع الاستشارة *</label>
              <textarea
                rows="4"
                required
                placeholder="اكتب شرحاً موجزاً للمشكلة أو السؤال القانوني..."
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black shadow-lg shadow-amber-950/20 cursor-pointer flex items-center justify-center gap-2 transition-all mt-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{loading ? 'جاري الإرسال...' : 'تأكيد وإرسال الاستشارة'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Consultation;