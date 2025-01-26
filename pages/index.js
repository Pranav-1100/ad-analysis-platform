// pages/index.js
import { useState } from 'react';
import { motion } from 'framer-motion';
import FileUpload from '../components/FileUpload';
import FilePreview from '../components/FilePreview';
import AnalysisOptionsGrid from '../components/AnalysisOptionsGrid';
import LoadingAnimation from '../components/LoadingAnimation';
import { analyzeAd } from '../lib/axios';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function Home() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [adImage, setAdImage] = useState(null);
  const [prdFile, setPrdFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageSelect = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('Image size must be less than 10MB');
      return;
    }
    setError(null);
    setAdImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOption || !adImage) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', adImage);
    if (prdFile) formData.append('prd', prdFile);

    try {
      const result = await analyzeAd(formData, selectedOption.id);
      setResult(result);
    } catch (error) {
      setError('Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const ComplianceCard = ({ title, data }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
          data.status === 'PASS' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {data.status === 'PASS' 
            ? <CheckCircle className="w-4 h-4" />
            : <XCircle className="w-4 h-4" />}
          <span className="font-medium">{data.status}</span>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(data.checks).map(([key, check]) => (
          <div key={key} className="border-b border-gray-100 pb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                {key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                check.status === 'PASS' 
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {check.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">{check.details}</p>
          </div>
        ))}

        {data.issues?.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">Issues</h4>
            <ul className="list-disc list-inside space-y-1">
              {data.issues.map((issue, i) => (
                <li key={i} className="text-sm text-red-600">{issue}</li>
              ))}
            </ul>
          </div>
        )}

        {data.recommendations?.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Recommendations</h4>
            <ul className="list-disc list-inside space-y-1">
              {data.recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-blue-600">{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
      {isLoading && <LoadingAnimation type={selectedOption?.id} />}

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ad Analysis Platform
          </h1>
          <p className="text-xl text-gray-600">
            Select analysis type and upload your files
          </p>
        </motion.div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Choose Analysis Type
            </h2>
            <AnalysisOptionsGrid
              selectedOption={selectedOption}
              onOptionSelect={setSelectedOption}
            />
          </section>

          {selectedOption && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Upload Files
              </h2>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center space-x-2 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    Ad Image (Max 10MB)
                  </h3>
                  {adImage ? (
                    <FilePreview
                      file={adImage}
                      type="image"
                      onRemove={() => setAdImage(null)}
                    />
                  ) : (
                    <FileUpload
                      type="image"
                      onFileSelect={handleImageSelect}
                    />
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    PRD Document
                  </h3>
                  {prdFile ? (
                    <FilePreview
                      file={prdFile}
                      type="pdf"
                      onRemove={() => setPrdFile(null)}
                    />
                  ) : (
                    <FileUpload
                      type="pdf"
                      onFileSelect={setPrdFile}
                    />
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!adImage || isLoading}
                className={`
                  mt-8 w-full py-4 px-6 rounded-xl text-white font-medium
                  ${isLoading || !adImage 
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                  }
                  transition-colors duration-200
                `}
              >
                Start Analysis
              </motion.button>
            </motion.section>
          )}

          {result && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Analysis Results
                </h2>
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
                  result.status === 'PASS' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {result.status === 'PASS' 
                    ? <CheckCircle className="w-5 h-5" />
                    : <AlertCircle className="w-5 h-5" />}
                  <span className="font-medium">Overall Status: {result.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(result.analysis.qc).map(([key, data]) => {
                  if (key === 'overall_status') return null;
                  return (
                    <ComplianceCard
                      key={key}
                      title={key.split('_').map(w => 
                        w.charAt(0).toUpperCase() + w.slice(1)
                      ).join(' ')}
                      data={data}
                    />
                  );
                })}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
}
