import React, { useEffect, useState } from "react";
import useWindow from "./useWindow";
import { IFormControlVariant } from "@webstack/components/AdapTable/models/IVariant";

interface IuseClassWidths {
    width: number | string,
    classList: string | string[]
}

interface IuseClass {
    cls: string;
    type?: string;
    variant?: any;
    extras?: string[] | undefined;
    standalones?: string[] | undefined;
    minWidths?: IuseClassWidths[];
    maxWidths?: IuseClassWidths[];
    width?: number;
}

const useClass = (props: IuseClass) => {

    const { cls, type, variant, extras, minWidths, maxWidths, width, standalones } = props;
    if(Boolean(!width && maxWidths) || Boolean(!width && minWidths))return cls;
    const [classState, setClassState] = useState<string>(cls);

    useEffect(() => {
        let newClass = cls;
        
        // Function to append modifiers
        const appendModifier = (modifier: string | undefined) => {
            if (modifier) {
                newClass += ` ${cls}__${modifier}`;
            }
        };
        
        appendModifier(variant);
        appendModifier(type);
        
        if (extras) {
            extras.forEach(extra => {
                if (extra?.length) {
                    newClass += ` ${cls}__${extra}`;
                }
            });
        }
        if (standalones) {
            standalones.forEach(extra => {
                if (extra?.length) {
                    newClass += ` ${extra}`;
                }
            });
        }

        const handleWidths = (widths: IuseClassWidths[], isMinWidth: boolean) => {
            if(!width)return;
            widths.forEach(w => {
                const widthCondition = typeof w.width === 'number' ? w.width :
                    (typeof w.width === 'string' && w.width.endsWith('px') ? parseInt(w.width) : 0);
                
                if (isMinWidth ? widthCondition > width : widthCondition < width) {
                    if (Array.isArray(w.classList)) {
                        w.classList.forEach(c => {
                            newClass += ` ${cls}__${c}`;
                        });
                    } else {
                        newClass += ` ${cls}${w.classList}`;
                    }
                }
            });
        };
        
        if (minWidths) {
            handleWidths(minWidths, true);
        }
        
        if (maxWidths) {
            handleWidths(maxWidths, false);
        }

        setClassState(newClass);
    }, [cls, type, variant, extras, minWidths, maxWidths, width]);

    return classState;
};

export default useClass;
