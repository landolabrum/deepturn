import useSessionStorage from '@webstack/hooks/storage/useSessionStorage';
import { useEffect, useState } from 'react';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import environment from '~/src/core/environment';
import useDevice from '~/src/core/authentication/hooks/useDevice';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { getService } from '@webstack/common';

const BUILDNAME = 'appliances';
const FORMNUM = `001`;

const useProductBuildForm = () => {
    const buildId = `${environment.merchant.mid}-${BUILDNAME}-${FORMNUM}`;
    const { sessionData, setSessionItem, deleteSessionItem } = useSessionStorage();
    const memberService = getService<IMemberService>('IMemberService');
    const device = useDevice();
    const [response, setResponse] = useState<any | null>(null);
    const [fieldErrors, setFieldErrors] = useState<any>();
    const [fields, setFields] = useState<IFormField[] | undefined>([]);
    const [request, setRequest] = useState<any | undefined>();

    const calculateTotal = (items: IFormField[]) => {
        return items.reduce((total, item) => {
            if (item?.checked && !isNaN(Number(item.value))) {
                return total + Number(item.value);
            }
            return total;
        }, 0);
    };

    const onSubmit = async () => {
        if (!request) return;
        const total = fields ? calculateTotal(fields) : 0;

        let preppedRequest = {
            ...request.user,
            metadata: {
                user: {
                    ...request.user,
                    devices: [{ ...device, created: Date.now() }],
                },
                merchant: environment.merchant,
                build: {
                    id: buildId,
                    data: { ...(request?.metadata?.build?.data || {}), total },
                    created: new Date().getTime(),
                }
            }
        };

        console.log({ FUNC: "AFTER PREP", preppedRequest });

        try {
            const _response = await memberService.signUp(preppedRequest);
            console.log({ response: _response });
            setResponse(_response);
        } catch (e: any) {
            console.error("Submission failed: ", e);
            if (e?.detail?.fields) {
                setFieldErrors(e.detail.fields);
            }
        }
    };

    const clearForm = () => deleteSessionItem(buildId);

    const setField = ({ name, value, checked, path = '', type }: { name: string; value: any; checked?: boolean; path?: string | string[], type?: string }) => {
        let updatedFields: IFormField[];

        if (checked === false && type === 'checkbox') {
            updatedFields = (fields || []).filter(field => field.name !== name || field.value !== value);
        } else {
            updatedFields = [...(fields || [])];
            const fieldIndex = updatedFields.findIndex(field => field.name === name);

            if (fieldIndex !== -1) {
                updatedFields[fieldIndex] = { name, value, checked, path };
            } else {
                updatedFields.push({ name, value, checked, path });
            }
        }

        const updatedRequest = updatedFields.reduce((acc: { [key: string]: any }, field:any) => {
            const paths = Array.isArray(field.path) ? field.path : [field.path];

            paths.forEach((path :any)=> {
                if (path) {
                    const keys = path.split('.');
                    let current = acc;
                    for (let i = 0; i < keys.length; i++) {
                        const key = keys[i];
                        if (!current[key]) current[key] = {};
                        if (i === keys.length - 1) {
                            current[key][field.name] = field.value;
                        } else {
                            current = current[key];
                        }
                    }
                } else {
                    acc[field.name] = field.value;
                }
            });

            return acc;
        }, {});

        console.log(`UPDATED REQUEST:`, { updatedRequest, updatedFields });

        setSessionItem(buildId, { fields: updatedFields, request: updatedRequest });
        setFields(updatedFields);
        setRequest(updatedRequest);
    };

    useEffect(() => {
        if (sessionData?.[buildId]) {
            const { fields: savedFields, request: savedRequest } = sessionData[buildId];
            setFields(savedFields || []);
            setRequest(savedRequest || {});
        }else if(!request){
            // SET REQUEST TO EMPTY COZ IT WAS NOT SET
            setRequest({ })
        }
    }, [sessionData, buildId]);

    return { fields, setField, onSubmit, request, response, clearForm, fieldErrors };
};

export default useProductBuildForm;
