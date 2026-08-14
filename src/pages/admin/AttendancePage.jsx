import React, { useState, useEffect } from 'react';
import {
  Clock,
  UserCheck,
  Search,
  Users,
  CheckCircle2,
  XCircle,
  Calendar as CalendarIcon,
  RefreshCw,
} from 'lucide-react';
import { Card, Button } from '../../components/ui';
import { db } from '../../firebase/config';
import { collection, onSnapshot, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export const AttendancePage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'users'), where('role', '==', 'LAWYER'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const lastLogin = data.lastLoginAt?.seconds 
            ? new Date(data.lastLoginAt.seconds * 1000) 
            : null;

          return {
            id: docSnap.id,
            name: data.name || 'محامٍ',
            email: data.email || 'غير مسجل',
            phone: data.phone || '---',
            specialization: data.specialization || 'محامٍ بالاستئناف والنقض',
            checkIn: lastLogin 
              ? lastLogin.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) 
              : '09:00 ص',
            checkOut: data.checkOutTime || '—',
            status: data.attendanceStatus || (data.status === 'INACTIVE' ? 'ABSENT' : 'PRESENT'),
          };
        });

        setLawyers(list);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const toggleStatus = async (lawyerId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'PRESENT' ? 'ABSENT' : 'PRESENT';
      const userRef = doc(db, 'users', lawyerId);
      await updateDoc(userRef, {
        attendanceStatus: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLawyers = lawyers.filter((lawyer) => {
    const matchesSearch =
      lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'PRESENT') return matchesSearch && lawyer.status === 'PRESENT';
    if (filterStatus === 'ABSENT') return matchesSearch && lawyer.status === 'ABSENT';
    return matchesSearch;
  });

  const totalLawyers = lawyers.length;
  const presentCount = lawyers.filter((l) => l.status === 'PRESENT').length;
  const absentCount = lawyers.filter((l) => l.status === 'ABSENT').length;

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-12" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">سجل حضور وانصراف فريق المحامين</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            متابعة فورية ومباشرة لمواعيد الحضور والانصراف وحالة التواجد لجميع المحامين المسجلين.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm">
            <CalendarIcon className="w-4 h-4 text-amber-600" />
            <span>{new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-6 space-y-2 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">إجمالي المحامين المسجلين</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{totalLawyers}</div>
        </Card>

        <Card className="p-6 space-y-2 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">المتواجدون اليوم</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600">{presentCount}</div>
        </Card>

        <Card className="p-6 space-y-2 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">غير المتواجدين</span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/60">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-600">{absentCount}</div>
        </Card>
      </div>

      <Card className="p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="بحث باسم المحامي، التخصص، أو البريد الإلكتروني..."
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
            الكل ({totalLawyers})
          </button>
          <button
            onClick={() => setFilterStatus('PRESENT')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'PRESENT'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            المتواجدين ({presentCount})
          </button>
          <button
            onClick={() => setFilterStatus('ABSENT')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'ABSENT'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            غير المتواجدين ({absentCount})
          </button>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden border border-slate-200/90 rounded-2xl bg-white shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
            <span>جاري تحميل سجل الحضور والانصراف...</span>
          </div>
        ) : filteredLawyers.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">لا يوجد محامون متاحون حالياً</h3>
            <p className="text-xs text-slate-500">أي محامٍ جديد يسجل حسابه سيظهر في هذا السجل تلقائياً.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6">المحامي</th>
                  <th className="py-4 px-4">التخصص القانوني</th>
                  <th className="py-4 px-4">رقم الهاتف</th>
                  <th className="py-4 px-4">وقت الحضور</th>
                  <th className="py-4 px-4">وقت الانصراف</th>
                  <th className="py-4 px-4 text-center">الحالة</th>
                  <th className="py-4 px-6 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLawyers.map((lawyer) => (
                  <tr key={lawyer.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-500 flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                          {lawyer.name.charAt(0)}
                        </div>
                        <div>
                          <strong className="text-slate-900 font-bold block">{lawyer.name}</strong>
                          <span className="text-[10px] text-slate-400" dir="ltr">{lawyer.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-700">{lawyer.specialization}</td>
                    <td className="py-4 px-4 font-mono text-slate-600" dir="ltr">{lawyer.phone}</td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-800">{lawyer.checkIn}</td>
                    <td className="py-4 px-4 font-mono text-slate-500">{lawyer.checkOut}</td>

                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${
                          lawyer.status === 'PRESENT'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            lawyer.status === 'PRESENT' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        {lawyer.status === 'PRESENT' ? 'متواجد' : 'غير متواجد'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(lawyer.id, lawyer.status)}
                        className={`text-[11px] font-bold rounded-xl py-1.5 px-3 ${
                          lawyer.status === 'PRESENT'
                            ? 'text-rose-600 border-rose-200 hover:bg-rose-50'
                            : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                        }`}
                      >
                        {lawyer.status === 'PRESENT' ? 'تسجيل انصراف' : 'تسجيل حضور'}
                      </Button>
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

export default AttendancePage;