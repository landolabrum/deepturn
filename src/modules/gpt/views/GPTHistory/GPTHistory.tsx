import React, { useEffect, useState } from 'react';
import styles from './GPTHistory.scss';
import { getService } from '@webstack/common';
import IGPTService, { GPTMessage } from '~/src/core/services/GPTService/IGPTService';
import { useUser } from '~/src/core/authentication/hooks/useUser';

const GPTHistory: React.FC<{ chats: string[] }> = ({ chats }) => {
  const user = useUser();
  const [history, setHistory] = useState<GPTMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const uid = user?.id || 'guest';
        const res = await getService<IGPTService>('IGPTService').getChatHistory(uid);
        setHistory(res.messages);
      } catch (err) {
        console.error('[GPT] Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  return (
    <div className="gpt-history">
      <style jsx>{styles}</style>
      <h3>Previous Chats</h3>
      {loading ? (
        <p>Loading chats...</p>
      ) : (
        <ul>
          {chats?.length && chats.map((chat, idx) => (
            <li key={idx} className="chat-item">
              Chat {chat}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GPTHistory;
