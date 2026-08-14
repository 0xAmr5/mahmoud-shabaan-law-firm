import React from 'react';
import { Card } from '../../components/ui';

export const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 border-r-4 border-amber-600 pr-3">الشروط والأحكام</h1>
      <Card className="p-6 text-sm text-slate-700 leading-relaxed space-y-4">
        <p>تستخدم هذه المنصة بغرض تقديم الخدمات القانونية المعتمدة وتسهيل المتابعة للعملاء المكتتبين ببيانات رسمية.</p>
        <p>الاستشارات المقدمة تعتمد على دقة البيانات والمعلومات المزودة من جانب العميل.</p>
      </Card>
    </div>
  );
};