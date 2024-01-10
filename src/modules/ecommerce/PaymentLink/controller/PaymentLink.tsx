// Relative Path: ./PaymentLink.tsx
import React from 'react';
import styles from './PaymentLink.scss';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';

// Remember to create a sibling SCSS file with the same name as this component

const PaymentLink: React.FC = () => {
    return (
        <>
            <style jsx>{styles}</style>
            <div className='payment-link'>
                <AdaptGrid xs={1} variant='card'>
                    <div>
                        hello
                    </div>
                </AdaptGrid>
            </div>
        </>
    );
};

export default PaymentLink;