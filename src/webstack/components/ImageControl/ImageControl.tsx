
// Relative Path: ./ImageControl.tsx
import React, { useEffect, useState } from 'react';
import styles from './ImageControl.scss';
type ClassDefinition = string;
const useClass = (cls:string, mediaType?: 'image' | 'video', variant?:string)=>{
    const[c,setC]=useState<ClassDefinition>(cls);
    const handleC =()=>{
        if(variant && typeof variant=='string')setC(`${cls} ${cls}__${variant}`);
    };
    useEffect(() => {
        cls && handleC
    }, [cls, variant]);
    return c;
}
// Remember to create a sibling SCSS file with the same name as this component
type IImageVariant= 'center' | string;
type IImageMediaType = ''
interface IImageControl{
    variant?: IImageVariant;
    mediaType?: IImageMediaType;
}
const ImageControl: React.FC<any> = ({variant}:IImageControl) => {

    const clzz: string = useClass('image-control', mediaType,variant);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='image-control'>
      <div className={clzz}>

      </div>
      </div>
    </>
  );
};

export default ImageControl;
