import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import 'leaflet.markercluster';
import { useState, useMemo, useEffect, Dispatch, SetStateAction } from 'react';
import { createPortal } from 'react-dom';
import { Filter, Map as MapIcon, List, Plus, Edit2, X, Save, MapPin, Maximize2, Minimize2, Navigation, Search, CheckSquare, Square, User, ClipboardList } from 'lucide-react';
import { motion } from 'motion/react';
import { Equipment, Visit } from '../data/equipments';
import { supabase } from '../lib/supabase';

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const FORTALEZA_COORDS: [number, number] = [-3.7319, -38.5267];

// Component to handle map clicks for coordinate selection
function MapClickHandler({ onMapClick, active }: { onMapClick: (lat: number, lng: number) => void, active: boolean }) {
  useMapEvents({
    click(e) {
      if (active) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

// Component to handle map invalidation and data count reporting
function MapEvents({ onCountChange, data, isExpanded, viewMode }: { onCountChange?: (count: number) => void, data: Equipment[], isExpanded: boolean, viewMode: string }) {
  const map = useMap();
  
  useEffect(() => {
    if (onCountChange) {
      onCountChange(data.length);
    }
  }, [data, onCountChange]);

  // Fix map rendering issues when container resized or toggled
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 500); // Wait for animations to finish
    return () => clearTimeout(timer);
  }, [map, isExpanded, viewMode]);

  return null;
}

const getCustomIcon = (policy: string) => {
  let color = '#10b981'; // Default emerald
  let iconPath = '<circle cx="12" cy="12" r="10"/>'; // Default circle
  
  const p = policy.toLowerCase();
  
  if (p.includes('saúde')) {
    color = '#ef4444'; // Red
    iconPath = '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>';
  } else if (p.includes('educação')) {
    color = '#3b82f6'; // Blue
    iconPath = '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>';
  } else if (p.includes('assistência') || p.includes('proteção')) {
    color = '#f59e0b'; // Amber
    iconPath = '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>';
  } else if (p.includes('cultura')) {
    color = '#8b5cf6'; // Violet
    iconPath = '<path d="m12 19 7-7 3 3-7 7-3-3Z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5Z"/><path d="m2 2 5 5"/><path d="m8.5 8.5 1.5 1.5"/>';
  } else if (p.includes('esporte') || p.includes('lazer')) {
    color = '#22c55e'; // Green
    iconPath = '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>';
  } else if (p.includes('trabalho') || p.includes('qualificação')) {
    color = '#6366f1'; // Indigo
    iconPath = '<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>';
  } else if (p.includes('mulher') || p.includes('humanos') || p.includes('lgbt')) {
    color = '#ec4899'; // Pink
    iconPath = '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>';
  } else if (p.includes('justiça')) {
    color = '#64748b'; // Slate
    iconPath = '<path d="M12 3v18"/><path d="M5 8h14"/><path d="M15 13a3 3 0 1 1-6 0"/>';
  }

  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color};" class="w-6 h-6 rounded-full border border-white shadow-md flex items-center justify-center text-white transform hover:scale-125 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconPath}</svg>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const categories = ["Todas", "Saúde", "Educação", "Assistência Social", "Cultura", "Esporte e Lazer", "Trabalho", "Direitos da Mulher", "Direitos Humanos"];

const neighborhoods = [
  "Todos",
  "Autran Nunes",
  "Bela Vista",
  "Conjunto Ceará I",
  "Conjunto Ceará II",
  "Couto Fernandes",
  "Demócrito Rocha",
  "Dom Lustosa",
  "Genibaú",
  "Henrique Jorge",
  "João XXIII",
  "Jóquei Clube",
  "Panamericano",
  "Pici"
];

const getCategoryColor = (policy: string) => {
  const p = policy.toLowerCase();
  if (p.includes('saúde')) return '#ef4444';
  if (p.includes('educação')) return '#3b82f6';
  if (p.includes('assistência') || p.includes('proteção')) return '#f59e0b';
  if (p.includes('cultura')) return '#8b5cf6';
  if (p.includes('esporte') || p.includes('lazer')) return '#22c55e';
  if (p.includes('trabalho') || p.includes('qualificação')) return '#6366f1';
  if (p.includes('mulher') || p.includes('humanos') || p.includes('lgbt')) return '#ec4899';
  if (p.includes('justiça')) return '#64748b';
  return '#10b981';
};

