// Relative Path: ./UserProfile.tsx
import React, { useEffect, useState } from 'react';
import styles from './UserProfile.scss';
import UserContext from '~/src/models/UserContext';
import AdaptTableCell from '@webstack/components/AdapTable/components/AdaptTableContent/components/AdaptTableCell/AdaptTableCell';
import UserModify from '../UserModify/UserModify';
import UiButton from '@webstack/components/UiButton/UiButton';
import ContactForm from '@shared/components/ContactForm/ContactForm';

// Remember to create a sibling SCSS file with the same name as this component
interface IUserProfile {
  user?: UserContext
}
type IView = { [key: string]: React.ReactElement };

const UserProfile: React.FC<any> = ({ user }: IUserProfile) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  
  useEffect(() => {}, [user, isEdit]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='user-profile'>
        <div className='user-profile__header'>
          <div className='user-profile__header-view'>
            <UiButton onClick={() => setIsEdit(!isEdit)}>edit</UiButton>
          </div>
        </div>
        <div className='user-profile__body'>
          <div className='user-profile__card'>
            <AdaptTableCell cell='member' data={user} />
          </div>
        </div>
        {isEdit && <div>
          <h3>Edit Profile</h3>

        <div className='user-profile__card'>
          {/* {JSON.stringify(user)} */}
          <ContactForm user={user} onSubmit={console.log} />
          {/* <UserModify user={user}/> */}
          </div>
        </div>
          }
      </div>
    </>
  );
};

export default UserProfile;