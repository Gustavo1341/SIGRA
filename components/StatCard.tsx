
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
    <div className="bg-white p-6 rounded-2xl border border-brand-gray-200 shadow-sm flex flex-col justify-between">
        <div>
            <div className="flex justify-between items-start">
                <h3 className="font-semibold text-brand-gray-500">{title}</h3>
                <div className="bg-brand-gray-100 p-2 rounded-lg">
                    {icon}
                </div>
            </div>
            <p className="text-4xl font-bold text-brand-gray-800 mt-2">{value}</p>
        </div>
        <div className="mt-4 text-sm text-brand-gray-500">
            {change && <span className={`font-semibold ${changeColor}`}>{change}</span>}
            {change && changeText && <span className="mx-1"></span>}
            {changeText && <span>{changeText}</span>}
            {actionButton && (
                <button onClick={actionButton.onClick} className="w-full bg-brand-gray-100 text-brand-gray-700 font-semibold py-2 rounded-lg hover:bg-brand-gray-200 transition-colors">
                    {actionButton.text}
                </button>
            )}
        </div>
    </div>
  );
};

export default StatCard;
