import React, { useEffect, useState } from 'react';
import styles from './AdminListDocuments.scss';
import { getService } from '@webstack/common';
import IDocumentService from '~/src/core/services/DocumentService/IDocumentService';
import UiButton from '@webstack/components/UiButton/UiButton';
import { useLoader } from '@webstack/components/Loader/Loader';

const AdminListDocuments = ({docs}:any) => {
    const docService = getService<IDocumentService>("IDocumentService");
    const [documents, setDocuments] = useState([]);
    const [currentDoc, setCurrentDoc] = useState<any>(null);
    const [loader, setLoader] = useLoader();

    const downloadFile = async (fileUrl: string, fileName: string) => {
        try {
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName; // Use the extracted filename
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    const retreive = async (fileId: string) => {
        try {
            const retrieved = await docService.retrieveDocument(fileId);
            setCurrentDoc(retrieved);
            console.log('[ DOCUMENT ]', retrieved);
        } catch (error) {
            console.log('[ DOCUMENT (error) ]', error);
        }
    };

    const RenderFile = () => {
        if (currentDoc) {
            if (currentDoc.type === 'pdf') {
                return (
                    <embed
                        src={currentDoc.url}
                        type="application/pdf"
                        width="100%"
                        height="500px"
                    />
                );
            } else if (currentDoc.type === 'png' || currentDoc.type === 'jpeg') {
                return <img src={currentDoc.url} alt={currentDoc.filename} />;
            }
        }

        return null; // No document to render
    };

    useEffect(() => {
        const getDocs = async () => {
            if(!docs){
                try {
                    const documentsList = await docService.listDocuments();
                    setDocuments(documentsList.data);
                } catch (error) {
                    console.error("Error fetching documents:", error);
                }
            }else{
                setDocuments(docs);
            }
        };

        if (documents?.length === 0) {
            setLoader({ active: true, body: 'Getting admin documents' });
            getDocs().then(() => setLoader({ active: false }));
        }
    }, [documents?.length, setCurrentDoc]);

    return (
        <>
            <style jsx>{styles}</style>
            {!docs && <h1>Admin List Docs</h1>}
            <div className='admin-list-documents'>
                {currentDoc?.id === (currentDoc && currentDoc.id)  && (
                    <RenderFile />
                )}
                {documents?.length > 0 ? (
                    documents.map((doc: any, index: number) => {
                        return (
                            <div key={index} className='admin-list-documents__list'>
                                <div className='admin-list-documents__list--item'>
                                    <div className='admin-list-documents__list--item-content'>
                                        <strong>file: </strong>
                                        {doc?.filename}<br/><br/>
                                        <strong>porpose:</strong>
                                        {doc?.purpose}
                                        </div>
                                    <div className='admin-list-documents__list--item-action'>

                                    <UiButton
                                        onClick={() => retreive(doc.id)}
                                        >Download</UiButton>
                                        </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <p>No documents found.</p>
                )}
            </div>
        </>
    );
};

export default AdminListDocuments;
