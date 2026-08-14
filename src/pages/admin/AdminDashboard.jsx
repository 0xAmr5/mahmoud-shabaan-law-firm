import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Calendar,
  FolderArchive,
  ArrowUpRight,
  Clock,
  Plus,
  ArrowLeft,
  ChevronLeft,
  Download,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';
import { db } from '../../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { OFFICE_INFO } from '../../constants/theme';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    casesCount: 0,
    clientsCount: 0,
    hearingsCount: 0,
    documentsCount: 0,
  });
  const [recentCases, setRecentCases] = useState([]);
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubs = [];

    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const unCase = onSnapshot(collection(db, 'cases'), (snap) => {
          setStats((prev) => ({ ...prev, casesCount: snap.size }));
          const cList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setRecentCases(cList.slice(0, 5));
        });
        unsubs.push(unCase);

        const unUsers = onSnapshot(collection(db, 'users'), (snap) => {
          const clientCount = snap.docs.filter((d) => d.data().role === 'CLIENT').length;
          setStats((prev) => ({ ...prev, clientsCount: clientCount || snap.size }));
        });
        unsubs.push(unUsers);

        const unHearings = onSnapshot(collection(db, 'hearings'), (snap) => {
          setStats((prev) => ({ ...prev, hearingsCount: snap.size }));
        });
        unsubs.push(unHearings);

        const unDocs = onSnapshot(collection(db, 'documents'), (snap) => {
          setStats((prev) => ({ ...prev, documentsCount: snap.size }));
          const dList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          dList.sort((a, b) => {
            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;
            return timeB - timeA;
          });
          setRecentDocs(dList.slice(0, 5));
          setLoading(false);
        });
        unsubs.push(unDocs);
      } catch (err) {
        setLoading(false);
      }
    };

    loadDashboardData();

    return () => {
      unsubs.forEach((un) => un && un());
    };
  }, []);

  const statCards = [
    {
      title: 'القضايا النشطة والمتداولة',
      count: stats.casesCount,
      link: '/admin/cases',
      icon: Briefcase,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      badge: 'مباشر',
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    },
    {
      title: 'الموكلين والعملاء المسجلين',
      count: stats.clientsCount,
      link: '/admin/clients',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      badge: 'سجل CRM',
      badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    },
    {
      title: 'الجلسات والقرارات القادمة',
      count: stats.hearingsCount,
      link: '/admin/hearings',
      icon: Calendar,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      badge: 'الرول القضائي',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    },
    {
      title: 'المستندات والعقود بالأرشيف',
      count: stats.documentsCount,
      link: '/admin/documents',
      icon: FolderArchive,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      badge: 'أرشيف سحابي',
      badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200/60',
    },
  ];

  const quickActions = [
    { label: 'إضافة قضية', path: '/admin/cases', icon: Plus, bg: 'bg-amber-600 text-white hover:bg-amber-700' },
    { label: 'سجل الحضور', path: '/admin/attendance', icon: Clock, bg: 'bg-slate-900 text-slate-100 hover:bg-slate-800 border border-slate-800' },
    { label: 'رفع مستند', path: '/admin/documents', icon: FolderArchive, bg: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200' },
    { label: 'المحادثات', path: '/admin/chat', icon: MessageSquare, bg: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200' },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-12" dir="rtl">
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 sm:p-10 border border-slate-800 shadow-2xl text-white">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              لوحة تحكم {OFFICE_INFO.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              متابعة مباشرة ومحكمة لملفات الدعاوى، التوكيلات، مواعيد الجلسات، والتواصل مع الموكلين وفريق العمل.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {quickActions.map((action, idx) => {
              const ActionIcon = action.icon;
              return (
                <Link key={idx} to={action.path}>
                  <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${action.bg}`}>
                    <ActionIcon className="w-4 h-4" />
                    <span>{action.label}</span>
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link key={idx} to={card.link}>
              <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:border-amber-500/40 transition-all duration-200 group flex flex-col justify-between h-44">
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
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-[-2px] transition-all" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold border border-amber-500/20">
                <Briefcase className="w-4 h-4" />
              </div>
              <h2 className="text-base font-black text-slate-900">أحدث القضايا المسجلة</h2>
            </div>
            <Link to="/admin/cases" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
              <span>عرض جميع القضايا</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="p-0 overflow-hidden border border-slate-200/90 rounded-2xl bg-white shadow-sm">
            {loading ? (
              <div className="py-16 text-center text-xs text-slate-400">جاري تحميل بيانات القضايا...</div>
            ) : recentCases.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-500">لا توجد قضايا مسجلة حتى الآن</p>
                <Link to="/admin/cases">
                  <Button variant="outline" size="sm" className="text-xs">إضافة أول قضية</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="py-3.5 px-5">عنوان القضية</th>
                      <th className="py-3.5 px-4">رقم القضية</th>
                      <th className="py-3.5 px-4">المحكمة</th>
                      <th className="py-3.5 px-4">الحالة</th>
                      <th className="py-3.5 px-4 text-center">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {recentCases.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-5">
                          <strong className="text-slate-900 font-bold block">{c.title || 'قضية بدون اسم'}</strong>
                          <span className="text-[10px] text-slate-400">{c.clientName || 'موكل عام'}</span>
                        </td>
                        <td className="py-4 px-4 font-mono text-slate-700">{c.caseNumber || '---'}</td>
                        <td className="py-4 px-4 text-slate-600">{c.court || 'غير محدد'}</td>
                        <td className="py-4 px-4">
                          <Badge variant="neutral" className="text-[10px] font-bold">
                            {c.status || 'متداولة'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Link to="/admin/cases" className="text-amber-600 hover:text-amber-700 font-bold text-xs inline-flex items-center gap-1">
                            <span>تفاصيل</span>
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold border border-purple-500/20">
                <FolderArchive className="w-4 h-4" />
              </div>
              <h2 className="text-base font-black text-slate-900">أحدث ملفات الأرشيف</h2>
            </div>
            <Link to="/admin/documents" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
              <span>فتح الأرشيف</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="p-0 overflow-hidden border border-slate-200/90 rounded-2xl bg-white shadow-sm">
            {loading ? (
              <div className="py-16 text-center text-xs text-slate-400">جاري فحص المستندات...</div>
            ) : recentDocs.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <FolderArchive className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-500">الأرشيف فارغ حالياً</p>
                <Link to="/admin/documents">
                  <Button variant="outline" size="sm" className="text-xs">رفع أول مستند</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentDocs.map((doc) => (
                  <div key={doc.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <strong className="text-xs font-bold text-slate-900 truncate block">{doc.title}</strong>
                        <span className="text-[10px] text-slate-400 font-mono block truncate" dir="ltr">{doc.fileName}</span>
                      </div>
                    </div>

                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all shrink-0"
                      title="معاينة / تنزيل"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;