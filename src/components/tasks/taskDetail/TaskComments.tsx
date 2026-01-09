import React, { useState } from 'react';
import { MessageSquare, User } from 'lucide-react';

interface TaskCommentsProps {
    comments: any[];
    onAddComment: (content: string) => Promise<void>;
}

export const TaskComments: React.FC<TaskCommentsProps> = ({ comments, onAddComment }) => {
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim() || submitting) return;

        setSubmitting(true);
        try {
            await onAddComment(comment);
            setComment('');
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full text-sm border border-gray-300 p-3 rounded focus:ring-1 focus:ring-blue-500 outline-none resize-none transition-colors"
                    placeholder="Écrire un commentaire..."
                    rows={3}
                />
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={!comment.trim() || submitting}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {submitting ? 'Envoi...' : 'Envoyer'}
                    </button>
                </div>
            </form>

            {comments.length > 0 ? (
                <div className="space-y-3">
                    {comments.map((c) => (
                        <div key={c.id} className="bg-gray-50 p-4 rounded border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User size={12} className="text-blue-600" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-700">
                                        {c.user?.name || 'Utilisateur'}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {new Date(c.created_at).toLocaleDateString('fr-FR')}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">{c.content}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 border rounded-lg bg-gray-50">
                    <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">Aucun commentaire</p>
                </div>
            )}
        </div>
    );
};
