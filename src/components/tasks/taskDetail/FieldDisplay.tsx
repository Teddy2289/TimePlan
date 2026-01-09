import React from 'react';

interface FieldDisplayProps {
    label: string;
    value: any;
    displayValue?: string;
    color?: string;
    icon?: React.ElementType;
    isPill?: boolean;
    isSelect?: boolean;
    isInput?: boolean;
    isDate?: boolean;
    inputType?: string;
    options?: Array<{ value: string; label: string }>;
    isEditing?: boolean;
    onChange?: (value: string) => void;
}

export const FieldDisplay: React.FC<FieldDisplayProps> = ({
    label,
    value,
    displayValue,
    color = 'text-gray-900',
    icon: Icon,
    isPill = false,
    isSelect = false,
    isInput = false,
    isDate = false,
    inputType = 'text',
    options = [],
    isEditing = false,
    onChange,
}) => {
    return (
        <div className="flex flex-col">
            <div className="flex items-center space-x-1 mb-1">
                {Icon && <Icon size={14} className="text-gray-500" />}
                <span className="text-xs font-semibold uppercase text-gray-500">{label}</span>
            </div>
            <div className="min-h-[24px]">
                {isEditing ? (
                    <>
                        {isSelect && (
                            <select
                                value={value || ''}
                                onChange={(e) => onChange?.(e.target.value)}
                                className="text-xs w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white transition-colors"
                            >
                                {options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}
                        {(isInput || isDate) && (
                            <input
                                type={isDate ? 'date' : inputType}
                                value={value || ''}
                                onChange={(e) => onChange?.(e.target.value)}
                                className="text-xs w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                        )}
                        {!isSelect && !isInput && !isDate && (
                            <span className={`text-xs ${color}`}>{displayValue || value}</span>
                        )}
                    </>
                ) : (
                    <div className="flex items-center">
                        {isPill ? (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
                                {displayValue || value}
                            </span>
                        ) : (
                            <span className={`text-xs ${color} truncate`}>
                                {displayValue || value}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
