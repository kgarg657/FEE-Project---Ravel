import React from 'react';
import theme from '../theme';
import Badge from './Badge';
import Button from './Button';

function Table({ 
  columns = [], 
  data = [], 
  onActionClick, 
  emptyText = "No records found" 
}) {
  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '8px',
        boxSizing: 'border-box',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '13px',
          fontFamily: theme.fonts?.sans || 'sans-serif',
        }}
      >
        {/* Table Header */}
        <thead>
          <tr
            style={{
              borderBottom: `1px solid ${theme.colors.border}`,
              backgroundColor: `${theme.colors.bg}80`, // 50% opacity slate background
            }}
          >
            {columns.map((col) => (
              <th
                key={col.key || col.accessor}
                style={{
                  padding: '12px 16px',
                  color: theme.colors.textSecondary,
                  fontWeight: 600,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                }}
              >
                {col.header}
              </th>
            ))}
            {onActionClick && (
              <th
                style={{
                  padding: '12px 16px',
                  color: theme.colors.textSecondary,
                  fontWeight: 600,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  textAlign: 'right',
                }}
              >
                Action
              </th>
            )}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onActionClick ? 1 : 0)}
                style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  color: theme.colors.textMuted,
                  fontSize: '14px',
                }}
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                style={{
                  borderBottom:
                    rowIndex === data.length - 1
                      ? 'none'
                      : `1px solid ${theme.colors.border}`,
                  transition: 'background-color 0.15s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = theme.colors.surfaceHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                {columns.map((col) => {
                  const cellValue = row[col.accessor];

                  return (
                    <td
                      key={col.key || col.accessor}
                      style={{
                        padding: '14px 16px',
                        color: theme.colors.textPrimary,
                        verticalAlign: 'middle',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {/* 1. Custom Cell Renderer (If provided) */}
                      {col.render ? (
                        col.render(cellValue, row)
                      ) : col.type === 'badge' ? (
                        /* 2. Automatic Badge Renderer */
                        <Badge
                          variant={
                            cellValue?.toLowerCase() === 'verified'
                              ? 'verified'
                              : cellValue?.toLowerCase() === 'suggested'
                              ? 'suggested'
                              : cellValue?.toLowerCase() === 'flagged' ||
                                cellValue?.toLowerCase() === 'critical'
                              ? 'flagged'
                              : 'default'
                          }
                        >
                          {cellValue}
                        </Badge>
                      ) : col.type === 'link' ? (
                        /* 3. Entity Link Renderer */
                        <span
                          style={{
                            color: theme.colors.accent,
                            fontWeight: 600,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          {cellValue}
                        </span>
                      ) : (
                        /* 4. Default Plain Text Renderer */
                        cellValue || '-'
                      )}
                    </td>
                  );
                })}

                {/* Optional Action Buttons Column */}
                {onActionClick && (
                  <td
                    style={{
                      padding: '14px 16px',
                      textAlign: 'right',
                      verticalAlign: 'middle',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        gap: '8px',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Button
                        variant="secondary"
                        onClick={() => onActionClick('view', row)}
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                      >
                        View Graph
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => onActionClick('edit', row)}
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                      >
                        Review
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;