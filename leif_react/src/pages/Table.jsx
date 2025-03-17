export const Table = ({ children }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 text-left">{children}</table>
    </div>
  );
  
  export const TableHead = ({ children }) => (
    <thead className="bg-gray-200">{children}</thead>
  );
  
  export const TableBody = ({ children }) => (
    <tbody className="divide-y divide-gray-300">{children}</tbody>
  );
  
  export const TableRow = ({ children }) => <tr className="hover:bg-gray-100">{children}</tr>;
  
  export const TableCell = ({ children, className = "" }) => (
    <td className={`p-2 border border-gray-300 ${className}`}>{children}</td>
  );