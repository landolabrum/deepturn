import React, { useEffect, useState } from 'react';
import styles from './GPTPage.scss';
import { getService } from '@webstack/common';
import IGPTService, { GPTMessage } from '~/src/core/services/GPTService/IGPTService';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import GPTHistory from '../views/GPTHistory/GPTHistory';
import CurrentChat from '../views/CurrentChat/CurrentChat';

const GPTPage: React.FC = () => {
  const gptService = getService<IGPTService>('IGPTService');
  const [uid, setUid] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<GPTMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [chats, setChats] = useState<string[]>([]);  // Store previous chats
  const user = useUser();

  useEffect(() => {
    const initChat = async () => {
      try {
        const res = await gptService.getNewChat(user?.id || 'guest');
        setUid(res.uid);
        setMessages(res.messages || []);
      } catch (err) {
        console.error('[GPT] Failed to initialize chat', err);
      }
    };
    initChat();

    const fetchChats = async () => {
      try {
        const res = await gptService.listChats(user?.id || 'guest');
        setChats(res);  // Store chat names or IDs for selection
      } catch (err) {
        console.error('[GPT] Failed to fetch chats', err);
      }
    };
    fetchChats();
  }, [user]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userName = user?.name || 'Anonymous';
    const newMessages: GPTMessage[] = [
      ...messages,
      { role: 'user', content: input, name: userName }
    ];

    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await gptService.sendChat({ uid, messages: newMessages });
      if (res.reply) {
        setMessages([
          ...newMessages,
          { role: 'assistant', content: res.reply }
        ]);
      }
    } catch (err) {
      console.error('[GPT] Failed to send chat', err);
    }

    setInput('');
    setLoading(false);
  };

  const handleNewChat = async () => {
    setMessages([]);
    try {
      const res = await gptService.getNewChat(user?.id || 'guest');
      setUid(res.uid);
      setMessages(res.messages || []);
    } catch (err) {
      console.error('[GPT] Failed to start new chat', err);
    }
  };

  return (
    <div className="gpt-page">
      <style jsx>{styles}</style>
      <div className="chat-container">
        <div className="left-panel">
          <GPTHistory chats={chats} />
        </div>
        <div className="right-panel">
          <CurrentChat messages={messages} />
          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
            />
            <button onClick={handleSend} disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
          <button onClick={handleNewChat} disabled={loading} className="new-chat-btn">
            Start New Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default GPTPage;
