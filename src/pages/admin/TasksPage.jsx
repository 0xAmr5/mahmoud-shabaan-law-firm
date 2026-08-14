import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckSquare, Plus, Clock, UserCheck, Briefcase, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui';
import { taskService } from '../../services/taskService';
import { lawyerService } from '../../services/lawyerService';
import { caseService } from '../../services/caseService';

const taskSchema = z.object({
  title: z.string().min(3, 'عنوان المهمة يجب ألا يقل عن 3 أحرف'),
  assignedToLawyerId: z.string().min(1, 'يرجى اختيار المحامي المكلف'),
  dueDate: z.string().min(1, 'تاريخ الاستحقاق مطلوب'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  caseId: z.string().optional(),
  description: z.string().optional(),
});

export const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, PENDING, IN_PROGRESS, COMPLETED

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'MEDIUM',
    },
  });

  const fetchData = async () => {
    setLoading(true);
    const { data: tasksData } = await taskService.getAllTasks();
    const { data: lawyersData } = await lawyerService.getAllLawyers();
    const { data: casesData } = await caseService.getAllCases();

    setTasks(tasksData || []);
    setLawyers(lawyersData || []);
    setCases(casesData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTask = async (data) => {
    setActionError(null);
    const selectedLawyer = lawyers.find((l) => l.id === data.assignedToLawyerId);
    const selectedCase = cases.find((c) => c.id === data.caseId);

    const payload = {
      ...data,
      assignedToLawyerName: selectedLawyer ? selectedLawyer.name : '',
      caseNumber: selectedCase ? selectedCase.caseNumber : '',
    };

    const { error } = await taskService.createTask(payload);
    if (!error) {
      reset();
      setShowModal(false);
      fetchData();
    } else {
      setActionError(error || 'حدث خطأ أثناء حفظ المهمة');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    await taskService.updateTaskStatus(taskId, newStatus);
    fetchData();
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('هل أنت تأكد من حذف هذه المهمة؟')) {
      await taskService.deleteTask(taskId);
      fetchData();
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'PENDING') return t.status === 'PENDING';
    if (activeTab === 'IN_PROGRESS') return t.status === 'IN_PROGRESS';
    if (activeTab === 'COMPLETED') return t.status === 'COMPLETED';
    return true;
  });

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'HIGH':
        return <Badge variant="danger">عالية الأهمية</Badge>;
      case 'MEDIUM':
        return <Badge variant="warning">متوسطة</Badge>;
      default:
        return <Badge variant="neutral">عادية</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">إدارة المهام والتكليفات</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            توزيع الأعمال الإدارية والقانونية على المحامين ومتابعة حالات التنفيذ.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          إضافة مهمة جديدة
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold transition-all border-b-2 ${
            activeTab === 'ALL'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          كافة المهام ({tasks.length})
        </button>
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold transition-all border-b-2 ${
            activeTab === 'PENDING'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          قيد الانتظار ({tasks.filter((t) => t.status === 'PENDING').length})
        </button>
        <button
          onClick={() => setActiveTab('IN_PROGRESS')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold transition-all border-b-2 ${
            activeTab === 'IN_PROGRESS'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          جاري التنفيذ ({tasks.filter((t) => t.status === 'IN_PROGRESS').length})
        </button>
        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold transition-all border-b-2 ${
            activeTab === 'COMPLETED'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          المكتملة ({tasks.filter((t) => t.status === 'COMPLETED').length})
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">جاري تحميل المهام...</div>
      ) : filteredTasks.length === 0 ? (
        <Card className="text-center py-12">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">لا توجد مهام حالياً</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">أضف تكليفات جديدة للمحامين لمتابعة الأداء وتنظيم العمل.</p>
          <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
            إسناد مهمة الآن
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{task.title}</h3>
                  {getPriorityBadge(task.priority)}
                </div>

                {task.description && (
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {task.description}
                  </p>
                )}

                <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>المحامي المكلف: <strong className="text-slate-900">{task.assignedToLawyerName}</strong></span>
                  </div>
                  {task.caseNumber && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>القضية المرتبطة: {task.caseNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>آخر ميعاد للتنفيذ: <strong>{task.dueDate}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                >
                  <option value="PENDING">قيد الانتظار</option>
                  <option value="IN_PROGRESS">جاري التنفيذ</option>
                  <option value="COMPLETED">مكتملة</option>
                  <option value="CANCELLED">ملغاة</option>
                </select>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                  title="حذف المهمة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal: Create Task */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl border border-slate-200" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">إسناد مهمة جديدة للمحامي</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <form onSubmit={handleSubmit(handleCreateTask)} className="space-y-4">
              {actionError && (
                <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs">
                  {actionError}
                </div>
              )}

              <Input label="عنوان المهمة *" placeholder="مثال: سداد الرسوم بفرع الشهر العقاري" error={errors.title?.message} {...register('title')} />

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">المحامي المكلف بالانجاز *</label>
                <select
                  {...register('assignedToLawyerId')}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-100"
                >
                  <option value="">حدد المحامي...</option>
                  {lawyers.map((l) => (
                    <option key={l.id} value={l.id}>{l.name} ({l.specialization})</option>
                  ))}
                </select>
                {errors.assignedToLawyerId && <p className="mt-1 text-xs text-rose-600">{errors.assignedToLawyerId.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">ربط بقضية (اختياري)</label>
                <select
                  {...register('caseId')}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-100"
                >
                  <option value="">غير مرتبطة بقضية محددة</option>
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>{c.caseNumber} - {c.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input type="date" label="تاريخ الاستحقاق *" error={errors.dueDate?.message} {...register('dueDate')} />
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">الأولوية *</label>
                  <select
                    {...register('priority')}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-100"
                  >
                    <option value="MEDIUM">متوسطة</option>
                    <option value="HIGH">عالية</option>
                    <option value="LOW">عادية</option>
                  </select>
                </div>
              </div>

              <div className="text-right">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">التفاصيل والتعليمات (اختياري)</label>
                <textarea
                  rows={3}
                  {...register('description')}
                  placeholder="ملاحظات أو خطوات مطلوبة..."
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100 bg-white"
                ></textarea>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full text-xs">
                  حفظ وإرسال التكليف
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="w-full text-xs">
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