import React, { useState, useEffect, useRef } from 'react';
import {
    X,
    File,
    Download,
    Link,
    Image as ImageIcon,
    AlertCircle,
    Loader2,
    FileText,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    ExternalLink,
} from 'lucide-react';

interface FilePreviewModalProps {
    file: any;
    isOpen: boolean;
    onClose: () => void;
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileUrl = (file: any): string => {
    if (!file) return '';

    if (file.file_path) {
        const filePath = file.file_path.startsWith('/')
            ? file.file_path.substring(1)
            : file.file_path;
        return `/storage/${filePath}`;
    }

    if (file.id) {
        return `/api/files/${file.id}/download`;
    }

    if (file.url || file.full_url) {
        const url = file.url || file.full_url;
        if (url.includes('localhost:8000')) {
            const path = url.replace('http://localhost:8000', '');
            return path;
        }
        return url;
    }

    return '';
};

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ file, isOpen, onClose }) => {
    const [imageError, setImageError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageData, setImageData] = useState<string | null>(null);
    const [pdfData, setPdfData] = useState<string | null>(null);
    const [pdfError, setPdfError] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'preview' | 'info'>('preview');

    const iframeRef = useRef<HTMLIFrameElement>(null);

    const fileUrl = React.useMemo(() => getFileUrl(file), [file]);

    const isImage = React.useMemo(() => {
        return (
            file?.file_type?.startsWith('image/') ||
            file?.mime_type?.startsWith('image/') ||
            file?.file_name?.match(/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i)
        );
    }, [file]);

    const isPDF = React.useMemo(() => {
        return (
            file?.file_type === 'application/pdf' ||
            file?.mime_type === 'application/pdf' ||
            file?.file_name?.match(/\.pdf$/i)
        );
    }, [file]);

    const isTextFile = React.useMemo(() => {
        return (
            file?.mime_type?.startsWith('text/') ||
            file?.file_name?.match(/\.(txt|md|js|ts|jsx|tsx|html|css|json)$/i)
        );
    }, [file]);

    const isOfficeFile = React.useMemo(() => {
        return (
            file?.mime_type?.includes('office') ||
            file?.mime_type?.includes('word') ||
            file?.mime_type?.includes('excel') ||
            file?.mime_type?.includes('powerpoint') ||
            file?.file_name?.match(/\.(doc|docx|xls|xlsx|ppt|pptx|odt|ods|odp)$/i)
        );
    }, [file]);

    const loadFileWithCredentials = async (url: string): Promise<string | null> => {
        try {
            const token = localStorage.getItem('access_token');
            const headers: Record<string, string> = {
                Accept: '*/*',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers,
                mode: 'cors',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const blob = await response.blob();
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Erreur chargement fichier:', error);
            return null;
        }
    };

    useEffect(() => {
        let isMounted = true;

        if ((isImage || isPDF) && fileUrl && isOpen) {
            const loadFile = async () => {
                if (!isMounted) return;

                setLoading(true);
                setImageError(false);
                setPdfError(false);

                try {
                    const blobUrl = await loadFileWithCredentials(fileUrl);
                    if (isMounted) {
                        if (blobUrl) {
                            if (isImage) {
                                setImageData(blobUrl);
                            } else if (isPDF) {
                                setPdfData(blobUrl);
                            }
                        } else {
                            if (isImage) setImageError(true);
                            if (isPDF) setPdfError(true);
                        }
                    }
                } catch (error) {
                    if (isMounted) {
                        if (isImage) setImageError(true);
                        if (isPDF) setPdfError(true);
                    }
                } finally {
                    if (isMounted) {
                        setLoading(false);
                    }
                }
            };

            loadFile();
        }

        return () => {
            isMounted = false;
            if (imageData) {
                URL.revokeObjectURL(imageData);
            }
            if (pdfData) {
                URL.revokeObjectURL(pdfData);
            }
        };
    }, [isImage, isPDF, fileUrl, isOpen]);

    const handleDownload = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const headers: Record<string, string> = {
                Accept: '*/*',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(fileUrl, {
                headers,
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = file.file_name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        } catch (error) {
            console.error('Erreur téléchargement:', error);
            alert('Erreur lors du téléchargement');
        }
    };

    const handleOpenInNewTab = () => {
        if (isPDF && pdfData) {
            window.open(pdfData, '_blank');
        } else {
            window.open(fileUrl, '_blank');
        }
    };

    const getFileTypeInfo = () => {
        if (isPDF) return 'Document PDF';
        if (isImage) return 'Image';
        if (isTextFile) return 'Fichier texte';
        if (isOfficeFile) return 'Document Office';
        return 'Fichier';
    };

    useEffect(() => {
        if (!isOpen) {
            setImageError(false);
            setLoading(false);
            setPdfError(false);
            setActiveTab('preview');
            setImageData(null);
            setPdfData(null);
        }
    }, [isOpen]);

    if (!isOpen || !file) return null;

    const renderPDFPreview = () => {
        if (loading) {
            return (
                <div className="text-center p-8">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Chargement du PDF...</p>
                </div>
            );
        }

        if (pdfError || !pdfData) {
            return (
                <div className="text-center p-8">
                    <FileText size={64} className="mx-auto text-red-400 mb-4" />
                    <p className="text-gray-600 mb-2">Impossible de prévisualiser le PDF</p>
                    <div className="space-y-3">
                        <button
                            onClick={handleDownload}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            <Download size={16} />
                            Télécharger le PDF
                        </button>
                        <button
                            onClick={handleOpenInNewTab}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                        >
                            <ExternalLink size={16} />
                            Ouvrir dans un nouvel onglet
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="w-full h-full flex flex-col">
                {/* Onglets pour PDF */}
                <div className="flex border-b border-gray-200 mb-4">
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'preview'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Aperçu
                    </button>
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'info'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Informations
                    </button>
                </div>

                {activeTab === 'preview' ? (
                    <>
                        <div className="flex items-center justify-between mb-4 p-3 bg-gray-100 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <FileText size={24} className="text-red-500" />
                                <span className="text-sm font-medium text-gray-700">
                                    Visualisation du PDF
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 border rounded-lg overflow-hidden bg-white">
                            <iframe
                                ref={iframeRef}
                                src={pdfData}
                                title={file.file_name}
                                className="w-full h-full min-h-[500px] border-none"
                                onError={() => setPdfError(true)}
                                onLoad={() => setLoading(false)}
                            />
                        </div>
                    </>
                ) : (
                    <div className="p-6 bg-white rounded-lg border">
                        <h4 className="text-lg font-semibold mb-4">Informations du fichier</h4>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Nom</p>
                                    <p className="font-medium">{file.file_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Type</p>
                                    <p className="font-medium">{getFileTypeInfo()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Taille</p>
                                    <p className="font-medium">
                                        {file.file_size && formatFileSize(file.file_size)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Format MIME</p>
                                    <p className="font-medium">
                                        {file.mime_type || file.file_type || 'Inconnu'}
                                    </p>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button
                                    onClick={handleDownload}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Download size={20} />
                                    Télécharger le fichier
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderImagePreview = () => {
        if (loading) {
            return (
                <div className="text-center p-8">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Chargement de l'image...</p>
                </div>
            );
        }

        if (imageError) {
            return (
                <div className="text-center p-8">
                    <AlertCircle size={64} className="mx-auto text-red-400 mb-4" />
                    <p className="text-gray-600 mb-2">L'image ne peut pas être chargée</p>
                    <div className="space-y-3">
                        <button
                            onClick={handleDownload}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            <Download size={16} />
                            Télécharger l'image
                        </button>
                    </div>
                </div>
            );
        }

        if (imageData) {
            return (
                <div className="relative max-w-full max-h-full">
                    <img
                        src={imageData}
                        alt={file.file_name}
                        className="max-w-full max-h-[70vh] object-contain rounded shadow-lg"
                        onError={() => setImageError(true)}
                    />
                </div>
            );
        }

        return null;
    };

    const renderGenericPreview = () => {
        return (
            <div className="text-center p-8">
                <File size={64} className="mx-auto text-gray-400 mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{file.file_name}</h4>
                <p className="text-gray-600 mb-4">Aperçu non disponible pour ce type de fichier</p>
                <div className="space-y-4">
                    <div className="inline-flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-500 mb-1">Type de fichier</span>
                        <span className="font-medium">{getFileTypeInfo()}</span>
                    </div>
                    <div className="flex justify-center space-x-3">
                        <button
                            onClick={handleDownload}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            <Download size={16} />
                            Télécharger
                        </button>
                        <button
                            onClick={handleOpenInNewTab}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                        >
                            <ExternalLink size={16} />
                            Ouvrir
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const getFileIcon = () => {
        if (isPDF) return <FileText size={20} className="text-red-500" />;
        if (isImage) return <ImageIcon size={20} className="text-blue-500" />;
        return <File size={20} className="text-gray-500" />;
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-zoom-in">
                {/* Header */}
                <div className="flex items-center justify-between h-14 border-b border-gray-300 px-6 bg-white">
                    <div className="flex items-center space-x-3 truncate">
                        {getFileIcon()}
                        <div className="min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 truncate">
                                {file.file_name}
                            </h3>
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-gray-500 truncate">
                                    {file.file_size && formatFileSize(file.file_size)} •{' '}
                                    {getFileTypeInfo()}
                                </p>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(fileUrl);
                                        alert('URL copiée dans le presse-papier');
                                    }}
                                    className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
                                    title="Copier l'URL"
                                >
                                    <Link size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleOpenInNewTab}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-300 transition-colors"
                            title="Ouvrir dans un nouvel onglet"
                        >
                            <ExternalLink size={14} />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                        >
                            <Download size={14} />
                            Télécharger
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Contenu */}
                <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-gray-50 min-h-[400px]">
                    {isImage
                        ? renderImagePreview()
                        : isPDF
                        ? renderPDFPreview()
                        : renderGenericPreview()}
                </div>

                {/* Footer avec infos */}
                <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div>
                            <span className="font-medium">Chemin : </span>
                            <span className="truncate max-w-xs inline-block align-middle">
                                {file.file_path || fileUrl}
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            {file.created_at && (
                                <span>
                                    Créé le {new Date(file.created_at).toLocaleDateString('fr-FR')}
                                </span>
                            )}
                            {file.updated_at && (
                                <span>
                                    Modifié le{' '}
                                    {new Date(file.updated_at).toLocaleDateString('fr-FR')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
