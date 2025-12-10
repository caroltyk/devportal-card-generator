import React from 'react';
import { StylePreset } from '../types';
import { Palette, Zap, Box, Briefcase, Droplets, Monitor } from 'lucide-react';

interface StyleSelectorProps {
  selected: StylePreset;
  onSelect: (style: StylePreset) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selected, onSelect }) => {
  const options = [
    { value: StylePreset.NONE, label: 'No Preset', icon: <Palette size={16} /> },
    { value: StylePreset.ABSTRACT_TECH, label: 'Abstract Tech', icon: <Monitor size={16} /> },
    { value: StylePreset.MINIMALIST_GEOMETRIC, label: 'Geometric', icon: <Box size={16} /> },
    { value: StylePreset.CYBERPUNK, label: 'Cyberpunk', icon: <Zap size={16} /> },
    { value: StylePreset.CORPORATE_CLEAN, label: 'Corporate', icon: <Briefcase size={16} /> },
    { value: StylePreset.FLUID_GRADIENT, label: 'Fluid', icon: <Droplets size={16} /> },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`flex items-center space-x-2 p-3 rounded-lg border text-sm transition-all duration-200 ${
            selected === option.value
              ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:bg-slate-750'
          }`}
        >
          <span className={selected === option.value ? 'text-indigo-400' : 'text-slate-500'}>
            {option.icon}
          </span>
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
};