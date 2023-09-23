import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import styles from './ProfileForm.scss';
import UiInput from '@webstack/components/UiInput/UiInput';
import { countryFormat, phoneFormat } from '@webstack/helpers/userExperienceFormats';
import { getService } from '@webstack/common';
import formatAccountFields from '../AccountForm/components/FormatAccountForm';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import UiButton from '@webstack/components/UiButton/UiButton';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { useNotification } from '@webstack/components/Notification/Notification';
import { countries, states } from '@webstack/models/location';
import { capitalizeAll } from '@webstack/helpers/Capitalize';
import { upperCase } from 'lodash';
const GOOGLE_API_KEY = 'AIzaSyCthMX-HyRujKH9WgIwvVoi6Hhms247Ts4';

const ProfileForm = ({ user }: any) => {
  // Initialize fields with empty strings or other defaults
  const [errors, setErrors] = useState({
    first_name: null,
    last_name: null,
    email: null,
    phone: null,
    address: null,
    country: null
  })
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
  const [notif, setNotif] = useNotification();

  const handleChange = (e: any) => {
    if (disabled) setDisabled(false);
    setFields({ ...fields, [e.target.name]: e.target.value });
  };


  const label = fields?.address?<>
  <style jsx>{styles}</style>
  <div className='profile-form__collapse-label'>
    <div>
      {fields.first_name} {fields.last_name}
    </div>
    <div>
      {fields?.address?.line1}, {fields?.address?.city}, {fields?.address?.state}
    </div>
  </div>
</>:'Profile Form'

  const addressDisplay = fields.address?.line1 ?
    `${fields.address?.line1+', ' || ''
    }${fields.address?.line2+' ' || ''
    }${fields.address?.city+' ' || ''
    }${fields.address?.state+', ' || ''
    }${fields.address?.postal_code+', ' || ''
    }${fields.address?.country || ''}`: undefined;

    
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
          setDisabled(false);
          // Only update the address field in the state
          setFields((prevFields:any) => ({ ...prevFields, address: formattedAddress }));
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

    const handleSubmit = async () => {
      if (!user || !fields) return;
      setLoading(true);
      let complete = true;
      const stateISO:any = Object.entries(states).find(([iso,state])=>state == fields.address?.state)
      const countryISO:any = Object.entries(countries).find(([iso,country])=>country == fields.address?.country)
      console.log({state: stateISO, country: countryISO})
      
      const payload = {
        name: `${fields.first_name} ${fields.last_name}`,
        email: fields.email,
        phone: fields.phone,
        address: {
          line1: fields.address.line1,
          line2: fields.address.line2 != ''?fields.address.line2: undefined,
          city: fields.address.city,
          postal_code: fields.address.postal_code,
          state: upperCase(stateISO[0]),
          country: upperCase(countryISO[0]),
        }
      };
      // Object.keys(fields).map((k) => {
      //   if (fields[k] == '') {
      //     setErrors({ ...errors, [k]: `${keyStringConverter(k)} cannot be blank` });
      //     complete = false;
      //   }
      // }
      // );
      if (true) {
        const memberResponse = await memberService.updateMember(user.id, payload);
        if (memberResponse?.id) {
          setNotif({
            active: true,
            persistance: 3000,
            list: [
              { label: `Successfully updated your account, ${fields.first_name}` }
            ]
          })
        }
      }
      setLoading(false);
    };
  useEffect(() => {
    if (user) userToFields().then(() => initAutocomplete());
  }, []);



  return (
    <>
      <style jsx>{styles}</style>

      <UiCollapse label={label} open={user?.address == undefined}>
        <div className='profile-form'>
          <div className='profile-form__body'>
            <div className='profile-form__name'>
              <UiInput required value={fields?.first_name || ''} label='First Name' name='first_name' onChange={handleChange} error={errors.first_name} />
              <UiInput required value={fields?.last_name || ''} label='Last Name' name='last_name' onChange={handleChange} error={errors.last_name} />
            </div>
            <div className='profile-form__contact'>
              <UiInput value={fields?.email || ''} type='email' label='Email'
                error={errors.email}
                name='email' onChange={handleChange} />
              <UiInput value={phoneFormat(fields?.phone, fields?.country)} label='Phone' type='tel' name='phone' onChange={handleChange} />
            </div>
            <div className="profile-form__address">
              <UiInput
                id="autocomplete-address"
                label='address'
                type="text"
                error={errors.address}
                placeholder="Enter your address"
                value={addressDisplay}
                name="address"
              />
            </div>
            <div className='profile-form__action'>
              <UiButton
                disabled={disabled}
                variant='primary'
                busy={loading}
                onClick={handleSubmit}>Update Account</UiButton>
            </div>
          </div>
        </div>
      </UiCollapse>
    </>
  );
};

export default ProfileForm;