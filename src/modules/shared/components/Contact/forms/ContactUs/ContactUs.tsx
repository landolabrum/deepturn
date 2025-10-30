// ./ContactUs.tsx
import React from "react";
import styles from "./ContactUs.scss";
import environment from "~/src/core/environment";
import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";
import { phoneFormat } from "@webstack/helpers/userExperienceFormats";

type ContactRecord = { email?: string; tel?: string; address?: string; role?: string };

const ContactUs: React.FC = () => {
  const { merchant } = environment;

  const contact = Object.values(merchant.settings?.contact || {}).find(
    (v: any) => v?.role === "user-contact"
  ) as ContactRecord | undefined;

  if (!contact) {
    return (
      <>
        <style jsx>{styles}</style>
        <div className="contact-us">
          <p>No contact information available.</p>
        </div>
      </>
    );
  }

  const tel = contact.tel?.replace(/\s+/g, "") || "";
  const mapsHref = contact.address
    ? `https://maps.google.com/?q=${encodeURIComponent(contact.address)}`
    : "";

  return (
    <>
      <style jsx>{styles}</style>
      <div className="contact-us">
 <p>Have questions about solar, batteries, or energy solutions? Our team is here to help. Whether you’re exploring a new system, looking to add storage to your existing setup, or need support with your installation, we make it easy to connect with a real expert.

Reach out by phone, email, or visit us at our office — we’ll guide you through your options and provide clear, no-pressure answers. At Nirvana Energy, we believe every conversation should bring you closer to energy independence and peace of mind.</p>

        {contact.address && (
          <p>
            <strong>Address:</strong> {contact.address}{" "}
            <UiButton
              variant="link"
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              traits={{ afterIcon: "fa-arrow-up-right-from-square" }}
            >
              View Map

              
            </UiButton>
          </p>
        )}

        {contact.tel && (
  
            <UiButton
              label="##### Direct Phone"

              href={`tel:${tel}`}
              target="_blank"
              rel="noopener noreferrer"
              traits={{ beforeIcon: "fa-circle-phone-flip" }}
            >
              {phoneFormat(contact.tel)||"N/A"}
            </UiButton>
        )}

        {contact.email && (
          
            <UiButton
              label="##### Email"

              href={`mailto:${contact.email}`}
              target="_blank"
              rel="noopener noreferrer"
              traits={{ beforeIcon: "fa-envelope" }}
            >
               {contact.email}
            </UiButton>

        )}
      </div>
    </>
  );
};

export default ContactUs;
