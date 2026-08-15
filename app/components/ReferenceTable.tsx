interface ReferenceTableProps {
  codeColumns?: readonly number[];
  headings: readonly string[];
  rows: readonly (readonly string[])[];
}

export function ReferenceTable({
  codeColumns = [],
  headings,
  rows,
}: ReferenceTableProps) {
  return (
    <div className="table-wrap reference-table">
      <table>
        <thead>
          <tr>
            {headings.map((heading) => (
              <th key={heading}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join(":")}>
              {row.map((cell, index) => (
                <td key={`${index}:${cell}`}>
                  {codeColumns.includes(index) ? <code>{cell}</code> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
