import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Badge } from '../../components/ui';

export const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: 'كيف يمكنني متابعة مجريات وتطورات قضيتي الجارية مع المكتب؟',
      a: 'بمجرد تسجيل توكيلك مع المكتب، يتم تزويدك بحساب رسمي على بوابة الموكل الإلكترونية عبر الموقع، حيث يمكنك الاطلاع على قرارات الجلسات، التحديثات الزمنية للدفوع، وتحميل صور ومستندات الدعوى مباشرة.'
    },
    {
      q: 'هل يمكنني الحصول على استشارة قانونية دون الحضور للمقر؟',
      a: 'نعم، نوفر خدمة الاستشارات الهاتفية أو عبر محادثات واتساب المباشرة بعد دراسة أوراق ومستندات الموضوع المقدمة من جانبكم.'
    },
    {
      q: 'ما هي المستندات المطلوبة للبدء في تحريك الدعوى القضائية؟',
      a: 'تختلف الأوراق بحسب طبيعة النزاع (عقود، إيصالات، توكيلات، إنذارات رسمية). ويقوم المكتب بفحص أوراقكم وإعداد بيان دقيق بالمستندات الناقصة في الجلسة الاستشارية الأولى.'
    },
    {
      q: 'كيف يتم تقدير وتحديد أتعاب المحاماة؟',
      a: 'تحدد الأتعاب وفقاً لطبيعة النزاع، درجة التقاضي (ابتدائي، استئناف، نقض)، وحجم الجهد والإجراءات اللازمة، وتثبت رسمياً في عقد اتفاق أتعاب يضمن حقوق الطرفين.'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-10 bg-slate-950 text-slate-100" dir="rtl">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <Badge variant="warning" className="text-[11px] px-3 py-1 font-bold">الأسئلة المتكررة</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-white">الأسئلة الشائعة</h1>
        <p className="text-xs sm:text-sm text-slate-400">إجابات توضيحية حول خدمات المكتب وآليات المتابعة القضائية</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            className="bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 cursor-pointer transition-all shadow-md"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openIdx === idx ? 'rotate-180 text-amber-500' : ''}`} />
            </div>
            {openIdx === idx && (
              <p className="mt-4 pt-3 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;