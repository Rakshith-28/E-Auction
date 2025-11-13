import { CheckCircle, XCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import { memo } from 'react';

const ICONS = {
  success: CheckCircle,
  error: XCircle,
};

const COLORS = {
  success: 'bg-success',
  error: 'bg-danger',
};

const Toast = ({ type = 'success', title, message }) => {
  const Icon = ICONS[type] ?? CheckCircle;
  const background = COLORS[type] ?? COLORS.success;

  return (
    <div className={`animate-slide-in fixed top-4 right-4 z-[60] max-w-sm rounded-2xl ${background} px-5 py-4 text-white shadow-xl`}> 
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          {title && <p className="text-sm font-semibold leading-tight">{title}</p>}
          {message && <p className="text-xs leading-relaxed text-white/90">{message}</p>}
        </div>
      </div>
    </div>
  );
};

Toast.propTypes = {
  type: PropTypes.oneOf(['success', 'error']),
  title: PropTypes.string,
  message: PropTypes.string,
};

export default memo(Toast);
