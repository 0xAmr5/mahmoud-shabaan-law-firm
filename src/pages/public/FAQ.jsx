import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'كيف يمكنني متابعة قضيتي إلكترونياً عبر المنظومة؟',
      a: 'بمجرد توكيل المكتب وتفعيل حسابك، يمكنك تسجيل الدخول إلى "بوابة الموكل الإلكترونية" والاطلاع على رول الجلسات، القرارات الصادرة، ومحادثة المحامي المباشر.',
    },
    {
      q: 'ما هي الأوراق المطلوبة لعمل توكيل رسمي بالقضايا؟',
      a: 'يلزم حضور الموكل بشخصه إلى مكتب الشهر العقاري مع بطاقة الرقم القومي سارية، وطلب عمل توكيل رسمي عام في القضايا باسم الأستاذ / محمود شعبان داخلي.',
    },
    {
      q: 'كم تستغرق مدة دراسة الاستشارة القانونية والرد عليها؟',
      a: 'يتم فحص الاستشارات الواردة عبر الموقع في غضون 24 ساعة كحد أقصى والتواصل مع العميل لتحديد جلسة استشارة تفصيلية.',
    },
    {
      q: 'هل تضمنون سرية الوثائق والمستندات المرفوعة؟',
      a: 'نعم، جميع المستندات تخضع لتشفير سحابي متقدم ولا يمكن لأي طرف ثالث الاطلاع عليها التزاماً بقانون سرية مهنة المحاماة.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8" dir="rtl">
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">الأسئلة الشائعة والإجابات القانونية</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          إليك إجابات وافية على أكثر التساؤلات تكراراً حول إجراءات التوكيل، الجلسات، والخدمات.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-all"
          >
            <button
              onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
              className="w-full p-5 text-right flex items-center justify-between gap-4 cursor-pointer"
            >
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-amber-500 transition-transform duration-200 shrink-0 ${
                  openIdx === i ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIdx === i && (
              <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;