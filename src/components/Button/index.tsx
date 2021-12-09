import classNames from "classnames";

const Button = ({ children, className = "", style = {}, ...rest }) => {
  return (
    <button
      className={classNames(
        "px-4 py-4 bg-gray-900 rounded-lg text-white text-center block",
        className && className,
        style && style
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
