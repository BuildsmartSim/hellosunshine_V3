import React from 'react';

type SchemaProps = {
    data: Record<string, any>;
};

export const Schema: React.FC<SchemaProps> = ({ data }) => {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
};
