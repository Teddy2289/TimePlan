import React, { useState, useEffect } from 'react';
import { Eye, Download, Trash2, FileText, Image as ImageIcon, File } from 'lucide-react';

interface FileThumbnailProps {
    file: any;
    onPreview: () => void;
    onDownload: () => void;
    onDelete?: () => void;
    canDelete?: boolean;
}

// Fonction utilitaire
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileUrl = (filePath: string): string => {
    if (!filePath) return '';
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
        // Convertir en URL relative pour le proxy
        const url = new URL(filePath);
        return url.pathname + url.search;
    }
    const cleanPath = filePath.replace(/^\/+/, '');
    return `/storage/${cleanPath}`;
};

// Fonction pour vérifier si une image existe
const checkImageExists = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        if (!url) {
            resolve(false);
            return;
        }
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
        setTimeout(() => resolve(false), 2000);
    });
};

export const FileThumbnail: React.FC<FileThumbnailProps> = ({
    file,
    onPreview,
    onDownload,
    onDelete,
    canDelete = false,
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [checkingImage, setCheckingImage] = useState(false);

    const isImage = React.useMemo(() => {
        return (
            file?.mime_type?.startsWith('image/') ||
            file?.file_name?.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)
        );
    }, [file]);

    const isPDF = React.useMemo(() => {
        return (
            file?.mime_type === 'application/pdf' || file?.file_name?.toLowerCase().endsWith('.pdf')
        );
    }, [file]);

    const fileUrl = React.useMemo(() => {
        return getFileUrl(file.file_path || file.url || '');
    }, [file]);

    // Vérifier si l'image existe
    useEffect(() => {
        let mounted = true;

        if (isImage && fileUrl) {
            setCheckingImage(true);
            checkImageExists(fileUrl).then((exists) => {
                if (mounted) {
                    if (!exists) {
                        setImageError(true);
                    }
                    setCheckingImage(false);
                }
            });
        } else {
            setImageError(false);
            setCheckingImage(false);
        }

        return () => {
            mounted = false;
        };
    }, [isImage, fileUrl]);

    const getIcon = () => {
        if (isImage) return <ImageIcon size={20} className="text-blue-500" />;
        if (isPDF) return <FileText size={20} className="text-red-500" />;
        if (file.mime_type?.startsWith('text/'))
            return <FileText size={20} className="text-green-500" />;
        return <File size={20} className="text-gray-500" />;
    };

    return (
        <div className="group relative border rounded-lg p-3 hover:border-blue-400 hover:shadow-md transition-all duration-200 bg-white">
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                    onClick={onPreview}
                    className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                    title="Aperçu"
                >
                    <Eye size={12} className="text-gray-700" />
                </button>
                <button
                    onClick={onDownload}
                    className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                    title="Télécharger"
                >
                    <Download size={12} className="text-gray-700" />
                </button>
                {canDelete && onDelete && (
                    <button
                        onClick={onDelete}
                        className="p-1.5 bg-white rounded-full shadow hover:bg-red-100 transition-colors"
                        title="Supprimer"
                    >
                        <Trash2 size={12} className="text-red-600" />
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {/* Aperçu */}
                <div
                    onClick={onPreview}
                    className="cursor-pointer h-32 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                    {isImage && fileUrl && !imageError && !checkingImage ? (
                        <>
                            {!imageLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="animate-pulse bg-gray-200 w-full h-full"></div>
                                </div>
                            )}
                            <img
                                src={fileUrl}
                                alt={file.file_name}
                                className={`w-full h-full object-cover transition-opacity duration-300 ${
                                    imageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                                onLoad={() => setImageLoaded(true)}
                                onError={() => setImageError(true)}
                                loading="lazy"
                                crossOrigin="anonymous"
                            />
                        </>
                    ) : checkingImage ? (
                        <div className="text-center p-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                            <p className="text-xs text-gray-500">Vérification...</p>
                        </div>
                    ) : (
                        <div className="text-center p-4">
                            {getIcon()}
                            <p className="text-xs text-gray-500 mt-2 truncate px-2">
                                {file.mime_type?.split('/')[1]?.toUpperCase() || 'FICHIER'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Infos */}
                <div>
                    <h4
                        onClick={onPreview}
                        className="text-xs font-semibold text-gray-900 truncate mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                    >
                        {file.file_name}
                    </h4>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{formatFileSize(file.file_size || 0)}</span>
                        <span className="text-xs">
                            {file.created_at &&
                                new Date(file.created_at).toLocaleDateString('fr-FR')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
