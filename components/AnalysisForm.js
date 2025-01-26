import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FileUpload from './FileUpload';
import { CheckCircle, AlertCircle } from 'lucide-react';

const analysisOptions = [
  { id: 'qc', name: 'QC Check', endpoint: '/api/ads/qc' },
  { id: 'crm', name: 'CRM Analysis', endpoint: '/api/ads/analysis' },
  { id: 'competitor', name: 'Competitor Analysis', endpoint: '/api/competitor/analyze' },
  { id: 'batch', name: 'Batch Analysis', endpoint: '/api/competitor/batch' },
  { id: 'compare', name: 'Competitor Compare', endpoint: '/api/competitor/compare' },
  { id: 'fetch', name: 'Fetch Ads', endpoint: '/api/fetch-ads' }
];

const AnalysisForm = () => {
  const [selectedOption, setSelectedOption] = useState(analysisOptions[0]);
  const [adImage, setAdImage] = useState(null);
  const [prdFile, setPrdFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    const formData = new FormData();
    
    // Be explicit about which endpoint we're hitting
    if (selectedOption.id === 'qc' || selectedOption.id === 'crm') {
      formData.append('image', adImage);
      if (prdFile) formData.append('prd', prdFile);
    } else if (selectedOption.id === 'batch') {
      // Handle batch uploads differently
      formData.append('images', adImage);
    } else {
      // For competitor analysis and compare
      formData.append('image', adImage);
    }
  
    try {
      const response = await fetch(selectedOption.endpoint, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ad Image
              </label>
              <FileUpload type="image" onFileSelect={setAdImage} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PRD Document
              </label>
              <FileUpload type="pdf" onFileSelect={setPrdFile} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Analysis Type
            </label>
            <select
              value={selectedOption.id}
              onChange={(e) => setSelectedOption(
                analysisOptions.find(opt => opt.id === e.target.value)
              )}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {analysisOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || !adImage}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-flex items-center"
              >
                <span className="mr-3">Analyzing</span>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </motion.div>
            ) : (
              'Start Analysis'
            )}
          </motion.button>
        </div>
      </form>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center mb-4">
            {result.status === 'PASS' ? (
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
            )}
            <h3 className="text-lg font-medium text-gray-900">Analysis Results</h3>
          </div>
          <pre className="bg-gray-50 rounded-md p-4 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </motion.div>
      )}
    </div>
  );
};

export default AnalysisForm;
