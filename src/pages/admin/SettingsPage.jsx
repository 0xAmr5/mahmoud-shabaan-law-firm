import React, { useState } from 'react';
import { Settings, Save, Building, Phone, Mail, MapPin, Globe, CheckCircle2 } from 'lucide-react';
import { Card, Button, Input } from '../../components/ui';
import { OFFICE_INFO } from '../../constants/theme';

export const SettingsPage = () => {
  const [formData, setFormData] = useState({
    name: OFFICE_INFO.name,
    owner: OFFICE_INFO.owner,
    phone: OFFICE_INFO.phone,
    whatsapp: OFFICE_INFO.whatsapp,
    email: OFFICE_INFO.email,
    address: OFFICE_INFO.address,
    workingHours: OFFICE_INFO.workingHours,
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">إعدادات المكتب والمنظومة</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          تعديل البيانات الأساسية للمكتب ومعلومات التواصل التي تظهر في الواجهة العامة وبوابة الموكلين.
        </p>
      </div>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {saved && (
            <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>تم حفظ التغييرات والإعدادات بنجاح.</span>
            </div>
          )}

          <Input
            label="اسم المكتب الرسمى"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="صاحب المكتب / المدير المسؤول"
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="رقم الهاتف"
              dir="ltr"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="رقم الواتساب"
              dir="ltr"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            />
          </div>

          <Input
            label="البريد الإلكتروني"
            dir="ltr"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Input
            label="عنوان المقر الرئيسي"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <Input
            label="مواعيد وساعات العمل"
            value={formData.workingHours}
            onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
          />

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button type="submit" variant="primary" className="gap-2 text-xs">
              <Save className="w-4 h-4" />
              حفظ الإعدادات
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};