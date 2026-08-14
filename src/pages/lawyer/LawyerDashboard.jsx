import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  CheckSquare,
  CalendarCheck,
  Plus,
  Clock,
  User,
  Scale,
  LogOut,
  MessageSquare,
  MapPin,
  Users,
  ShieldCheck,
  ArrowUpRight,
  ChevronLeft,
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { caseService } from '../../services/caseService';
import { taskService } from '../../services/taskService';
import { hearingService } from '../../services/hearingService';
import { attendanceService } from '../../services/attendanceService';
import { authService } from '../../services/authService';
import { CaseNotesSection } from '../../components/common/CaseNotesSection';
import { ChatBox } from '../../components/chat/ChatBox';
import { NotificationBell } from '../../components/common/NotificationBell';
import { OFFICE_INFO } from '../../constants/theme';

export const LawyerDashboard = () => {
  const { user, userProfile } = useAuth();
  const [myCases, setMyCases] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [myHearings, setMyHearings] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [attendanceRecord, setAttendanceRecord] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('CASES');
  const [chatRecipient, setChatRecipient] = useState(null);

  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventVisibility, setEventVisibility] = useState('INTERNAL');

  const fetchLawyerData = async () => {
    if (!user?.uid) return;
    setLoading(true);

    try {
      const { data: casesData } = await caseService.getCasesByLawyer(user.uid);
      const casesList = casesData || [];
      setMyCases(casesList);

      if (casesList.length > 0 && !selectedCase) {
        setSelectedCase(casesList[0]);
      }

      const { data: tasksData } = await taskService.getTasksByLawyer(user.uid);
      setMyTasks(tasksData || []);

      const { data: allHearings } = await hearingService.getAllHearings();
      const lawyerHearings = (allHearings || []).filter((h) => h.lawyerId === user.uid);
      setMyHearings(lawyerHearings);

      const { data: attData } = await attendanceService.getTodayStatus(user.uid);
      setAttendanceRecord(attData);
    } catch (err) {
      console.error('Lawyer data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyerData();
  }, [user?.uid]);

  useEffect(() => {
    const fetchTimeline = async () => {
      if (!selectedCase?.id) return;
      const { data } = await caseService.getCaseTimeline(selectedCase.id);
      setTimelineEvents(data || []);
    };

    fetchTimeline();
  }, [selectedCase?.id]);

  const handleCheckIn = async () => {
    setAttendanceLoading(true);
    const { success, error } = await attendanceService.checkIn({
      lawyerId: user.uid,
      lawyerName: userProfile?.name || 'محامي',
    });
    if (success) {
      const { data } = await attendanceService.getTodayStatus(user.uid);
      setAttendanceRecord(data);
    } else {
      alert(error || 'تعذر تسجيل الحضور.');
    }
    setAttendanceLoading(false);
  };

  const handleCheckOut = async () => {
    setAttendanceLoading(true);
    const { success, error } = await attendanceService.checkOut(user.uid);
    if (success) {
      const { data } = await attendanceService.getTodayStatus(user.uid);
      setAttendanceRecord(data);
    } else {
      alert(error || 'تعذر تسجيل الانصراف.');
    }
    setAttendanceLoading(false);
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    await taskService.updateTaskStatus(taskId, newStatus);
    fetchLawyerData();
  };

  const handleAddTimelineEvent = async (e) => {
    e.preventDefault();
    if (!selectedCase || !eventTitle) return;

    const { success } = await caseService.addCaseEvent(selectedCase.id, {
      title: eventTitle,
      description: eventDesc,
      visibility: eventVisibility,
    });

    if (success) {
      setEventTitle('');
      setEventDesc('');
      setShowEventModal(false);
      const { data } = await caseService.getCaseTimeline(selectedCase.id);
      setTimelineEvents(data || []);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-500 gap-3" dir="rtl">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold text-slate-300">جاري تحميل لوحة المحامي...</span>
      </div>
    );
  }

  const clientsList = Array.from(
    new Map(
      myCases
        .filter((c) => c.clientId)
        .map((c) => [c.clientId, { uid: c.clientId, name: c.clientName || 'موكل', role: 'CLIENT', caseNumber: c.caseNumber }])
    ).values()
  );

  const notifications = [
    { id: '1', text: `لديك ${myTasks.filter(t => t.status !== 'COMPLETED').length} مهام قيد التنفيذ`, time: 'اليوم', read: false },
    { id: '2', text: `لديك ${myHearings.filter(h => h.status !== 'COMPLETED').length} جلسات قادمة مسندة إليك`, time: 'مؤخراً', read: false },
  ];

  const statCards = [
    {
      title: 'قضاياي المسندة',
      count: myCases.length,
      icon: Briefcase,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      badge: 'ملفات نشطة',
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    },
    {
      title: 'مهامي القائمة',
      count: myTasks.filter((t) => t.status !== 'COMPLETED').length,
      icon: CheckSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      badge: 'تكليفات العمل',
      badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    },
    {
      title: 'جلساتي القادمة',
      count: myHearings.filter((h) => h.status !== 'COMPLETED').length,
      icon: CalendarCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      badge: 'الرول القضائي',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
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
              <span>لوحة عمل المحامي المسؤول</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell notifications={notifications} />

          <div className="flex items-center gap-3 pr-3 border-r border-slate-800">
            <div className="text-left hidden sm:block">
              <span className="text-xs font-black text-white block leading-tight">{userProfile?.name || 'المحامي'}</span>
              <span className="text-[10px] text-amber-500 font-bold block">
                تخصص: {userProfile?.specialization || 'شؤون قانونية'}
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
        
        {/* Banner + Attendance Card */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 sm:p-8 border border-slate-800 shadow-2xl text-white">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-amber-500 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 inline-block">
                مرحباً بك، أستاذ {userProfile?.name}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                متابعة المهام اليومية، التوكيلات، وجلسات الدوائر
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                {attendanceRecord
                  ? `حالة اليوم: مسجل حضور الساعة (${attendanceRecord.checkInTime}) ${attendanceRecord.checkOutTime ? `| انصراف: (${attendanceRecord.checkOutTime})` : ''}`
                  : 'لم يتم تسجيل الحضور لليوم بعد. برجاء إثبات الحضور لبدء المتابعة.'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {!attendanceRecord ? (
                <Button
                  variant="primary"
                  isLoading={attendanceLoading}
                  onClick={handleCheckIn}
                  className="px-5 py-3 rounded-xl text-xs font-black bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-950 gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  تسجيل الحضور الآن
                </Button>
              ) : !attendanceRecord.checkOutTime ? (
                <Button
                  variant="outline"
                  isLoading={attendanceLoading}
                  onClick={handleCheckOut}
                  className="px-5 py-3 rounded-xl text-xs font-black border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل الانصراف
                </Button>
              ) : (
                <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  تم تسجيل الحضور والانصراف لليوم ✓
                </div>
              )}
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
        <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm gap-2">
          <button
            onClick={() => setActiveTab('CASES')}
            className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'CASES'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>إدارة القضايا والملفات المسندة</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('CHAT');
              if (clientsList.length > 0 && !chatRecipient) {
                setChatRecipient(clientsList[0]);
              }
            }}
            className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'CHAT'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>المحادثات المباشرة والشات</span>
          </button>
        </div>

        {/* 5. Main Tab Body */}
        {activeTab === 'CHAT' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-4 space-y-3 border border-slate-200/90 shadow-sm">
              <h4 className="text-xs font-black text-slate-900 border-b border-slate-100 pb-2">اختر جهة المراسلة</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setChatRecipient({ uid: 'ADMIN', name: 'صاحب المكتب / أ. محمود شعبان', role: 'ADMIN' })}
                  className={`w-full p-3 rounded-xl text-right transition-all flex items-center justify-between border cursor-pointer ${
                    chatRecipient?.uid === 'ADMIN'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-amber-50/70 text-slate-900 border-amber-200 hover:bg-amber-100/60'
                  }`}
                >
                  <div>
                    <h5 className="text-xs font-black">صاحب المكتب (الإدارة)</h5>
                    <span className="text-[10px] opacity-70 block mt-0.5">تواصل مباشر</span>
                  </div>
                  <Badge variant="warning" className="text-[9px]">إدارة</Badge>
                </button>

                <div className="pt-3">
                  <span className="text-[10px] text-slate-400 font-bold block mb-2 px-1">
                    موكلو قضاياك ({clientsList.length})
                  </span>
                  {clientsList.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      لا يوجد موكلون مرتبطون بقضاياك حالياً.
                    </p>
                  ) : (
                    <div className="space-y-1.5 max-h-[360px] overflow-y-auto">
                      {clientsList.map((c) => (
                        <button
                          key={c.uid}
                          onClick={() => setChatRecipient(c)}
                          className={`w-full p-3 rounded-xl text-right transition-all flex items-center justify-between border cursor-pointer ${
                            chatRecipient?.uid === c.uid
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-slate-50 text-slate-800 border-slate-100 hover:bg-slate-100'
                          }`}
                        >
                          <div>
                            <h5 className="text-xs font-bold">{c.name}</h5>
                            <span className="text-[10px] opacity-70 block mt-0.5">قضية: {c.caseNumber}</span>
                          </div>
                          <Badge variant="neutral" className="text-[9px]">موكل</Badge>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <div className="lg:col-span-2">
              {chatRecipient ? (
                <ChatBox
                  recipientUser={chatRecipient}
                  caseNumber={chatRecipient.caseNumber}
                />
              ) : (
                <Card className="h-[520px] flex items-center justify-center text-xs text-slate-400 border border-slate-200/90 shadow-sm">
                  حدد جهة التواصل لبدء المحادثة الفورية.
                </Card>
              )}
            </div>
          </div>
        ) : myCases.length === 0 ? (
          <Card className="text-center py-16 border border-slate-200/90 shadow-sm">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-black text-slate-800">أهلاً بك أستاذ {userProfile?.name}</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
              لا توجد قضايا مسندة لحسابك في الوقت الحالي. سيتم إدراج القضايا والتكليفات تلقائياً من قبل الإدارة.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Selected Case Details & Timeline */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Horizontal Case Quick Switcher */}
              <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-800">اختر القضية للمتابعة:</h3>
                <div className="flex flex-wrap gap-2">
                  {myCases.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCase(c)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        selectedCase?.id === c.id
                          ? 'bg-slate-900 text-amber-500 border-slate-900 shadow-md scale-102'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      {c.caseNumber} - {c.title}
                    </button>
                  ))}
                </div>
              </div>

              {selectedCase && (
                <>
                  {/* Case Info Card */}
                  <Card className="p-5 border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 inline-block mb-1">
                          {selectedCase.caseNumber}
                        </span>
                        <h2 className="text-base font-black text-slate-900">{selectedCase.title}</h2>
                      </div>
                      <Badge variant="warning">{selectedCase.priority || 'متوسطة'}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 pt-3 border-t border-slate-100">
                      <div>المحكمة: <strong className="text-slate-900">{selectedCase.court || 'غير محدد'}</strong></div>
                      <div>العميل: <strong className="text-slate-900">{selectedCase.clientName || 'غير مسجل'}</strong></div>
                    </div>
                  </Card>

                  {/* Timeline Card */}
                  <Card
                    title="الجدول الزمني للقضية (Timeline)"
                    headerAction={
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setShowEventModal(true)}
                        className="text-xs font-bold gap-1 bg-amber-600 hover:bg-amber-700"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        تحديث التايم لاين
                      </Button>
                    }
                    className="border border-slate-200/90 shadow-sm"
                  >
                    {timelineEvents.length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        لا توجد أحداث مسجلة بالتايم لاين لهذه القضية.
                      </p>
                    ) : (
                      <div className="relative border-r-2 border-slate-200 mr-2 pr-4 space-y-5 py-1">
                        {timelineEvents.map((evt) => (
                          <div key={evt.id} className="relative">
                            <div className="absolute -right-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-600 ring-4 ring-white"></div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-900">{evt.title}</h4>
                              <Badge variant={evt.visibility === 'CLIENT_VISIBLE' ? 'success' : 'neutral'} className="text-[9px]">
                                {evt.visibility === 'CLIENT_VISIBLE' ? 'مرئي للعميل' : 'داخلي فقط'}
                              </Badge>
                            </div>
                            {evt.description && <p className="text-xs text-slate-600 mt-1 leading-relaxed">{evt.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>

                  {/* Case Notes */}
                  <CaseNotesSection caseItem={selectedCase} />
                </>
              )}
            </div>

            {/* Right Column: Tasks & Hearings Tables */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Tasks List */}
              <Card title="المهام المسندة إليك" className="border border-slate-200/90 shadow-sm">
                {myTasks.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    لا توجد مهام مكلّف بها حالياً.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[380px] overflow-y-auto">
                    {myTasks.map((t) => (
                      <div key={t.id} className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl text-xs space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-black text-slate-900 leading-snug">{t.title}</h4>
                          <Badge variant={t.priority === 'HIGH' ? 'danger' : 'warning'} className="text-[9px]">
                            {t.priority === 'HIGH' ? 'عاجل' : 'عادي'}
                          </Badge>
                        </div>

                        {t.description && <p className="text-slate-600 text-[11px] leading-relaxed">{t.description}</p>}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                          <span className="text-[10px] text-slate-500 font-mono">الموعد: {t.dueDate}</span>
                          <select
                            value={t.status}
                            onChange={(e) => handleTaskStatusChange(t.id, e.target.value)}
                            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-[11px] text-slate-900 focus:outline-none focus:border-amber-600 font-bold"
                          >
                            <option value="PENDING">انتظار</option>
                            <option value="IN_PROGRESS">تنفيذ</option>
                            <option value="COMPLETED">مكتملة ✓</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Hearings List */}
              <Card title="جلساتي المقررة بالمحكمة" className="border border-slate-200/90 shadow-sm">
                {myHearings.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    لا توجد جلسات مكلف بالحضور فيها حالياً.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[380px] overflow-y-auto">
                    {myHearings.map((h) => (
                      <div key={h.id} className="p-3.5 bg-amber-50/40 border border-amber-200/80 rounded-xl text-xs space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="font-black text-slate-900">{h.court}</span>
                          <span className="text-[10px] text-amber-700 font-mono font-bold">{h.caseNumber}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 pt-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>تاريخ الجلسة: <strong className="text-slate-900">{h.date} ({h.time})</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

            </div>

          </div>
        )}
      </main>

      {/* Timeline Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">إضافة تحديث للجدول الزمني</h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTimelineEvent} className="space-y-4">
              <Input
                label="عنوان التحديث *"
                placeholder="مثال: تم إيداع مذكرة الدفاع للدائرة"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
              />

              <div className="text-right">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">التفاصيل (اختياري)</label>
                <textarea
                  rows={3}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-600 transition-colors"
                  placeholder="شرح إضافي للإجراء القانوني المنفذ..."
                ></textarea>
              </div>

              <div className="text-right">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">إمكانية رؤية التحديث *</label>
                <select
                  value={eventVisibility}
                  onChange={(e) => setEventVisibility(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-amber-600"
                >
                  <option value="INTERNAL">داخلي فقط (للمكتب والمحامين)</option>
                  <option value="CLIENT_VISIBLE">مرئي للعميل (يظهر في بوابة الموكل)</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <Button type="submit" variant="primary" className="w-full text-xs font-black py-3 rounded-xl bg-amber-600 hover:bg-amber-700">
                  حفظ الحدث
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowEventModal(false)} className="w-full text-xs py-3 rounded-xl">
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

export default LawyerDashboard;