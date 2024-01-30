// Relative Path: ./SettingsView.tsx
import React, { useEffect,  useState } from 'react';
import styles from './UiSettingsLayout.scss';
import { default as Div } from "@webstack/components/UiDiv/UiDiv";
import UiMenu from '../../components/UiMenu/UiMenu';
import UiSelect from '../../components/UiSelect/UiSelect';
import { capitalizeAll } from '@webstack/helpers/Capitalize';
import UiLoader from '../../components/UiLoader/view/UiLoader';
import { useRouter } from 'next/router';
import useClass from '@webstack/hooks/useClass';
import useWindow from '@webstack/hooks/useWindow';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

// Remember to create a sibling SCSS file with the same name as this component
interface ISettingsLayout {
  views: any;
  setViewCallback?: (e: any) => void;
  variant?: string;
  title?: string;
  defaultView?: string
}
const UiSettingsLayout: React.FC<ISettingsLayout> = ({
  views,
  setViewCallback,
  variant,
  title,
  defaultView
}: ISettingsLayout) => {
const {width }=useWindow();
  const router = useRouter();
  const queryViewId = router?.query?.vid && router.query.vid;
  const [view, setView] = useState<string | undefined>(defaultView);
  const [actionStyles, setActionStyles] = useState({ width: 350 });
  const handleView = (view: string) => {
    router.push({
      pathname: router?.pathname,
      query: {
        vid: keyStringConverter(view, false) || queryViewId
      }
    },
      undefined, { shallow: false }
    )
    setViewCallback && setViewCallback(view);
  }
  const containerClass = useClass('settings', undefined, variant);
  const contentClass = useClass('settings__content', undefined, variant);
  const viewClass = useClass('settings__view', undefined, variant);

const [hide, setHide]=useState('');
const handleHide = () =>{
  if(hide == '')setHide('hide');
  else if(hide == 'hide')setHide('show');
  else if(hide == 'show')setHide('hide');
  else setHide('');
}
  const optionViews = (dashed: boolean = true) => Object.keys(views).map(v => {
    return keyStringConverter(v, dashed)
  });
  
  useEffect(() => {
    if(width < 1100 && hide == 'hide')setHide('show');
    if (views) {
      const firstView = queryViewId || defaultView || Object.keys(views)[0];
      firstView && setView(String(firstView));
    }
  }, [queryViewId]);
  if (!Boolean(view)) return <UiLoader />;
  return (
    <>
      <style jsx>{styles}</style>
      <div id="settings-container" className={containerClass}>
        <div className={contentClass}>
        <div className={`settings--icon ${`settings--icon--${hide}`}`}>
            {/* {hide == 'show'?'hide':'show'} */}
                <UiIcon 
                  icon={hide==''?"fa-xmark" : hide=='hide'?'fa-bars':'fa-xmark'}
                  onClick={handleHide}
                />
                  </div>
          <div className={`settings__actions ${hide!==''?`settings__actions--${hide}`:''}`}>
            <Div maxWidth={1100} style={actionStyles}>
              <div className="settings__actions--content">
                <UiMenu
                  options={optionViews(false)}
                  variant="flat"
                  value={view}
                  onSelect={handleView}
                />
              </div>
       
            </Div>

            <Div minWidth={1100} >
              <div className="settings__actions--content">
                <UiSelect
                  onSelect={handleView}
                  title={capitalizeAll(view || '')}
                  // openState
                  options={optionViews(false)}
                />
              </div>
            </Div>

          </div>
   
          <div id='settings-view' className={viewClass}>
          {title && <div className={`settings__view--header${
                  hide==''?' settings__view--header--init':hide=='show'?' settings__view--header--show':' settings__view--header--hide'}`}>
      

                  <div className='settings__view--header--title'>
                    {title} 
                  </div>
                  {/* <BreadCrumbs defaultLink={{label: title}}/> */}
              </div>}
            <div className='settings__view__content'>
              {view && views[view]}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UiSettingsLayout;