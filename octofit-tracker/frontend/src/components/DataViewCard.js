import { useMemo, useState } from 'react';

function DataViewCard({
  title,
  subtitle,
  endpoint,
  rows,
  columns,
  searchPlaceholder,
  emptyMessage,
  rowKey,
  onRefresh,
}) {
  const [query, setQuery] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return rows;
    }

    return rows.filter((row) => {
      const haystack = columns
        .map((column) => {
          const rawValue = column.getValue ? column.getValue(row) : row[column.key];
          return rawValue === null || rawValue === undefined ? '' : String(rawValue);
        })
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [columns, query, rows]);

  return (
    <section className="data-page container py-4">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
            <div>
              <h1 className="h3 mb-1">{title}</h1>
              {subtitle ? <p className="text-secondary mb-0">{subtitle}</p> : null}
            </div>
            <div className="d-flex flex-wrap gap-2">
              <a className="btn btn-outline-primary" href={endpoint} target="_blank" rel="noreferrer">
                API Link
              </a>
              <button className="btn btn-primary" type="button" onClick={onRefresh}>
                Refresh
              </button>
            </div>
          </div>

          <form className="row g-3 mb-3" onSubmit={(event) => event.preventDefault()}>
            <div className="col-12 col-md-8 col-lg-6">
              <label className="form-label" htmlFor={`${title.toLowerCase()}-search`}>
                Search
              </label>
              <input
                id={`${title.toLowerCase()}-search`}
                type="search"
                className="form-control"
                placeholder={searchPlaceholder}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div className="col-12 col-md-4 col-lg-3 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                type="button"
                onClick={() => setQuery('')}
                disabled={query.length === 0}
              >
                Clear Filter
              </button>
            </div>
          </form>

          <div className="table-responsive octo-table-wrap">
            <table className="table table-hover table-striped align-middle mb-0">
              <thead className="table-light">
                <tr>
                  {columns.map((column) => (
                    <th key={column.header} scope="col">
                      {column.header}
                    </th>
                  ))}
                  <th className="text-end" scope="col">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td className="text-muted py-4" colSpan={columns.length + 1}>
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => (
                    <tr key={rowKey(row)}>
                      {columns.map((column) => (
                        <td key={`${rowKey(row)}-${column.header}`}>
                          {column.render ? column.render(row) : row[column.key] ?? '-'}
                        </td>
                      ))}
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => setSelectedRow(row)}>
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedRow ? (
        <>
          <div className="modal d-block" role="dialog" aria-modal="true" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header">
                  <h2 className="modal-title h5 mb-0">{title} Details</h2>
                  <button
                    className="btn-close"
                    type="button"
                    aria-label="Close"
                    onClick={() => setSelectedRow(null)}
                  />
                </div>
                <div className="modal-body">
                  <pre className="mb-0 bg-light p-3 rounded-3 small">{JSON.stringify(selectedRow, null, 2)}</pre>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" type="button" onClick={() => setSelectedRow(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" />
        </>
      ) : null}
    </section>
  );
}

export default DataViewCard;