import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageSquare, CheckCircle2, Send, Scale, Clock, Phone } from 'lucide-react';
import { OFFICE_INFO } from '../../constants/theme';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Badge } from '../../components/ui';

const schema = z.object({
  name: z.string().min(3, 'الاسم يجب ألا يقل عن 3 أحرف'),
  phone: z.string().min(10, 'رقم الهاتف غير صحيح'),
  service: z.string().min(1, 'يرجى اختيار نوع الخدمة'),
  method: z.string().min(1, 'يرجى اختيار طريقة الاستشارة'),
  message: z.string().min(10, 'يرجى كتابة شرح مختصر لا يقل عن 10 أحرف'),
});

export const Consultation = () => {
  const [submittedData, setSubmittedData] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      method: 'حضور بمقر المكتب',
      service: 'الاستشارات القانونية العامة',
    },
  });

  const onSubmit = async (data) => {
    setSubmitError(null);
    try {
      const docRef = await addDoc(collection(db, 'consultations'), {
        ...data,
        status: 'PENDING',
        createdAt: serverTimestamp(),
      });
      setSubmittedData({ ...data, id: docRef.id });
    } catch (err) {
      console.error(err);
      setSubmitError('حدث خطأ أثناء إرسال الطلب، يمكنك التواصل معنا مباشرة عبر واتساب.');
    }
  };

  const getWhatsAppLink = () => {
    if (!submittedData) return `https://wa.me/2${OFFICE_INFO.whatsapp}`;
    const text = `طلب استشارة قانونية:\n- الاسم: ${submittedData.name}\n- الهاتف: ${submittedData.phone}\n- الخدمة: ${submittedData.service}\n- طريقة الاستشارة: ${submittedData.method}\n- التفاصيل: ${submittedData.message}`;
    return `https://wa.me/2${OFFICE_INFO.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-10 bg-slate-950 text-slate-100" dir="rtl">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <Badge variant="warning" className="text-[11px] px-3 py-1 font-bold">حجز موعد</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-white">طلب استشارة قانونية</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          سجل تفاصيل استشارتك وسيتم مراجعتها من قبل الإدارة القانونية وتحديد الموعد فوراً
        </p>
      </div>

      {submittedData ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">تم إرسال طلب استشارتك بنجاح</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              شكراً لك أستاذ {submittedData.name}. يمكنك الآن تأكيد موعدك مباشرة عبر واتساب مع إدارة المكتب.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>تأكيد الطلب عبر واتساب</span>
            </a>
            <button
              onClick={() => setSubmittedData(null)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
            >
              تقديم طلب آخر
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {submitError && (
              <div className="p-3.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold">
                {submitError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block px-1">الاسم بالكامل *</label>
                <input
                  type="text"
                  placeholder="أحمد محمد علي"
                  {...register('name')}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
                {errors.name && <p className="text-[11px] text-rose-400 px-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block px-1">رقم الهاتف *</label>
                <input
                  type="tel"
                  placeholder="010xxxxxxxx"
                  {...register('phone')}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 text-right"
                  dir="ltr"
                />
                {errors.phone && <p className="text-[11px] text-rose-400 px-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block px-1">نوع الخدمة / الموضوع *</label>
                <select
                  {...register('service')}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="الاستشارات القانونية العامة">الاستشارات القانونية العامة</option>
                  <option value="القضايا الجنائية والجنح">القضايا الجنائية والجنح</option>
                  <option value="صياغة ومراجعة العقود">صياغة ومراجعة العقود</option>
                  <option value="قضايا الشركات والاستثمار">قضايا الشركات والاستثمار</option>
                  <option value="قضايا الأحوال الشخصية والتركات">قضايا الأحوال الشخصية والتركات</option>
                  <option value="الدعاوى المدنية والتعويضات">الدعاوى المدنية والتعويضات</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block px-1">طريقة الاستشارة *</label>
                <select
                  {...register('method')}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="حضور بمقر المكتب">حضور في مقر المكتب</option>
                  <option value="استشارة هاتفية">استشارة هاتفية</option>
                  <option value="استشارة عبر واتساب">استشارة عبر واتساب</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block px-1">تفاصيل الاستفسار أو القضية *</label>
              <textarea
                rows={4}
                placeholder="اكتب شرحاً مختصراً عن موضوع الاستشارة والأطراف المعنية..."
                {...register('message')}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
              ></textarea>
              {errors.message && <p className="text-[11px] text-rose-400 px-1">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black shadow-lg shadow-amber-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 -scale-x-100" />
              <span>{isSubmitting ? 'جاري إرسال الطلب...' : 'إرسال طلب الاستشارة'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Consultation;