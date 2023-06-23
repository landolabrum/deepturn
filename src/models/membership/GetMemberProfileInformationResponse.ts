export interface GetMemberProfileInformationResponse{
    memberId: string;
    memberNumber: string;
    country: string;
    countryPhoneCode: string;
    email: string;
    emailCommunicationOptIn: boolean;
    firstName: string;
    fullName: string;
    lastName: string;
    phone: string;
    smsCommunicationOptIn: boolean;
    locale: string;
}