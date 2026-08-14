import React from 'react';
import { Scale, Award, ShieldCheck, Target, Users, BookOpen } from 'lucide-react';
import { OFFICE_INFO } from '../../constants/theme';
import { Badge } from '../../components/ui';

export const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-14 bg-slate-950 text-slate-100" dir="rtl">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="warning" className="text-[11px] px-3 py-1 font-bold">عن المكتب</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-white">{OFFICE_INFO.name}</h1>
        <p className="text-xs sm:text-sm text-slate-400">{OFFICE_INFO.subtitle}</p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6 text-sm text-slate-300 leading-relaxed shadow-xl">
        <h2 className="text-lg font-black text-amber-500 border-r-4 border-amber-500 pr-3">رسالة ورؤية المكتب</h2>
        <p>
          تأسس مكتب الأستاذ محمود شعبان داخلي ليكون صرحاً قانونياً راسخاً يجمع بين الفهم الدقيق لأحكام الشريعة والقانون المصري، وبين الإدارة القضائية الحديثة للدعاوى.
        </p>
        <p>
          نؤمن بأن العدالة تتطلب عملاً دؤوباً وتحضيراً مسبقاً لكل ثغرة أو تفصيل في ملف الدعوى، مع الالتزام الصارم بأخلاقيات مهنة المحاماة وحفظ أسرار الموكلين وتمثيلهم بأعلى درجات الكفاءة والأمانة أمام كافة الهيئات القضائية.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl text-center space-y-3">
          <ShieldCheck className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="font-bold text-white text-sm">السرية والأمان</h3>
          <p className="text-xs text-slate-400">حماية تامة لكافة وثائق وملفات القضايا وسرية الجلسات.</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl text-center space-y-3">
          <Target className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="font-bold text-white text-sm">الدقة والمتابعة</h3>
          <p className="text-xs text-slate-400">متابعة يومية لأجندة الجلسات وإعلام الموكل أولاً بأول.</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl text-center space-y-3">
          <Award className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="font-bold text-white text-sm">الاحترافية الفقهية</h3>
          <p className="text-xs text-slate-400">مذكرات دفاع مؤصلة بأحدث أحكام محكمة النقض والدستورية العليا.</p>
        </div>
      </div>
    </div>
  );
};

export default About;