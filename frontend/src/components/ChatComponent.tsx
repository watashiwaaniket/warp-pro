import React, { useState } from 'react';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: inputMessage }];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/chat', 
        { messages: newMessages }, 
        { responseType: 'stream' }
      );

      const reader = response.data;
      reader.on('data', (chunk: string) => {
        try {
          const parsedChunk = JSON.parse(chunk);
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: 'assistant', content: parsedChunk.message.content },
          ]);
        } catch (error) {
          console.error('Error parsing chunk:', error);
        }
      });

      reader.on('end', () => {
        setIsLoading(false);
      });

      reader.on('error', (err: Error) => {
        console.error('Streaming error:', err);
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800">Chat</h1>
        <div className="mt-4 h-64 overflow-y-auto border rounded p-2 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`my-2 ${
                msg.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <span
                className={`inline-block p-2 rounded-lg ${
                  msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-200'
                }`}
              >
                {msg.content}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow border rounded px-2 py-1"
        />
        <button
          onClick={handleSendMessage}
          className={`px-4 py-2 rounded ${
            isLoading ? 'bg-gray-400' : 'bg-blue-500 text-white'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
