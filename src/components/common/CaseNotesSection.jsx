import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, Plus, Trash2, User, MessageSquare } from 'lucide-react';
import { Card, Button, Badge } from '../ui';
import { noteService } from '../../services/noteService';
import { useAuth } from '../../context/AuthContext';

const schema = z.object({
  content: z.string().min(3, 'الملاحظة يجب ألا تقل عن 3 أحرف'),
  visibility: z.enum(['INTERNAL', 'CLIENT_VISIBLE']),
});

export const CaseNotesSection = ({ caseItem }) => {
  const { user, userProfile, role, isAdmin } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, INTERNAL, CLIENT_VISIBLE

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      visibility: 'INTERNAL',
    },
  });

  const fetchNotes = async () => {
    if (!caseItem?.id) return;
    setLoading(true);
    const { data } = await noteService.getNotesByCase(caseItem.id, role);
    setNotes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, [caseItem?.id]);

  const onSubmit = async (data) => {
    const payload = {
      caseId: caseItem.id,
      authorId: user.uid,
      authorName: userProfile?.name || 'مستخدم',
      authorRole: role,
      lawyerId: caseItem.lawyerId || '',
      clientId: caseItem.clientId || '',
      content: data.content,
      visibility: data.visibility,
    };

    const { success } = await noteService.addNote(payload);
    if (success) {
      reset();
      fetchNotes();
    }
  };

  const handleDelete = async (noteId) => {
    if (window.confirm('هل أنت تأكد من حذف هذه الملاحظة؟')) {
      await noteService.deleteNote(noteId);
      fetchNotes();
    }
  };

  const filteredNotes = notes.filter((n) => {
    if (activeTab === 'INTERNAL') return n.visibility === 'INTERNAL';
    if (activeTab === 'CLIENT_VISIBLE') return n.visibility === 'CLIENT_VISIBLE';
    return true;
  });

  return (
    <Card className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">ملاحظات ودفتر القضية</h3>
          <p className="text-xs text-slate-500">إدارة الاستراتيجيات القانونية والتوجيهات الموجهة للعميل</p>
        </div>

        {role !== 'CLIENT' && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${activeTab === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
            >
              الكل ({notes.length})
            </button>
            <button
              onClick={() => setActiveTab('INTERNAL')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${activeTab === 'INTERNAL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
            >
              سرية سري للغاية
            </button>
            <button
              onClick={() => setActiveTab('CLIENT_VISIBLE')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${activeTab === 'CLIENT_VISIBLE' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
            >
              ملاحظات للعميل
            </button>
          </div>
        )}
      </div>

      {/* نموذج إضافة ملاحظة جديدة (للمحامي ولصاحب المكتب فقط) */}
      {role !== 'CLIENT' && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="text-right">
            <textarea
              rows={3}
              {...register('content')}
              placeholder="اكتب ملاحظة أو توجيه قانوني جديد..."
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 bg-white"
            ></textarea>
            {errors.content && <p className="mt-1 text-xs text-rose-600">{errors.content.message}</p>}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                <input type="radio" value="INTERNAL" {...register('visibility')} defaultChecked />
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                ملاحظة سرية (للمحامين والأدمن فقط)
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                <input type="radio" value="CLIENT_VISIBLE" {...register('visibility')} />
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                مرئية للعميل
              </label>
            </div>

            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting} className="gap-1.5 text-xs">
              <Plus className="w-4 h-4" />
              حفظ الملاحظة
            </Button>
          </div>
        </form>
      )}

      {/* قائمة الملاحظات */}
      {loading ? (
        <div className="py-8 text-center text-xs text-slate-500">جاري تحميل الملاحظات...</div>
      ) : filteredNotes.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          لا توجد ملاحظات مسجلة في هذا القسم حالياً.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                note.visibility === 'INTERNAL'
                  ? 'bg-amber-50/40 border-amber-200/80'
                  : 'bg-emerald-50/40 border-emerald-200/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                    <User className="w-3 h-3" />
                  </div>
                  <span className="font-bold text-slate-900">{note.authorName}</span>
                  <Badge variant={note.authorRole === 'ADMIN' ? 'warning' : 'neutral'} className="text-[9px]">
                    {note.authorRole === 'ADMIN' ? 'صاحب المكتب' : note.authorRole === 'LAWYER' ? 'محامي' : 'عميل'}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={note.visibility === 'INTERNAL' ? 'danger' : 'success'} className="gap-1 text-[9px]">
                    {note.visibility === 'INTERNAL' ? (
                      <>
                        <Lock className="w-2.5 h-2.5" />
                        سرية داخلية
                      </>
                    ) : (
                      <>
                        <Eye className="w-2.5 h-2.5" />
                        مرئية للعميل
                      </>
                    )}
                  </Badge>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="حذف الملاحظة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed pt-1 whitespace-pre-wrap">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};