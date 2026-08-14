import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  CalendarCheck,
  FileText,
  Activity,
  Phone,
  User,
  Clock,
  Download,
  Scale,
  LogOut,
  MessageSquare,
  ShieldCheck,
  ArrowUpRight,
  ChevronLeft,
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { caseService } from '../../services/caseService';
import { hearingService } from '../../services/hearingService';
import { documentService } from '../../services/documentService';
import { noteService } from '../../services/noteService';
import { authService } from '../../services/authService';
import { ChatBox } from '../../components/chat/ChatBox';
import { NotificationBell } from '../../components/common/NotificationBell';
import { OFFICE_INFO } from '../../constants/theme';

export const ClientPortal = () => {
  const { user, userProfile } = useAuth();
  const [cases, setCases] = useState([]);
  const [hearings, setHearings] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseTimeline, setCaseTimeline] = useState([]);
  const [caseNotes, setCaseNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('DETAILS');

  useEffect(() => {
    let isMounted = true;

    const fetchClientData = async () => {
      if (!user?.uid) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 1. جلب قضايا الموكل
        const { data: casesData } = await caseService.getCasesByClient(user.uid);
        const clientCases = Array.isArray(casesData) ? casesData : [];

        if (isMounted) {
          setCases(clientCases);
          if (clientCases.length > 0) {
            setSelectedCase(clientCases[0]);
          }
        }

        // 2. جلب الجلسات الخاصة بالموكل
        const { data: allHearings } = await hearingService.getAllHearings();
        const clientHearings = Array.isArray(allHearings)
          ? allHearings.filter((h) => h?.clientId === user.uid)
          : [];

        if (isMounted) setHearings(clientHearings);

        // 3. جلب المستندات المرئية للموكل
        const { data: allDocs } = await documentService.getAllDocuments();
        const clientDocs = Array.isArray(allDocs)
          ? allDocs.filter(
              (d) => clientCases.some((c) => c.id === d.caseId) && d.visibility === 'CLIENT_VISIBLE'
            )
          : [];

        if (isMounted) setDocuments(clientDocs);
      } catch (err) {
        console.error('Client Portal Fetch Error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchClientData();

    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  useEffect(() => {
    let isMounted = true;

    const fetchCaseDetails = async () => {
      if (!selectedCase?.id) {
        if (isMounted) {
          setCaseTimeline([]);
          setCaseNotes([]);
        }
        return;
      }

      try {
        const { data: timelineData } = await caseService.getCaseTimeline(selectedCase.id, true);
        if (isMounted) setCaseTimeline(Array.isArray(timelineData) ? timelineData : []);

        const { data: notesData } = await noteService.getNotesByCase(selectedCase.id, 'CLIENT');
        if (isMounted) setCaseNotes(Array.isArray(notesData) ? notesData : []);
      } catch (err) {
        console.error('Case Details Error:', err);
      }
    };

    fetchCaseDetails();

    return () => {
      isMounted = false;
    };
  }, [selectedCase?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-500 gap-3" dir="rtl">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold text-slate-300">جاري تحميل بوابة الموكل...</span>
      </div>
    );
  }

  const notifications = [
    { id: '1', text: `لديك ${cases.length} قضايا مسجلة في المنظومة`, time: 'الآن', read: false },
    { id: '2', text: `لديك ${hearings.filter(h => h.status !== 'COMPLETED').length} جلسات قادمة محددة`, time: 'مؤخراً', read: false },
  ];

  const statCards = [
    {
      title: 'قضاياي المسجلة',
      count: cases.length,
      icon: Briefcase,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      badge: 'ملفات الدعاوى',
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    },
    {
      title: 'الجلسات القادمة',
      count: hearings.filter((h) => h.status !== 'COMPLETED').length,
      icon: CalendarCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      badge: 'الرول القضائي',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    },
    {
      title: 'المستندات والأوراق',
      count: documents.length,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      badge: 'أرشيف متاح',
      badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200/60',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-16" dir="rtl">
      {/* 1. Header */}
      <header className="h-20 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white">{OFFICE_INFO?.name || 'مكتب المحاماة'}</h1>
            <div className="inline-flex items-center gap-1.5 text-[10px] text-amber-500 font-bold">
              <ShieldCheck className="w-3 h-3" />
              <span>بوابة الموكل الإلكترونية</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell notifications={notifications} />

          <div className="flex items-center gap-3 pr-3 border-r border-slate-800">
            <div className="text-left hidden sm:block">
              <span className="text-xs font-black text-white block leading-tight">{userProfile?.name || 'الموكل الكريم'}</span>
              <span className="text-[10px] text-amber-500 font-bold block">
                حساب موكل مسجل
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-black shadow-inner">
              <User className="w-5 h-5" />
            </div>
          </div>

          <button
            onClick={() => authService.logout()}
            className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs flex items-center gap-1.5 transition-all cursor-pointer mr-1"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline font-bold">خروج</span>
          </button>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* Banner Card */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 sm:p-8 border border-slate-800 shadow-2xl text-white">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-amber-500 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 inline-block">
                أهلاً بك، أستاذ {userProfile?.name || 'الموكل'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                متابعة مباشرة ومحكمة لمراحل الدعاوى ومواعيد الجلسات
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                يمكنك الاطلاع على الجدول الزمني لتطورات قضيتك، توجيهات المحامي المسؤول، وتحميل صور ومستندات الدعوى مباشرة.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={`https://wa.me/2${OFFICE_INFO?.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-950 transition-all flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>تواصل مع الإدارة (واتساب)</span>
              </a>
            </div>
          </div>
        </div>

        {/* 3. Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:border-amber-500/40 transition-all duration-200 flex flex-col justify-between h-40 group"
              >
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-2xl ${card.bgColor} ${card.color} border ${card.borderColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-3xl font-black text-slate-900 tracking-tight">
                    {card.count}
                  </div>
                  <div className="text-xs font-bold text-slate-500 flex items-center justify-between">
                    <span>{card.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-all" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Tab Selector */}
        {cases.length > 0 && (
          <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm gap-2">
            <button
              onClick={() => setActiveTab('DETAILS')}
              className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'DETAILS'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>تفاصيل وتطورات القضية</span>
            </button>
            <button
              onClick={() => setActiveTab('CHAT')}
              className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'CHAT'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>المحادثة المباشرة مع المحامي</span>
            </button>
          </div>
        )}

        {/* 5. Main Content Body */}
        {cases.length === 0 ? (
          <Card className="text-center py-16 border border-slate-200/90 shadow-sm">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-black text-slate-800">أهلاً بك أستاذ {userProfile?.name}</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
              لم يتم ربط أي قضايا بحسابك حالياً. يرجى التواصل مع إدارة المكتب لإدراج وتحديث ملفات قضاياك.
            </p>
          </Card>
        ) : activeTab === 'CHAT' ? (
          <div className="max-w-3xl mx-auto">
            {selectedCase?.lawyerId ? (
              <ChatBox
                recipientUser={{
                  uid: selectedCase.lawyerId,
                  name: selectedCase.lawyerName || 'المحامي المسؤول',
                  role: 'LAWYER',
                }}
                caseNumber={selectedCase.caseNumber}
              />
            ) : (
              <Card className="text-center py-16 border border-slate-200/90 shadow-sm text-xs text-slate-400">
                لم يتم تعيين محامٍ مسؤول عن هذه القضية بعد للبدء في الشات.
              </Card>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Case Details & Timeline */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Case Quick Switcher */}
              <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-800">اختر القضية لمتابعة موقفها:</h3>
                <div className="flex flex-wrap gap-2">
                  {cases.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCase(c)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        selectedCase?.id === c.id
                          ? 'bg-slate-900 text-amber-500 border-slate-900 shadow-md scale-102'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      {c.caseNumber || '---'} - {c.title}
                    </button>
                  ))}
                </div>
              </div>

              {selectedCase && (
                <>
                  {/* Selected Case Info */}
                  <Card className="p-5 border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 inline-block mb-1">
                          رقم القضية: {selectedCase.caseNumber || '---'}
                        </span>
                        <h2 className="text-base font-black text-slate-900">{selectedCase.title}</h2>
                      </div>
                      <Badge variant="neutral" className="font-bold text-[10px]">
                        {selectedCase.status || 'متداولة'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 pt-3 border-t border-slate-100">
                      <div>المحكمة المختصة: <strong className="text-slate-900">{selectedCase.court || 'غير محددة'}</strong></div>
                      <div>المحامي المسؤول: <strong className="text-slate-900">{selectedCase.lawyerName || 'إدارة المكتب'}</strong></div>
                    </div>
                  </Card>

                  {/* Timeline Card */}
                  <Card
                    title="مراحل وتطورات الدعوى (Timeline)"
                    subtitle="السجل الزمني للتحديثات الرسمية الخاصة بقضيتك"
                    className="border border-slate-200/90 shadow-sm"
                  >
                    {caseTimeline.length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        لا توجد تحديثات منشورة بالتايم لاين لهذه القضية حتى الآن.
                      </p>
                    ) : (
                      <div className="relative border-r-2 border-slate-200 mr-2 pr-4 space-y-6 py-2">
                        {caseTimeline.map((evt) => (
                          <div key={evt.id} className="relative">
                            <div className="absolute -right-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-600 ring-4 ring-white"></div>
                            <h4 className="text-xs font-black text-slate-900">{evt.title}</h4>
                            {evt.description && (
                              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{evt.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>

                  {/* Lawyer Notes to Client */}
                  <Card
                    title="توجيهات وتنبيهات المكتب"
                    subtitle="الملاحظات والتوصيات القانونية الموجهة إليك"
                    className="border border-slate-200/90 shadow-sm"
                  >
                    {caseNotes.length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        لا توجد ملاحظات خاصة مسجلة حتى الآن.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {caseNotes.map((note) => (
                          <div key={note.id} className="p-3.5 bg-emerald-50/50 border border-emerald-200/80 rounded-xl space-y-1">
                            <span className="text-[10px] font-black text-emerald-800 block">
                              {note.authorName || 'المحامي المسؤول'}
                            </span>
                            <p className="text-xs text-slate-700 leading-relaxed">{note.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </>
              )}
            </div>

            {/* Right Column: Lawyer Details, Hearings & Documents */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Assigned Lawyer Info */}
              {selectedCase && (
                <Card className="p-5 border border-slate-200/90 shadow-sm space-y-3">
                  <h3 className="text-xs font-black text-slate-500 border-b border-slate-100 pb-2">
                    المحامي المسؤول عن متابعة قضيتك
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-900 text-amber-500 flex items-center justify-center font-black text-sm shadow-inner">
                      {selectedCase.lawyerName ? selectedCase.lawyerName.charAt(0) : 'م'}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{selectedCase.lawyerName || 'إدارة المكتب'}</h4>
                      <span className="text-xs text-amber-600 font-bold block">{OFFICE_INFO?.name || 'مكتب المحاماة'}</span>
                    </div>
                  </div>
                </Card>
              )}

              {/* Hearings List */}
              <Card title="الجلسات والقرارات القضائية" className="border border-slate-200/90 shadow-sm">
                {hearings.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    لا توجد جلسات مسجلة حالياً.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[380px] overflow-y-auto">
                    {hearings.map((h) => (
                      <div key={h.id} className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl text-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-black text-slate-900">{h.court}</span>
                          <Badge variant={h.status === 'COMPLETED' ? 'success' : 'warning'} className="text-[9px]">
                            {h.status === 'COMPLETED' ? 'تمت' : 'قادمة'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 pt-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>تاريخ الجلسة: <strong className="text-slate-900">{h.date} ({h.time})</strong></span>
                        </div>
                        {h.decision && (
                          <div className="text-[11px] text-amber-800 bg-amber-50/80 p-2 rounded-lg border border-amber-200/60 mt-1">
                            <strong>القرار:</strong> {h.decision}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Downloadable Documents */}
              <Card title="الأوراق والمستندات المتاحة" className="border border-slate-200/90 shadow-sm">
                {documents.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    لا توجد مستندات مرفوعة للعرض حالياً.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[320px] overflow-y-auto">
                    {documents.map((docItem) => (
                      <div key={docItem.id} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-xl border border-slate-200/70 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="truncate font-bold text-slate-900">{docItem.title}</span>
                        </div>
                        {docItem.fileUrl && (
                          <a href={docItem.fileUrl} target="_blank" rel="noreferrer" className="shrink-0">
                            <Button variant="outline" size="sm" className="px-2.5 py-1 text-[11px] font-bold gap-1 border-slate-300 hover:border-amber-500 hover:text-amber-600">
                              <Download className="w-3 h-3" />
                              <span>تحميل</span>
                            </Button>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>

            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default ClientPortal;