// Component to handle marker clustering with fine-tuned settings
const MarkerClusterer = ({ data, onEdit }: { data: Equipment[], onEdit: (e: Equipment) => void }) => {
  const map = useMap();

  useEffect(() => {
    const clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      zoomToBoundsOnClick: true,
      chunkedLoading: true,
      maxClusterRadius: 30, // Reduced radius to keep markers closer to their real spots
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div class="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs">
                  ${count}
                 </div>`,
          className: 'custom-cluster-icon',
          iconSize: [32, 32],
        });
      },
    });

    data.forEach((loc) => {
      const marker = L.marker(loc.coords, {
        icon: getCustomIcon(loc.policy)
      });
      
      const popupDiv = document.createElement('div');
      popupDiv.className = 'p-2 min-w-[200px]';
      popupDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
          <div style="color: ${getCategoryColor(loc.policy)}; font-weight: bold; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em;">
            ${loc.policy} • ${loc.type}
          </div>
        </div>
        <h3 style="font-weight: bold; font-size: 16px; color: #0f172a; line-height: 1.25; margin-bottom: 8px;">${loc.name}</h3>
        <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: #475569;">
          <p><span style="font-weight: bold; color: #1e293b;">Bairro:</span> ${loc.neighborhood}</p>
          <p><span style="font-weight: bold; color: #1e293b;">Endereço:</span> ${loc.address}</p>
          <p><span style="font-weight: bold; color: #1e293b;">Órgão:</span> ${loc.organ}</p>
          ${loc.contact ? `<p><span style="font-weight: bold; color: #1e293b;">Contato:</span> ${loc.contact}</p>` : ''}
          ${loc.reference ? `<p><span style="font-weight: bold; color: #1e293b;">Referência:</span> ${loc.reference}</p>` : ''}
          ${loc.observations ? `<p><span style="font-weight: bold; color: #1e293b;">Observações:</span> ${loc.observations}</p>` : ''}
        </div>
        
        <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 8px;">
          <button id="visit-btn-${loc.id}" style="width: 100%; padding: 10px; background: #057A55; border-radius: 8px; font-size: 12px; font-weight: bold; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 2px 4px rgba(5, 122, 85, 0.2);">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>
            Adicionar Informação
          </button>

          <a 
            href="https://www.google.com/maps/dir/?api=1&destination=${loc.coords[0]},${loc.coords[1]}" 
            target="_blank" 
            rel="noopener noreferrer"
            style="width: 100%; padding: 8px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 11px; font-weight: bold; color: #475569; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 6px;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            Como Chegar
          </a>
          
          <button id="edit-btn-${loc.id}" style="width: 100%; padding: 8px; background: #f1f5f9; border-radius: 8px; font-size: 11px; font-weight: bold; color: #64748b; border: 1px solid #e2e8f0; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            Editar Equipamento
          </button>
        </div>
      `;

      // Handle buttons click inside the popup
      marker.on('popupopen', () => {
        const editBtn = document.getElementById(`edit-btn-${loc.id}`);
        if (editBtn) {
          editBtn.onclick = () => {
            onEdit(loc);
            marker.closePopup();
          };
        }

        const visitBtn = document.getElementById(`visit-btn-${loc.id}`);
        if (visitBtn) {
          visitBtn.onclick = () => {
            // This will be handled in MapComponent via state
            window.dispatchEvent(new CustomEvent('open-visit-form', { detail: loc }));
            marker.closePopup();
          };
        }
      });
      
      marker.bindPopup(popupDiv, { className: 'custom-popup' });
      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);

    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [map, data, onEdit]);

  return null;
};

