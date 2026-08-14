import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users, Plus, Phone, Mail, MapPin, CreditCard, MessageSquare, ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui';
import { clientService } from '../../services/clientService';
import { consultationService } from '../../services/consultationService';

const schema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  phone: z.string().min(10, 'رقم الهاتف غير صحيح'),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  nationalId: z.string().optional(),
  address: z.string().optional(),
});

export const ClientsPage = () => {
  const [activeTab, setActiveTab] = useState('clients');
  const [clients, setClients] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [actionError, setActionError] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const fetchData = async () => {
    setLoading(true);
    const { data: clientsData } = await clientService.getAllClients();
    const { data: leadsData } = await consultationService.getAllRequests();
    setClients(clientsData || []);
    setLeads(leadsData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    setActionError(null);
    const { success, error } = await clientService.createClient(data);
    if (success) {
      reset();
      setShowModal(false);
      fetchData();
    } else {
      setActionError(error || 'حدث خطأ أثناء إضافة العميل');
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    await clientService.updateLeadStatus(leadId, newStatus);
    fetchData();
  };

  const handleConvertLead = async (lead) => {
    await clientService.convertLeadToClient(lead);
    fetchData();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">إدارة العلاقات والعملاء (CRM)</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            متابعة سجلات موكلي المكتب والطلبات الجديدة الواردة من الاستشارات.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          إضافة عميل جديد
        </Button>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('clients')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold transition-all border-b-2 ${
            activeTab === 'clients'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          العملاء المقيدون ({clients.length})
        </button>
        <button
          onClick={() => setActiveTab('leads')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold transition-all border-b-2 ${
            activeTab === 'leads'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          طلبات الاستشارات والـ Leads ({leads.length})
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">جاري تحميل البيانات...</div>
      ) : activeTab === 'clients' ? (
        clients.length === 0 ? (
          <Card className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">لا يوجد عملاء مقيدون حالياً</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">أضف عملاءك لتتمكن من ربط القضايا والتوكيلات بهم.</p>
            <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
              تسجيل عميل الآن
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <Card key={client.id} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm border border-slate-200">
                      {client.name ? client.name.charAt(0) : 'ع'}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{client.name}</h3>
                      <span className="text-[11px] text-slate-500 font-medium">عميل مقيد</span>
                    </div>
                  </div>
                  <Badge variant="success">حساب نشط</Badge>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span dir="ltr">{client.phone}</span>
                  </div>
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span dir="ltr">{client.email}</span>
                    </div>
                  )}
                  {client.nationalId && (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      <span>الرقم القومي: {client.nationalId}</span>
                    </div>
                  )}
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg text-xs flex justify-between items-center text-slate-600 border border-slate-100">
                  <span>القضايا المسجلة:</span>
                  <span className="font-bold text-slate-900">{client.activeCasesCount || 0}</span>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        leads.length === 0 ? (
          <Card className="text-center py-12 text-xs text-slate-500">لا توجد طلبات استشارة واردة حالياً.</Card>
        ) : (
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-700 font-bold">
                  <tr>
                    <th className="py-3.5 px-4">اسم العميل</th>
                    <th className="py-3.5 px-4">رقم الهاتف</th>
                    <th className="py-3.5 px-4">التخصص المطلوب</th>
                    <th className="py-3.5 px-4">الموعد والطريقة</th>
                    <th className="py-3.5 px-4">حالة المتابعة</th>
                    <th className="py-3.5 px-4">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{lead.name}</td>
                      <td className="py-3.5 px-4" dir="ltr">{lead.phone}</td>
                      <td className="py-3.5 px-4">{lead.service}</td>
                      <td className="py-3.5 px-4">{lead.date} ({lead.method})</td>
                      <td className="py-3.5 px-4">
                        <select
                          value={lead.status || 'NEW'}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className="bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-800"
                        >
                          <option value="NEW">جديد</option>
                          <option value="CONTACTED">تم التواصل</option>
                          <option value="QUALIFIED">مؤهل</option>
                          <option value="CLOSED">مغلق</option>
                          <option value="CONVERTED" disabled>محول لعميل</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        {lead.status === 'CONVERTED' ? (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            عميل مقيد
                          </Badge>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleConvertLead(lead)}
                            className="text-[11px] py-1 px-2.5 gap-1"
                          >
                            <ArrowLeftRight className="w-3 h-3" />
                            تحويل إلى عميل
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-xl border border-slate-200" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">إضافة عميل جديد</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {actionError && (
                <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs">
                  {actionError}
                </div>
              )}

              <Input label="اسم العميل بالكامل *" error={errors.name?.message} {...register('name')} />
              <Input label="رقم الهاتف *" dir="ltr" error={errors.phone?.message} {...register('phone')} />
              <Input label="البريد الإلكتروني (اختياري)" dir="ltr" error={errors.email?.message} {...register('email')} />
              <Input label="الرقم القومي (اختياري)" dir="ltr" error={errors.nationalId?.message} {...register('nationalId')} />
              <Input label="العنوان (اختياري)" error={errors.address?.message} {...register('address')} />

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
                  تسجيل العميل
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