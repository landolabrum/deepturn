
import { useEffect, useState } from 'react';
// import styles from './UserModify.scss';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { useNotification } from '@webstack/components/Notification/Notification';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { phoneFormat } from '@webstack/helpers/userExperienceFormats';
import UiMarkdown from '@webstack/components/UiMarkDown/UiMarkDown';

const UserModify = ({ user, open = false }: any) => {
  const MemberService = getService<IMemberService>('IMemberService');
  const [notifiication, setNotification]=useNotification();
  const [busy, setBusy]=useState(false);
  const initialFields: IFormField[] = [
    { name: 'first_name', label: 'first name', required: true },
    { name: 'last_name', label: 'last name', required: true },
    { name: 'email', label: 'email', required: true },
    { name: 'phone', label: 'phone', required: true,constraints:{ min: 1, max: 9} },
    { name: 'address', label: 'address', required: true },
  ]
  const [fields, setFields] = useState<IFormField[]>(initialFields);
  const onUser = () => {
    const fieldKeys = initialFields.map(field => field.name);
    const userFields = () => {
      if (!user) return [];
      if(user.phone)user.phone = phoneFormat(user.phone);
      const firstLast = user.name.split(' ');
      // Assuming user object has a 'name' property that contains the full name
      const modifiedUser = {
        ...user,
        first_name: firstLast[0],
        last_name: firstLast[1] || '', // In case there's no last name
      };
      delete modifiedUser.name;

      return initialFields.map(field => {
        if (field.name && fieldKeys.includes(field.name)) return { ...field, value: modifiedUser[field.name] || field.value };
        return field;
      });
    };
    const updatedFields = userFields();
    if (updatedFields.length) setFields(updatedFields);
  };
  const onChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    // Update the state with the new value for the changed field
    setFields(currentFields => currentFields.map(field => {
      if (field.name === name) {
        // If the field is the one that changed, update its value
        return { ...field, value: value };
      }
      // Otherwise, return the field as is
      return field;
    }));
  };
  const onSubmit = async (form:any)=>{
    setBusy(true);
    const findField:any= (name:string)=>fields.find(f=>f.name == name)?.value;
    let address = findField('address');
    const metadata = Boolean(address?.lat && address?.lng ) && {'address.lat': address.lat, 'address.lng': address.lng};
    if(address?.lat, address?.lng){
      delete address?.lat;
      delete address?.lng;
    }
    let request:any = {
      name: `${findField('first_name')} ${findField('last_name')}`,
      email: findField('email'),
      phone: phoneFormat(String(findField('phone')), 'US', true),
      ...address,
      metadata: metadata,
    }
    console.log('[ request ]',request)
    try{
      const response = await MemberService.modifyCustomer(user.id, request);
      if(response.object == 'customer')setNotification({
        active: true,
        list:[
          {label: 'success', message:<UiMarkdown text={`Updated Member: *${response?.name}*`}/>}
        ]
      })
      // console.log('[ SUCCESS ]', response);
    }catch(e){
      console.log('[ EROR ]', e);
    }
    setBusy(false);
  }
  useEffect(() => {
    // Check if the user object is present and if the fields have not been updated yet
    if (user && JSON.stringify(fields) === JSON.stringify(initialFields)) {
      onUser();
    }
  }, [user, setFields]);
  
  return (
      <UiForm
        fields={fields}
        onChange={onChange}
        onSubmit={onSubmit}
        loading={busy}
      />
  );
};

export default UserModify;
