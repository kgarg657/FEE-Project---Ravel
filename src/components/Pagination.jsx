import React, { useState } from 'react';
import theme from '../theme';

const Pagination = ({
    currentPage = 1,
    totalPages = 16,
    onPageChange,
    itemsPerPage = 2,
    totalItems = 32
}) => {
    const [inputPage, setInputPage] = useState('');

    const handlePageClick = (page) => {
        const pageNum = Number(page);
        if (pageNum >= 1 && pageNum <= totalPages && pageNum !== currentPage) {
            if (onPageChange) onPageChange(pageNum);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handlePageClick(inputPage);
            setInputPage('');
        }
    };

    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                height: '40px',
                padding: '0 16px',
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '0 0 6px 6px',
                fontFamily: theme.fonts.sans,
                fontSize: '12px',
                boxSizing: 'border-box'
            }}
        >
            {/* Left: Direct Page Jump Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: theme.colors.textSecondary }}>
                <span>Go to page:</span>
                <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={inputPage}
                    onChange={(e) => setInputPage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={currentPage.toString()}
                    style={{
                        width: '40px',
                        height: '22px',
                        backgroundColor: theme.colors.bg,
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '4px',
                        color: theme.colors.textPrimary,
                        textAlign: 'center',
                        fontSize: '11px',
                        outline: 'none'
                    }}
                />
            </div>

            {/* Center: Controls (|< 1 2 3 ... 16 >|) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                    type="button"
                    onClick={() => handlePageClick(1)}
                    disabled={currentPage === 1}
                    style={{ background: 'none', border: 'none', color: theme.colors.textSecondary, cursor: 'pointer' }}
                >
                    |&lt;
                </button>

                {[1, 2, 3, totalPages].map((page) => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => handlePageClick(page)}
                        style={{
                            padding: '2px 8px',
                            backgroundColor: currentPage === page ? 'rgba(255,255,255,0.1)' : 'transparent',
                            border: currentPage === page ? `1px solid ${theme.colors.border}` : 'none',
                            borderRadius: '4px',
                            color: currentPage === page ? theme.colors.textPrimary : theme.colors.textSecondary,
                            cursor: 'pointer'
                        }}
                    >
                        {page}
                    </button>
                ))}

                <button
                    type="button"
                    onClick={() => handlePageClick(totalPages)}
                    disabled={currentPage === totalPages}
                    style={{ background: 'none', border: 'none', color: theme.colors.textSecondary, cursor: 'pointer' }}
                >
                    &gt;|
                </button>
            </div>

            {/* Right: Item Range indicator */}
            <div style={{ color: theme.colors.textSecondary }}>
                {startItem} - {endItem} next
            </div>
        </div>
    );
};

export default Pagination;