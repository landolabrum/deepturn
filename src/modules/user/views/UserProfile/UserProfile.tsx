// Relative Path: ./UserProfile.tsx
import React, { useEffect, useState } from 'react';
import styles from './UserProfile.scss';
import UserContext from '~/src/models/UserContext';
import AdaptTableCell from '@webstack/components/AdapTable/components/AdaptTableContent/components/AdaptTableCell/AdaptTableCell';
import UserModify from '../UserModify/UserModify';
import UiButton from '@webstack/components/UiButton/UiButton';
import ContactForm from '@shared/components/ContactForm/ContactForm';
import MemberService from '~/src/core/services/MemberService/MemberService';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';

// Remember to create a sibling SCSS file with the same name as this component
interface IUserProfile {
  user?: UserContext
}
type IView = { [key: string]: React.ReactElement };

const UserProfile: React.FC<any> = ({ user }: IUserProfile) => {
  const memberService = getService<IMemberService>("IMemberService");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const modifyUser =async (user:any) =>{
    let request = {...user};
    // console.log("[ UserProfile ]", request)
// try {
//   // const resp = memberService.modifyCustomer()
// } catch (error) {
  
// }
  }
  useEffect(() => {}, [isEdit]);
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
          <ContactForm onSubmit={modifyUser} />
          {/* <UserModify user={user}/> */}
          </div>
        </div>
          }
      </div>
    </>
  );
};

export default UserProfile;