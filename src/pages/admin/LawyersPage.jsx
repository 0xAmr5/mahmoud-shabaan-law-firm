import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserCheck, Plus, Phone, Mail, Briefcase, CheckSquare, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui';
import { lawyerService } from '../../services/lawyerService';

const schema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().min(10, 'رقم الهاتف غير صحيح'),
  specialization: z.string().min(2, 'يرجى تحديد التخصص القانوني'),
  password: z.string().min(6, 'كلمة السر الأولية يجب ألا تقل عن 6 أحرف'),
});

export const LawyersPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [actionError, setActionError] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const fetchLawyers = async () => {
    setLoading(true);
    const { data } = await lawyerService.getAllLawyers();
    setLawyers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLawyers();
  }, []);

  const onSubmit = async (data) => {
    setActionError(null);
    const { success, error } = await lawyerService.createLawyer(data);
    if (success) {
      reset();
      setShowModal(false);
      fetchLawyers();
    } else {
      setActionError(error || 'حدث خطأ أثناء إضافة المحامي');
    }
  };

  const handleToggleStatus = async (lawyerId, status) => {
    await lawyerService.toggleLawyerStatus(lawyerId, status);
    fetchLawyers();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">إدارة فريق المحامين بالمكتب</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            متابعة حسابات المحامين وتوزيع ضغط العمل والقضايا المسندة.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          إضافة محامٍ جديد
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">جاري تحميل قائمة المحامين...</div>
      ) : lawyers.length === 0 ? (
        <Card className="text-center py-12">
          <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">لا يوجد محامون مضافون حالياً</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">قم بإضافة أول محامٍ للفريق للبدء في توزيع القضايا والمهام.</p>
          <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
            إضافة محامٍ الآن
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lawyers.map((lawyer) => (
            <Card key={lawyer.id} className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-500 flex items-center justify-center font-bold text-sm">
                    {lawyer.name ? lawyer.name.charAt(0) : 'م'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{lawyer.name}</h3>
                    <span className="text-xs text-amber-700 font-medium block">{lawyer.specialization}</span>
                  </div>
                </div>
                <Badge variant={lawyer.status === 'ACTIVE' ? 'success' : 'danger'}>
                  {lawyer.status === 'ACTIVE' ? 'نشط' : 'معطل'}
                </Badge>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span dir="ltr">{lawyer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span dir="ltr">{lawyer.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg text-center text-xs border border-slate-100">
                <div>
                  <span className="text-slate-500 text-[10px] block">القضايا النشطة</span>
                  <span className="font-bold text-slate-900 text-sm">{lawyer.activeCasesCount || 0}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">المهام القائمة</span>
                  <span className="font-bold text-slate-900 text-sm">{lawyer.pendingTasksCount || 0}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  variant={lawyer.status === 'ACTIVE' ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => handleToggleStatus(lawyer.id, lawyer.status)}
                  className="w-full text-xs"
                >
                  {lawyer.status === 'ACTIVE' ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-xl border border-slate-200" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">إضافة محامٍ جديد للسيستم</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {actionError && (
                <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs">
                  {actionError}
                </div>
              )}

              <Input label="الاسم بالكامل *" error={errors.name?.message} {...register('name')} />
              <Input label="التخصص القانوني *" placeholder="مثال: قضايا جنائية ومدنية" error={errors.specialization?.message} {...register('specialization')} />
              <Input label="رقم الهاتف *" dir="ltr" error={errors.phone?.message} {...register('phone')} />
              <Input label="البريد الإلكتروني *" dir="ltr" error={errors.email?.message} {...register('email')} />
              <Input label="كلمة السر الأولية *" type="password" dir="ltr" error={errors.password?.message} {...register('password')} />

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
                  حفظ وتفعيل الحساب
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="w-full">
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};