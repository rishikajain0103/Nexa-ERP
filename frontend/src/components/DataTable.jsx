function DataTable({ columns, data, actions }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-5 py-4 text-left font-semibold text-slate-600"
              >
                {col.label}
              </th>
            ))}
            {actions && (
              <th className="px-5 py-4 text-right font-semibold text-slate-600">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b last:border-b-0 hover:bg-slate-50">
              {columns.map((col) => (
                <td key={col.key} className="px-5 py-4 text-slate-700">
                  {row[col.key] ?? "-"}
                </td>
              ))}

              {actions && (
                <td className="px-5 py-4 text-right space-x-2">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;