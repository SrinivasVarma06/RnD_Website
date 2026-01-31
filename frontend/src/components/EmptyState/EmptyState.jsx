import React from 'react';
import { SearchX, FileQuestion, AlertCircle, RefreshCw } from 'lucide-react';

const EmptyState = ({ 
  type = 'no-results', // 'no-results', 'no-data', 'error'
  title,
  message,
  onRetry,
  icon: CustomIcon
}) => {
  const configs = {
    'no-results': {
      Icon: SearchX,
      defaultTitle: 'No results found',
      defaultMessage: 'Try adjusting your search or filters to find what you\'re looking for.',
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-400',
    },
    'no-data': {
      Icon: FileQuestion,
      defaultTitle: 'No data available',
      defaultMessage: 'There is no data to display at this time.',
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-400',
    },
    'error': {
      Icon: AlertCircle,
      defaultTitle: 'Something went wrong',
      defaultMessage: 'We couldn\'t load the data. Please try again.',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-400',
    },
  };

  const config = configs[type] || configs['no-results'];
  const Icon = CustomIcon || config.Icon;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 ${config.bgColor} rounded-lg`}>
      <div className={`p-4 rounded-full ${config.bgColor} mb-4`}>
        <Icon size={48} className={config.iconColor} strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        {title || config.defaultTitle}
      </h3>
      <p className="text-gray-500 text-center max-w-md mb-4">
        {message || config.defaultMessage}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default EmptyState;
