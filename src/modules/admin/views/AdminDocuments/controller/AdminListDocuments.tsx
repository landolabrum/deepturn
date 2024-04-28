import React, { useEffect, useState } from 'react';
import styles from './AdminListDocuments.scss';
import { getService } from '@webstack/common';
import IDocumentService from '~/src/core/services/DocumentService/IDocumentService';
import UiButton from '@webstack/components/UiButton/UiButton';
import { useLoader } from '@webstack/components/Loader/Loader';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { useRouter } from 'next/router';
import Image from 'next/image';

const RenderFile = ({ currentDoc }:{currentDoc:any}) => {
    const retrieved = currentDoc.retrieved;
    const router = useRouter();
    useEffect(() => {
        console.log('Document changed:', currentDoc);
    }, [currentDoc]);

    if (currentDoc) {
        if(retrieved?.object && retrieved.object === 'file_link'){
            if(currentDoc.type === 'png'){
                return <Image src={retrieved.url} alt={currentDoc.filename} />;
            }
            else if (currentDoc.type === 'pdf') {
                return (
                    <embed
                        src={currentDoc.url}
                        type="application/pdf"
                        width="100%"
                        height="500px"
                    />
            );
        }
        // } else if (currentDoc.type === 'png' || currentDoc.type === 'jpeg') {
        //     return <img src={currentDoc.url} alt={currentDoc.filename} />;
        // }
    }
    }

    return null; // No document to render
};

const AdminListDocuments = ({ docs }: any) => {
    const docService = getService<IDocumentService>("IDocumentService");
    const [documents, setDocuments] = useState<any | undefined>();
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

    const retreive = async (doc:any) => {
        const fileId = doc.id
        setLoader({ active: true, body: `loading document ${fileId}` });
        
        try {
            const retrieved = await docService.retrieveDocument(fileId);
            setCurrentDoc({...doc, retrieved});
            setLoader({ active: false });
        } catch (error) {
            setLoader({ active: true, body: <div className='error'>Document Failed {fileId}</div>, persistence:3000 });
        }
    };


    useEffect(() => {
        const getDocs = async () => {
            if (!docs) {
                try {
                    const documentsList = await docService.listDocuments();
                    setDocuments(documentsList.data);
                } catch (error) {
                    setDocuments(false);
                    console.error("Error fetching documents:", error);
                }
            } else {
                setDocuments(docs);
            }
        };

        if (documents === undefined) {
            setLoader({ active: true, body: 'Getting admin documents' });
            getDocs().then(() => setLoader({ active: false }));
        }
    }, [docs, docService, ]);

    return (
        <>
            <style jsx>{styles}</style>
            {!docs && <h1>Admin List Docs</h1>}
            <div className='admin-list-documents'>
                {currentDoc && <RenderFile currentDoc={currentDoc} />}
                {documents ? (
                    documents.map((doc: any, index: number) => {
                        return (
                            <div key={index} className='admin-list-documents__list'>
                                <div className='admin-list-documents__list--item'>
                                    <div className='admin-list-documents__list--item-content'>
                                        <strong>file: </strong>{doc?.filename}<br/><br/>
                                        <strong>purpose:</strong>{doc?.purpose}
                                    </div>
                                    <div className='admin-list-documents__list--item-action'>
                                        <UiButton onClick={() => retreive(doc)}>preview</UiButton>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <>
                        {documents === false && <p>No documents found.</p>}
                        {documents === undefined && <UiLoader />}
                    </>
                )}
            </div>
        </>
    );
};

export default AdminListDocuments;
