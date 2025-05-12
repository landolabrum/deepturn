import useSessionStorage from '@webstack/hooks/storage/useSessionStorage';
import { useEffect, useState } from 'react';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import environment from '~/src/core/environment';
import build from 'next/dist/build';
import useDevice from '~/src/core/authentication/hooks/useDevice';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { getService } from '@webstack/common';

const BUILDNAME = 'appliances';
const FORMNUM = `001`;


const useProductBuildForm = () => {
    const buildId: string = `${environment.merchant.mid}-${BUILDNAME}-${FORMNUM}`;
    const { sessionData, setSessionItem, deleteSessionItem } = useSessionStorage();
    const memberService = getService<IMemberService>('IMemberService');
    const [response, setResponse] = useState<any | null>(null);
    const [fieldErrors, setFieldErrors] = useState<any>();





    const [fields, setFields] = useState<any[] | undefined>();
    const [request, setRequest] = useState<any | undefined>();

    const onSubmit = async () => {
        //         console.log({ ONSUBMIT: request })

        //         //         "metadata": {
        //         //             "build": {
        //         //                 "usage": "residential",
        //         //                 "data": {
        //         //                     "air-conditioner": 15,
        //         //                     "iron": 10
        //         //                 }
        //         //             }
        //         //         },
        //         //         "user": {
        //         //             "name": "fdsa fdsa",
        //         //             "email": "fdsa@fdsa.co",
        //         //             "phone": "1 ( 444 ) 444 - 4444",
        //         //             "address": {
        //         //                 "line1": "4324 Commercial Way",
        //         //                 "line2": "",
        //         //                 "city": "Salt Lake City",
        //         //                 "state": "UT",
        //         //                 "postal_code": "84104",
        //         //                 "country": "US",
        //         //                 "lat": 40.7461576,
        //         //                 "lng": -111.9942893
        //         //             }
        //         //         }
        //    console.log({
        //     FUNC:"B$", request
        //    })
          const calculateTotal = (items: IFormField[]) => {
            return items.reduce((total, item) => {
              if (item.checked && !isNaN(Number(item.value))) {
                return total + Number(item.value);
              }
              return total;
            }, 0);
          };
          const total =fields && calculateTotal(fields);
        let preppedRequest: any = {
            ...request.user,
            metadata: {
                user: {
                    ...request.user,
                    devices: [{ ...useDevice, created: Date.now() }],
                },
                merchant: environment.merchant,
                build: {
                    id: `${environment.merchant.mid}-${FORMNUM}`,
                    data: {...request?.metadata?.build?.data, total},
                    //   data:request.metadata.
                    // buildFields.reduce((acc: any, item: any) => {
                    //   if (item.selected) {
                    //     acc[keyStringConverter(item.name, { dashed: true })] = item.value;
                    //   }
                    //   return acc;
                    // }, {}),
                    created: new Date().getTime()
                }
            }
        }
        console.log({
            "FUNC": "aFTER",
            preppedRequest
        }
        )
        try {
            const _response = await memberService.signUp(preppedRequest);
            console.log({ reps: _response });
            setResponse(_response)
            // if (response?.email) {
            //     //   setView('success');
            //     setResponse({status:'success',data:response.email});
            // } else if (response?.status) {
            //     //   setView(response.status);
            //     setResponse({status:'success',data:response.email});
            //     setResponse(response.message);
            // }
        } catch (e: any) {
            console.error("Submission failed: ", e);
            const errorFields = e.detail?.fields;
            // console.log({ user, errorFields });
            if (errorFields) {
                setFieldErrors(errorFields);
                //   setView("contact");
                return;
            }

            // setView('error');
        }
        //     ...request.user,
        //     metadata: {
        //         data: request.metadata.build.data,
        //         user: request?.user,
        //         merchant: { mid: environment.merchant.mid },
        //         build: {
        //             id: `${environment.merchant.mid}-${FORMNUM}`,
        //             created: new Date().getTime()
        //         }
        //     },
        // };
        // Handle form submission logic here
    };
    const clearForm = () => {
        deleteSessionItem(buildId);
    }
    const setField = (p0: { name: string; value: any; checked?: boolean; path?: string | string[] }) => {
        const { name, value, checked, path } = p0;

        let updatedFields;
        if (checked === false) {
            updatedFields = (fields || []).filter(field => field.name !== name || field.value !== value);
        } else {
            const fieldIndex = (fields || []).findIndex(field => field.name === name);
            updatedFields = [...(fields || [])];
            if (fieldIndex !== -1) {
                updatedFields[fieldIndex] = { ...p0, path: p0.path || '' };
            } else {
                updatedFields.push({ ...p0, path: p0.path || '' });
            }
        }

        const updatedRequest = updatedFields.reduce((acc: { [key: string]: any }, field) => {
            const paths = Array.isArray(field.path) ? field.path : [field.path];
            paths.forEach((path: any) => {
                if (path) {
                    const keys = path.split('.');
                    let current = acc;
                    for (let i = 0; i < keys.length; i++) {
                        const key = keys[i];
                        if (!current[key]) {
                            current[key] = {};
                        }
                        if (i === keys.length - 1) {
                            // console.log({ FUNC: 65, keyLen: keys.length, field })
                            current[key][field.name] = field.value;
                        } else {
                            // console.log({ FUNC: 68, keyLen: keys.length, field })
                            current = current[key];
                        }
                    }
                } else {
                    acc[field.name] = field.value;
                }
            });

            return acc;
        }, {});

        setSessionItem(buildId, { fields: updatedFields, request: updatedRequest });
        setFields(updatedFields);
        setRequest(updatedRequest);
    };


    // useEffect(() => { console.log({ FUNC: "USEEEE", response }) }, [])
    useEffect(() => {
        // console.log({
        //     FUNC: "useEffect",
        //     session: sessionData,
        // });

        // Load session data if defined
        if (sessionData?.[buildId]) {
            const { fields: savedFields, request: savedRequest } = sessionData?.[buildId];
            setFields(savedFields || []);
            setRequest(savedRequest || {});
        }
    }, [sessionData, buildId, clearForm]);

    return { fields, setField, onSubmit, response, clearForm, fieldErrors };
};

export default useProductBuildForm;
