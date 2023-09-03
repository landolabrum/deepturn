import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import styles from './ProfileForm.scss';
import FormControl from '@webstack/components/FormControl/FormControl';
import UiInput from '@webstack/components/UiInput/UiInput';
import { phoneFormat } from '@webstack/helpers/userExperienceFormats';
import UiLoader from '@webstack/components/UiLoader/UiLoader';

const ProfileForm = ({ user }: any) => {

    const [fields, setFields] = useState<any>({address: ''});
    const onLoad = () => {
        if (!user) return;
        user.address && handleAddress(user.address);
        Object.entries(user).forEach(([key, line]: any) => {
            if (key == 'name') {
                user.first_name = line.split(' ')[0];
                user.last_name = line.split(' ')[1];
            } 
        });
        setFields(user);
    }
    useEffect(() => {
        onLoad();
    }, [user]);
    const handleChange = (e: any) => {
        setFields({ ...fields, [e.target.name]: e.target.value });
    }

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
                console.log(address);

                setFields({...fields, 'address':`${address.line1}, ${address.city}, ${address.state}, ${address.postal_code}`});
            });
            
            // Set initial value if available
            if (inAddress) {
                setFields({...fields, 'address':`${inAddress.line1}, ${inAddress.city}, ${inAddress.state}, ${inAddress.postal_code}`});
            }

        });
    }
    useEffect(() => {
        onLoad();
    }, [Object(fields).length == 0]);

    return (
        <>
            <style jsx>{styles}</style>
            <p style={{ maxWidth: '400px' }}>
                {JSON.stringify(fields)}
            </p>
            <div className='profile-form'>
                <div className='profile-form__name'>
                    <UiInput value={fields?.first_name} label='first name' variant={`dark`} name='first_name' onChange={handleChange} />
                    <UiInput value={fields?.last_name} label='last name' variant={`dark`} name='first_name' onChange={handleChange} />
                </div>
                <div className='profile-form__contact'>
                    <UiInput
                        value={fields?.email}
                        type='email'
                        label='email'
                        variant={`dark`}
                        name='email'
                        onChange={handleChange}
                    />
                    <UiInput
                        value={phoneFormat(fields?.phone, fields.country)}
                        label='phone'
                        type='tel'
                        variant={`dark`}
                        name='phone'
                        onChange={handleChange}
                    />
                </div>
                <div className='profile-form__address'>
                    <FormControl variant='dark' label='address' traits={{height:'45px', width:"100%"}}>
                    <input
                        id="autocomplete-input"
                        type="text"
                        placeholder="Enter your address"
                        value={typeof fields?.address == 'string'?fields.address:''}
                        onChange={handleChange}
                    />
                    </FormControl>
                </div>
            </div>
        </>
    );
    // return <UiLoader position='relative'/>
};

export default ProfileForm;