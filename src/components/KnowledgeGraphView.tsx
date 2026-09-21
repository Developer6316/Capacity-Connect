import React, { useState } from 'react';
import { 
  Network, 
  Sparkles, 
  BookOpen, 
  ExternalLink, 
  Share2, 
  Layers, 
  Filter, 
  Info,
  ChevronRight,
  X
} from 'lucide-react';
import { KnowledgeNode, KnowledgeLink, SubjectId } from '../types';
import { KNOWLEDGE_NODES, KNOWLEDGE_LINKS } from '../data/knowledgeGraphData';
import { sound } from '../utils/audioSynth';

interface KnowledgeGraphViewProps {
  selectedSubject: SubjectId;
  onOpenTutorWithTopic?: (topic: string) => void;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  selectedSubject,
  onOpenTutorWithTopic,
}) => {
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(KNOWLEDGE_NODES[0]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'cross-only'>('all');

  // Discipline color styling
  const getSubjectColor = (subject: SubjectId) => {
    switch (subject) {
      case 'ap-calc-bc':
        return { fill: '#6366f1', stroke: '#818cf8', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400' };
      case 'ap-physics':
        return { fill: '#06b6d4', stroke: '#38bdf8', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' };
      case 'ap-bio':
        return { fill: '#10b981', stroke: '#34d399', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' };
      default:
        return { fill: '#8b5cf6', stroke: '#a78bfa', bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' };
    }
  };

  const handleNodeClick = (node: KnowledgeNode) => {
    setSelectedNode(node);
    sound.playClick();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Interdisciplinary STEM Nexus
            </span>
            <span className="text-xs text-slate-400 font-mono">
              AP Calculus BC • Physics C • Biology
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Interactive Knowledge Mind Map</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Explore how mathematical principles in calculus directly underpin physical laws and biological cellular dynamics.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Connections
            </button>
            <button
              onClick={() => setActiveFilter('cross-only')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeFilter === 'cross-only' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cross-Discipline Bridges Only
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Canvas & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Network Visualizer */}
        <div className="lg:col-span-8 p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden min-h-[460px] flex items-center justify-center">
          {/* Legend */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2.5 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[11px]">
            <div className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span>Calculus</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span>Physics C</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>Biology</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 border-l border-slate-700 pl-2">
              <span className="w-3 h-0.5 bg-amber-400/80"></span>
              <span>Bridge</span>
            </div>
          </div>

          <svg viewBox="100 20 700 520" className="w-full h-auto max-h-[500px]">
            <defs>
              <linearGradient id="bridgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>

            {/* Render Links */}
            {KNOWLEDGE_LINKS.map((link, idx) => {
              const sourceNode = KNOWLEDGE_NODES.find(n => n.id === link.source);
              const targetNode = KNOWLEDGE_NODES.find(n => n.id === link.target);
              if (!sourceNode || !targetNode) return null;

              const isCross = link.type === 'cross_discipline';
              if (activeFilter === 'cross-only' && !isCross) return null;

              const isHighlighted = selectedNode && (selectedNode.id === link.source || selectedNode.id === link.target);

              return (
                <g key={idx}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={isHighlighted ? '#f59e0b' : isCross ? 'url(#bridgeGrad)' : '#334155'}
                    strokeWidth={isHighlighted ? 2.5 : isCross ? 2 : 1.2}
                    strokeDasharray={isCross ? '6,4' : 'none'}
                    opacity={isHighlighted ? 1 : 0.6}
                  />
                  {isHighlighted && (
                    <text
                      x={((sourceNode.x || 0) + (targetNode.x || 0)) / 2}
                      y={((sourceNode.y || 0) + (targetNode.y || 0)) / 2 - 6}
                      fill="#fef08a"
                      fontSize="9"
                      textAnchor="middle"
                      className="font-mono font-bold"
                    >
                      {link.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Render Nodes */}
            {KNOWLEDGE_NODES.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const color = getSubjectColor(node.subject);

              return (
                <g
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  className="cursor-pointer transition-all duration-200"
                >
                  {/* Outer orbital halo */}
                  {isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="32"
                      fill="none"
                      stroke={color.stroke}
                      strokeWidth="2"
                      strokeDasharray="4,4"
                      className="animate-spin origin-center"
                      style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 22 : 18}
                    fill="#0f172a"
                    stroke={color.stroke}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all hover:scale-110"
                  />

                  {/* Core glow */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="8"
                    fill={color.fill}
                    opacity={isSelected ? 1 : 0.7}
                  />

                  {/* Node Text Label */}
                  <text
                    x={node.x}
                    y={(node.y || 0) + 32}
                    fill={isSelected ? '#ffffff' : '#cbd5e1'}
                    fontSize={isSelected ? '11' : '10'}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    textAnchor="middle"
                    className="pointer-events-none select-none"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Details Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {selectedNode ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 animate-in fade-in duration-200">
              <div>
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getSubjectColor(selectedNode.subject).bg} ${getSubjectColor(selectedNode.subject).text} border ${getSubjectColor(selectedNode.subject).border}`}>
                    {selectedNode.category}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Level {selectedNode.level}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-2">{selectedNode.label}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{selectedNode.summary}</p>
              </div>

              {/* Governing equations */}
              {selectedNode.equations && selectedNode.equations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Governing Equations</h4>
                  <div className="space-y-1.5">
                    {selectedNode.equations.map((eq, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 border border-slate-800">
                        {eq}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cross-Subject Bridges */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interdisciplinary Bridges</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedNode.crossSubjectBridges.map((targetId) => {
                    const targetNode = KNOWLEDGE_NODES.find(n => n.id === targetId);
                    if (!targetNode) return null;

                    return (
                      <button
                        key={targetId}
                        onClick={() => setSelectedNode(targetNode)}
                        className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left text-xs transition flex items-center justify-between group"
                      >
                        <span className="text-slate-200 group-hover:text-white font-medium">{targetNode.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Socratic Tutor launcher */}
              {onOpenTutorWithTopic && (
                <button
                  onClick={() => onOpenTutorWithTopic(selectedNode.label)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Discuss {selectedNode.label} in Tutor</span>
                </button>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
              Click any node on the graph to inspect its mathematical theorems and cross-subject applications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
