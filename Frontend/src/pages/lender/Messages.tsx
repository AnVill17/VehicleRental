import { motion } from 'framer-motion';
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ChatBox } from '@/components/ChatBox';
import { Message } from '@/types';
import { mockMessages } from '@/data/mockData';

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
}

const mockConversations: Conversation[] = [
  {
    id: 'c1',
    userId: 'user1',
    userName: 'Alice Brown',
    lastMessage: 'Perfect! I\'ll reserve it for you.',
    timestamp: new Date('2024-12-07T10:10:00'),
    unread: 0,
  },
  {
    id: 'c2',
    userId: 'user2',
    userName: 'Bob Wilson',
    lastMessage: 'Is the BMW still available?',
    timestamp: new Date('2024-12-06T15:30:00'),
    unread: 2,
  },
  {
    id: 'c3',
    userId: 'user3',
    userName: 'Carol Davis',
    lastMessage: 'Thanks for the great service!',
    timestamp: new Date('2024-12-05T09:00:00'),
    unread: 0,
  },
];

const Messages = () => {
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    mockConversations[0]
  );
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const handleSendMessage = (content: string) => {
    // TODO: Connect to backend API
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'owner1',
      receiverId: selectedConversation?.userId || '',
      content,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Messages
            </h1>
            <p className="text-muted-foreground">
              Communicate with your renters
            </p>
          </motion.div>

          {/* Chat Layout */}
          <motion.div
            className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-16rem)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Conversations List */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-display font-semibold text-foreground">
                  Conversations
                </h2>
              </div>
              <div className="overflow-y-auto h-[calc(100%-4rem)] scrollbar-thin">
                {conversations.map((conversation) => (
                  <motion.button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full p-4 flex items-center gap-3 text-left transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-primary/10'
                        : 'hover:bg-muted/50'
                    }`}
                    whileHover={{ x: 5 }}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        {conversation.userAvatar ? (
                          <img
                            src={conversation.userAvatar}
                            alt={conversation.userName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-bold text-muted-foreground">
                            {conversation.userName.charAt(0)}
                          </span>
                        )}
                      </div>
                      {conversation.unread > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground truncate">
                          {conversation.userName}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(conversation.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            <div className="lg:col-span-2 h-full">
              {selectedConversation ? (
                <ChatBox
                  messages={messages.filter(
                    (m) =>
                      m.senderId === selectedConversation.userId ||
                      m.receiverId === selectedConversation.userId
                  )}
                  currentUserId="owner1"
                  onSend={handleSendMessage}
                  otherUserName={selectedConversation.userName}
                />
              ) : (
                <div className="glass rounded-2xl h-full flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Select a conversation to start messaging
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
