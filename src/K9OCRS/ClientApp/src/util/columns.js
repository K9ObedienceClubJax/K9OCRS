import React from 'react';

export const alignmentWrapper =
    (alignment, cellCreator) =>
    ({ value }) => {
        if (value === null || value === undefined) return '';

        const style = {
            display: 'flex',
            alignItems: 'center',
        };

        switch (alignment) {
            case 'center':
                style.justifyContent = 'center';
                break;
            case 'right':
                style.justifyContent = 'end';
                break;
            case 'left':
            default:
                style.justifyContent = 'start';
                break;
        }

        return (
            <div style={style}>
                {typeof cellCreator === 'function' ? cellCreator({ value }) : value}
            </div>
        );
    };
