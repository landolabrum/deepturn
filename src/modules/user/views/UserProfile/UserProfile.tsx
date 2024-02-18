// Relative Path: ./UserProfile.tsx
import React from 'react';
import styles from './UserProfile.scss';
import UserContext from '~/src/models/UserContext';

// Remember to create a sibling SCSS file with the same name as this component
interface IUserProfile{
    user?: UserContext
}
const UserProfile: React.FC<any> = ({user}:IUserProfile) => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='user-profile'>
      <div className='user-profile__title'>
        {user?.name}
      </div>
      <div className='user-profile__body'></div>
      </div>
    </>
  );
};

export default UserProfile;