import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import styles from './ProfileForm.scss';
import FormControl from '@webstack/components/FormControl/FormControl';
import UiInput from '@webstack/components/UiInput/UiInput';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
const GOOGLE_API_KEY = 'AIzaSyCthMX-HyRujKH9WgIwvVoi6Hhms247Ts4';

const ProfileForm = ({ user }: any) => {
    const [fields, setFields] = useState<any>({ address: '' });

    const handleChange = (e: any) => {
        setFields({ ...fields, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        handleAddress(user?.address);
     
    }, []);    
    const phoneFormat = (phoneNumber: string, countryCode: string): string => {
        const phoneUtil = PhoneNumberUtil.getInstance();
        try {
            const parsedNumber = phoneUtil.parseAndKeepRawInput(phoneNumber, countryCode);
            return phoneUtil.format(parsedNumber, PhoneNumberFormat.NATIONAL);
        } catch (e) {
            return phoneNumber;
        }
    };

    const handleAddress = (inAddress: any) => {

        const loader = new Loader({
            apiKey: 'AIzaSyCthMX-HyRujKH9WgIwvVoi6Hhms247Ts4',
            libraries: ['places'],
        });

        loader.load().then((google) => {
            const inputElement = document.getElementById("autocomplete-input");

            const autocomplete = new google.maps.places.Autocomplete(inputElement);

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                const address = {
                    line1: '',
                    city: '',
                    state: '',
                    country: '',
                    postal_code: '',
                };

                for (let i = 0; i < place.address_components.length; i++) {
                    const component = place.address_components[i];
                    switch (component.types[0]) {
                        case 'street_number': {
                            address.line1 = `${component.long_name} ${address.line1}`;
                            break;
                        }
                        case 'route': {
                            address.line1 += component.short_name;
                            break;
                        }
                        case 'locality':
                            address.city = component.long_name;
                            break;
                        case 'administrative_area_level_1':
                            address.state = component.short_name;
                            break;
                        case 'country':
                            address.country = component.long_name;
                            break;
                        case 'postal_code':
                            address.postal_code = component.long_name;
                            break;
                    }
                }

                // Do something with the address

                setFields({...fields, 'address':`${address.line1}, ${address.city}, ${address.state}, ${address.postal_code}`});
            });
            
            // Set initial value if available
            if (inAddress) {
                // setFields({...fields, 'address':`${inAddress.line1}, ${inAddress.city}, ${inAddress.state}, ${inAddress.postal_code}`});
            }

        });
    }
    return (
      <>
        <style jsx>{styles}</style>
        {JSON.stringify(fields?.address)}
        <div className='profile-form'>
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
        </div>
      </>
    );
  };
  
  export default ProfileForm;