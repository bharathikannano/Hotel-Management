
import React, { useState, useMemo } from 'react';

const Table = (
  { columns, data, renderRowActions }: { columns: any[], data: any[], renderRowActions?: (item: any) => React.ReactNode }
) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (column: any) => {
    const keyToSortBy = column.sortKey ?? (typeof column.accessor === 'string' ? column.accessor : null);

    if (!keyToSortBy) return;

    if (sortColumn === keyToSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(keyToSortBy);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;

    const activeColumn = columns.find(col => {
        const key = col.sortKey ?? (typeof col.accessor === 'string' ? col.accessor : null);
        return key === sortColumn;
    });

    return [...data].sort((a, b) => {
      let result = 0;
      
      if (activeColumn && activeColumn.sortFn) {
         result = activeColumn.sortFn(a, b);
      } else {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue < bValue) result = -1;
        if (aValue > bValue) result = 1;
      }

      return sortDirection === 'asc' ? result : -result;
    });
  }, [data, sortColumn, sortDirection, columns]);

  return (
    <div className="overflow-x-auto bg-neutral-50 dark:bg-neutral-800 rounded-2xl shadow-xl shadow-primary-900/10 dark:shadow-xl dark:shadow-black/30">
      <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
        <thead className="bg-neutral-100 dark:bg-neutral-700/50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.header)}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider ${col.sortable ? 'cursor-pointer' : ''}`}
                onClick={() => col.sortable && handleSort(col)}
              >
                <div className="flex items-center">
                  {col.header}
                  {col.sortable && sortColumn === (col.sortKey ?? (typeof col.accessor === 'string' ? col.accessor : null)) && (
                    <span className="ml-2">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {renderRowActions && (
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-neutral-50 dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
          {sortedData.map((item) => (
            <tr key={item.id} className="hover:bg-neutral-100 dark:hover:bg-neutral-700/50">
              {columns.map((col) => (
                <td key={`${item.id}-${String(col.header)}`} className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-300">
                  {typeof col.accessor === 'function'
                    ? col.accessor(item)
                    : item[col.accessor]}
                </td>
              ))}
              {renderRowActions && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {renderRowActions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
