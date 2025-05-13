import React from 'react';
import styles from './TermsOfService.scss';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import environment from '~/src/core/environment';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { useRouter } from 'next/router';

const TermsOfService = ({ onClose }: { onClose: () => void }) => {
    const merchant = environment.merchant;
    const merchantName = keyStringConverter(merchant.name)?.toUpperCase();
        const router = useRouter();

    const MerchantHeader = () => {
        return (
          <>
            <style jsx>{styles}</style>
            <div className="terms-of-service__header">
                <h1>{merchantName}</h1>
                <div className="terms-of-service__content--title">Terms of Service</div>
                <p className='s-9-width'>{merchantName} is a registered trademark of {merchantName} LLC. All rights reserved.</p>
                <UiIcon width='100px' icon={merchantName+"-logo"} />
            </div>
          </>
        );
    }

  return (
    <>
      <style jsx>{styles}</style>
      <div className="terms-of-service">
        <div className="terms-of-service__content">
          <MerchantHeader />
          <p><strong>1. Acceptance of Terms</strong><br/>
          By accessing the Site or purchasing products/services from {merchantName}, you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree, do not use the Site.</p>

          <p><strong>2. Eligibility</strong><br/>
          You must be at least 18 years old and legally capable of entering into contracts to use the Site.</p>

          <p><strong>3. Account Registration</strong><br/>
          You may need to create an account to access certain features. You are responsible for maintaining account security and for all activities under your credentials.</p>

          <p><strong>4. Intellectual Property</strong><br/>
          All content on the Site—including text, graphics, logos, and software—is the property of {merchantName} or its licensors and is protected by intellectual‑property laws. You may not reproduce or distribute Site content without prior written consent.</p>

          <p><strong>5. User Content</strong><br/>
          If you submit reviews, comments, or other content (&quot;User Content&quot;), you grant {merchantName} a non‑exclusive, royalty‑free, worldwide license to use, display, and distribute that content in connection with the Site and our marketing.</p>

          <p><strong>6. Prohibited Conduct</strong><br/>
          You agree not to:
            <ul>
              <li>Violate any applicable laws or regulations.</li>
              <li>Infringe intellectual property or privacy rights.</li>
              <li>Upload viruses or malicious code.</li>
              <li>Use the Site to send unsolicited messages (spam).</li>
            </ul>
          </p>

          <p><strong>7. Orders & Payment</strong><br/>
          Prices, descriptions, and availability may change without notice. We reserve the right to refuse or cancel orders at any time. All payments must be authorized and valid.</p>

          <p><strong>8. Disclaimers</strong><br/>
          THE SITE AND SERVICES ARE PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. {merchantName} DISCLAIMS ALL WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON‑INFRINGEMENT.</p>

          <p><strong>9. Limitation of Liability</strong><br/>
          TO THE FULLEST EXTENT PERMITTED BY LAW, {merchantName} WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SITE OR SERVICES.</p>

          <p><strong>10. Indemnification</strong><br/>
          You agree to indemnify and hold harmless {merchantName}, its officers, directors, employees, and agents from any claims arising from your use of the Site or violation of these Terms.</p>

          <p><strong>11. Governing Law &amp; Dispute Resolution</strong><br/>
          These Terms are governed by the laws of the State of Arizona. Any dispute shall be resolved exclusively in Maricopa County, Arizona.</p>

          <p><strong>12. Modifications</strong><br/>
          We may modify these Terms at any time by posting the updated version. Continued use of the Site constitutes acceptance of the modified Terms.</p>

          <p><strong>13. Contact Information</strong><br/>
          For questions, contact legal@nirvanaenergy.net.</p>

          <p><strong>Appendix A — Jurisdiction‑Specific Disclosures</strong></p>
          <p><strong>A.1 California Consumer Privacy Act (CCPA)</strong><br/>
          Email privacy@nirvanaenergy.net or call (888) 555‑0123.</p>

          <p><strong>A.2 EU/EEA General Data Protection Regulation (GDPR)</strong><br/>
          Contact your local supervisory authority.</p>

          <p>© 2025 {merchantName} LLC. All rights reserved.</p>

          <div className='s-w-100 d-flex'>
    <UiButton variant='link' onClick={()=>router.push("/")}>Close</UiButton>          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;
