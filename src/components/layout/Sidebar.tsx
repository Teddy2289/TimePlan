// Sidebar.tsx
import React, { useState } from 'react';
import {
    Home,
    MoreHorizontal,
    Star,
    ChevronRight,
    ChevronDown,
    Plus,
    Settings,
    Briefcase,
    Globe,
    Users,
    CheckSquare,
    Calendar,
    BarChart,
    FileText,
    Loader2,
    AlertCircle,
    ListChecks,
} from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';
import CreateSpaceModal from '../spaces/CreateSpaceModal';
import CreateProjectModal from '../../components/ProjectTeam/CreateProjectModal';
import { useAuth } from '../../context/AuthContext';
import { useToastContext } from '../../context/ToastContext';
import { useTeams } from '../../hooks/useTeams';
import { useTeamProjects } from '../../hooks/useTeamProjects';
import projectsTeamsService from '../../services/projectsTeamsService';

const Sidebar: React.FC = () => {
    const { navigateTo, isActiveRoute, navigationRoutes } = useNavigation();
    const { user, logout } = useAuth();
    const [isTeamSpaceOpen, setIsTeamSpaceOpen] = useState(true);
    const [isCreateSpaceModalOpen, setIsCreateSpaceModalOpen] = useState(false);
    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState<string | number | null>(null);
    const { showToast } = useToastContext();
    const { teams, loading: teamsLoading, error: teamsError, refreshTeams } = useTeams();

    const [expandedTeams, setExpandedTeams] = useState<Record<string | number, boolean>>({});

    const toggleTeamSpace = () => {
        setIsTeamSpaceOpen(!isTeamSpaceOpen);
    };

    // Sidebar.tsx - Modifiez la fonction handleTeamClick
    const handleTeamClick = (teamId: string | number, e?: React.MouseEvent) => {
        // Si on clique sur le bouton plus ou flèche, ne pas basculer l'accordéon
        if (e?.target instanceof Element) {
            const target = e.target as HTMLElement;
            // Si on clique sur le bouton plus ou la flèche ChevronDown
            if (
                target.closest('button') ||
                target.closest('svg') ||
                target.closest('.flex.space-x-1.items-center') // Le conteneur des boutons
            ) {
                return; // Ne pas basculer l'accordéon
            }
        }

        // Basculer l'ouverture/fermeture de l'accordéon de l'équipe
        toggleTeamExpansion(teamId);
    };

    // Ajoutez cette fonction pour ouvrir une seule équipe à la fois
    const toggleTeamExpansion = (teamId: string | number) => {
        setExpandedTeams((prev) => {
            const newState: Record<string | number, boolean> = {};

            // Fermer toutes les équipes d'abord
            Object.keys(prev).forEach((id) => {
                newState[id] = false;
            });

            // Basculer l'état de l'équipe cliquée
            newState[teamId] = !prev[teamId];

            return newState;
        });
    };

    const handleSpaceCreated = (team: any) => {
        refreshTeams();
        showToast({
            type: 'success',
            message: `L'espace "${team.name}" a été créé avec succès`,
        });
    };

    const handleCreateProject = (teamId: string | number, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedTeamId(teamId);
        setIsCreateProjectModalOpen(true);
    };

    const handleProjectCreated = (project: any) => {
        showToast({
            type: 'success',
            message: `Le projet "${project.name}" a été créé avec succès`,
        });
        // Rafraîchir la liste des projets pour cette équipe
        // (le refresh se fera via le hook useTeamProjects)
    };

    const handleProjectClick = (projectId: string | number, e: React.MouseEvent) => {
        e.stopPropagation();
        navigateTo(`/projects/${projectId}`);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigateTo('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Remplacer les icônes de navigation génériques
    const getRouteIcon = (label: string) => {
        switch (label) {
            case 'Accueil':
                return Home;
            case 'Tableau de bord':
                return Briefcase;
            case 'Projet':
                return ListChecks;
            case 'Tâches':
                return CheckSquare;
            case 'Calendrier':
                return Calendar;
            case 'Fichiers':
                return FileText;
            case 'Rapports':
                return BarChart;
            case 'Paramètres':
                return Settings;
            default:
                return Home;
        }
    };

    // Obtenir une couleur pour les projets basée sur le statut
    const getProjectColor = (status: string) => {
        switch (status) {
            case 'active':
                return { color: 'text-green-600', bgColor: 'bg-green-100' };
            case 'completed':
                return { color: 'text-blue-600', bgColor: 'bg-blue-100' };
            case 'on_hold':
                return { color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
            case 'cancelled':
                return { color: 'text-red-600', bgColor: 'bg-red-100' };
            default:
                return { color: 'text-gray-600', bgColor: 'bg-gray-100' };
        }
    };

    // Composant pour afficher les projets d'une équipe
    const TeamProjects: React.FC<{ teamId: string | number }> = ({ teamId }) => {
        const { projects, loading, error } = useTeamProjects(teamId);

        if (loading) {
            return (
                <div className="flex items-center justify-center py-2">
                    <Loader2 size={12} className="animate-spin text-gray-400" />
                    <span className="text-xs text-gray-500 ml-2">Chargement...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex items-center py-2 px-3">
                    <AlertCircle size={12} className="text-red-500 mr-2" />
                    <span className="text-xs text-red-500">{error}</span>
                </div>
            );
        }

        if (projects.length === 0) {
            return (
                <div className="py-2 px-3">
                    <span className="text-xs text-gray-500 italic">Aucun projet</span>
                </div>
            );
        }

        return (
            <div className="space-y-1">
                {projects.map((project) => {
                    const projectColor = getProjectColor(project.status);
                    const isActive = isActiveRoute(`/projects/${project.id}`);

                    return (
                        <div
                            key={project.id}
                            onClick={(e) => handleProjectClick(project.id, e)}
                            className={`flex items-center justify-between py-1 px-3 rounded cursor-pointer transition-colors ml-6 ${
                                isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <div
                                    className={`w-5 h-5 ${projectColor.bgColor} rounded flex items-center justify-center flex-shrink-0`}
                                >
                                    <Briefcase size={12} className={projectColor.color} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-xs truncate">{project.name}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto flex flex-col">
            {/* En-tête M. MBL Service */}
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-lg font-bold text-gray-900 mb-4">M. MBL Service</h1>

                {/* Navigation principale */}
                <div className="space-y-1">
                    {navigationRoutes.map((route) => {
                        const IconComponent = getRouteIcon(route.label);
                        return (
                            <div
                                key={route.path}
                                onClick={() => navigateTo(route.path)}
                                className={`flex items-center space-x-3 py-2 px-3 rounded cursor-pointer transition-colors ${
                                    isActiveRoute(route.path)
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <IconComponent
                                    size={18}
                                    className={
                                        isActiveRoute(route.path)
                                            ? 'text-blue-600'
                                            : 'text-gray-500'
                                    }
                                />
                                <span className="text-xs font-medium">{route.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Section Favoris et Espaces */}
            <div className="p-4 border-b border-gray-200">
                {/* Favoris */}
                <div className="flex items-center justify-between py-2 px-3 text-gray-700 hover:bg-gray-50 rounded cursor-pointer transition-colors mb-2">
                    <div className="flex items-center space-x-3">
                        <Star size={16} className="text-gray-500" />
                        <span className="text-xs font-medium">Favoris</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-500" />
                </div>

                {/* Espaces */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Espaces
                        </h3>
                        <div className="flex space-x-1">
                            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                <MoreHorizontal size={14} className="text-gray-500" />
                            </button>
                            <button
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                onClick={() => setIsCreateSpaceModalOpen(true)}
                            >
                                <Plus size={14} className="text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Tout */}
                    {/* <div className="flex items-center space-x-3 py-1 px-3 text-gray-700 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                        <div className="w-6 h-6 flex items-center justify-center">
                            <Globe size={14} className="text-gray-500" />
                        </div>
                        <span className="text-xs">Tout</span>
                    </div> */}

                    {/* Team Space - Accordéon */}
                    <div className="space-y-1">
                        <div
                            onClick={toggleTeamSpace}
                            className="flex items-center space-x-3 py-1 px-3 text-gray-700 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                        >
                            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                <Users size={14} className="text-blue-600" />
                            </div>
                            <span className="text-xs">Team Space</span>
                            <div className="flex space-x-1 ml-auto items-center">
                                <button
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <MoreHorizontal size={12} className="text-gray-500" />
                                </button>
                                <button
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsCreateSpaceModalOpen(true);
                                    }}
                                >
                                    <Plus size={12} className="text-gray-500" />
                                </button>
                                <ChevronDown
                                    size={14}
                                    className={`text-gray-500 transition-transform ${
                                        isTeamSpaceOpen ? 'rotate-0' : '-rotate-90'
                                    }`}
                                />
                            </div>
                        </div>

                        {/* Contenu de Team Space (collapsible) */}
                        {isTeamSpaceOpen && (
                            <div className="ml-6 space-y-1">
                                {/* Liste des équipes avec leurs projets */}
                                <div className="space-y-1">
                                    {teamsLoading ? (
                                        <div className="flex items-center justify-center py-2">
                                            <Loader2
                                                size={14}
                                                className="animate-spin text-gray-400"
                                            />
                                            <span className="text-xs text-gray-500 ml-2">
                                                Chargement...
                                            </span>
                                        </div>
                                    ) : teamsError ? (
                                        <div className="flex items-center py-2 px-3">
                                            <AlertCircle size={14} className="text-red-500 mr-2" />
                                            <span className="text-xs text-red-500">
                                                {teamsError}
                                            </span>
                                        </div>
                                    ) : teams.length === 0 ? (
                                        <div className="py-2 px-3">
                                            <span className="text-xs text-gray-500 italic">
                                                Aucune équipe disponible
                                            </span>
                                        </div>
                                    ) : (
                                        // Dans le map des teams, modifiez le code de l'équipe comme suit:
                                        teams.map((team, index) => {
                                            const isExpanded = expandedTeams[team.id] || false;
                                            // Retirez la variable isActive car on ne navigue plus vers une page team

                                            return (
                                                <div key={team.id} className="space-y-1">
                                                    {/* Ligne de l'équipe */}
                                                    <div
                                                        onClick={(e) => handleTeamClick(team.id, e)}
                                                        className={`flex items-center space-x-3 py-1 px-3 rounded cursor-pointer transition-colors ${
                                                            isExpanded
                                                                ? 'bg-blue-50 text-blue-600'
                                                                : 'text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0">
                                                            <ListChecks
                                                                size={14}
                                                                className="fill-current text-gray-500"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <span className="text-xs truncate">
                                                                {team.name}
                                                            </span>
                                                        </div>
                                                        <div className="flex space-x-1 items-center">
                                                            <button
                                                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleCreateProject(team.id, e);
                                                                }}
                                                                title="Créer un projet"
                                                            >
                                                                <Plus
                                                                    size={12}
                                                                    className="text-gray-500 hover:text-blue-600"
                                                                />
                                                            </button>
                                                            <ChevronDown
                                                                size={14}
                                                                className={`text-gray-500 transition-transform cursor-pointer ${
                                                                    isExpanded
                                                                        ? 'rotate-0'
                                                                        : '-rotate-90'
                                                                }`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleTeamExpansion(team.id);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Projets de l'équipe (collapsible) */}
                                                    {isExpanded && (
                                                        <TeamProjects teamId={team.id} />
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bouton Créer un espace */}
                <div
                    onClick={() => setIsCreateSpaceModalOpen(true)}
                    className="flex items-center space-x-3 py-2 px-3 text-blue-600 hover:bg-blue-50 rounded cursor-pointer transition-colors mt-2"
                >
                    <Plus size={16} className="text-blue-600" />
                    <span className="text-xs font-medium">Créer un espace</span>
                </div>
            </div>

            {/* Modal de création d'espace (Team) */}
            {isCreateSpaceModalOpen && (
                <CreateSpaceModal
                    isOpen={isCreateSpaceModalOpen}
                    onClose={() => setIsCreateSpaceModalOpen(false)}
                    onSpaceCreated={handleSpaceCreated}
                />
            )}

            {/* Modal de création de projet */}
            {isCreateProjectModalOpen && selectedTeamId && (
                <CreateProjectModal
                    isOpen={isCreateProjectModalOpen}
                    onClose={() => {
                        setIsCreateProjectModalOpen(false);
                        setSelectedTeamId(null);
                    }}
                    teamId={selectedTeamId}
                    onProjectCreated={handleProjectCreated}
                />
            )}
        </aside>
    );
};

export default Sidebar;
