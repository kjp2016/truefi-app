"use client"; 
import React from 'react';

interface TableColumn {
  Header: string;
  accessor: string; // Key in the row data object
}

interface TableRow {
  [key: string]: any; // Allows any other properties for a row
}

interface TableComponentProps {
  data: {
    columns: TableColumn[];
    rows: TableRow[];
  };
  title?: string; // Optional title for the table
}

const TableComponent: React.FC<TableComponentProps> = ({ data, title }) => {
  if (!data || !data.rows || !data.columns || data.columns.length === 0) {
    return <p className="text-sm text-red-500 my-2">Table data is not available or is malformed.</p>;
  }

  return (
    <div className="my-3 overflow-x-auto shadow-md sm:rounded-lg border border-gray-300 dark:border-gray-600"> {/* Added border to the outer div */}
      {title && <h4 className="text-md font-semibold px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">{title}</h4>}
      <table className="min-w-full border-collapse"> {/* Removed divide-y, added border-collapse */}
        <thead className="bg-gray-100 dark:bg-gray-750">
          <tr>
            {data.columns.map((col) => (
              <th 
                key={col.accessor} 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider border border-gray-300 dark:border-gray-600" // Added border
              >
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800"> {/* Removed divide-y */}
          {data.rows.length > 0 ? (
            data.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'} hover:bg-gray-100 dark:hover:bg-gray-700`}>
                {data.columns.map((col) => (
                  <td 
                    key={col.accessor} 
                    className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600" // Added border
                  >
                    {(row[col.accessor] !== undefined && row[col.accessor] !== null) ? String(row[col.accessor]) : '-'}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan={data.columns.length} 
                className="text-center px-4 py-4 text-sm text-gray-500 border border-gray-300 dark:border-gray-600" // Added border
              >
                No data available for this table.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;