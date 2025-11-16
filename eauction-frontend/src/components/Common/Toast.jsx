import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import PropTypes from 'prop-types';
import { memo } from 'react';

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const COLORS = {
  success: 'bg-gradient-to-r from-green-500 to-emerald-600',
  error: 'bg-gradient-to-r from-red-500 to-rose-600',
  info: 'bg-gradient-to-r from-blue-500 to-indigo-600',
  warning: 'bg-gradient-to-r from-amber-500 to-orange-600',
};

const Toast = ({ type = 'success', title, message }) => {
  const Icon = ICONS[type] ?? CheckCircle;
  const background = COLORS[type] ?? COLORS.success;

  return (
    <div className={`animate-slideIn fixed right-4 top-20 z-[60] max-w-sm rounded-2xl ${background} px-5 py-4 text-white shadow-2xl backdrop-blur`}> 
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
          <Icon className="h-4 w-4" />
        </span>
        <div className="flex-1">
          {title && <p className="mb-1 text-sm font-bold leading-tight">{title}</p>}
          {message && <p className="text-xs leading-relaxed text-white/95">{message}</p>}
        </div>
      </div>
    </div>
  );
};

Toast.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
  title: PropTypes.string,
  message: PropTypes.string,
};

export default memo(Toast);
