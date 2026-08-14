import React from 'react';
import { Scale, Award, BookOpen, Target, CheckCircle2 } from 'lucide-react';
import { OFFICE_INFO } from '../../constants/theme';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
          عن مكتب الأستاذ / محمود شعبان داخلي
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          منظومة قانونية رائدة قائمة على الخبرة، الدقة في صياغة الدفوع، والريادة في حل النزاعات القضائية المعقدة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">رؤيتنا ورسالتنا القانونية</h2>
              <span className="text-xs text-amber-500 font-bold">العدالة والحماية القانونية المتكاملة</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            نسعى لتقديم أعلى مستويات الاستشارات القانونية والترافع أمام المحاكم بمختلف درجاتها، مع التركيز على الابتكار في استراتيجيات الدفاع وحماية مصالح موكلينا بكل حزم وأمانة.
          </p>
          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>إعداد مذكرات الدفاع والطعون بالنقض والاستئناف.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>صياغة وتوثيق العقود التجارية والمدنية بدقة بالغة.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>التمثيل القانوني للشركات والأفراد أمام الهيئات الرسمية.</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white space-y-6 shadow-xl">
          <h3 className="text-lg font-black text-amber-400">قيم العمل والالتزام المهني</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            نؤمن بأن مهنة المحاماة هي رسالة عدالة مقدسة، ولذلك نلتزم بأعلى معايير النزاهة والشفافية مع الموكلين، وتقديم تقارير دورية وواضحة عن مسار كل قضية.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div>
              <span className="text-2xl font-black text-amber-500 block">+15</span>
              <span className="text-[11px] text-slate-400">عاماً من الخبرة القضائية</span>
            </div>
            <div>
              <span className="text-2xl font-black text-amber-500 block">100%</span>
              <span className="text-[11px] text-slate-400">التزام وسرية مطلقة</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;