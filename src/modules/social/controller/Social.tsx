import React from 'react';
import styles from './Social.scss';
import Twitch from '../views/twitch/controller/Twitch';
import { useUser } from '~/src/core/authentication/hooks/useUser';

// Remember to create a sibling SCSS file with the same name as this component

const Social: React.FC = () => {
  const user = useUser();
  return (
    <>
      <style jsx>{styles}</style>
      <div className="social">
        {/* Social.tsx (or wherever you render it) */}
        <Twitch user={user ?? {}} />
      </div>
    </>
  );
};

export default Social;
