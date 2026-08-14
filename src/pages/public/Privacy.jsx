import React from 'react';
import { Card } from '../../components/ui';

export const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 border-r-4 border-amber-600 pr-3">سياسة الخصوصية</h1>
      <Card className="p-6 text-sm text-slate-700 leading-relaxed space-y-4">
        <p>يلتزم مكتب الأستاذ محمود شعبان داخلي بالحفاظ الكامل على السرية والخصوصية لجميع البيانات والمستندات المقدمة من العملاء.</p>
        <p>لا يتم استخدام بيانات التواصل أو الوثائق الخاصة بالقضايا إلا في أغراض التمثيل القانوني والمتابعة القضائية فقط.</p>
      </Card>
    </div>
  );
};