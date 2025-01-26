import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Image as ImageIcon } from 'lucide-react';

const FileUpload = ({ type, onFileSelect }) => {
  const [file, setFile] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: type === 'image' 
      ? { 'image/*': ['.jpeg', '.jpg', '.png'] }
      : { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      onFileSelect(acceptedFiles[0]);
    }
  });

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          {type === 'image' ? (
            <ImageIcon className="w-12 h-12 text-blue-500" />
          ) : (
            <File className="w-12 h-12 text-blue-500" />
          )}
          {file ? (
            <p className="text-sm text-gray-600">{file.name}</p>
          ) : (
            <>
              <p className="text-lg font-medium text-gray-700">
                Drop your {type === 'image' ? 'image' : 'PDF'} here
              </p>
              <p className="text-sm text-gray-500">
                or click to browse
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;