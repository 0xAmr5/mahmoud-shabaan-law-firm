import React, { useState, useEffect, useMemo } from 'react';
import { Search, History } from 'lucide-react';
import { Card, Badge } from '../../components/ui';
import { auditService } from '../../services/auditService';

export const AuditPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchLogs = async () => {
      try {
        setLoading(true);
        const { data } = await auditService.getAllLogs();
        if (isMounted) {
          setLogs(data || []);
        }
      } catch (error) {
        console.error('Failed to fetch audit logs:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLogs();

    return () => {
      isMounted = false;
    };
  }, []);

  const getActionBadge = (action = '') => {
    const act = action.toUpperCase();
    if (act.includes('CREATE') || act.includes('ADD')) {
      return <Badge variant="success">إضافة جديدة</Badge>;
    }
    if (act.includes('DELETE') || act.includes('REMOVE')) {
      return <Badge variant="danger">حذف / إزالة</Badge>;
    }
    if (act.includes('UPDATE') || act.includes('TOGGLE') || act.includes('EDIT')) {
      return <Badge variant="warning">تعديل بيانات</Badge>;
    }
    return <Badge variant="neutral">{action}</Badge>;
  };

  const formatDate = (createdAt) => {
    if (!createdAt) return 'الآن';
    
    // Firestore Timestamp with .toDate()
    if (typeof createdAt.toDate === 'function') {
      return createdAt.toDate().toLocaleString('ar-EG');
    }
    // Firestore Timestamp seconds object
    if (createdAt.seconds) {
      return new Date(createdAt.seconds * 1000).toLocaleString('ar-EG');
    }
    // ISO String or standard Date
    const parsedDate = new Date(createdAt);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleString('ar-EG');
    }

    return 'غير محدد';
  };

  const filteredLogs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return logs;

    return logs.filter(
      (log) =>
        log.userName?.toLowerCase().includes(term) ||
        log.action?.toLowerCase().includes(term) ||
        log.target?.toLowerCase().includes(term)
    );
  }, [logs, searchTerm]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-slate-700" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              سجل الأنشطة والتدقيق الأمني (Audit Trail)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            متابعة فورية وغير قابلة للحذف لكافة الإجراءات والعمليات المنفذة على المنظومة.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="بحث باسم المسؤول، نوع الإجراء، أو الهدف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-800 transition-colors"
          />
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">جاري قراءة سجل الأنشطة...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">لا توجد سجلات أنشطة مطابقة حتى الآن.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-700 font-bold">
                <tr>
                  <th className="py-3.5 px-4">اسم المنفذ</th>
                  <th className="py-3.5 px-4">الدور الوظيفي</th>
                  <th className="py-3.5 px-4">نوع الإجراء</th>
                  <th className="py-3.5 px-4">الهدف / البيان</th>
                  <th className="py-3.5 px-4">توقيت الحدث</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{log.userName || 'غير معروف'}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-medium text-slate-600">
                        {log.role === 'ADMIN' ? 'صاحب المكتب' : log.role === 'LAWYER' ? 'محامي' : log.role || '—'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{getActionBadge(log.action)}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{log.target || '—'}</td>
                    <td className="py-3.5 px-4 text-slate-500" dir="ltr">{formatDate(log.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};