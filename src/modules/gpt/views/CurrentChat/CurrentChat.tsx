// CurrentChat.tsx
import React from 'react';
import { GPTMessage } from '~/src/core/services/GPTService/IGPTService';

interface CurrentChatProps {
  messages: GPTMessage[];
}

const CurrentChat: React.FC<CurrentChatProps> = ({ messages }) => {
  return (
    <div className="current-chat">
      <h3>Current Chat</h3>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`msg msg-${msg.role}`}>
            <strong>{msg.name || msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentChat;
