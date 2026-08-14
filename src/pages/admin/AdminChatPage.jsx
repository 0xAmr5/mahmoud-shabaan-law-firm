import React, { useState, useEffect } from 'react';
import { Card, Badge } from '../../components/ui';
import { ChatBox } from '../../components/chat/ChatBox';
import { lawyerService } from '../../services/lawyerService';
import { clientService } from '../../services/clientService';
import { Users, UserCheck, MessageSquare, Search } from 'lucide-react';

export const AdminChatPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [clients, setClients] = useState([]);
  const [activeTab, setActiveTab] = useState('LAWYERS');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data: lawyersData } = await lawyerService.getAllLawyers();
      const { data: clientsData } = await clientService.getAllClients();
      setLawyers(lawyersData || []);
      setClients(clientsData || []);

      if (lawyersData && lawyersData.length > 0) {
        setSelectedUser(lawyersData[0]);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const usersList = activeTab === 'LAWYERS' ? lawyers : clients;
  const filteredUsers = usersList.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">المحادثات والرسائل الفورية</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          التواصل المباشر مع طاقم المحامين والموكلين عبر الشات اللحظي.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4 space-y-4">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => {
                setActiveTab('LAWYERS');
                if (lawyers.length > 0) setSelectedUser(lawyers[0]);
              }}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'LAWYERS'
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              فريق المحامين ({lawyers.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('CLIENTS');
                if (clients.length > 0) setSelectedUser(clients[0]);
              }}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'CLIENTS'
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              الموكلين ({clients.length})
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute right-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="بحث بالاسم أو الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-800"
            />
          </div>

          <div className="space-y-1.5 max-h-[420px] overflow-y-auto">
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">جاري تحميل المستخدمين...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">لا يوجد مستخدمون في هذا القسم.</div>
            ) : (
              filteredUsers.map((u) => (
                <button
                  key={u.id || u.uid}
                  onClick={() => setSelectedUser(u)}
                  className={`w-full p-3 rounded-xl text-right transition-all flex items-center justify-between border ${
                    (selectedUser?.id || selectedUser?.uid) === (u.id || u.uid)
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-800 border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold">{u.name}</h4>
                    <span className="text-[10px] opacity-70 block mt-0.5">{u.phone || u.email}</span>
                  </div>
                  <Badge variant={activeTab === 'LAWYERS' ? 'warning' : 'neutral'} className="text-[9px]">
                    {activeTab === 'LAWYERS' ? 'محامي' : 'موكل'}
                  </Badge>
                </button>
              ))
            )}
          </div>
        </Card>

        <div className="lg:col-span-2">
          {selectedUser ? (
            <ChatBox
              recipientUser={{
                uid: selectedUser.uid || selectedUser.id,
                name: selectedUser.name,
                role: selectedUser.role || (activeTab === 'LAWYERS' ? 'LAWYER' : 'CLIENT'),
              }}
            />
          ) : (
            <Card className="h-[520px] flex items-center justify-center text-xs text-slate-400">
              اختر شخصاً للبدء في المحادثة الفورية.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};