export default function MapComponent({ 
  onToggleExpand, 
  isExpanded, 
  onCountChange, 
  onVisitRecorded, 
  visitHistory,
  externalEquipments,
  onEquipmentsChange
}: { 
  onToggleExpand: () => void, 
  isExpanded: boolean,
  onCountChange?: (count: number) => void,
  onVisitRecorded?: (visit: Visit) => void,
  visitHistory?: Visit[],
  externalEquipments: Equipment[],
  onEquipmentsChange: Dispatch<SetStateAction<Equipment[]>>
}) {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  
  // Use parent's equipments
  const equipments = externalEquipments;
  const setEquipments = onEquipmentsChange;
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquip, setEditingEquip] = useState<Partial<Equipment> | null>(null);
  const [isSelectingCoords, setIsSelectingCoords] = useState(false);

  // Visit Form State
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [activeVisit, setActiveVisit] = useState<Partial<Visit> | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      setActiveVisit({
        equipmentId: e.detail.id,
        date: new Date().toISOString().split('T')[0],
        ageGroups: [],
        objectives: [],
        professional: 'Natalia Rocha',
        intern: 'Nenhuma',
        synthesis: '',
      });
      setIsVisitModalOpen(true);
    };
    window.addEventListener('open-visit-form', handler);
    return () => window.removeEventListener('open-visit-form', handler);
  }, []);

  const filteredData = useMemo(() => {
    return equipments.filter(item => {
      const matchesCategory = selectedCategory === "Todas" || 
        item.policy.toLowerCase().includes(selectedCategory.toLowerCase()) || 
        selectedCategory.toLowerCase().includes(item.policy.toLowerCase());
      
      const matchesNeighborhood = selectedNeighborhood === "Todos" || 
        item.neighborhood.toLowerCase() === selectedNeighborhood.toLowerCase();
      
      const matchesSearch = searchQuery === "" || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesNeighborhood && matchesSearch;
    });
  }, [selectedCategory, selectedNeighborhood, searchQuery, equipments]);

  const handleVisitSave = async (e: any) => {
    e.preventDefault();
    if (!activeVisit || !onVisitRecorded) return;

    const visitData = {
      equipment_id: activeVisit.equipmentId,
      date: activeVisit.date,
      professional: activeVisit.professional,
      intern: activeVisit.intern || 'Nenhuma',
      age_groups: activeVisit.ageGroups,
      objectives: activeVisit.objectives,
      other_objective: activeVisit.otherObjective || '',
      synthesis: activeVisit.synthesis
    };

    const { data, error } = await supabase
      .from('visits')
      .insert([visitData])
      .select()
      .single();

    if (error) {
      console.error('Error saving visit:', error);
      return;
    }

    if (data) {
      const newVisit: Visit = {
        ...activeVisit,
        id: data.id,
      } as Visit;

      onVisitRecorded(newVisit);
    }
    
    setIsVisitModalOpen(false);
    setActiveVisit(null);
  };

  const professionals = ['Natalia Rocha', 'Luciana Matias'];
  const interns = ['Nenhuma', 'Monaliza Oliveira', 'Gabriela Souza'];
  const ageGroups = ['Criança', 'Adolescente', 'Adulto', 'Idoso'];
  const visitObjectives = [
    'Articulação e fortalecimento da rede',
    'Mapeamento territorial',
    'Alinhamento de fluxos de encaminhamento',
    'Identificação de parcerias intersetoriais',
    'Outro'
  ];

  useEffect(() => {
    if (onCountChange) {
      onCountChange(filteredData.length);
    }
  }, [filteredData, onCountChange]);

  const handleSave = async (e: any) => {
    e.preventDefault();
    if (!editingEquip) return;

    const equipData = {
      name: editingEquip.name,
      policy: editingEquip.policy,
      type: editingEquip.type,
      address: editingEquip.address,
      neighborhood: editingEquip.neighborhood,
      organ: editingEquip.organ,
      contact: editingEquip.contact,
      reference: editingEquip.reference,
      observations: editingEquip.observations,
      latitude: editingEquip.coords ? editingEquip.coords[0] : FORTALEZA_COORDS[0],
      longitude: editingEquip.coords ? editingEquip.coords[1] : FORTALEZA_COORDS[1]
    };

    if (editingEquip.id) {
      const { data, error } = await supabase
        .from('equipments')
        .update(equipData)
        .eq('id', editingEquip.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating equipment:', error);
        return;
      }

      if (data) {
        const updated: Equipment = {
          ...data,
          coords: [data.latitude, data.longitude]
        };
        setEquipments((prev: Equipment[]) => prev.map(item => item.id === editingEquip.id ? updated : item));
      }
    } else {
      const { data, error } = await supabase
        .from('equipments')
        .insert([equipData])
        .select()
        .single();

      if (error) {
        console.error('Error creating equipment:', error);
        return;
      }

      if (data) {
        const created: Equipment = {
          ...data,
          coords: [data.latitude, data.longitude]
        };
        setEquipments((prev: Equipment[]) => [created, ...prev]);
      }
    }

    setIsModalOpen(false);
    setEditingEquip(null);
    setIsSelectingCoords(false);
  };

  const openAddModal = () => {
    setEditingEquip({
      name: '',
      policy: 'Saúde',
      type: '',
      address: '',
      neighborhood: '',
      organ: '',
      contact: '',
      reference: '',
      observations: '',
      coords: FORTALEZA_COORDS
    });
    setIsModalOpen(true);
  };

  const openEditModal = (equip: Equipment) => {
    setEditingEquip(equip);
    setIsModalOpen(true);
  };

  return (
    <div className="h-full w-full flex flex-col gap-4">
      {/* Refined Control Bar */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* Top Section: Search & Main Actions */}
        <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center border-b border-slate-50">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar por nome ou endereço..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent focus:border-emerald-200 focus:bg-white rounded-2xl outline-none text-sm transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-2xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Adicionar Equipamento</span>
            </button>

            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              <button 
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <MapIcon className="w-4 h-4" />
                <span className="hidden lg:inline">Mapa</span>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <List className="w-4 h-4" />
                <span className="hidden lg:inline">Lista</span>
              </button>
            </div>

            <button 
              onClick={onToggleExpand}
              className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-600 transition-all active:scale-95"
              title={isExpanded ? "Recolher" : "Expandir"}
            >
              {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Bottom Section: Filters */}
        <div className="px-6 py-4 bg-slate-50/50 flex flex-col gap-4">
          {/* Neighborhood Select and Tags Combined */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-600">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Bairro</span>
              <select 
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer border-b-2 border-emerald-200 pb-0.5"
              >
                {neighborhoods.map(nb => <option key={nb} value={nb}>{nb}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-600 shrink-0">
                <Filter className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 shrink-0">Política Pública</span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all whitespace-nowrap border ${
                      selectedCategory === cat 
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100' 
                        : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative bg-white">
        {viewMode === 'map' ? (
          <MapContainer 
            center={FORTALEZA_COORDS} 
            zoom={13} 
            scrollWheelZoom={true}
            className="h-full w-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler 
              active={isSelectingCoords} 
              onMapClick={(lat, lng) => {
                setEditingEquip(prev => prev ? { ...prev, coords: [lat, lng] } : null);
                setIsSelectingCoords(false);
              }} 
            />
            <MapEvents 
              data={filteredData} 
              onCountChange={onCountChange} 
              isExpanded={isExpanded}
              viewMode={viewMode}
            />
            <MarkerClusterer data={filteredData} onEdit={openEditModal} />
          </MapContainer>
        ) : (
          <div className="h-full overflow-y-auto p-6 space-y-4">
            {filteredData.map((item, index) => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group flex gap-4">
                <div 
                  style={{ backgroundColor: getCategoryColor(item.policy) }}
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm"
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span 
                        style={{ color: getCategoryColor(item.policy), backgroundColor: `${getCategoryColor(item.policy)}15` }}
                        className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                      >
                        {item.policy}
                      </span>
                      <h4 className="font-bold text-slate-900 mt-1">{item.name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{item.type}</span>
                      <button 
                        onClick={() => openEditModal(item)}
                        className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-emerald-600 transition-all shadow-sm border border-transparent hover:border-emerald-100"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                    <p><span className="font-bold text-slate-700">Bairro:</span> {item.neighborhood}</p>
                    <p><span className="font-bold text-slate-700">Órgão:</span> {item.organ}</p>
                    <p className="col-span-2"><span className="font-bold text-slate-700">Endereço:</span> {item.address}</p>
                    {item.contact && <p><span className="font-bold text-slate-700">Contato:</span> {item.contact}</p>}
                    {item.reference && <p><span className="font-bold text-slate-700">Referência:</span> {item.reference}</p>}
                    {item.observations && <p className="col-span-2"><span className="font-bold text-slate-700">Observações:</span> {item.observations}</p>}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => {
                        setActiveVisit({
                          equipmentId: item.id,
                          date: new Date().toISOString().split('T')[0],
                          ageGroups: [],
                          objectives: [],
                          professional: 'Natalia Rocha',
                          synthesis: ''
                        });
                        setIsVisitModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 transition-all shadow-md"
                    >
                      <Plus className="w-3 h-3" />
                      ADICIONAR INFORMAÇÃO
                    </button>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${item.coords[0]},${item.coords[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-200 transition-all border border-slate-200"
                    >
                      <Navigation className="w-3 h-3" />
                      COMO CHEGAR
                    </a>
                  </div>
                </div>
              </div>
            ))}
            {filteredData.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                <Filter className="w-8 h-8 opacity-20" />
                <p>Nenhum equipamento encontrado nesta categoria.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && editingEquip && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                {editingEquip.id ? <Edit2 className="w-5 h-5 text-emerald-600" /> : <Plus className="w-5 h-5 text-emerald-600" />}
                {editingEquip.id ? 'Editar Equipamento' : 'Novo Equipamento'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nome do Equipamento</label>
                  <input 
                    required
                    value={editingEquip.name}
                    onChange={e => setEditingEquip({ ...editingEquip, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm"
                    placeholder="Ex: UBS João XXIII"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Política Pública</label>
                  <select 
                    value={editingEquip.policy}
                    onChange={e => setEditingEquip({ ...editingEquip, policy: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm bg-white"
                  >
                    {categories.filter(c => c !== 'Todas').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tipo de Equipamento</label>
                  <input 
                    required
                    value={editingEquip.type}
                    onChange={e => setEditingEquip({ ...editingEquip, type: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm"
                    placeholder="Ex: UBS, CRAS, Escola"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Órgão Responsável</label>
                  <input 
                    required
                    value={editingEquip.organ}
                    onChange={e => setEditingEquip({ ...editingEquip, organ: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm"
                    placeholder="Ex: SMS, SME, SDHDS"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Endereço Completo</label>
                  <input 
                    required
                    value={editingEquip.address}
                    onChange={e => setEditingEquip({ ...editingEquip, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm"
                    placeholder="Rua, Número, Complemento"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Bairro</label>
                  <input 
                    required
                    value={editingEquip.neighborhood}
                    onChange={e => setEditingEquip({ ...editingEquip, neighborhood: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm"
                    placeholder="Ex: Bonsucesso"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Contato</label>
                  <input 
                    value={editingEquip.contact}
                    onChange={e => setEditingEquip({ ...editingEquip, contact: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm"
                    placeholder="(85) 0000-0000"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pessoa de Referência / Público</label>
                  <input 
                    value={editingEquip.reference}
                    onChange={e => setEditingEquip({ ...editingEquip, reference: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm"
                    placeholder="Nome ou descrição do público"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Observações</label>
                  <textarea 
                    value={editingEquip.observations || ''}
                    onChange={e => setEditingEquip({ ...editingEquip, observations: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm min-h-[80px]"
                    placeholder="Informações adicionais sobre o equipamento..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Localização (Lat, Lng)</label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-500 font-mono flex items-center">
                      {editingEquip.coords?.[0].toFixed(6)}, {editingEquip.coords?.[1].toFixed(6)}
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        setIsSelectingCoords(true);
                        setViewMode('map');
                      }}
                      className={`px-4 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold ${
                        isSelectingCoords 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600 animate-pulse' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      {isSelectingCoords ? 'Clique no Mapa' : 'Selecionar'}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Observações</label>
                  <textarea 
                    value={editingEquip.observations}
                    onChange={e => setEditingEquip({ ...editingEquip, observations: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm min-h-[100px]"
                    placeholder="Informações adicionais importantes..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-top border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar Equipamento
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Visit Information Modal */}
      {isVisitModalOpen && activeVisit && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-emerald-50/20">
              <div className="flex items-center gap-5">
                <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-xl shadow-emerald-200">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Scribere • <span className="text-emerald-600 italic serif font-bold">Visita Técnica</span></h2>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1">
                    Registro de campo Regional 11
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsVisitModalOpen(false)} 
                className="p-3 hover:bg-white rounded-2xl transition-all text-slate-400 hover:text-slate-900 shadow-sm border border-transparent hover:border-slate-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleVisitSave} className="p-10 overflow-y-auto space-y-10 no-scrollbar">
              {/* Date and Professional */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Data da Atividade</label>
                  <input 
                    type="date"
                    required
                    value={activeVisit.date}
                    onChange={e => setActiveVisit({ ...activeVisit, date: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-100 focus:bg-white outline-none text-sm font-bold transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Responsável Técnico</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <select 
                      value={activeVisit.professional}
                      onChange={e => setActiveVisit({ ...activeVisit, professional: e.target.value })}
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-100 focus:bg-white outline-none text-sm appearance-none font-bold transition-all"
                    >
                      {professionals.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Estagiária em Serviço</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <select 
                      value={activeVisit.intern}
                      onChange={e => setActiveVisit({ ...activeVisit, intern: e.target.value })}
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-100 focus:bg-white outline-none text-sm appearance-none font-bold transition-all"
                    >
                      {interns.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Age Groups - Better Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Público Prioritário</label>
                  <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-400 font-bold">Múltipla escolha</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {ageGroups.map(age => {
                    const isSelected = activeVisit.ageGroups?.includes(age);
                    return (
                      <button
                        key={age}
                        type="button"
                        onClick={() => {
                          const current = activeVisit.ageGroups || [];
                          const updated = isSelected 
                            ? current.filter(a => a !== age) 
                            : [...current, age];
                          setActiveVisit({ ...activeVisit, ageGroups: updated });
                        }}
                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl text-[10px] font-bold transition-all border-2 ${
                          isSelected 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-100 scale-105 active:scale-100' 
                            : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-100 hover:text-emerald-600'
                        }`}
                      >
                        {isSelected ? <CheckSquare className="w-5 h-5 mb-1" /> : <Plus className="w-5 h-5 mb-1 opacity-20" />}
                        {age}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Objectives - Functional Tags */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1 text-center block">Estratégia e Intencionalidade</label>
                <div className="flex flex-wrap justify-center gap-2">
                  {visitObjectives.map(obj => {
                    const isSelected = activeVisit.objectives?.includes(obj);
                    return (
                      <button
                        key={obj}
                        type="button"
                        onClick={() => {
                          const current = activeVisit.objectives || [];
                          const updated = isSelected 
                            ? current.filter(o => o !== obj) 
                            : [...current, obj];
                          setActiveVisit({ ...activeVisit, objectives: updated });
                        }}
                        className={`px-4 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border-2 ${
                          isSelected 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                            : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                        }`}
                      >
                        {obj}
                      </button>
                    );
                  })}
                </div>
                {activeVisit.objectives?.includes('Outro') && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <input 
                      type="text"
                      placeholder="Descreva o objetivo específico..."
                      value={activeVisit.otherObjective || ''}
                      onChange={e => setActiveVisit({ ...activeVisit, otherObjective: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-emerald-100 outline-none focus:ring-4 focus:ring-emerald-50 text-sm font-medium transition-all"
                    />
                  </motion.div>
                )}
              </div>

              {/* Synthesis - Full width now */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Síntese Operacional</label>
                <textarea 
                  required
                  rows={5}
                  value={activeVisit.synthesis}
                  onChange={e => setActiveVisit({ ...activeVisit, synthesis: e.target.value })}
                  className="w-full px-6 py-5 rounded-[32px] bg-slate-50 border-2 border-transparent focus:border-emerald-100 focus:bg-white outline-none text-sm leading-relaxed transition-all resize-none"
                  placeholder="Descreva as orientações técnicas, alinhamentos e encaminhamentos..."
                />
              </div>

              <div className="flex gap-4 pt-4 pb-4">
                <button 
                  type="button"
                  onClick={() => setIsVisitModalOpen(false)}
                  className="flex-1 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all border-2 border-transparent hover:border-slate-100"
                >
                  Descartar
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 flex items-center justify-center gap-3 active:scale-95"
                >
                  <Save className="w-5 h-5" />
                  Salvar Registro Scribere
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
