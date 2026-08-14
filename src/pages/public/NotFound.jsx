import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui';

export const NotFound = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <h1 className="text-6xl font-black text-amber-600">404</h1>
      <h2 className="text-xl font-bold text-slate-900">الصفحة غير موجودة</h2>
      <p className="text-xs text-slate-600">عفواً، الرابط الذي تحاول الوصول إليه غير موجود أو تم تحريكه.</p>
      <Link to="/" className="inline-block pt-2">
        <Button variant="primary">العودة للرئيسية</Button>
      </Link>
    </div>
  );
};