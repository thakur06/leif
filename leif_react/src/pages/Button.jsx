export const Button = ({ children, className = "", ...props }) => (
    <button className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${className}`} {...props}>
      {children}
    </button>
  );