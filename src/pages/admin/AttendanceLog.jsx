import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { Card, Badge } from '../../components/ui';
import { db } from '../../firebase/config';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export const AttendanceLog = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const q = query(collection(db, 'attendance'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAttendance(data);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  return (
    <div className="space-y-6 pb-12 text-slate-100" dir="rtl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white">سجل الحضور والانصراف</h1>
        <p className="text-xs text-slate-400 mt-1">متابعة إثبات حضور المحامين ومواعيد العمل</p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">جاري تحميل سجل الحضور...</div>
      ) : attendance.length === 0 ? (
        <Card className="p-12 text-center space-y-3 bg-slate-900/60 border-slate-800">
          <Clock className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400 font-bold">لا توجد تسجيلات حضور لليوم.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {attendance.map((item) => (
            <Card key={item.id} className="p-5 bg-slate-900/80 border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white">{item.userName || 'محامٍ'}</h3>
                <Badge variant="success" className="text-[10px]">حاضر</Badge>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>وقت الحضور: {item.checkInTime || 'سجل إلكتروني'}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceLog;