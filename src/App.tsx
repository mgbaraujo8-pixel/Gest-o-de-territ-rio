import { useState, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Info, Menu, Search, Filter, Map as MapIcon, List, Maximize2, Minimize2, Calendar, BarChart3, Route, Clock, ChevronRight, Plus, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import MapComponent from './components/MapComponent';
import { Visit, allEquipments, Referral } from './data/equipments';

const SocialWorkIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Flame - Red */}
    <path 
      d="M12 2c0 0-1.5 2-1.5 4.5s1.5 3.5 1.5 3.5 1.5-1 1.5-3.5-1.5-4.5-1.5-4.5z" 
      fill="#ef4444" 
    />
    <path 
      d="M10.5 4c0 0-1.5 1.5-1.5 3.5s1.5 2.5 1.5 2.5" 
      stroke="#ef4444" 
      strokeWidth="1"
      strokeLinecap="round"
    />
    <path 
      d="M13.5 4c0 0 1.5 1.5 1.5 3.5s-1.5 2.5-1.5 2.5" 
      stroke="#ef4444" 
      strokeWidth="1"
      strokeLinecap="round"
    />
    
    {/* Torch Body - Green */}
    <path 
      d="M10.5 10h3l-1.5 12h-0.5l-1-12z" 
      fill="#057A55" 
    />
    <path 
      d="M9 9h6v1.5h-6z" 
      fill="#057A55" 
    />

    {/* Balance Scale Bar - Green */}
    <path 
      d="M4 12c3-1.5 5-1.5 8-1.5s5 0 8 1.5" 
      stroke="#057A55" 
      strokeWidth="1.2" 
      strokeLinecap="round"
    />

    {/* Left Scale - Green */}
    <path d="M4 12l-2.5 6h5l-2.5-6z" stroke="#057A55" strokeWidth="0.8" fill="none" />
    <path d="M1.5 18h5" stroke="#057A55" strokeWidth="0.8" />
    
    {/* Right Scale - Green */}
    <path d="M20 12l-2.5 6h5l-2.5-6z" stroke="#057A55" strokeWidth="0.8" fill="none" />
    <path d="M17.5 18h5" stroke="#057A55" strokeWidth="0.8" />
  </svg>
);

type Tab = 'territorios' | 'agendamento' | 'relatorios' | 'planejamento';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('territorios');
  const [isExpanded, setIsExpanded] = useState(false);
  const [equipCount, setEquipCount] = useState(0);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  
  // New Referral Form State
  const [newReferral, setNewReferral] = useState<Partial<Referral>>({
    personName: '',
    targetEquipmentId: 1,
    professional: 'Natalia Rocha',
    reason: '',
    status: 'Ativo'
  });

  const tabs = [
    { id: 'territorios' as Tab, label: 'Territórios', icon: <MapPin className="w-4 h-4" /> },
    { id: 'agendamento' as Tab, label: 'Agendamento', icon: <Calendar className="w-4 h-4" /> },
    { id: 'relatorios' as Tab, label: 'Relatórios', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'planejamento' as Tab, label: 'Planejamento', icon: <Route className="w-4 h-4" /> },
  ];

  // Report Data
  const policyStats = useMemo(() => {
    const categories: Record<string, number> = {};
    allEquipments.forEach(eq => {
      categories[eq.policy] = (categories[eq.policy] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, []);

  const ageData = useMemo(() => {
    const ageGroups: Record<string, number> = {
      'Criança': 0,
      'Adolescente': 0,
      'Adulto': 0,
      'Idoso': 0
    };
    visits.forEach(v => {
      v.ageGroups.forEach(age => {
        if (ageGroups[age] !== undefined) ageGroups[age]++;
      });
    });
    return Object.entries(ageGroups).map(([name, value]) => ({ name, value }));
  }, [visits]);

  const totalPublicReached = useMemo(() => {
    return ageData.reduce((acc, v) => acc + v.value, 0);
  }, [ageData]);

  const handleAddReferral = (e: FormEvent) => {
    e.preventDefault();
    if (!newReferral.personName || !newReferral.targetEquipmentId) return;

    const referral: Referral = {
      id: Date.now(),
      personName: newReferral.personName,
      targetEquipmentId: Number(newReferral.targetEquipmentId),
      date: new Date().toLocaleDateString('pt-BR'),
      professional: newReferral.professional || 'Natalia Rocha',
      reason: newReferral.reason || '',
      status: 'Ativo'
    };

    setReferrals(prev => [referral, ...prev]);
    setNewReferral({
      personName: '',
      targetEquipmentId: 1,
      professional: 'Natalia Rocha',
      reason: '',
      status: 'Ativo'
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1C1E] font-sans selection:bg-emerald-200">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4 transition-all duration-500 ${isExpanded ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="hidden md:flex items-center bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/50' 
                    : 'text-slate-500 hover:text-emerald-500'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="h-8 w-[1px] bg-slate-200 hidden md:block" />
            <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 md:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border-2 border-white shadow-sm flex items-center justify-center">
                <SocialWorkIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 uppercase">Complexo Social Mais Infância</span>
                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">João XXIII</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className={`pt-32 pb-12 px-6 max-w-7xl mx-auto transition-all duration-500 ${isExpanded ? 'pt-0 max-w-none px-0 overflow-hidden' : ''}`}>
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 ${isExpanded ? 'block' : ''}`}>
          
          {/* Left Sidebar / Info */}
          <AnimatePresence mode="wait">
            {!isExpanded && (
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="lg:col-span-4 space-y-12"
              >
                <div className="space-y-6">
                  <h2 className="text-6xl md:text-7xl font-bold leading-[0.85] tracking-tighter italic serif text-slate-900">
                    {activeTab === 'territorios' && <>{'Gestão do '}<br /><span className="text-emerald-600 underline decoration-emerald-200 underline-offset-8">Território.</span></>}
                    {activeTab === 'agendamento' && <>{'Agenda de '}<br /><span className="text-emerald-600 underline decoration-emerald-200 underline-offset-8">Visitas.</span></>}
                    {activeTab === 'relatorios' && <>{'Análise de '}<br /><span className="text-emerald-600 underline decoration-emerald-200 underline-offset-8">Dados.</span></>}
                    {activeTab === 'planejamento' && <>{'Rotas de '}<br /><span className="text-emerald-600 underline decoration-emerald-200 underline-offset-8">Viagem.</span></>}
                  </h2>
                  <p className="text-lg text-slate-500 leading-relaxed font-medium">
                    {activeTab === 'territorios' && "Plataforma de visualização e análise de equipamentos públicos. Monitore a distribuição de serviços e infraestrutura no território."}
                    {activeTab === 'agendamento' && "Organize e gerencie as visitas técnicas aos equipamentos do território de forma integrada."}
                    {activeTab === 'relatorios' && "Visualize indicadores e estatísticas detalhadas sobre os equipamentos e atendimentos realizados."}
                    {activeTab === 'planejamento' && "Planeje rotas eficientes para otimizar as visitas de campo da equipe."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-8 bg-white rounded-[32px] border border-black/5 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative">
                      <div className="text-5xl font-black text-emerald-600 mb-2 tracking-tighter">{visits.length}</div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Visitas</div>
                    </div>
                  </div>
                  <div className="p-8 bg-white rounded-[32px] border border-black/5 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative">
                      <div className="text-5xl font-black text-emerald-600 mb-2 tracking-tighter">{equipCount}</div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Ativos</div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-slate-900 rounded-[40px] text-white space-y-8 relative overflow-hidden shadow-2xl shadow-slate-300">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-[80px] -mr-24 -mt-24" />
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400">Status Operacional</h3>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-30" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-30" />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      { label: "Equipamentos Georreferenciados", value: "100%", color: "emerald-500" },
                      { label: "Visitas Planejadas (Semana)", value: "12", color: "blue-400" },
                      { label: "Bairros Cobertos", value: "14", color: "amber-400" }
                    ].map((stat, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-xs font-medium text-slate-400">{stat.label}</span>
                          <span className="text-sm font-bold font-mono tracking-tighter">{stat.value}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: stat.value.includes('%') ? stat.value : '60%' }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                            className={`h-full bg-${stat.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-4 bg-emerald-600 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/40 active:scale-95">
                    Exportar Relatório PDF
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Container */}
          <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              height: isExpanded ? '100vh' : (activeTab === 'territorios' ? '800px' : 'auto')
            }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className={`${isExpanded ? 'fixed inset-0 z-[60] h-screen w-screen bg-white' : 'lg:col-span-8 sticky top-28'}`}
          >
            {activeTab === 'territorios' && (
              <MapComponent 
                onToggleExpand={() => setIsExpanded(!isExpanded)} 
                isExpanded={isExpanded} 
                onCountChange={setEquipCount}
                onVisitRecorded={(visit: Visit) => setVisits(prev => [...prev, visit])}
                visitHistory={visits}
              />
            )}
            {activeTab === 'agendamento' && (
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-black/5 min-h-[500px]">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Calendar className="text-emerald-600" /> Agendar Nova Visita
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-bold opacity-60">Equipamento</label>
                    <input type="text" className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-emerald-200" placeholder="Buscar equipamento..." />
                    
                    <label className="block text-sm font-bold opacity-60">Endereço</label>
                    <input type="text" className="w-full p-3 bg-slate-50 rounded-xl border-none opacity-50" readOnly placeholder="Endereço automático" />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold opacity-60">Data</label>
                        <input type="date" className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-emerald-200" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold opacity-60">Horário</label>
                        <input type="time" className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-emerald-200" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold opacity-60">Profissional Responsável</label>
                    <select className="w-full p-3 bg-slate-50 rounded-xl border-none appearance-none outline-none focus:ring-2 focus:ring-emerald-200">
                      <option>Natalia Rocha (Assistente Social)</option>
                      <option>Luciana Matias (Assistente Social)</option>
                      <option>Monaliza Oliveira (Estagiária)</option>
                      <option>Gabriela Souza (Estagiária)</option>
                    </select>

                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                      <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-emerald-800">Reserva de Carro</p>
                        <p className="text-xs text-emerald-600 mt-1">Ao agendar, uma mensagem será enviada automaticamente para o Paulo para reserva do veículo.</p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-2xl border border-black/5">
                      <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2">Mensagem para Paulo</p>
                      <p className="text-xs italic text-slate-500">"Olá Paulo, gostaria de reservar um veículo para uma visita técnica no dia [Data] às [Horário]..."</p>
                    </div>

                    <button className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 mt-4 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                       Agendar e Reservar <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'relatorios' && (
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-black/5 min-h-[500px]">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <BarChart3 className="text-emerald-600" /> Relatórios de Gestão
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-slate-50 p-6 rounded-2xl text-center">
                    <div className="text-4xl font-bold text-slate-800">{allEquipments.length}</div>
                    <div className="text-xs uppercase font-bold opacity-40 mt-1">Equipamentos</div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl text-center">
                    <div className="text-4xl font-bold text-emerald-600">{visits.length}</div>
                    <div className="text-xs uppercase font-bold opacity-40 mt-1">Visitas</div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl text-center">
                    <div className="text-4xl font-bold text-blue-600">{referrals.length}</div>
                    <div className="text-xs uppercase font-bold opacity-40 mt-1">Encaminhamentos</div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl text-center">
                    <div className="text-4xl font-bold text-amber-600">{totalPublicReached}</div>
                    <div className="text-xs uppercase font-bold opacity-40 mt-1">Público Atendido</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <h4 className="text-sm font-bold uppercase tracking-widest opacity-40 mb-6 font-sans">Equipamentos por Política</h4>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={policyStats} layout="vertical">
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" width={100} fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip cursor={{fill: '#f1f5f9'}} />
                          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {policyStats.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#22c55e', '#6366f1'][index % 6]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6">
                    <h4 className="text-sm font-bold uppercase tracking-widest opacity-40 mb-6">Atendimento por Faixa Etária</h4>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={ageData} 
                            dataKey="value" 
                            nameKey="name" 
                            cx="50%" 
                            cy="50%" 
                            innerRadius={60} 
                            outerRadius={80} 
                            paddingAngle={5} 
                            fill="#057A55"
                            label={({name, value}) => value > 0 ? `${name}: ${value}` : ''}
                          >
                             {ageData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#ef4444'][index % 4]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Referral Section */}
                <div className="border-t border-slate-100 pt-12">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* New Referral Form */}
                    <div className="lg:col-span-4 space-y-6">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Novo Encaminhamento</h4>
                        <p className="text-xs text-slate-500 mt-1">Registre um encaminhamento de uma pessoa para um equipamento da rede.</p>
                      </div>
                      <form onSubmit={handleAddReferral} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nome da Pessoa/Usuário</label>
                          <input 
                            required
                            type="text" 
                            value={newReferral.personName}
                            onChange={e => setNewReferral({...newReferral, personName: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-200 outline-none text-sm transition-all"
                            placeholder="Nome completo..."
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Equipamento de Destino</label>
                          <select 
                            required
                            value={newReferral.targetEquipmentId}
                            onChange={e => setNewReferral({...newReferral, targetEquipmentId: Number(e.target.value)})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-200 outline-none text-sm transition-all appearance-none"
                          >
                            {allEquipments.sort((a,b) => a.name.localeCompare(b.name)).map(eq => (
                              <option key={eq.id} value={eq.id}>{eq.name} ({eq.neighborhood})</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Motivo do Encaminhamento</label>
                          <textarea 
                            rows={3}
                            value={newReferral.reason}
                            onChange={e => setNewReferral({...newReferral, reason: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-200 outline-none text-sm transition-all resize-none"
                            placeholder="Breve descrição do motivo..."
                          />
                        </div>
                        <button type="submit" className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all text-xs uppercase tracking-widest">
                          Registrar Encaminhamento
                        </button>
                      </form>
                    </div>

                    {/* Referral History */}
                    <div className="lg:col-span-8 space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-bold text-slate-900">Histórico de Encaminhamentos</h4>
                        <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-500">{referrals.length} Total</span>
                      </div>
                      
                      {referrals.length === 0 ? (
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                          <p className="text-sm text-slate-400 italic">Nenhum encaminhamento registrado até o momento.</p>
                        </div>
                      ) : (
                        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden divide-y divide-slate-100">
                          {referrals.map(ref => {
                            const equipment = allEquipments.find(e => e.id === ref.targetEquipmentId);
                            return (
                              <div key={ref.id} className="p-6 hover:bg-slate-50 transition-colors group">
                                <div className="flex justify-between items-start">
                                  <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                      {ref.personName.charAt(0)}
                                    </div>
                                    <div>
                                      <h5 className="font-bold text-slate-900">{ref.personName}</h5>
                                      <div className="flex items-center gap-2 mt-1">
                                        <ArrowRight className="w-3 h-3 text-slate-300" />
                                        <span className="text-xs font-medium text-emerald-600">{equipment?.name}</span>
                                      </div>
                                      {ref.reason && (
                                        <p className="text-xs text-slate-500 mt-2 italic">"{ref.reason}"</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{ref.date}</div>
                                    <div className="text-[9px] font-black text-slate-300 mt-1 uppercase">{ref.professional}</div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'planejamento' && (
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-black/5 min-h-[500px] flex flex-col items-center justify-center text-center">
                <Route className="w-16 h-16 text-emerald-200 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Planejamento de Viagem</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8">
                  Crie rotas otimizadas para suas visitas territoriais. Adicione pontos de interesse para calcular o melhor trajeto.
                </p>
                <div className="max-w-md w-full p-6 bg-slate-50 rounded-3xl border border-black/5 text-left mb-8">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="w-2 h-2 rounded-full bg-emerald-500" />
                     <span className="text-sm font-medium">Ponto de Partida: Regional 11</span>
                   </div>
                   <div className="border-l-2 border-dashed border-slate-200 ml-1 py-4 px-3 space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-xs font-bold text-slate-400 italic">Nenhum equipamento selecionado...</span>
                         <Plus className="w-4 h-4 text-emerald-600 cursor-pointer" />
                      </div>
                   </div>
                   <div className="flex items-center gap-3 mt-4">
                     <div className="w-2 h-2 rounded-full bg-slate-400" />
                     <span className="text-sm font-medium">Fim da Rota</span>
                   </div>
                </div>
                <button 
                   onClick={() => setActiveTab('territorios')}
                   className="bg-emerald-600 text-white font-bold px-8 py-3 rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                >
                  Selecionar no Mapa
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-black/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-sm opacity-50">
            © 2024 Mapeamento de Equipamentos. Regional 11 - Gestão Territorial.
          </div>
          <div className="flex gap-6 text-sm font-bold uppercase tracking-widest opacity-50">
            <a href="#" className="hover:opacity-100">Privacidade</a>
            <a href="#" className="hover:opacity-100">Termos</a>
            <a href="#" className="hover:opacity-100">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

