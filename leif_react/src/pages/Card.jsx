export const Card = ({ children, className = "" }) => (
    <div className={`bg-white p-4 shadow-md rounded-lg ${className}`}>{children}</div>
  );
  
  export const CardContent = ({ children }) => <div className="p-2">{children}</div>;
  