// src/components/DashboardStats.tsx
import React, { useState } from 'react';
import {
    Clock,
    AlertTriangle,
    CheckCircle,
    Circle,
    TrendingUp,
    TrendingDown,
    Target,
    Calendar,
    BarChart3,
    PieChart,
    Users,
    Folder,
    FileText,
    CalendarDays,
    Clock4,
    Trophy,
    Zap,
    TrendingUp as TrendingUpIcon,
    ChevronDown,
    ChevronUp,
    MoreVertical,
} from 'lucide-react';
import { useTaskStats } from '../../hooks/useTaskStats';

interface DashboardStatsProps {
    timeframe?: string;
    projectId?: number;
    showDetails?: boolean;
    className?: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
    timeframe = 'month',
    projectId,
    showDetails = true,
    className = '',
}) => {
    const { stats, loading, error, formattedStats } = useTaskStats({
        timeframe,
        projectId,
        autoFetch: true,
    });

    const [expandedSections, setExpandedSections] = useState({
        basic: true,
        priorities: false,
        timeline: false,
        distribution: false,
        efficiency: false,
        trends: false,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    if (loading) {
        return (
            <div className={`p-4 ${className}`}>
                <div className="flex items-center justify-center h-40">
                    <div className="text-center text-gray-500">Chargement...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`p-4 ${className}`}>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-red-700">Erreur: {error}</div>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className={`p-4 ${className}`}>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <div className="text-gray-500">Aucune statistique disponible</div>
                </div>
            </div>
        );
    }

    // Cartes de statistiques principales - version compacte
    const mainStatCards = [
        {
            label: 'Total',
            value: stats.total,
            icon: FileText,
            color: 'gray',
            trend: stats.changes?.total_change,
            description: 'Tâches',
        },
        {
            label: 'À faire',
            value: stats.todo,
            icon: Circle,
            color: 'blue',
            trend: stats.changes?.todo_change,
            description: 'En attente',
        },
        {
            label: 'En cours',
            value: stats.doing,
            icon: Clock,
            color: 'amber',
            trend: stats.changes?.doing_change,
            description: 'En progression',
        },
        {
            label: 'Terminées',
            value: stats.done,
            icon: CheckCircle,
            color: 'emerald',
            trend: stats.changes?.done_change,
            description: 'Complétées',
        },
        {
            label: 'En retard',
            value: stats.overdue,
            icon: AlertTriangle,
            color: 'rose',
            trend: stats.changes?.overdue_change,
            description: 'Dépassées',
        },
        {
            label: 'Taux',
            value: `${stats.done_percentage.toFixed(0)}%`,
            icon: Trophy,
            color: 'violet',
            trend: stats.changes?.completion_rate_change,
            description: 'Complétion',
        },
    ];

    const priorityStats = [
        {
            label: 'Haute',
            value: stats.high_priority,
            color: 'red',
            percentage: stats.high_priority > 0 ? (stats.high_priority / stats.total) * 100 : 0,
        },
        {
            label: 'Moyenne',
            value: stats.medium_priority,
            color: 'yellow',
            percentage: stats.medium_priority > 0 ? (stats.medium_priority / stats.total) * 100 : 0,
        },
        {
            label: 'Basse',
            value: stats.low_priority,
            color: 'green',
            percentage: stats.low_priority > 0 ? (stats.low_priority / stats.total) * 100 : 0,
        },
    ];

    const getColorClasses = (color: string) => {
        const colors: any = {
            gray: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
            blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
            amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
            emerald: {
                bg: 'bg-emerald-50',
                text: 'text-emerald-600',
                border: 'border-emerald-200',
            },
            rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
            violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200' },
            red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
            yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' },
            green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
        };
        return colors[color] || colors.gray;
    };

    const renderTrendIndicator = (trend: any) => {
        if (!trend) return null;
        const isPositive = trend.is_positive;
        const isNeutral = trend.trend === 'neutral';

        if (isNeutral) return null;

        return (
            <div
                className={`text-xs flex items-center ${
                    isPositive ? 'text-emerald-500' : 'text-rose-500'
                }`}
            >
                {isPositive ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {trend.percentage > 0 ? '+' : ''}
                {trend.percentage.toFixed(0)}%
            </div>
        );
    };

    return (
        <div
            className={`space-y-4 px-4 py-6 sm:px-6 lg:px-8 bg-white shadow-sm rounded-lg overflow-hidden '${className}`}
        >
            {/* En-tête compact */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Statistiques</h2>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                        <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                        <span>
                            {timeframe === 'month'
                                ? 'Mensuel'
                                : timeframe === 'week'
                                ? 'Hebdomadaire'
                                : timeframe === 'day'
                                ? 'Journalier'
                                : 'Personnalisé'}
                        </span>
                        <span className="mx-2">•</span>
                        <span>
                            {stats.start_date} - {stats.end_date}
                        </span>
                    </div>
                </div>
                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    {new Date().toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                    })}
                </div>
            </div>

            {/* Cartes principales compactes */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {mainStatCards.map((stat) => {
                    const IconComponent = stat.icon;
                    const colors = getColorClasses(stat.color);

                    return (
                        <div
                            key={stat.label}
                            className={`p-3 rounded-lg border ${colors.border} ${colors.bg} hover:shadow-xs transition-all duration-200`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className={`p-1.5 rounded-md ${colors.text} bg-white/50`}>
                                    <IconComponent className="h-4 w-4" />
                                </div>
                                {renderTrendIndicator(stat.trend)}
                            </div>
                            <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                            <div className="text-xs text-gray-600">{stat.label}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{stat.description}</div>
                        </div>
                    );
                })}
            </div>

            {/* Section Priorités */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('priorities')}
                >
                    <h3 className="text-sm font-medium text-gray-900 flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                        Priorités
                    </h3>
                    {expandedSections.priorities ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                </div>

                {expandedSections.priorities && (
                    <div className="mt-4 space-y-3">
                        {priorityStats.map((priority) => {
                            const colors = getColorClasses(priority.color);
                            return (
                                <div key={priority.label} className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm font-medium ${colors.text}`}>
                                            {priority.label}
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-900">
                                                {priority.value}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {priority.percentage.toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div
                                            className={`h-1.5 rounded-full ${colors.text.replace(
                                                '600',
                                                '500'
                                            )}`}
                                            style={{ width: `${priority.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Métriques temporelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <Clock4 className="h-4 w-4 mr-2 text-blue-500" />
                        Temps
                    </h4>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Estimé total</span>
                            <span className="text-sm font-medium text-gray-900">
                                {stats.total_estimated_time} min
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Travaillé</span>
                            <span className="text-sm font-medium text-gray-900">
                                {stats.total_worked_time_hours.toFixed(1)}h
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Efficacité</span>
                            <span className="text-sm font-medium text-gray-900">
                                {stats.time_efficiency.toFixed(0)}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <Target className="h-4 w-4 mr-2 text-emerald-500" />
                        Indicateurs
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">
                                {stats.recent_tasks}
                            </div>
                            <div className="text-xs text-gray-500">Récentes</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">
                                {stats.with_due_date}
                            </div>
                            <div className="text-xs text-gray-500">Avec échéance</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">
                                {stats.with_time_estimate}
                            </div>
                            <div className="text-xs text-gray-500">Estimées</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">
                                {stats.active_tasks_count}
                            </div>
                            <div className="text-xs text-gray-500">Actives</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Distribution par projet */}
            {stats.project_distribution && stats.project_distribution.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection('distribution')}
                    >
                        <h3 className="text-sm font-medium text-gray-900 flex items-center">
                            <Folder className="h-4 w-4 mr-2 text-violet-500" />
                            Projets
                        </h3>
                        {expandedSections.distribution ? (
                            <ChevronUp className="h-4 w-4 text-gray-400" />
                        ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                    </div>

                    {expandedSections.distribution && (
                        <div className="mt-4 space-y-3">
                            {stats.project_distribution.slice(0, 3).map((project) => (
                                <div key={project.project_id} className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-900 truncate">
                                            {project.project_name}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {project.task_count}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div
                                            className="h-1.5 rounded-full bg-violet-500"
                                            style={{ width: `${project.percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-gray-500 text-right">
                                        {project.percentage.toFixed(0)}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Évolution et tendances */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Évolution */}
                {stats.status_evolution && Object.keys(stats.status_evolution).length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleSection('timeline')}
                        >
                            <h3 className="text-sm font-medium text-gray-900 flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-amber-500" />
                                Évolution
                            </h3>
                            {expandedSections.timeline ? (
                                <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                        </div>

                        {expandedSections.timeline && (
                            <div className="mt-4">
                                <div className="flex space-x-2 overflow-x-auto pb-2">
                                    {Object.entries(stats.status_evolution)
                                        .slice(-7)
                                        .map(([date, data]: [string, any]) => (
                                            <div key={date} className="text-center min-w-[60px]">
                                                <div className="text-xs font-medium text-gray-700">
                                                    {new Date(date).getDate()}
                                                </div>
                                                <div className="text-xs text-gray-500 mb-1">
                                                    {new Date(date)
                                                        .toLocaleDateString('fr-FR', {
                                                            weekday: 'short',
                                                        })
                                                        .slice(0, 1)}
                                                </div>
                                                <div className="text-xs font-semibold text-gray-900">
                                                    {data.total}
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-1 mt-1">
                                                    <div
                                                        className="h-1 rounded-full bg-emerald-500"
                                                        style={{
                                                            width: `${
                                                                (data.done / data.total) * 100 || 0
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Tendances */}
                {stats.changes && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleSection('trends')}
                        >
                            <h3 className="text-sm font-medium text-gray-900 flex items-center">
                                <TrendingUpIcon className="h-4 w-4 mr-2 text-blue-500" />
                                Tendances
                            </h3>
                            {expandedSections.trends ? (
                                <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                        </div>

                        {expandedSections.trends && (
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                {Object.entries(stats.changes)
                                    .slice(0, 4)
                                    .map(([key, change]: [string, any]) => {
                                        const labels: any = {
                                            total_change: 'Total',
                                            todo_change: 'À faire',
                                            doing_change: 'En cours',
                                            done_change: 'Terminées',
                                        };

                                        return (
                                            <div key={key} className="text-center">
                                                <div className="text-xs text-gray-500 mb-1">
                                                    {labels[key] || key}
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <div
                                                        className={`text-sm font-semibold ${
                                                            change.is_positive
                                                                ? 'text-emerald-600'
                                                                : change.trend === 'down'
                                                                ? 'text-rose-600'
                                                                : 'text-gray-600'
                                                        }`}
                                                    >
                                                        {change.value > 0 ? '+' : ''}
                                                        {change.value}
                                                    </div>
                                                    {change.percentage !== 0 && (
                                                        <div
                                                            className={`text-xs ml-1 ${
                                                                change.is_positive
                                                                    ? 'text-emerald-500'
                                                                    : 'text-rose-500'
                                                            }`}
                                                        >
                                                            ({change.percentage > 0 ? '+' : ''}
                                                            {change.percentage.toFixed(0)}%)
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Résumé compact */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                    <Trophy className="h-5 w-5 text-emerald-600 mr-2" />
                    <h3 className="text-sm font-semibold text-gray-900">Performances</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-white/50 rounded">
                        <div className="text-lg font-bold text-gray-900">
                            {stats.done_percentage.toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-600">Complétion</div>
                    </div>
                    <div className="text-center p-2 bg-white/50 rounded">
                        <div className="text-lg font-bold text-gray-900">
                            {stats.active_tasks_count}
                        </div>
                        <div className="text-xs text-gray-600">Actives</div>
                    </div>
                    <div className="text-center p-2 bg-white/50 rounded">
                        <div className="text-lg font-bold text-gray-900">{stats.overdue}</div>
                        <div className="text-xs text-gray-600">En retard</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
