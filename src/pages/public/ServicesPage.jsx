import React from 'react';
import { Link } from 'react-router-dom';
import { Gavel, FileSignature, Briefcase, MessageSquare, Scale, ShieldCheck, ChevronLeft } from 'lucide-react';
import { Badge } from '../../components/ui';

export const ServicesPage = () => {
  const services = [
    {
      icon: Gavel,
      title: 'القضايا الجنائية والجنح',
      desc: 'تمثيل ودفاع متخصص أمام محاكم الجنايات والجنح الاقتصادية، وإعداد مذكرات الطعن بالنقض وفق الضوابط الإجرائية الدقيقة.',
      tag: 'جنائي ونقض',
    },
    {
      icon: FileSignature,
      title: 'صياغة وتوثيق العقود والاتفاقيات',
      desc: 'صياغة ومراجعة كافة العقود المدنية والتجارية، وعقود البيع والإيجار والشركات بما يقطع دابر النزاع المستقبلي.',
      tag: 'عقود وتوثيق',
    },
    {
      icon: Briefcase,
      title: 'الشركات والاستثمار التجاري',
      desc: 'تأسيس الكيانات التجارية والشركات بمختلف أنواعها، التمثيل في هيئات التحكيم، وتسوية المنازعات التجارية وحماية العلامات.',
      tag: 'استثمار وشركات',
    },
    {
      icon: MessageSquare,
      title: 'قضايا الأحوال الشخصية والتركات',
      desc: 'متابعة دعاوى الأسرة، توثيق إعلام الوراثة، قسمة التركات الرضائية والقضائية، وحضانة الأطفال والولاية في سرية تامة.',
      tag: 'أسرة وتركات',
    },
    {
      icon: Scale,
      title: 'الدعاوى المدنية والتعويضات',
      desc: 'المطالبة بالحقوق ومنازعات الملكية العقارية، دعاوى صحة ونفاذ العقود، والتعويضات الجابرة للأضرار المادية والمعنوية.',
      tag: 'مدني وتعويضات',
    },
    {
      icon: ShieldCheck,
      title: 'الاستشارات الوقائية الشاملة',
      desc: 'فحص ودراسة الموقف القانوني المسبق قبل إبرام الصفقات أو التصرفات لتلافي الثغرات القانونية وحماية مصالح العميل استباقياً.',
      tag: 'وقائي واستراتيجي',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-14 bg-slate-950 text-slate-100" dir="rtl">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="warning" className="text-[11px] px-3 py-1 font-bold">الخدمات التخصصية</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-white">الخدمات القانونية والمرافعات</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          تغطية تخصصية متكاملة لجميع أفرع القانون المصري بدقة واحترافية عالية
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc, idx) => {
          const Icon = svc.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 p-7 rounded-3xl transition-all duration-300 group space-y-5 hover:bg-slate-900/90 flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-inner">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/60">
                    {svc.tag}
                  </span>
                </div>
                <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors">
                  {svc.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{svc.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/60">
                <Link
                  to="/consultation"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-400 group-hover:translate-x-[-4px] transition-all"
                >
                  <span>طلب استشارة في هذه الخدمة</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesPage;