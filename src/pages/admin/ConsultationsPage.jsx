import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  RefreshCw,
  User,
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';
import { db } from '../../firebase/config';
import { collection, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export const ConsultationsPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, 'consultations'),
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        list.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });

        setConsultations(list);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const docRef = doc(db, 'consultations', id);
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error updating consultation status:', err);
    }
  };

  const filteredList = consultations.filter((item) => {
    const search = searchTerm.toLowerCase();
    const matches =
      (item.name && item.name.toLowerCase().includes(search)) ||
      (item.phone && item.phone.toLowerCase().includes(search)) ||
      (item.subject && item.subject.toLowerCase().includes(search)) ||
      (item.type && item.type.toLowerCase().includes(search));

    if (filterStatus === 'PENDING') return matches && (!item.status || item.status === 'PENDING');
    if (filterStatus === 'COMPLETED') return matches && item.status === 'COMPLETED';
    if (filterStatus === 'CANCELLED') return matches && item.status === 'CANCELLED';
    return matches;
  });

  const totalCount = consultations.length;
  const pendingCount = consultations.filter((c) => !c.status || c.status === 'PENDING').length;
  const completedCount = consultations.filter((c) => c.status === 'COMPLETED').length;

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-12" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">طلبات الاستشارات القانونية</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            متابعة وتأكيد مواعيد الاستشارات الواردة من عملاء وزوار الموقع.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-6 space-y-2 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">إجمالي الطلبات</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{totalCount}</div>
        </Card>

        <Card className="p-6 space-y-2 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">طلبات قيد المراجعة</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600">{pendingCount}</div>
        </Card>

        <Card className="p-6 space-y-2 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">استشارات تمت</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600">{completedCount}</div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="بحث باسم العميل، رقم الهاتف، أو موضوع الاستشارة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-slate-800 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الكل ({totalCount})
          </button>
          <button
            onClick={() => setFilterStatus('PENDING')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'PENDING'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            جديدة ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('COMPLETED')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'COMPLETED'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            مكتملة ({completedCount})
          </button>
        </div>
      </Card>

      {/* Consultations Table */}
      <Card className="p-0 overflow-hidden border border-slate-200/90 rounded-2xl bg-white shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
            <span>جاري تحميل طلبات الاستشارات...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">لا توجد طلبات استشارة حالياً</h3>
            <p className="text-xs text-slate-500">أي طلب يتم إرساله من الصفحة الرئيسية سيظهر هنا مباشرة.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6">صاحب الاستشارة</th>
                  <th className="py-4 px-4">رقم الهاتف</th>
                  <th className="py-4 px-4">نوع الخدمة / الموضوع</th>
                  <th className="py-4 px-4">تفاصيل الطلب</th>
                  <th className="py-4 px-4 text-center">الحالة</th>
                  <th className="py-4 px-6 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-500 flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                          {item.name ? item.name.charAt(0) : <User className="w-4 h-4" />}
                        </div>
                        <div>
                          <strong className="text-slate-900 font-bold block">{item.name || 'عميل'}</strong>
                          <span className="text-[10px] text-slate-400">{item.email || 'بدون بريد'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-700" dir="ltr">{item.phone || '---'}</td>
                    <td className="py-4 px-4 text-slate-900 font-semibold">{item.subject || item.type || 'استشارة عامة'}</td>
                    <td className="py-4 px-4 text-slate-600 max-w-xs truncate">{item.message || item.details || 'لا توجد تفاصيل إضافية'}</td>

                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${
                          item.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.status === 'CANCELLED'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {item.status === 'COMPLETED' ? 'تمت الاستشارة' : item.status === 'CANCELLED' ? 'ملغية' : 'قيد المراجعة'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {item.phone && (
                          <a
                            href={`https://wa.me/2${item.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            title="مراسلة عبر واتساب"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {item.status !== 'COMPLETED' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(item.id, 'COMPLETED')}
                            className="text-[11px] font-bold text-emerald-600 border-emerald-200 hover:bg-emerald-50 rounded-xl py-1 px-2.5"
                          >
                            تحديد كمكتمل
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(item.id, 'PENDING')}
                            className="text-[11px] font-bold text-slate-500 border-slate-200 hover:bg-slate-100 rounded-xl py-1 px-2.5"
                          >
                            إعادة فتح
                          </Button>
                        )}
                      </div>
                    </td>
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

export default ConsultationsPage;