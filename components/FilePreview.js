import React from 'react';
import { motion } from 'framer-motion';
import { X, FileText, Image as ImageIcon } from 'lucide-react';

const FilePreview = ({ file, type, onRemove }) => {
  const [preview, setPreview] = React.useState('');

  React.useEffect(() => {
    if (file && type === 'image') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [file, type]);

  if (!file) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white rounded-lg shadow-md p-4"
    >
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
      >
        <X className="w-4 h-4 text-white" />
      </button>

      <div className="flex items-center space-x-4">
        {type === 'image' && preview ? (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
            {type === 'image' ? (
              <ImageIcon className="w-12 h-12 text-gray-400" />
            ) : (
              <FileText className="w-12 h-12 text-gray-400" />
            )}
          </div>
        )}

        <div>
          <h4 className="font-medium text-gray-900">{file.name}</h4>
          <p className="text-sm text-gray-500">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FilePreview;