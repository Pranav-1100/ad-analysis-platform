import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  UserCircle2, 
  Users, 
  BarChart2, 
  GitCompare, 
  Search,
  CheckCircle 
} from 'lucide-react';

const analysisOptions = [
  {
    id: 'qc',
    name: 'QC Check',
    description: 'Quality check for ad compliance',
    Icon: CheckCircle2,
    color: 'bg-blue-500'
  },
  {
    id: 'crm',
    name: 'CRM Analysis',
    description: 'Customer response analysis',
    Icon: UserCircle2,
    color: 'bg-purple-500'
  },
  {
    id: 'competitor',
    name: 'Competitor Analysis',
    description: 'Single ad competitor analysis',
    Icon: BarChart2,
    color: 'bg-green-500'
  },
  {
    id: 'batch',
    name: 'Batch Analysis',
    description: 'Multiple ads analysis',
    Icon: Users,
    color: 'bg-orange-500'
  },
  {
    id: 'compare',
    name: 'Compare',
    description: 'Compare with competitors',
    Icon: GitCompare,
    color: 'bg-indigo-500'
  },
  {
    id: 'fetch',
    name: 'Fetch Ads',
    description: 'Fetch ads for analysis',
    Icon: Search,
    color: 'bg-pink-500'
  }
];

const AnalysisOption = ({ option, selected, onSelect }) => {
  const Icon = option.Icon; // Note the capital I in Icon here
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative cursor-pointer rounded-xl p-6 
        ${selected ? 'bg-white shadow-lg ring-2 ring-blue-500' : 'bg-white/80 hover:bg-white hover:shadow-md'}
        transition-all duration-200
      `}
      onClick={() => onSelect(option)}
    >
      <div className="flex items-center space-x-4">
        <div className={`${option.color} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{option.name}</h3>
          <p className="text-sm text-gray-500">{option.description}</p>
        </div>
      </div>
      
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-4 h-4 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};

const AnalysisOptionsGrid = ({ selectedOption, onOptionSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {analysisOptions.map((option) => (
        <AnalysisOption
          key={option.id}
          option={option}
          selected={selectedOption?.id === option.id}
          onSelect={onOptionSelect}
        />
      ))}
    </div>
  );
};

export default AnalysisOptionsGrid;