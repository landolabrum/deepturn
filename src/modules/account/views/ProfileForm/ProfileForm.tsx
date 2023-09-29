import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import styles from './ProfileForm.scss';
import UiInput from '@webstack/components/UiInput/UiInput';
import { phoneFormat } from '@webstack/helpers/userExperienceFormats';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import UiButton from '@webstack/components/UiButton/UiButton';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { useNotification } from '@webstack/components/Notification/Notification';
import { countries, states } from '@webstack/models/location';
import { upperCase } from 'lodash';
const GOOGLE_API_KEY = 'AIzaSyCthMX-HyRujKH9WgIwvVoi6Hhms247Ts4';

const ProfileForm = ({ user, open = false }: any) => {
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
  const [disabled, setDisabled] = useState<boolean | undefined>(true);
  const [loading, setLoading] = useState(false);
  const memberService = getService<IMemberService>("IMemberService");
  const [notif, setNotif] = useNotification();





  const userToFields = async () => {
    setFields({
      first_name: user.name.split(' ')[0] || '',
      last_name: user.name.split(' ')[1] || '',
      email: user.email,
      phone: user.phone,
      address: user.address
    })
  }
  const handleChange = (e: any) => {
    if (disabled) setDisabled(undefined);
    if (e.target.name != 'address') {
      setFields({ ...fields, [e.target.name]: e.target.value });
    } else {
      let _fields = fields;
      _fields.address = e.target.value;
      setFields(_fields);
    }
  };

  const handleSubmit = async () => {
    if (!user || !fields) return;
    setLoading(true);
    let complete = true;
    const stateISO: any = Object.entries(states).find(([iso, state]) => state == fields.address?.state)
    const countryISO: any = Object.entries(countries).find(([iso, country]) => country == fields.address?.country)
    const payload = {
      name: `${fields.first_name} ${fields.last_name}`,
      email: fields.email,
      phone: fields.phone,
      address: {
        line1: fields.address.line1,
        line2: fields.address.line2 != '' ? fields.address.line2 : undefined,
        city: fields.address.city,
        postal_code: fields.address.postal_code,
        state: stateISO ? upperCase(stateISO[0]) : fields.address.state,
        country: countryISO ? upperCase(countryISO[0]) : fields.address.state,
      }
    };
    Object.keys(payload).map((k) => {
      if (fields[k] == '') {
        setErrors({ ...errors, [k]: `${keyStringConverter(k)} cannot be blank` });
        complete = false;
      }
    }
    );
    if (true) {
      alert(JSON.stringify(payload))
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
    if (fields?.first_name == '') userToFields()
  }, []);



  return (
    <>
      <style jsx>{styles}</style>
      <UiCollapse label={fields?.address ? <>
        <div className='profile-form__collapse-label'>
          <div>
            {fields.first_name} {fields.last_name}
          </div>
          <div>
            {fields?.address?.line1}, {fields?.address?.city}, {fields?.address?.state}
          </div>
        </div>
      </> : 'Profile Form'} open={open}>
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
                label='address'
                type="text"
                error={errors.address}
                placeholder="Enter your address"
                value={fields.address}
                onChange={handleChange}
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