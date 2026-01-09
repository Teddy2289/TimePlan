import React, { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { FileThumbnail } from './FileThumbnail';

interface TaskFilesProps {
    files: any[];
    loading: boolean;
    onUpload: (files: FileList) => Promise<void>;
    onPreview: (file: any) => void;
    onDownload: (file: any) => void;
    onDelete: (fileId: number) => void;
}

export const TaskFiles: React.FC<TaskFilesProps> = ({
    files,
    loading,
    onUpload,
    onPreview,
    onDownload,
    onDelete,
}) => {
    const [dragOver, setDragOver] = useState(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files.length > 0) {
            onUpload(e.dataTransfer.files);
        }
    };

    return (
        <div className="space-y-4">
            {/* Zone d'upload */}
            <div
                className={`border-2 ${
                    dragOver ? 'border-blue-400 bg-blue-50' : 'border-dashed border-gray-300'
                } 
          rounded-lg p-4 text-center transition-all duration-200`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                <label className="cursor-pointer block">
                    <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files) {
                                onUpload(e.target.files);
                            }
                        }}
                        disabled={loading}
                    />
                    <div className="flex flex-col items-center">
                        {loading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                        ) : (
                            <Plus size={32} className="text-gray-400 mb-2" />
                        )}
                        <span className="text-sm font-medium text-gray-600">
                            {loading ? 'Upload en cours...' : 'Ajouter des fichiers'}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                            Glissez-déposez ou cliquez pour sélectionner
                        </span>
                    </div>
                </label>
            </div>

            {/* Liste des fichiers */}
            {files.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {files.map((file) => (
                        <FileThumbnail
                            key={file.id}
                            file={file}
                            onPreview={() => onPreview(file)}
                            onDownload={() => onDownload(file)}
                            onDelete={() => onDelete(file.id)}
                            canDelete={true}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 border rounded-lg bg-gray-50">
                    <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">Aucun fichier attaché</p>
                </div>
            )}
        </div>
    );
};
