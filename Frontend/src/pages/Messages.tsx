import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ChatBox } from '@/components/ChatBox';
import { mockMessages, mockVehicles } from '@/data/mockData';
import { Message } from '@/types';
import { MessageCircle, Search } from 'lucide-react';

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Group messages by lender (for user view)
  const lenderChats = mockVehicles.reduce((acc, vehicle) => {
    if (!acc[vehicle.ownerId]) {
      acc[vehicle.ownerId] = {
        id: vehicle.ownerId,
        name: `${vehicle.company} Owner`,
        vehicle: `${vehicle.company} ${vehicle.model}`,
        lastMessage: messages.find(
          (m) => m.senderId === vehicle.ownerId || m.receiverId === vehicle.ownerId
        )?.content || 'No messages yet',
        unread: messages.filter(
          (m) => m.senderId === vehicle.ownerId
        ).length,
      };
    }
    return acc;
  }, {} as Record<string, { id: string; name: string; vehicle: string; lastMessage: string; unread: number }>);

  const chatList = Object.values(lenderChats).filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (content: string) => {
    if (!selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'current-user',
      receiverId: selectedChat,
      content,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    // TODO: Connect to backend API
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Messages
            </h1>
            <p className="text-muted-foreground">
              Chat with vehicle owners
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chat List */}
            <motion.div
              className="glass rounded-2xl p-4 lg:col-span-1 h-[600px] flex flex-col"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="input-field pl-10"
                />
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin">
                <AnimatePresence>
                  {chatList.map((chat, index) => (
                    <motion.button
                      key={chat.id}
                      onClick={() => setSelectedChat(chat.id)}
                      className={`w-full p-3 rounded-xl text-left transition-all ${
                        selectedChat === chat.id
                          ? 'bg-primary/20 border border-primary/30'
                          : 'bg-muted/50 hover:bg-muted border border-transparent'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-foreground truncate">
                              {chat.name}
                            </span>
                            {chat.unread > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                                {chat.unread}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-primary/70 mb-1">
                            {chat.vehicle}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {chat.lastMessage}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>

                {chatList.length === 0 && (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No conversations yet</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Chat Window */}
            <motion.div
              className="lg:col-span-2 h-[600px]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {selectedChat ? (
              <ChatBox
                  messages={messages.filter(
                    (m) =>
                      m.senderId === selectedChat ||
                      m.receiverId === selectedChat
                  )}
                  currentUserId="current-user"
                  otherUserName={lenderChats[selectedChat]?.name || 'Owner'}
                  onSend={handleSendMessage}
                />
              ) : (
                <div className="glass rounded-2xl h-full flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <MessageCircle className="w-10 h-10 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-muted-foreground">
                      Choose a chat from the list to start messaging
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
