import PropTypes from 'prop-types';
import logoImg from '../../assets/Logo1.jpg';

const sizes = {
  small: 24,
  default: 40,
  large: 56,
};

const Logo = ({ size = 'default', showText = true, variant = 'default', className = '' }) => {
  const px = sizes[size] ?? sizes.default;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={logoImg}
        alt="BidGrid logo"
        style={{ height: px, width: 'auto' }}
        className="rounded-md shadow-sm"
      />
      {showText && (
        <span
          className={`select-none text-[18px] font-bold tracking-tight ${
            variant === 'light' ? 'text-white' : 'text-slate-900'
          }`}
          style={{ letterSpacing: '-0.5px' }}
        >
          BidGrid
        </span>
      )}
    </div>
  );
};

Logo.propTypes = {
  size: PropTypes.oneOf(['small', 'default', 'large']),
  showText: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'light']),
  className: PropTypes.string,
};

export default Logo;
