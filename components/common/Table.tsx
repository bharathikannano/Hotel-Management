import React, { useState, useMemo } from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  sortable?: boolean;
  sortKey?: keyof T;
  sortFn?: (a: T, b: T) => number;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  renderRowActions?: (item: T) => React.ReactNode;
}

const Table = <T extends { id: string }>(
  { columns, data, renderRowActions }: TableProps<T>
) => {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: Column<T>) => {
    const keyToSortBy = column.sortKey ?? (typeof column.accessor === 'string' ? column.accessor as keyof T : null);

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
    <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-700/50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.header)}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider ${col.sortable ? 'cursor-pointer' : ''}`}
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
        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
          {sortedData.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
              {columns.map((col) => (
                <td key={`${item.id}-${String(col.header)}`} className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                  {typeof col.accessor === 'function'
                    ? col.accessor(item)
                    : (item[col.accessor] as React.ReactNode)}
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