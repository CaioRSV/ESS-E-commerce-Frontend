import React from 'react';
import { Button } from './button';
import { Input } from './input';

export type TTableProps = {
  data: Array<Record<string, any>>;
  columns: Array<{ key: string; title: string }>;
  onSort: (key: string) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  changeInputSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disableNextPage: boolean;
  disablePreviousPage: boolean;
  handleDeleteAction: (id: number) => void;
};

const Table = ({
  data,
  columns,
  onSort,
  onNextPage,
  onPreviousPage,
  disableNextPage,
  disablePreviousPage,
  changeInputSearch,
  handleDeleteAction,
}: TTableProps) => {
  const handleDelete = (id: number) => {
    if (window.confirm('Você tem certeza que deseja deletar esse usuário?')) {
      handleDeleteAction(id);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <Input
          placeholder="Buscar usuários"
          onChange={(event) => changeInputSearch(event)}
          className="mb-2 w-full max-w-md"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" id="usersTable">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => onSort(column.key)}
                >
                  {column.title}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row[column.key]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Button onClick={() => handleDelete(row.id)} className="bg-red-500 hover:bg-red-700">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <Button onClick={onPreviousPage} disabled={disablePreviousPage}>
          Voltar
        </Button>
        <Button onClick={onNextPage} disabled={disableNextPage}>
          Próximo
        </Button>
      </div>
    </div>
  );
};

export default Table;
