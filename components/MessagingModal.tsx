import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole, Message } from '../types';
import { X, Send } from './Icons';

interface MessagingModalProps {
  currentUser: User;
  onClose: () => void;
  users: User[];
  messages: Message[];
  onSendMessage: (message: Message) => void;
}

const MessagingModal: React.FC<MessagingModalProps> = ({ currentUser, onClose, users, messages, onSendMessage }) => {
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [newMessageText, setNewMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const contacts = users.filter(user => {
    if (currentUser.role === UserRole.Learner) {
      return user.role === UserRole.Instructor;
    }
    if (currentUser.role === UserRole.Instructor) {
      return user.role === UserRole.Learner;
    }
    return false;
  });

  const activeContact = users.find(u => u.id === activeConversationId);

  const conversationMessages = messages.filter(
    msg =>
      (msg.senderId === currentUser.id && msg.receiverId === activeConversationId) ||
      (msg.senderId === activeConversationId && msg.receiverId === currentUser.id)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeConversationId) {
        scrollToBottom();
    }
  }, [conversationMessages, activeConversationId]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessageText.trim() === '' || !activeConversationId) return;

    const newMessage: Message = {
      id: Date.now(),
      senderId: currentUser.id,
      receiverId: activeConversationId,
      text: newMessageText,
      timestamp: new Date().toISOString(),
    };

    onSendMessage(newMessage);
    setNewMessageText('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-cream dark:bg-gray-800 rounded-lg shadow-xl border-2 border-black dark:border-gray-600 w-full max-w-4xl h-[80vh] flex flex-col">
        <header className="p-4 border-b-2 border-black dark:border-gray-600 flex justify-between items-center bg-brand-yellow">
          <h2 className="text-xl font-bold font-display text-black">Messages</h2>
          <button onClick={onClose} className="text-black hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </header>
        <main className="flex-grow flex overflow-hidden">
          {/* Contacts List */}
          <div className="w-1/3 border-r-2 border-black dark:border-gray-600 overflow-y-auto bg-brand-green/20 dark:bg-gray-900/50">
            <ul className="p-2">
              {contacts.map(contact => (
                <li key={contact.id}>
                  <button
                    onClick={() => setActiveConversationId(contact.id)}
                    className={`w-full text-left flex items-center p-3 rounded-lg transition-colors border border-black dark:border-gray-600 ${
                      activeConversationId === contact.id ? 'bg-brand-yellow' : 'bg-cream dark:bg-gray-700 hover:bg-brand-yellow/50 dark:hover:bg-brand-yellow/50'
                    }`}
                  >
                    <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full mr-3 border-2 border-black dark:border-gray-500" />
                    <div>
                      <p className="font-semibold text-black dark:text-cream">{contact.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{contact.role}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Chat Window */}
          <div className="w-2/3 flex flex-col">
            {activeConversationId && activeContact ? (
              <>
                <div className="p-4 border-b-2 border-black dark:border-gray-600 flex items-center bg-white dark:bg-gray-700">
                  <img src={activeContact.avatar} alt={activeContact.name} className="w-10 h-10 rounded-full mr-3 border-2 border-black dark:border-gray-500" />
                  <div>
                    <h3 className="font-bold text-black dark:text-cream">{activeContact.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="h-2 w-2 bg-green-500 inline-block rounded-full mr-1"></span>
                      Online
                    </p>
                  </div>
                </div>
                <div className="flex-grow p-4 overflow-y-auto bg-white dark:bg-gray-700">
                  <div className="space-y-4">
                    {conversationMessages.map(msg => (
                      <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                        {msg.senderId !== currentUser.id && <img src={activeContact.avatar} className="h-8 w-8 rounded-full border-2 border-black dark:border-gray-500" />}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl border border-black dark:border-gray-600 ${msg.senderId === currentUser.id ? 'bg-brand-blue text-black rounded-br-lg' : 'bg-gray-200 dark:bg-gray-600 text-black dark:text-cream rounded-bl-lg'}`}>
                          <p className="text-sm">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                     <div ref={messagesEndRef} />
                  </div>
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t-2 border-black dark:border-gray-600 bg-white dark:bg-gray-700 flex items-center">
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow p-2 border-2 border-black dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-white dark:bg-gray-600 text-black dark:text-cream"
                    aria-label="Message input"
                  />
                  <button type="submit" className="ml-3 bg-brand-blue text-black rounded-full p-3 hover:bg-blue-300 transition-colors flex-shrink-0 border-2 border-black" aria-label="Send message">
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-grow flex items-center justify-center text-gray-600 dark:text-gray-400">
                <p>Select a conversation to start chatting.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MessagingModal;