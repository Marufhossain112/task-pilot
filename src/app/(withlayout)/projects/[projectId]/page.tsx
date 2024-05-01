"use client";
import { useParams } from 'next/navigation';
import React from 'react';

const DynamicProjectPage = () => {
    const {projectId} = useParams();
    return (
        <div>
            <h1>This is dynamic page {projectId}</h1>
        </div>
    );
};

export default DynamicProjectPage;