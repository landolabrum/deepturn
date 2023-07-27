export interface GetPersonalInformationResponse{
  memberId: string,
  memberNumber: string,
  country: string,
  email: string,
  emailCommunicationOptIn: boolean,
  firstName: string,
  fullName: string,
  lastName: string,
  phone: string,
  countryPhoneCode: string,
  smsCommunicationOptIn: boolean,
  locale: string
}