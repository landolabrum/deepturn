import React from 'react';
import styles from './PrivacyPolicy.scss'; // Consider renaming this to 'PrivacyPolicy.scss' for clarity
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import environment from '~/src/core/environment';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { useRouter } from 'next/router';

const PrivacyPolicy = ({ onClose }: { onClose: () => void }) => {
    const router = useRouter();
    const merchant = environment.merchant;
    const merchantName = keyStringConverter(merchant.name)?.toUpperCase();

    const MerchantHeader = () => (
        <>
            <style jsx>{styles}</style>
            <div className="terms-of-service__header">
                <h1>{merchantName}</h1>
                <div className="terms-of-service__content--title">Privacy Policy</div>
                <p className='s-9-width'>{merchantName} is a registered trademark of {merchantName} LLC. All rights reserved.</p>
                <UiIcon width='100px' icon={merchantName + "-logo"} />
            </div>
        </>
    );

    return (
        <>
            <style jsx>{styles}</style>
            <div className="terms-of-service">
                <div className="terms-of-service__content">
                    <MerchantHeader />

                    <p><strong>1. Who We Are</strong><br />
                        Nirvana Energy LLC ("Nirvana Energy," "we," "our," or "us") provides renewable-energy products and services throughout the United States. Our headquarters is located at:<br />
                        Nirvana Energy LLC<br />
                        1077 S Reber Ave<br />
                        Gilbert, AZ 85296<br />
                        United States<br />
                        support@nirvanaenergy.net<br />
                        (888) 555‑0123
                    </p>

                    <p><strong>2. Scope of This Policy</strong><br />
                        This Privacy Policy explains how we collect, use, disclose, and protect personal information when you visit nirvanaenergy.net (the "Site"), interact with our services, or otherwise engage with us.
                    </p>

                    <p><strong>3. Information We Collect</strong></p>
                    <ul>
                        <li><strong>Contact Information:</strong> name, email, address, phone — to communicate with you, fulfill orders, support you.</li>
                        <li><strong>Energy‑Profile Data:</strong> utility provider, usage, system specs — to design and quote energy solutions.</li>
                        <li><strong>Device & Usage Data:</strong> IP, browser type, referring pages, cookies — to improve and secure the Site.</li>
                        <li><strong>Payment Data:</strong> cardholder name, last 4 digits — to process transactions (via PCI-compliant processors).</li>
                        <li><strong>SMS Consent Data:</strong> time/date, phone, checkbox state — to comply with carrier/A2P 10DLC rules.</li>
                    </ul>
                    <p>We do not knowingly collect information from children under 13.</p>

                    <p><strong>4. How We Use Information</strong><br />
                        - Provide, maintain, and improve the Site and our services.<br />
                        - Send transactional messages like confirmations and reminders.<br />
                        - Send marketing only if you’ve opted in (see Section 8).<br />
                        - Detect and prevent fraud and illegal activities.<br />
                        - Comply with laws and carrier regulations.
                    </p>

                    <p><strong>5. Sharing & Disclosure</strong><br />
                        We may share your data with:<br />
                        - Service providers (e.g., hosting, payments, analytics).<br />
                        - Affiliates within Nirvana Energy’s corporate family.<br />
                        - Law enforcement or regulators when required.<br />
                        - Business transferees in a merger or sale.<br /><br />
                        <strong>SMS privacy:</strong> No mobile info is shared with third parties/affiliates for marketing. SMS opt-in/consent data is never shared.
                    </p>

                    <p><strong>6. Cookies & Tracking Technologies</strong><br />
                        We use first- and third-party cookies for preferences, performance, and advertising. You can control cookies via browser settings.
                    </p>

                    <p><strong>7. Your Choices & Rights</strong><br />
                        You may have the right to access, correct, delete, or port your personal data, or opt out of processing. Contact privacy@nirvanaenergy.net.<br />
                        See Appendix A for CCPA and GDPR-specific rights.
                    </p>

                    <p><strong>8. SMS/Text Messaging</strong><br />
                        By opting in, you consent to receive recurring SMS from Nirvana Energy. Msg frequency varies. Msg & data rates may apply. Text STOP to cancel, HELP for help. Consent not required for purchase.
                    </p>

                    <p><strong>9. Data Security</strong><br />
                        We use technical, administrative, and physical safeguards. No system is 100% secure — use the Site at your own risk.
                    </p>

                    <p><strong>10. Data Retention</strong><br />
                        We retain personal data only as long as needed for its purpose or as required by law.
                    </p>

                    <p><strong>11. Changes to This Policy</strong><br />
                        We may update this Policy at any time. Updates will be posted with a “Last updated” date.
                    </p>

                    <p><strong>12. Contact Us</strong><br />
                        Questions? Email <a href="mailto:privacy@nirvanaenergy.net">privacy@nirvanaenergy.net</a> or write to the address in Section 1.
                    </p>

                    <p><strong>Appendix A — Jurisdiction‑Specific Disclosures</strong></p>
                    <p><strong>A.1 California Consumer Privacy Act (CCPA)</strong><br />
                        Email <a href="mailto:privacy@nirvanaenergy.net">privacy@nirvanaenergy.net</a> or call (888) 555‑0123.
                    </p>

                    <p><strong>A.2 EU/EEA General Data Protection Regulation (GDPR)</strong><br />
                        Contact your local data protection authority for assistance.
                    </p>

                    <p>© 2025 {merchantName} LLC. All rights reserved.</p>

                    <div className='s-w-100 d-flex'>
                        <UiButton variant='link' onClick={()=>router.push("/")}>Close</UiButton>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;
