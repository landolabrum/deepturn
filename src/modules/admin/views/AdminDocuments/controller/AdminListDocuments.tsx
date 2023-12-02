import React, { useEffect, useState } from 'react';
import styles from './AdminListDocuments.scss';
import { getService } from '@webstack/common';
import IDocumentService from '~/src/core/services/DocumentService/IDocumentService';
import UiButton from '@webstack/components/UiButton/UiButton';

const AdminListDocuments = () => {
    const docService = getService<IDocumentService>("IDocumentService");
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const getDocs = async () => {
            try {
                const documentsList = await docService.listDocuments();
                setDocuments(documentsList.data);
            } catch (error) {
                console.error("Error fetching documents:", error);
            }
        };

        if (documents.length === 0) {
            getDocs();
        }
    }, [documents.length]);

    const downloadFile = async (fileId: string) => {
        try {
            const response = await fetch(`/api/download-stripe-file/${fileId}`);
            if (!response.ok) throw new Error('Network response was not ok');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileId; // You can give a more meaningful filename here
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    const renderFile = (doc:any) => {
        const fileUrl = `/api/fetch-stripe-file/${doc.id}`;
    
        if (doc.type === 'pdf') {
            return <iframe src={fileUrl} title={doc.filename} width="100%" height="500px"></iframe>;
        } else if (doc.type === 'png' || doc.type === 'jpeg') {
            return <img src={fileUrl} alt={doc.filename} />;
        }
    
        return <p>No preview available</p>;
    };

    return (
        <>
            <style jsx>{styles}</style>
            <h1>Admin List Docs</h1>
            <div className='admin-list-documents'>
                {documents.length > 0 ? (
                    documents.map((doc, index) => (
                        <div key={index} className='admin-list-documents__list'>
                            {/* ... existing document details ... */}
                            <UiButton onClick={() => downloadFile(doc.id)}>Download</UiButton>
                        </div>
                    ))
                ) : (
                    <p>No documents found.</p>
                )}
            </div>
        </>
    );
};

export default AdminListDocuments;
