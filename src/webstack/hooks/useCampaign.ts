import { useEffect, useState } from 'react';
import useUserAgent from './getUserAgentInfo';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import { useRouter } from 'next/router';

const useCampaign = () => {
  const router = useRouter();
  const user_agent_data = useUserAgent();
  const user = useUser();
  const id = router?.query?.cid;
  const [campaignData, setCampaignData]=useState<any>();
  useEffect(()=>{
    if(id && user_agent_data)setCampaignData({
      user, user_agent_data, id
    });
  },[router, user, user_agent_data]);
  if(!id)return;
  return campaignData;
};


export default useCampaign;