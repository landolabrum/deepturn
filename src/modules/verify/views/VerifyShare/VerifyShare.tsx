// Relative Path: ./VerifyShare.tsx
import React, { useEffect, useState } from 'react';
import styles from './VerifyShare.scss';
import UiInput from '@webstack/components/UiInput/UiInput';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
const initial = "broudy";
const VerifyShare: React.FC = () => {

  const [token, onChange] = useState<string | undefined>();
  useEffect(() => {
  }, [onChange]);
  let x = 0;

  if (1 == x) return <>
  {/* if (!token || token !== initial) return <> */}
    <style jsx>{styles}</style>
    <div className='token-wall'>
      <div className='token-wall-content'>
        <UiInput label='token' placeholder='* * * * * *' value={token} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  </>
  const BroudyProposal = () => <>
    <style jsx>{styles}</style>
    <div className='proposal'>
      <div className='proposal-header'>
        <div className='proposal-header_client'>
          Broudy Nissan
          <div className='proposal-header_subtitle'>
            Target Market <UiIcon icon='fa-crosshairs' />
          </div>
        </div>
      </div>
      <div className='proposal-content'>
        <div className='service-item'>
          <div className='proposal-header_title'>
            <div className='proposal-header_marquee'>
              <div className='marquee-logo'>
                <UiIcon icon="deepturn-logo" />
              </div>
              Deepturn Services
            </div>
          </div>
          </div>
        <div className='service-item'>
          <div className='proposal-header_title'>
            Social Engineering
          </div>

          <div className='proposal-content_title'>Enhanced Audience Targeting</div>
          <div className="proposal-content_body">
            Communication has evolved. Traditional blanket advertising no longer yields a strong return on investment for every campaign. The advent of big data has transformed how organizations identify and engage their ideal prospects. However, data alone is not sufficient. At Deepturn, we&apos;re pioneering a future where individuals can engage in genuinely personal interactions with their preferred brands and causes. We enable organizations to understand not only where people are but also what they truly value and what motivates their behaviors.
          </div>
        <div className='service-item'>
          <div className='proposal-content_title'>Advanced Data Modeling</div>
          <div className="proposal-content_body">
            At Deepturn, we leverage sophisticated data modeling and psychographic profiling to expand audiences, pinpoint key influencers, and connect with people in ways that inspire action. Our proprietary data sets and unmatched modeling capabilities allow organizations throughout America to forge stronger connections with their target audiences across all media platforms.
          </div>
        </div>
        <div className='service-item'>
          <div className='proposal-content_title'>Utilizing the OCEAN Personality Model</div>
          <div className="proposal-content_body">
            We employ the scientifically validated OCEAN scale of personality traits to gain deep insights into what people value, why they act as they do, and what truly influences their decisions. This approach ensures that our strategies are finely tuned to resonate with individuals at a meaningful level.
          </div>
        </div>
        </div>
        <hr/>
        <div className='service-item'>
            <div className='proposal-header_marquee'>Proposed Actions</div>
          <div className='proposal-list'>
            Social Engineering
            <div className='list-item'>
              <div className='list-item_title'>Prepare</div>
              Implement, unified Brand-Presence, across valuable social platforms.
            </div>
            <div className='list-item'>
              <div className='list-item_title'>Connect</div>
              Using proven automated processes, Create a community around the platforms. This intensive process involves, cultivating your target-audience and rating their likelyhood of becoming a customer.
            </div>
            <div className='list-item'>
              <div className='list-item_title'>Monitor</div>
              Apply Dynamic tracking mechanisms, intuitively designed to rate and monitor all data-points.
            </div>
            <div className='list-item'>
              <div className='list-item_title'>Evaluate</div>
              Determine the current stategic performances of KPI&apos;s and adjust the process accordingly.
            </div>
          </div>
        </div>
        <AdaptGrid xs={1} md={3} gap={10}>
          <div className='service-item'>
            <div className='proposal-content_title'>Social Automation</div>
            <div className="proposal-content_body">
              {/* Broudy Nissan stands at a pivotal point where enhancing the service department&apos;s digital engagement can significantly increase traffic and revenue. */}
              Deepturn is uniquely positioned to implement targeted digital solutions that will drive higher service bookings and elevate customer loyalty. This proposal outlines our strategy to leverage sophisticated tools and analytics for substantial growth in your service department.
            </div>
          </div>
          <div className='service-item'>
            <div className='proposal-content_title'>Funnel Design</div>
            <div className="proposal-content_body">
              {/* Broudy Nissan stands at a pivotal point where enhancing the service department&apos;s digital engagement can significantly increase traffic and revenue. */}
              Deepturn is uniquely positioned to implement targeted digital solutions that will drive higher service bookings and elevate customer loyalty. This proposal outlines our strategy to leverage sophisticated tools and analytics for substantial growth in your service department.
            </div>
          </div>

        </AdaptGrid>




      </div>
    </div></>;
  return (<>
    <style jsx>{styles}</style>
    <div className='verify-share'>
      <BroudyProposal />
    </div>
  </>
  );
};

export default VerifyShare;
{/* <div className='proposal-content_title'>
          Executive Summary
        </div>
        <div className="proposal-content_body">
          Broudy Nissan stands at a pivotal point where enhancing the service department&apos;s digital engagement can significantly increase traffic and revenue. Deepturn is uniquely positioned to implement targeted digital solutions that will drive higher service bookings and elevate customer loyalty. This proposal outlines our strategy to leverage sophisticated tools and analytics for substantial growth in your service department.
        </div>
        <div className='proposal-list'>
         <strong>{capitalize(token)} Service</strong>
          <small>Proposed Actions</small>
          <div className='list-item'>
            <div>Online service scheduling and basic digital outreach for service promotions.</div>
          </div>
          <div className='list-item'>Revamped Interface: We will overhaul your booking system to make it highly user-friendly, thereby increasing appointment rates.</div>
          <div className='list-item'>Automated Service Reminders: Tailored reminders will be sent via email and SMS, boosting repeat service visits.</div>
          <div className='list-item'>Service-Specific Promotions: We will launch precisely targeted ads on social media and search engines to promote your services and special offers, using data-driven insights to optimize reach and engagement.</div>
          <div className='list-item'>Enhanced Local Listings: We will optimize Broudy Nissan’s Google My Business profile with a focus on your service offerings, attracting more local searches to your site.</div>
          <div className='list-item'>Customer Reviews Strategy: We will implement a system to encourage and leverage positive customer reviews, strengthening your online reputation.</div>
          <div className='list-item'>Creation of high-value articles and videos on vehicle maintenance, directly aimed at driving organic traffic and establishing your dealership as a trusted expert.</div>
          <div className='list-item'>Regular updates employing strategic keywords to capture more service-related searches and draw potential customers.</div>
          <div className='list-item'>Custom Loyalty Program: We will introduce a loyalty scheme that rewards repeat customers, effectively increasing customer lifetime value.</div>
          <div className='list-item'>Enhanced CRM Utilization: Sophisticated CRM analytics will enable personalized service reminders and efficient booking management.</div>
        </div>
        <div className='proposal-content_footer'>
          The investment in these enhancements will yield a measurable increase in service appointments and customer retention, directly contributing to your bottom line. We invite Broudy Nissan’s management to discuss this proposal in a detailed session where we can tailor our strategies to your specific objectives.
        </div> */}