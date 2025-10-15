import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AcademicFile } from '../types';
import { BookOpenIcon, ChevronRightIcon, FileIcon, FolderIcon, GitBranchIcon, EyeIcon, DownloadIcon } from '../components/icons';
import FileViewerModal from '../components/FileViewerModal';

interface ExplorePageProps {
  files: AcademicFile[];
}

const ExplorePage: React.FC<ExplorePageProps> = ({ files }) => {
  const { courseName, semester, subject } = useParams<{ courseName: string, semester?: string, subject?: string }>();
  const [viewingFile, setViewingFile] = useState<AcademicFile | null>(null);
  
  const decodedCourseName = courseName ? decodeURIComponent(courseName) : '';

  const courseFiles = files.filter(file => file.course === decodedCourseName);

  const getBreadcrumbs = () => {
    const crumbs = [{ name: decodedCourseName, path: `/explore/${courseName}` }];
    if (semester) {
      crumbs.push({ name: semester, path: `/explore/${courseName}/${semester}` });
    }
    if (subject) {
      crumbs.push({ name: subject, path: `/explore/${courseName}/${semester}/${subject}` });
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const renderContent = () => {
    if (subject && semester) {
      // Show files in a subject
      const subjectFiles = courseFiles.filter(file => file.semester === semester && file.subject === subject);
      return subjectFiles.map(file => (
        <FileListItem key={file.id} file={file} onViewFile={setViewingFile} />
      ));
    }
    
    if (semester) {
      // Show subjects in a semester
      const semesterFiles = courseFiles.filter(file => file.semester === semester);
      // FIX: Use `Array.from` to ensure correct type inference for `subjects` as `string[]`.
      const subjects: string[] = Array.from(new Set(semesterFiles.map(file => file.subject)));
      const subjectLinks = subjects.map(sub => {
          // The original date-based sort was failing due to unparsable date strings (e.g., "2 dias atrás").
          // Switched to sorting by ID descending as a stable, type-safe alternative.
          const lastFile = semesterFiles.filter(f => f.subject === sub).sort((a: AcademicFile,b: AcademicFile) => b.id - a.id)[0];
          return {
              name: sub,
              lastUpdateMessage: lastFile?.lastUpdateMessage || 'Nenhuma atualização recente',
              uploadedAt: lastFile?.uploadedAt || ''
          }
      });
      return subjectLinks.map(sub => (
        <DirectoryListItem key={sub.name} type="subject" name={sub.name} path={`/explore/${courseName}/${semester}/${encodeURIComponent(sub.name)}`} lastUpdateMessage={sub.lastUpdateMessage} lastModified={sub.uploadedAt}/>
      ));
    }
    
    // Show semesters in a course
    // FIX: Use `Array.from` to ensure correct type inference for `semesters` as `string[]`.
    const semesters: string[] = Array.from(new Set(courseFiles.map(file => file.semester)));
    const semesterLinks = semesters.map(sem => {
        // The original date-based sort was failing due to unparsable date strings (e.g., "2 dias atrás").
        // Switched to sorting by ID descending as a stable, type-safe alternative.
        const lastFile = courseFiles.filter(f => f.semester === sem).sort((a: AcademicFile,b: AcademicFile) => b.id - a.id)[0];
        return {
            name: sem,
            lastUpdateMessage: lastFile?.lastUpdateMessage || 'Nenhuma atualização recente',
            uploadedAt: lastFile?.uploadedAt || ''
        }
    });
    return semesterLinks.map(sem => (
      <DirectoryListItem key={sem.name} type="semester" name={sem.name} path={`/explore/${courseName}/${encodeURIComponent(sem.name)}`} lastUpdateMessage={sem.lastUpdateMessage} lastModified={sem.uploadedAt} />
    ));
  };
  
  return (
    <div>
      <div className="bg-white p-4 rounded-t-2xl border-x border-t border-brand-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center text-lg space-x-2">
                <BookOpenIcon className="w-5 h-5 text-brand-gray-500 flex-shrink-0" />
                <nav className="flex items-center flex-wrap" aria-label="Breadcrumb">
                    {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="flex items-center">
                        <Link to={crumb.path} className="font-semibold text-brand-blue-600 hover:underline">
                            {crumb.name}
                        </Link>
                        {index < breadcrumbs.length - 1 && (
                            <ChevronRightIcon className="h-5 w-5 text-brand-gray-400 mx-1 flex-shrink-0" />
                        )}
                        </div>
                    ))}
                </nav>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white border border-brand-gray-300 rounded-md shadow-sm self-end sm:self-center">
                <GitBranchIcon className="w-4 h-4 text-brand-gray-500" />
                <span>main</span>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-b-2xl border border-brand-gray-200 shadow-sm">
        <div className="divide-y divide-brand-gray-200">
          {renderContent()}
        </div>
      </div>

      <FileViewerModal isOpen={!!viewingFile} onClose={() => setViewingFile(null)} file={viewingFile} />
    </div>
  );
};

interface DirectoryListItemProps {
    name: string;
    path: string;
    type: 'semester' | 'subject';
    lastUpdateMessage: string;
    lastModified: string;
}

const DirectoryListItem: React.FC<DirectoryListItemProps> = ({ name, path, lastUpdateMessage, lastModified }) => (
    <Link to={path} className="flex items-center p-3 hover:bg-brand-gray-50 transition-colors">
      <div className="w-6 text-brand-blue-500"><FolderIcon className="w-5 h-5" /></div>
      <div className="flex-1 ml-2 grid grid-cols-1 md:grid-cols-12 items-center gap-x-4 gap-y-1">
        <div className="md:col-span-6 font-medium text-brand-gray-700 hover:text-brand-blue-600 hover:underline">{name}</div>
        <div className="md:col-span-4 text-sm text-brand-gray-500 truncate">{lastUpdateMessage}</div>
        <div className="md:col-span-2 text-sm text-brand-gray-500 text-left md:text-right">{lastModified}</div>
      </div>
    </Link>
);


interface FileListItemProps {
    file: AcademicFile;
    onViewFile: (file: AcademicFile) => void;
}
const FileListItem: React.FC<FileListItemProps> = ({ file, onViewFile }) => {
    const handleDownload = () => {
        if (!file.fileContent || !file.fileName) return;
        const blob = new Blob([file.fileContent], { type: file.fileType || 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex items-center p-3 hover:bg-brand-gray-50">
          <div className="w-6 text-brand-gray-500"><FileIcon className="w-5 h-5" /></div>
          <div className="flex-1 ml-2 grid grid-cols-1 md:grid-cols-12 items-center gap-x-4 gap-y-1">
            <div className="md:col-span-5 font-medium text-brand-gray-700">{file.title}</div>
            <div className="md:col-span-3 text-sm text-brand-gray-500 truncate">{file.lastUpdateMessage}</div>
            <div className="md:col-span-2 text-sm text-brand-gray-500 text-left md:text-right">{file.uploadedAt}</div>
            <div className="md:col-span-2 flex justify-start md:justify-end items-center space-x-1">
                <button onClick={() => onViewFile(file)} className="p-2 text-brand-gray-400 hover:text-brand-gray-600 hover:bg-brand-gray-200 rounded-md" aria-label={`Visualizar ${file.title}`}>
                    <EyeIcon className="w-5 h-5" />
                </button>
                <button onClick={handleDownload} className="p-2 text-brand-gray-400 hover:text-brand-gray-600 hover:bg-brand-gray-200 rounded-md" aria-label={`Baixar ${file.title}`}>
                    <DownloadIcon className="w-5 h-5" />
                </button>
            </div>
          </div>
        </div>
    );
};


export default ExplorePage;