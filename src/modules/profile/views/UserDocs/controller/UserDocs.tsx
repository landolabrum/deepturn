import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './UserDocs.scss';
import IAuthenticatedUser from '~/src/models/UserContext';
import { getService } from '@webstack/common';
import IProductService from '~/src/core/services/ProductService/IProductService';
import environment from '~/src/core/environment';
import UiButton from '@webstack/components/UiButton/UiButton';
import capitalize, { capitalizeAll } from '@webstack/helpers/Capitalize';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import { useLoader } from '@webstack/components/Loader/Loader';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import UiInput from '@webstack/components/UiForm/components/UiInput/UiInput';
import DocumentsNone from '../views/DocumentsNone';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import IDocumentService from '~/src/core/services/DocumentService/IDocumentService';
import { useModal } from '@webstack/components/modal/contexts/modalContext';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';

// Remember to create a sibling SCSS file with the same name as this component
interface IDocuments {
  user?: IAuthenticatedUser;
  previewPdf?: boolean;
}

const UserDocs = ({ user, previewPdf }: IDocuments) => {

  const docRef = useRef<any | null>(null);
  const [docs, setDocs] = useState([]);
  const ProductService = getService<IProductService>('IProductService');
  const [loader, setLoader] = useLoader();
  const [fullName, setFullName] = useState<string>('');
  const pdfContainerRef = useRef<HTMLDivElement | null>(null);

  const documentService = getService<IDocumentService>('IDocumentService');
  const { openModal, closeModal, modalContent } = useModal();
  const onSubmit = async (formData: any) => {
    closeModal();
    setLoader({ active: true, body: 'Uploading your document' });
    try {
      const response = await documentService.uploadDocument(formData, 'tax_document_user_upload');
      console.log('PDF uploaded successfully', response);
    } catch (error) {
      console.error('Error uploading PDF', error);
    }
  }
  const generateAndSendPDF = async (docId: string) => {
    // Get the DOM element using the ref
    const pdfCurrent = pdfContainerRef.current;
    console.log('[ PDF CONTAINER REF ]', pdfCurrent?.offsetHeight)
    if (!pdfCurrent) {
      console.error('PDF container element not found');
      return;
    }

    // Define custom dimensions for the PDF (adjust as needed)
    const pageWidth = pdfCurrent?.offsetWidth; // A standard page width in points (8.27 inches * 72 points per inch)
    const pageHeight = pdfCurrent?.offsetHeight;  // A standard page height in points (11 inches * 72 points per inch)
    const margin = 10;       // Margin in points

    // Create a new jsPDF instance with custom dimensions
    const pdf = new jsPDF('p', 'pt', [pageWidth, pageHeight]);

    // Initialize variables for page rendering
    let currentPageY = margin;
    let contentHeight = 0;

    // // Helper function to add a new page
    // const addNewPage = () => {
    //   pdf.addPage();
    //   currentPageY = margin;
    //   contentHeight = 0;
    // };

    // Capture the content of the specified element
    const canvas = await html2canvas(pdfCurrent, { scrollY: currentPageY });

    // Calculate the content's height
    contentHeight = canvas.height;

    // Check if content height exceeds the remaining page height
    // if (currentPageY + contentHeight > pageHeight - margin) {
    //   // Content height exceeds the remaining page height, so add a new page
    //   addNewPage();
    // }

    // Add the captured content to the PDF page
    pdf.addImage(canvas, 'PNG', margin, currentPageY, pageWidth - 2 * margin, contentHeight);

    // Convert the PDF to a Blob
    const pdfBlob = pdf.output('blob');

    // Prepare the data to be sent
    const formData = new FormData();
    formData.append('file', pdfBlob, 'document.pdf');

    // Open the modal with the preview content
    if(previewPdf){openModal(
      < >
        <style jsx>{styles}</style>
        <div className='account-documents__pdf-preview'>

          <h2>Document Preview</h2>
          <div className='account-documents__pdf-preview--content'>
            <embed src={URL.createObjectURL(pdfBlob)} type="application/pdf" width="100%" height="600px" />
          </div>
          <UiButton variant='primary' onClick={() => onSubmit(formData).then(() => setLoader({ active: false }))}>Confirm & continue</UiButton>
          <UiButton variant='link' onClick={closeModal}>cancel</UiButton>
        </div>
      </>
    )}else{
      onSubmit(formData).then(() => setLoader({ active: false }));
    }
  };

  const handleFullName = (e: any) => {
    const { value } = e.target;
    setFullName(value);
  };

  const getDocuments = async () => {
    setLoader({ active: true, body: 'getting your documents' })
    try {
      const entireProducts = await ProductService.getProducts();
      const userRequirements = user?.metadata?.requirements;
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

  const DocStatusBox = ({ status, docs }: any) => {
    return <>
      <style jsx>{styles}</style>
      <div className='account-documents__status'>
        {status} Documents
        <div className='account-documents__status--docs'>
          {docs?.length && Object.entries(docs).map(([k, s]: any) => {
            return <div key={k} className='account-documents__status--docs--doc'>
              {/* {s?.name} */}
              {Number(k + 1)}. <UiButton variant='link'>{capitalizeAll(s?.name)}</UiButton>
            </div>
          }) || <div className='account-documents__status--docs--none'>
              NO documents are {status}
            </div>}
        </div>
      </div>
    </>
  }
  return (
    <>
      <style jsx>{styles}</style>
      <div className='account-documents' ref={docRef}>
        <div className='account-documents__header'>
          <div className='account-documents__header--title'>
            {user?.name && `${capitalizeAll(user.name)}'s Documents`}
          </div>
        </div>
        {docs?.length && <AdaptGrid xs={1} md={2} variant='card' gapX={10} margin="var(--s-4) 0">
          <DocStatusBox status='incomplete' docs={docs} />
          <DocStatusBox status='complete' />
        </AdaptGrid> || null}
        <div className='account-documents__list'>
          <div className='account-documents--document'>
            {docs?.length ? docs.map((doc: any, i: number) => {
              return <div key={i} >
                <UiCollapse variant='document' label={doc?.name} open={true}>
                  <div className='account-documents__pdf' ref={pdfContainerRef}>
                    {doc?.description && <div className='account-documents__pdf__description'>
                      {doc?.description}
                    </div>}
                    <ol className='account-documents--document__terms' >
                      {doc?.metadata && Object.entries(doc?.metadata).filter(([key, bullShit]) => key.substring(0, 2) === 't-').map(([key, value]: any) => {
                        const termTitle: string = String(`${capitalize(key?.split('_')[1])}`);

                        return <li key={key} className='account-documents--document__terms--term'>
                          <div className='account-documents--document__terms--term__title'>
                            {capitalize(keyStringConverter(termTitle))}
                          </div>
                          <div className='account-documents--document__terms--term__body'>
                            {value && value || ''}
                          </div>
                        </li>
                      })}
                    </ol>
                    <div className='account-documents__actions'>
                      <UiInput
                        variant={`signature${typeof complete != 'string' ? '' : ' invalid'}`}
                        name='name'
                        value={fullName}
                        label={`Sign, "${user?.name}". to agree to the terms & conditions`}
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

export default UserDocs;
