import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import styles from './ProfileForm.scss';
import FormControl from '@webstack/components/FormControl/FormControl';
import UiInput from '@webstack/components/UiInput/UiInput';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import { phoneFormat } from '@webstack/helpers/userExperienceFormats';
import { getService } from '@webstack/common';
import formatAccountFields from '../AccountForm/components/FormatAccountForm';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import UiButton from '@webstack/components/UiButton/UiButton';
const GOOGLE_API_KEY = 'AIzaSyCthMX-HyRujKH9WgIwvVoi6Hhms247Ts4';

const ProfileForm = ({ user }:any) => {
    const [fields, setFields] = useState<any>({ 
        first_name:'',
        last_name:'',
        phone:'',
        address: '',
        country: ''
    });
    const [loading, setLoading] = useState(false);
    const memberService = getService<IMemberService>("IMemberService");
  
    const handleChange = (e) => {
      setFields({ ...fields, [e.target.name]: e.target.value });
    };
  
    useEffect(() => {
      // Initialize Google Places Autocomplete
      const initAutocomplete = async () => {
        const loader = new Loader({
          apiKey: GOOGLE_API_KEY,
          libraries: ['places'],
        });
        const google = await loader.load();
        const inputElement = document.getElementById('autocomplete-input');
        const autocomplete = new google.maps.places.Autocomplete(inputElement);
  
        // Listener to capture selected address
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place && place.address_components) {
            // Parsing the address components and updating the state
            const addressComponents = place.address_components.reduce((acc, component) => {
              const type = component.types[0];
              acc[type] = component.long_name || component.short_name;
              return acc;
            }, {});
            const formattedAddress = `${addressComponents.street_number || ''} ${addressComponents.route || ''}, ${addressComponents.locality || ''}, ${addressComponents.administrative_area_level_1 || ''}, ${addressComponents.postal_code || ''}, ${addressComponents.country || ''}`;
            setFields((prevFields) => ({ ...prevFields, address: formattedAddress }));
          }
        });
      };
  
      initAutocomplete();
    }, [user]);
  
    const handleSubmit = async () => {
      if (!user || !fields) return;
      setLoading(true);

      // Prepare the payload
      const payload = {
        name: `${fields.first_name} ${fields.last_name}`,
        address:{
            line1: fields.address.split(",")[0], // assuming the format remains consistent
            line2: 'line 2', // assuming the format remains consistent
            city: fields.address.split(",")[1].trim(),
            state: fields.address.split(",")[2].trim(),
            postal_code: fields.address.split(",")[3].trim(),
            country: fields.address.split(",")[4].trim(),
        },
        email: fields.email,
        phone: fields.phone,
      };
  
      const memberResponse = await memberService.updateMember(user.id, payload);
      if (memberResponse?.id) {
        setLoading(false);
        setFields(formatAccountFields(memberResponse));
      } else {
        setLoading(false);
      }
    };
  
    return (
      <>
        <style jsx>{styles}</style>
            <div className='profile-form'>
                fo: {JSON.stringify(fields)}
                <div className='profile-form__name'>
                    <UiInput value={fields?.first_name} label='First Name' variant='dark' name='first_name' onChange={handleChange} />
                    <UiInput value={fields?.last_name} label='Last Name' variant='dark' name='last_name' onChange={handleChange} />
                </div>
                <div className='profile-form__contact'>
                    <UiInput value={fields?.email} type='email' label='Email' variant='dark' name='email' onChange={handleChange} />
                    <UiInput value={phoneFormat(fields?.phone, fields?.country)} label='Phone' type='tel' variant='dark' name='phone' onChange={handleChange} />
                </div>
                <div className="profile-form__address">
                    <FormControl variant="dark" label="Address" traits={{ height: '45px', width: '100%' }}>
                        <input
                            id="autocomplete-input"
                            className="custom-autocomplete-input"
                            type="text"
                            placeholder="Enter your address"
                            value={typeof fields?.address === 'string' ? fields.address : ''}
                            name="address"
                            onChange={handleChange}
                        />
                    </FormControl>
                </div>
          <div className='profile-form__action'>
            <UiButton busy={loading} variant='dark' onClick={handleSubmit}>Update Account</UiButton>
          </div>
        </div>
      </>
    );
  };
  
  export default ProfileForm;