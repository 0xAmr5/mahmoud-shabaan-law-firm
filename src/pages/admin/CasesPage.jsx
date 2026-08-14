import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  UserCheck,
  User,
  Calendar,
  Clock,
  Eye,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui';
import { caseService } from '../../services/caseService';
import { clientService } from '../../services/clientService';
import { lawyerService } from '../../services/lawyerService';

const caseSchema = z.object({
  caseNumber: z.string().min(1, 'رقم القضية مطلوب'),
  title: z.string().min(3, 'عنوان القضية مطلوب'),
  clientId: z.string().min(1, 'يرجى اختيار العميل'),
  lawyerId: z.string().min(1, 'يرجى تعيين المحامي المسؤول'),
  type: z.string().min(1, 'نوع القضية مطلوب'),
  court: z.string().min(2, 'المحكمة والدائرة مطلوبة'),
  priority: z.string().min(1, 'يرجى تحديد الأولوية'),
  description: z.string().optional(),
});

const eventSchema = z.object({
  title: z.string().min(2, 'عنوان التحديث مطلوب'),
  description: z.string().optional(),
  visibility: z.string().min(1, 'تحديد إمكانية الرؤية مطلوب'),
});

export const CasesPage = () => {
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCaseModal, setShowCaseModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  const [searchTerm, setSearchType] = useState('');
  const [actionError, setActionError] = useState(null);

  const {
    register: registerCase,
    handleSubmit: handleSubmitCase,
    reset: resetCase,
    formState: { errors: caseErrors, isSubmitting: caseSubmitting }
  } = useForm({
    resolver: zodResolver(caseSchema),
  });

  const {
    register: registerEvent,
    handleSubmit: handleSubmitEvent,
    reset: resetEvent,
    formState: { errors: eventErrors, isSubmitting: eventSubmitting }
  } = useForm({
    resolver: zodResolver(eventSchema),
  });

  const fetchData = async () => {
    setLoading(true);
    const { data: casesData } = await caseService.getAllCases();
    const { data: clientsData } = await clientService.getAllClients();
    const { data: lawyersData } = await lawyerService.getAllLawyers();

    setCases(casesData || []);
    setClients(clientsData || []);
    setLawyers(lawyersData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCase = async (data) => {
    setActionError(null);
    const client = clients.find((c) => c.id === data.clientId);
    const lawyer = lawyers.find((l) => l.id === data.lawyerId);

    const payload = {
      ...data,
      clientName: client ? client.name : 'غير محدد',
      lawyerName: lawyer ? lawyer.name : 'غير محدد',
    };

    const { error } = await caseService.createCase(payload);
    if (!error) {
      resetCase();
      setShowCaseModal(false);
      fetchData();
    } else {
      setActionError(error || 'حدث خطأ أثناء حفظ القضية');
    }
  };

  const openTimeline = async (cDoc) => {
    setSelectedCase(cDoc);
    setTimelineLoading(true);
    const { data } = await caseService.getCaseTimeline(cDoc.id);
    setTimelineEvents(data || []);
    setTimelineLoading(false);
  };

  const handleAddEvent = async (data) => {
    if (!selectedCase) return;
    const { success } = await caseService.addCaseEvent(selectedCase.id, data);
    if (success) {
      resetEvent();
      setShowEventModal(false);
      openTimeline(selectedCase);
    }
  };

  const filteredCases = cases.filter(
    (c) =>
      c.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'HIGH':
      case 'URGENT':
        return <Badge variant="danger">عاجلة / هامة</Badge>;
      case 'MEDIUM':
        return <Badge variant="warning">متوسطة</Badge>;
      default:
        return <Badge variant="neutral">عادية</Badge>;
    }
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case 'NEW':
        return <Badge variant="info">جديدة</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="warning">قيد النظر</Badge>;
      case 'CLOSED':
        return <Badge variant="success">منتهية</Badge>;
      default:
        return <Badge variant="neutral">{s}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">إدارة القضايا والتحديثات</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            إيجاد القضايا، تعيين المحامين المسؤولين، ومتابعة السجل الزمني (Case Timeline).
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCaseModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          إنشاء ملف قضية جديدة
        </Button>
      </div>

      {/* Filter and Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="بحث برقم القضية، عنوان القضية، أو اسم العميل..."
            value={searchTerm}
            onChange={(e) => setSearchType(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-800 transition-colors"
          />
        </div>
      </Card>

      {/* Cases Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">جاري تحميل القضايا...</div>
      ) : filteredCases.length === 0 ? (
        <Card className="text-center py-12">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">لا توجد قضايا مضافة</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">قم بإنشاء قضية جديدة وتعيين محامٍ وعميل لها.</p>
          <Button variant="outline" size="sm" onClick={() => setShowCaseModal(true)}>
            إنشاء قضية الآن
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((cDoc) => (
            <Card key={cDoc.id} className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 inline-block mb-1">
                      {cDoc.caseNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{cDoc.title}</h3>
                  </div>
                  {getStatusBadge(cDoc.status)}
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>العميل: <strong className="text-slate-800">{cDoc.clientName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>المحامي: <strong className="text-slate-800">{cDoc.lawyerName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>المحكمة: {cDoc.court}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>{getPriorityBadge(cDoc.priority)}</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openTimeline(cDoc)}
                  className="gap-1.5 text-[11px]"
                >
                  <Activity className="w-3.5 h-3.5 text-amber-600" />
                  السجل الزمني (Timeline)
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal 1: Create Case */}
      {showCaseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-xl border border-slate-200 overflow-y-auto max-h-[90vh]" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">إنشاء ملف قضية جديدة</h3>
              <button onClick={() => setShowCaseModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <form onSubmit={handleSubmitCase(handleCreateCase)} className="space-y-4">
              {actionError && (
                <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs">
                  {actionError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="رقم القضية / الدعوى *" placeholder="مثال: 1204 لسنة 2026" error={caseErrors.caseNumber?.message} {...registerCase('caseNumber')} />
                <Input label="نوع القضية *" placeholder="مثال: مدني / جنايات" error={caseErrors.type?.message} {...registerCase('type')} />
              </div>

              <Input label="موضوع / عنوان القضية *" placeholder="مثال: دعوى صحة ونفاذ عقد بيع" error={caseErrors.title?.message} {...registerCase('caseTitle' in caseErrors ? '' : 'title')} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">اختر العميل *</label>
                  <select
                    {...registerCase('clientId')}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-100"
                  >
                    <option value="">حدد العميل...</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {caseErrors.clientId && <p className="mt-1 text-xs text-rose-600">{caseErrors.clientId.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">المحامي المسؤول *</label>
                  <select
                    {...registerCase('lawyerId')}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-100"
                  >
                    <option value="">حدد المحامي...</option>
                    {lawyers.map((l) => (
                      <option key={l.id} value={l.id}>{l.name} - ({l.specialization})</option>
                    ))}
                  </select>
                  {caseErrors.lawyerId && <p className="mt-1 text-xs text-rose-600">{caseErrors.lawyerId.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="المحكمة والدائرة *" placeholder="مثال: محكمة أسيوط الابتدائية - الدائرة 3" error={caseErrors.court?.message} {...registerCase('court')} />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">الأولوية *</label>
                  <select
                    {...registerCase('priority')}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-100"
                  >
                    <option value="MEDIUM">متوسطة</option>
                    <option value="HIGH">عالية</option>
                    <option value="URGENT">عاجلة جداً</option>
                    <option value="LOW">عادية</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <Button type="submit" variant="primary" isLoading={caseSubmitting} className="w-full">
                  حفظ القضية
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCaseModal(false)} className="w-full">
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Case Timeline View */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-xl border border-slate-200 overflow-y-auto max-h-[90vh]" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs text-amber-600 font-bold">{selectedCase.caseNumber}</span>
                <h3 className="text-base font-bold text-slate-900">{selectedCase.title}</h3>
              </div>
              <button onClick={() => setSelectedCase(null)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700">السجل الزمني للتطورات (Case Timeline)</h4>
              <Button variant="primary" size="sm" onClick={() => setShowEventModal(true)} className="gap-1 text-xs">
                <Plus className="w-3.5 h-3.5" />
                إضافة تحديث جديد
              </Button>
            </div>

            {timelineLoading ? (
              <div className="py-8 text-center text-xs text-slate-500">جاري تحميل الأحداث...</div>
            ) : timelineEvents.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                لا توجد تحديثات مسجلة في التايم لاين لهذه القضية حتى الآن.
              </div>
            ) : (
              <div className="relative border-r-2 border-slate-200 mr-3 pr-4 space-y-6">
                {timelineEvents.map((evt) => (
                  <div key={evt.id} className="relative">
                    <div className="absolute -right-[23px] top-1.5 w-3 h-3 rounded-full bg-amber-600 ring-4 ring-white"></div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-slate-900">{evt.title}</h5>
                        <Badge variant={evt.visibility === 'CLIENT_VISIBLE' ? 'success' : 'neutral'} className="text-[9px]">
                          {evt.visibility === 'CLIENT_VISIBLE' ? 'مرئي للعميل' : 'داخلي فقط'}
                        </Badge>
                      </div>
                      {evt.description && <p className="text-xs text-slate-600 leading-relaxed">{evt.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal 3: Add Event to Timeline */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl border border-slate-200" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">إضافة تحديث لـ Timeline القضية</h3>
              <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <form onSubmit={handleSubmitEvent(handleAddEvent)} className="space-y-4">
              <Input label="عنوان التحديث *" placeholder="مثال: تم إيداع مذكرة الدفاع للدائرة" error={eventErrors.title?.message} {...registerEvent('title')} />

              <div className="text-right">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">التفاصيل (اختياري)</label>
                <textarea
                  rows={3}
                  {...registerEvent('description')}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
                  placeholder="ملخص الإجراء الذي تم..."
                ></textarea>
              </div>

              <div className="text-right">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">إمكانية رؤية التحديث *</label>
                <select
                  {...registerEvent('visibility')}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-100"
                >
                  <option value="INTERNAL">داخلي فقط (للمكتب والمحامي)</option>
                  <option value="CLIENT_VISIBLE">مرئي للعميل (يظهر في بوابة العميل)</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <Button type="submit" variant="primary" isLoading={eventSubmitting} className="w-full text-xs">
                  حفظ التحديث
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowEventModal(false)} className="w-full text-xs">
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