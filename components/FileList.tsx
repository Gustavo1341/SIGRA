
import React from 'react';
import { AcademicFile } from '../types';
import { ClockIcon } from './icons';

interface FileListProps {
  title: string;
  subtitle: string;
  files: AcademicFile[];
}

const FileListItem: React.FC<{ file: AcademicFile }> = ({ file }) => {
  const initials = file.author.split(' ').map(n => n[0]).slice(0, 2).join('');
  
  return (
    <div className="flex items-center p-4 hover:bg-brand-gray-100 rounded-lg transition-colors">
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-gray-200 flex items-center justify-center font-bold text-brand-gray-600">
        {initials}
      </div>
      <div className="flex-1 ml-4 grid grid-cols-5 items-center gap-4">
        <div className="col-span-3">
          <p className="font-semibold text-brand-gray-800 truncate">{file.title}</p>
          <p className="text-sm text-brand-gray-500">
            {file.author} &bull; {file.course}
          </p>
        </div>
        <div className="text-sm text-brand-gray-500 text-right">{file.uploadedAt}</div>
        <div className="text-right">
          <span className="inline-block bg-brand-gray-200 text-brand-gray-700 text-sm font-semibold px-3 py-1 rounded-full">
            {file.downloads} downloads
          </span>
        </div>
      </div>
    </div>
  );
};

const FileList: React.FC<FileListProps> = ({ title, subtitle, files }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-brand-gray-200 shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <ClockIcon className="w-6 h-6 text-brand-gray-400" />
        <div>
          <h2 className="text-xl font-bold text-brand-gray-800">{title}</h2>
          <p className="text-sm text-brand-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-2">
        {files.map(file => (
          <FileListItem key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
};

export default FileList;
