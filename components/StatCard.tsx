
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change?: string;
  changeColor?: string;
  changeText?: string;
  actionButton?: {
    text: string;
    onClick: () => void;
  }
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, change, changeColor = 'text-brand-gray-500', changeText, actionButton }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-brand-gray-300 transition-all duration-200 flex flex-col justify-between group">
        <div>
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-sm text-brand-gray-600">{title}</h3>
                <div className="bg-brand-gray-50 p-2.5 rounded-lg group-hover:bg-brand-gray-100 transition-colors">
                    {icon}
                </div>
            </div>
            <p className="text-3xl font-bold text-brand-gray-900 tracking-tight">{value}</p>
        </div>
        <div className="mt-4 text-sm text-brand-gray-500">
            {change && <span className={`font-semibold ${changeColor}`}>{change}</span>}
            {change && changeText && <span className="mx-1"></span>}
            {changeText && <span>{changeText}</span>}
            {actionButton && (
                <button onClick={actionButton.onClick} className="w-full mt-3 bg-brand-gray-100 text-brand-gray-700 font-semibold py-2.5 rounded-lg hover:bg-brand-gray-200 active:bg-brand-gray-300 transition-all duration-200">
                    {actionButton.text}
                </button>
            )}
        </div>
    </div>
  );
};

export default StatCard;
