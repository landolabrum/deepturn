import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Documents.scss';
import UserContext from '~/src/models/UserContext';
import { getService } from '@webstack/common';
import IShoppingService from '~/src/core/services/ShoppingService/IShoppingService';
import environment from '~/src/environment';
import UiButton from '@webstack/components/UiButton/UiButton';
import capitalize from '@webstack/helpers/Capitalize';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import { useLoader } from '@webstack/components/Loader/Loader';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import useScroll from '@webstack/hooks/useScroll';
import UiInput from '@webstack/components/UiInput/UiInput';
import DocumentsNone from '../views/DocumentsNone';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import IDocumentService from '~/src/core/services/DocumentService/IDocumentService';
import { useModal } from '@webstack/components/modal/contexts/modalContext';

// Remember to create a sibling SCSS file with the same name as this component
interface IDocuments {
  user?: UserContext;
}

const Documents = ({ user }: IDocuments) => {
  const views: any = {
    1: 'lorem',
    2: 'ipsum',
    3: 'ipsum',
  }

  const [currentScrollYPosition, scrollToPosition] = useScroll();
  const docRef = useRef<any | null>(null);
  const [docs, setDocs] = useState([]);
  const shoppingService = getService<IShoppingService>('IShoppingService');
  const [loader, setLoader] = useLoader();
  const [fullName, setFullName] = useState<string>('');

  const documentService = getService<IDocumentService>('IDocumentService');
  const { openModal, closeModal, modalContent } = useModal();

  const generateAndSendPDF = async (docId: string) => {
    const input: any = document.getElementById(docId);
  
    // Calculate the height of the content to determine the number of pages needed
    const contentHeight = input.offsetHeight;
  
    // Calculate the number of pages based on content height and page height (adjust pageHeight as needed)
    const pageHeight = 792; // A standard page height in points (11 inches * 72 points per inch)
    const numPages = Math.ceil(contentHeight / pageHeight);
  
    // Create a new jsPDF instance with custom dimensions based on the number of pages
    const pdf = new jsPDF('p', 'pt', [595.28, pageHeight]);
  
    // Generate each page
    for (let i = 0; i < numPages; i++) {
      if (i > 0) {
        // Add a new page for subsequent pages
        pdf.addPage();
      }
      const startY = i * pageHeight;
  
      // Capture the content of the specified element for each page
      const canvas = await html2canvas(input, { scrollY: startY });
      const imgData = canvas.toDataURL('image/png');
  
      // Add the content to the PDF page, ensuring it fits within the page dimensions
      pdf.addImage(imgData, 'PNG', 0, 0, 595.28, pageHeight);
    }
  
    // Convert the PDF to a Blob
    const pdfBlob = pdf.output('blob', { type: 'application/pdf' });
  
    // Prepare the data to be sent
    const formData = new FormData();
    formData.append('file', pdfBlob, 'document.pdf');
  
    // Use DocumentService to send the data
    try {
      const response = await documentService.uploadDocument(formData, 'tax_document_user_upload');
      console.log('PDF uploaded successfully', response);
  
      // Open the modal with the preview content
      openModal(
        <div style={{ height: '80vh' }}>
          <h2>Document Preview</h2>
          <embed src={URL.createObjectURL(pdfBlob)} type="application/pdf" width="100%" height="100%" />
          <button onClick={closeModal}>Close Preview</button>
        </div>
      );
    } catch (error) {
      console.error('Error uploading PDF', error);
    }
  };
  

  const handleFullName = (e: any) => {
    const { value } = e.target;
    setFullName(value);
  };

  const getDocuments = async () => {
    setLoader({ active: true, body: 'getting your documents' })
    try {
      const entireProducts = await shoppingService.getProducts();
      const userRequirements = user?.metadata?.requirements;
      console.log('[ USER REQs ]', userRequirements)
      const newDocs = entireProducts?.data.filter((prod: any) =>
        // IS MERCHANT
        prod?.metadata?.mid == environment.merchant.mid &&
        // IS A DOCUMENT
        prod?.metadata?.type == 'document' &&
        // Document is for Customer
        userRequirements?.includes(prod.id)
      );
      setDocs(newDocs);
    } catch (e: any) {
      console.log('[ DOCS ERROR ]', e);
    }
    setLoader({ active: false });
  }

  const isComplete = () => {
    const fNLen = fullName.length;
    if (!user || user?.name == undefined) return 'no user';
    else if (fNLen < 3) return true;
    else if (fNLen >= 3 && String(user.name).toLowerCase().includes(fullName.toLowerCase())) {
      return true;
    } else {
      return 'full name incorrect';
    }
  };

  const complete = isComplete();

  useEffect(() => {
    Boolean(!Object(docs).length) && getDocuments();
  }, [setDocs]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='documents' ref={docRef}>
        <div className='documents__header'>
          <div className='documents__header--title'>
            {user?.name}&apos;s Documents
          </div>
        </div>
        <div className='documents__list'>
          <div className='documents--document'>
            {docs?.length ? docs.map((doc: any, i: number) => {
              return <div key={i} >
                <UiCollapse variant='document' label={doc?.name} open={true}>
                  <div className='documents__pdf' id={doc?.id}>
                  <ol className='documents--document__terms' >
                    {doc?.metadata && Object.entries(doc?.metadata).filter(([key, bullShit]) => key.substring(0, 2) === 't-').map(([key, value]: any) => {
                      const termTitle: string = String(`${capitalize(key?.split('_')[1])}`);

                      return <li key={key} className='documents--document__terms--term'>
                        <div className='documents--document__terms--term__title'>
                          {capitalize(keyStringConverter(termTitle))}
                        </div>
                        <div className='documents--document__terms--term__body'>
                          {value && value || ''}
                        </div>
                      </li>
                    })}
                  </ol>
                  <div className='documents__actions'>
                    <UiInput
                      variant={`signature${typeof complete != 'string' ? '' : ' invalid'}`}
                      name='name'
                      value={fullName}
                      label='sign your full name & agree, to continue.'
                      placeholder={user?.name}
                      onChange={handleFullName}
                      error={typeof complete == 'string' && complete || undefined}
                    />
                    <UiButton
                      variant={String(user?.name).toLowerCase() == fullName.toLowerCase() ? 'primary' : 'disabled'}
                      onClick={() => generateAndSendPDF(doc.id)}
                    >
                      Agree
                    </UiButton>
                  </div>
                  </div></UiCollapse>
              </div>
            }) : (!loader.active &&
              <DocumentsNone />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Documents;
