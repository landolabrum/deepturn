// Relative Path: ./UiElements.tsx
import React from 'react';
import styles from './UiElements.scss';
import lstyles from './UiList.scss';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import UiButton from '@webstack/components/UiButton/UiButton';
import UiInput from '@webstack/components/UiInput/UiInput';
import UiMenu from '@webstack/components/UiMenu/UiMenu';

// Remember to create a sibling SCSS file with the same name as this component

const UiElements: React.FC = () => {
    const UiList = ({data}:any)=>{
        return <>
        <style jsx>{lstyles}</style>
        <ul>
            {data && Object.entries(data).map(([key, value]:any)=>{
                return <li key={key}>
                    <div>
                        {key}
                    </div> 
                    <div>
                        {value}
                    </div>
                </li>
            })}
        </ul>
        </>;
    }
    const compontents: any = [
        {
            component: <UiButton
                variant='dark'
                label='<UiButton variant="dark" />'
            >UiButton</UiButton>,
            props: <UiList
                data={{
                    'onClick?': '(e: any) => void',
                    'disabled?': 'boolean',
                    'busy?': 'boolean',
                    'href?': 'string',
                    'target?': 'string'
                }}
            />
        }, {
            component: <UiInput
                variant='dark'
                label="<UiInput variant='dark'"
                value={"UiInput"}
            />,
            props: <><UiMenu traits={{border:'none'}} variant='dark' options={[
                "name?: string;",
                "type?: string;",
                "disabled?: boolean;",
                "value?: ValueType;",
                "defaultValue?: string | number | readonly string[] | undefined;",
                "onPaste?: (e: any) => void;",
                "onChange?: (e: any) => void;",
                "onKeyDown?: (e: any) => void;",
                "onKeyUp?: (e: any) => void;",
                "placeholder?: string;",
                "variant?: VariantProps;",
                "min?: number;",
                "max?: number;",
                "autoComplete?: string;",
            ]} /></>

        }
    ]
    return (
        <>
            <style jsx>{styles}</style>
            <div className='ui-elements'>
                <div className='ui-elements__header'>
                    <div className='ui-elements__header-content'>
                        <div className='ui-elements__title'>
                            Ui Elements
                        </div>
                        <div className='ui-elements__sub-title'>
                            A tribute to the inspiration to Fashore's work.
                        </div>
                    </div>
                </div>
                <div className='ui-elements__content'>
                    <div className='ui-elements__body'>
                        <AdapTable
                            options={{tableTitle:'components'}}
                            data={compontents}
                        />
                    </div>
                </div>
                <div className='ui-elements__footer'>

                </div>
            </div>
        </>
    );
};

export default UiElements;