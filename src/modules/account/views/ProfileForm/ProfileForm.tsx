import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import styles from './ProfileForm.scss';
import UiInput from '@webstack/components/UiInput/UiInput';
import { phoneFormat } from '@webstack/helpers/userExperienceFormats';
import { getService } from '@webstack/common';
import formatAccountFields from '../AccountForm/components/FormatAccountForm';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import UiButton from '@webstack/components/UiButton/UiButton';
const GOOGLE_API_KEY = 'AIzaSyCthMX-HyRujKH9WgIwvVoi6Hhms247Ts4';

const ProfileForm = ({ user }: any) => {
  // Initialize fields with empty strings or other defaults

  const [fields, setFields] = useState<any>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    country: ''
  });
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const memberService = getService<IMemberService>("IMemberService");

  const handleChange = (e: any) => {
    if(disabled)setDisabled(false);
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const initAutocomplete = async () => {
      const loader = new Loader({
        apiKey: GOOGLE_API_KEY,
        libraries: ['places'],
      });
      const google = await loader.load();
      const inputElement = document.getElementById('autocomplete-address');
      const autocomplete = new google.maps.places.Autocomplete(inputElement);

      // Listener to capture selected address
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place && place.address_components) {
          const addressComponents = place.address_components.reduce((acc: any, component: any) => {
            const type = component.types[0];
            acc[type] = component.long_name || component.short_name;
            return acc;
          }, {});
          const formattedAddress = {
            line1: `${addressComponents.street_number || ''} ${addressComponents.route || ''}`,
            line2: addressComponents.sublocality || '',
            city: addressComponents.locality || '',
            state: addressComponents.administrative_area_level_1 || '',
            postal_code: addressComponents.postal_code || '',
            country: addressComponents.country || ''
          };
          setFields({ ...fields, address: formattedAddress });
    
        }
      });
    };
    const userToFields = async () => {
      setFields({
        first_name: user.name.split(' ')[0] || '',
        last_name: user.name.split(' ')[1] || '',
        email: user.email,
        phone: user.phone,
        address: user.address
      })
    }

    if (user) {
      userToFields().then(() => initAutocomplete());
    }
  }, [user]);
  const handleSubmit = async () => {
    if (!user || !fields) return;
    setLoading(true);

    const payload = {
      name: `${fields.first_name} ${fields.last_name}`,
      email: fields.email,
      phone: fields.phone,
      address: fields.address
    };

    const memberResponse = await memberService.updateMember(user.id, payload);
    if (memberResponse?.id) {
      setFields(formatAccountFields(memberResponse));
    }
    setLoading(false);
  };

  useEffect(() => {}, [handleChange]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='profile-form'>
        <div className='profile-form__name'>
          <UiInput value={fields?.first_name} label='First Name' name='first_name' onChange={handleChange} />
          <UiInput value={fields?.last_name} label='Last Name' name='last_name' onChange={handleChange} />
        </div>
        <div className='profile-form__contact'>
          <UiInput value={fields?.email} type='email' label='Email'
            //  variant='dark'
            name='email' onChange={handleChange} />
          <UiInput value={phoneFormat(fields?.phone, fields?.country)} label='Phone' type='tel' name='phone' onChange={handleChange} />
        </div>
        <div className="profile-form__address">
          {fields.address && <UiInput
            id="autocomplete-address"
            label='address'
            type="text"
            placeholder="Enter your address"
            defaultValue={`${fields.address?.line1 ? fields.address?.line1 + ', ' : ''
              }${fields.address?.line2 ? fields.address?.line2 + ', ' : ''
              }${fields.address?.city ? fields.address?.city + ', ' : ''
              }${fields.address?.state ? fields.address?.state + ', ' : ''
              }${fields.address?.postal_code ? fields.address?.postal_code + ', ' : ''
              }${fields.address?.country ? fields.address?.country : ''
              }`}
            name="address"
          />}
        </div>
        <div className='profile-form__action'>
          <UiButton 
            variant='primary'
            disabled={disabled}
            busy={loading}
            onClick={handleSubmit}>Update Account</UiButton>
        </div>
      </div>
    </>
  );
};

export default ProfileForm;