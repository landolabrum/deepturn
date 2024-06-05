import styles from './CreatePDF.scss'; // Corrected the import statement
import React, { FC, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useModal } from '@webstack/components/modal/contexts/modalContext';
import UiInput from '@webstack/components/UiInput/UiInput';
import UiSelect from '@webstack/components/UiSelect/UiSelect';
import UiButton from '@webstack/components/UiButton/UiButton';

interface ICreatePDF {
    pdfRef: React.RefObject<HTMLDivElement>;
    preview?: boolean;
    downloadable?: boolean;
}
const CreatePDF: FC<ICreatePDF> = ({ pdfRef, preview, downloadable }) => {
    const { openModal } = useModal();
    const initialOutputSize = { width: 8.27, height: 11.69 };
    const [previewImage, setPreviewImage] = useState<string | null>(null); // State for preview image
    const PreviewContent = ({ imgData }: { imgData: string }) => {
        const [unit, setUnit] = useState<'in' | 'px'>('in'); // Explicitly setting the type for unit
        const [outputSize, setOutputSize] = useState(initialOutputSize); // Default A4 size in inches
        const handleOutputSize = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value, name } = e.target;
            console.log({
                name: name, value: value
            });

            if (/^\d*\.?\d*$/.test(value)) {
                let newValue;
                if (value === '' || value === '.') {
                    // If the value is empty or just a decimal point, set it to 0
                    newValue = 0;
                } else if (value.endsWith('.')) {
                    // If the value ends with a decimal point, keep it as a string
                    newValue = value;
                } else {
                    // Otherwise, parse the value as a float
                    newValue = parseFloat(value);
                }

                setOutputSize({
                    ...outputSize,
                    [name]: newValue
                });
            }
        };
        return (
            <>
                <style jsx>{styles}</style>
                <div className='pdf-preview'>
                    <img src={imgData} alt="PDF Preview"
                        className='pdf-preview--image'
                    />
                    <div className='pdf-preview__options'>
                        <div className='pdf-preview__options--actions'>
                            <div>
                                {/* <UiSelect
                                    options={['in', 'px']}
                                    onSelect={(unit) => setUnit(unit)}
                                    variant='lite'
                                    label='units'
                                    value={unit}
                                /> */}
                            </div>
                            <div>
                                <UiInput
                                    label={`Width ( ${unit} ):`}
                                    value={outputSize.width}
                                    name='width'
                                    type="tel"
                                    onChange={handleOutputSize}
                          
                                />
                            </div>
                            <div>
                                <UiInput
                                    label={`Height ( ${unit} ):`}
                                    value={outputSize.height}
                                    type="number"
                                    name='height'
                                    onChange={handleOutputSize}
                                />
                            </div>
                        </div>
                        <UiButton onClick={() => downloadPdfWithSize(imgData)}>Download Resized PDF</UiButton>
                    </div>
                </div>
            </>
        )
    };

    const convertToPoints = (size: number, unit: string) => {
        switch (unit) {
            case 'in': // inches to points
                return size * 72;
            case 'px': // pixels to points (assuming 96 dpi)
                return size * 0.75;
            default:
                return size; // already in points if mm
        }
    };
    let { initHeight, initWidth }: { initHeight: number, initWidth: number } = { initHeight: 100, initWidth: 100 };
    if (pdfRef.current) {
        initHeight = pdfRef.current.offsetHeight;
        initWidth = pdfRef.current.offsetWidth;
    }
    const renderPdf = async (download: boolean) => {
        if (pdfRef.current) {
            const canvas = await html2canvas(pdfRef.current);
            const imgData = canvas.toDataURL('image/png');
            const orientation = initWidth > initHeight ? 'l' : 'p'; // Determine orientation based on width and height

            if (download) {
                let unit = 'px';
                const pdf = new jsPDF({
                    orientation,
                    unit: unit as 'in' | 'px', // Typecast to ensure correct type
                    format: [
                        convertToPoints(initWidth, unit),
                        convertToPoints(initHeight, unit)
                    ]
                });
                pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
                pdf.save('download.pdf');
            } else {
                setPreviewImage(imgData); // Set the preview image
                openModal(<PreviewContent imgData={imgData} />);
            }
        }
    };

    const downloadPdfWithSize = (imgData: string) => {
        const pdf = new jsPDF({
            orientation: initWidth > initHeight ? 'l' : 'p',
            unit: 'pt',
            format: [
                convertToPoints(initWidth, 'px'),
                convertToPoints(initHeight, 'px')
            ]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
        pdf.save('resized-download.pdf');
    };

    const downloadPdf = () => renderPdf(true);
    const handlePreview = () => renderPdf(false);

    return (
        <>
            <style jsx>{styles}</style>
            <div className='create-pdf'>
                {preview && (
                    <div className={styles.preview}>
                        <button onClick={handlePreview}>Preview Content</button>
                    </div>
                )}
                {downloadable && <button onClick={downloadPdf}>Download as PDF</button>}
            </div>

        </>
    );
};

export default CreatePDF;