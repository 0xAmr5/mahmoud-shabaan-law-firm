import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarCheck, Plus, Clock, Scale, UserCheck, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui';
import { hearingService } from '../../services/hearingService';
import { caseService } from '../../services/caseService';
import { lawyerService } from '../../services/lawyerService';

const hearingSchema = z.object({
  caseId: z.string().min(1, 'يرجى اختيار القضية'),
  court: z.string().min(2, 'المحكمة والدائرة مطلوبة'),
  date: z.string().min(1, 'تاريخ الجلسة مطلوب'),
  time: z.string().min(1, 'وقت الجلسة مطلوب'),
  lawyerId: z.string().min(1, 'يرجى اختيار المحامي الحاضر'),
});

const decisionSchema = z.object({
  decision: z.string().min(2, 'قرار المحكمة مطلوب'),
  nextHearingDate: z.string().optional(),
});

export const HearingsPage = () => {
  const [hearings, setHearings] = useState([]);
  const [cases, setCases] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowCaseModal] = useState(false);
  const [selectedHearing, setSelectedHearing] = useState(null);
  const [actionError, setActionError] = useState(null);

  const {
    register: registerHearing,
    handleSubmit: handleSubmitHearing,
    reset: resetHearing,
    formState: { errors: hearingErrors, isSubmitting: hearingSubmitting }
  } = useForm({
    resolver: zodResolver(hearingSchema),
  });

  const {
    register: registerDecision,
    handleSubmit: handleSubmitDecision,
    reset: resetDecision,
    formState: { errors: decisionErrors, isSubmitting: decisionSubmitting }
  } = useForm({
    resolver: zodResolver(decisionSchema),
  });

  const fetchData = async () => {
    setLoading(true);
    const { data: hearingsData } = await hearingService.getAllHearings();
    const { data: casesData } = await caseService.getAllCases();
    const { data: lawyersData } = await lawyerService.getAllLawyers();

    setHearings(hearingsData || []);
    setCases(casesData || []);
    setLawyers(lawyersData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddHearing = async (data) => {
    setActionError(null);
    const selectedCase = cases.find((c) => c.id === data.caseId);
    const selectedLawyer = lawyers.find((l) => l.id === data.lawyerId);

    const payload = {
      ...data,
      caseNumber: selectedCase ? selectedCase.caseNumber : '',
      caseTitle: selectedCase ? selectedCase.title : '',
      clientId: selectedCase ? selectedCase.clientId : '',
      clientName: selectedCase ? selectedCase.clientName : '',
      lawyerName: selectedLawyer ? selectedLawyer.name : '',
    };

    const { error } = await hearingService.addHearing(payload);
    if (!error) {
      resetHearing();
      setShowCaseModal(false);
      fetchData();
    } else {
      setActionError(error || 'حدث خطأ أثناء إضافة الجلسة');
    }
  };

  const handleSaveDecision = async (data) => {
    if (!selectedHearing) return;
    const { success } = await hearingService.updateHearingDecision(selectedHearing.id, {
      ...data,
      caseId: selectedHearing.caseId,
      caseNumber: selectedHearing.caseNumber,
      caseTitle: selectedHearing.caseTitle,
      court: selectedHearing.court,
      lawyerId: selectedHearing.lawyerId,
      lawyerName: selectedHearing.lawyerName,
      clientId: selectedHearing.clientId,
      clientName: selectedHearing.clientName,
    });

    if (success) {
      resetDecision();
      setSelectedHearing(null);
      fetchData();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">أجندة الجلسات القضائية</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            جدول ومواعيد الجلسات بالمحاكم وتسجيل القرارات والتأجيلات.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCaseModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          إضافة جلسة جديدة
        </Button>
      </div>

      {/* Grid or List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">جاري تحميل أجنـدة الجلسات...</div>
      ) : hearings.length === 0 ? (
        <Card className="text-center py-12">
          <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">لا توجد جلسات مسجلة بالأجندة</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">قم بإضافة مواعيد الجلسات القادمة لمتابعتها وإسناد المحامين.</p>
          <Button variant="outline" size="sm" onClick={() => setShowCaseModal(true)}>
            إضافة جلسة الآن
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hearings.map((h) => (
            <Card key={h.id} className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 inline-block mb-1">
                      {h.caseNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{h.caseTitle}</h3>
                  </div>
                  <Badge variant={h.status === 'COMPLETED' ? 'success' : 'warning'}>
                    {h.status === 'COMPLETED' ? 'تمت' : 'قادمة'}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Scale className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>المحكمة: <strong>{h.court}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>التاريخ والوقت: <strong className="text-slate-900">{h.date} ({h.time})</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>المحامي الحاضر: {h.lawyerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>العميل: {h.clientName}</span>
                  </div>
                </div>

                {h.decision && (
                  <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 border border-slate-100">
                    <span className="font-bold text-slate-900 block">القرار الصادر:</span>
                    <p className="text-slate-700 leading-relaxed">{h.decision}</p>
                    {h.nextHearingDate && (
                      <span className="text-emerald-600 font-bold block pt-1">
                        تأجلت لجلسة: {h.nextHearingDate}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {h.status !== 'COMPLETED' && (
                <div className="pt-3 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedHearing(h)}
                    className="w-full text-xs gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    تسجيل قرار المحكمة
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Modal 1: Add Hearing */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl border border-slate-200" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">إضافة ميعاد جلسة جديدة</h3>
              <button onClick={() => setShowCaseModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <form onSubmit={handleSubmitHearing(handleAddHearing)} className="space-y-4">
              {actionError && (
                <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs">
                  {actionError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">اختر القضية *</label>
                <select
                  {...registerHearing('caseId')}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-100"
                >
                  <option value="">حدد القضية...</option>
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>{c.caseNumber} - {c.title}</option>
                  ))}
                </select>
                {hearingErrors.caseId && <p className="mt-1 text-xs text-rose-600">{hearingErrors.caseId.message}</p>}
              </div>

              <Input label="المحكمة والدائرة *" placeholder="مثال: محكمة القضاء الإداري - الدائرة الأولى" error={hearingErrors.court?.message} {...registerHearing('court')} />

              <div className="grid grid-cols-2 gap-3">
                <Input type="date" label="تاريخ الجلسة *" error={hearingErrors.date?.message} {...registerHearing('date')} />
                <Input type="time" label="الوقت *" defaultValue="09:00" error={hearingErrors.time?.message} {...registerHearing('time')} />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">المحامي المكلف بالحضور *</label>
                <select
                  {...registerHearing('lawyerId')}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-100"
                >
                  <option value="">حدد المحامي...</option>
                  {lawyers.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
                {hearingErrors.lawyerId && <p className="mt-1 text-xs text-rose-600">{hearingErrors.lawyerId.message}</p>}
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <Button type="submit" variant="primary" isLoading={hearingSubmitting} className="w-full text-xs">
                  حفظ الجلسة
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCaseModal(false)} className="w-full text-xs">
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Decision Record */}
      {selectedHearing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl border border-slate-200" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs text-amber-600 font-bold">{selectedHearing.caseNumber}</span>
                <h3 className="text-sm font-bold text-slate-900">تسجيل قرار جلسة {selectedHearing.date}</h3>
              </div>
              <button onClick={() => setSelectedHearing(null)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <form onSubmit={handleSubmitDecision(handleSaveDecision)} className="space-y-4">
              <div className="text-right">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">قرار / حكم المحكمة الصادر *</label>
                <textarea
                  rows={3}
                  {...registerDecision('decision')}
                  placeholder="مثال: تأجيل لإعادة الإعلان / المرافعة..."
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100 bg-white"
                ></textarea>
                {decisionErrors.decision && <p className="mt-1 text-xs text-rose-600">{decisionErrors.decision.message}</p>}
              </div>

              <Input type="date" label="تاريخ الجلسة القادمة (في حالة التأجيل)" error={decisionErrors.nextHearingDate?.message} {...registerDecision('nextHearingDate')} />

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <Button type="submit" variant="primary" isLoading={decisionSubmitting} className="w-full text-xs">
                  تأكيد وحفظ القرار
                </Button>
                <Button type="button" variant="outline" onClick={() => setSelectedHearing(null)} className="w-full text-xs">
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