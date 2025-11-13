import { Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { memo } from 'react';

const Spinner = ({ size = 20, className = '' }) => (
  <Loader2
    className={`animate-spin text-white ${className}`.trim()}
    style={{ width: size, height: size }}
  />
);

Spinner.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
};

export default memo(Spinner);
