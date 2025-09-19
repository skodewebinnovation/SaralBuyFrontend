import React, { useState, useEffect } from 'react'
import ChatService from '../services/chat.service'
import { Search, Send, Menu, X, Circle, List, LayoutGrid, Paperclip } from 'lucide-react'
import { Input } from '../Components/ui/input'
import { Button } from '../Components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../Components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '../Components/ui/sheet'
import { Badge } from '../Components/ui/badge'
import { fallBackName } from '@/helper/fallBackName'
import { getUserProfile } from "@/zustand/userProfile";
import { useLocation } from 'react-router-dom'

const ContactsList = ({
  onSelectContact,
  contact,
  userType,
  user,
}: {
  onSelectContact: (contact: any) => void;
  contact: any;
  userType: "seller" | "buyer";
  user: any;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredContacts = [contact].filter(
    (c) =>
      c &&
      c.name &&
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-chat-sidebar border-r-0 border-chat-border">
      <div className="p-4 border-b border-chat-border">
        <h2 className="text-lg font-semibold mb-2 text-gray-600">Messaging</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search in dashboard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-chat-border"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.map((contact) => {
          console.log(contact,"con")
          // Determine unread count based on userType
          const unreadCount =
            userType === "buyer"
              ? contact.buyerUnreadCount
              : contact.sellerUnreadCount;
          return (
            <div
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              className="px-2 py-1 border-chat-border hover:bg-chat-message-bg cursor-pointer transition-colors"
            >
              <div className="flex items-start space-x-3 bg-white p-3 rounded-md">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>{fallBackName(contact.name)}</AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-chat-online border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-600 truncate">{contact.name}</h3>
                    <span className="text-xs text-muted-foreground ml-2">
                      {/* Last message time */}
                      {contact.lastMessage && contact.lastMessage.timestamp
                        ? new Date(contact.lastMessage.timestamp).toLocaleTimeString()
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    {/* Last message text */}
                    <p className="text-[13px] text-muted-foreground font-medium truncate mt-1">
                      {contact.lastMessage && contact.lastMessage.message
                        ? contact.lastMessage.message
                        : ""}
                    </p>
                    {/* Unread count badge */}
                    {unreadCount > 0 && (
                      <span className="ml-2 bg-orange-500 text-white rounded-full px-2 py-0.5 text-xs font-semibold">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface ChatAreaProps {
  selectedContact: any;
  userType: "seller" | "buyer";
  userId: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  onSidebarContactUpdate: (updater: (prev: any) => any) => void;
}

const ChatArea = ({
  selectedContact,
  userType,
  userId,
  productId,
  buyerId,
  sellerId,
  messages,
  setMessages,
  onSidebarContactUpdate,
}: ChatAreaProps) => {
  const [messageText, setMessageText] = useState('');
  const [chatService] = useState(() => ChatService.getInstance());

  useEffect(() => {
    if (!userId || !productId || !sellerId || !userType || !buyerId) {
      console.error('Missing required parameters:', { userId, productId, sellerId, userType, buyerId });
      return;
    }
    
    console.log('Joining room with:', { userId, productId, sellerId, userType, buyerId });
    chatService.joinRoom(userId, productId, sellerId, userType, buyerId);

    // Emit get_chat_history after joining room
    if (chatService.socket) {
      chatService.socket.emit("get_chat_history", {
        productId,
        sellerId,
        buyerId,
      });

      // Listen for chat_history event
      const handleChatHistory = (data: any) => {
        if (data && Array.isArray(data.messages)) {
          // Map backend messages to frontend format
          const mappedMessages = data.messages.map((msg: any, idx: number) => ({
            id: msg._id || idx + "_" + (msg.timestamp || ""),
            text: msg.message,
            senderId: msg.senderId,
            senderType: msg.senderType,
            time: msg.timestamp
              ? new Date(msg.timestamp).toLocaleTimeString()
              : "",
          }));
          setMessages(mappedMessages);

          // Update sidebar contact info with lastMessage and unread counts
          if (typeof onSidebarContactUpdate === "function") {
            onSidebarContactUpdate((prev: any) => ({
              ...prev,
              lastMessage: data.lastMessage,
              buyerUnreadCount: data.buyerUnreadCount,
              sellerUnreadCount: data.sellerUnreadCount,
            }));
          }
        }
      };

      chatService.socket.on("chat_history", handleChatHistory);

      // Cleanup listener on unmount or dependency change
      return () => {
        if (chatService.socket) {
          chatService.socket.off("chat_history", handleChatHistory);
        }
      };
    }
  }, [userId, productId, sellerId, userType, buyerId, chatService, setMessages, onSidebarContactUpdate]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // FIXED: Pass buyerId to sendMessage
      chatService.sendMessage(productId, sellerId, messageText, userId, userType, buyerId);
      
      // Add message to local state immediately for better UX
      const newMessage = {
        id: Date.now().toString(),
        text: messageText,
        senderId: userId,
        senderType: userType,
        time: new Date().toLocaleTimeString(),
      };
      
      setMessages((prev) => [...prev, newMessage]);
      setMessageText('');
    }
  };

  if (!selectedContact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
          <p className="text-sm">Choose a contact from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col border-1 rounded-md overflow-hidden">
      {/* Chat Header */}
      <div className="border-b border-chat-border bg-background">
        <div className='bg-gray-100 flex justify-between items-center'>
          <p></p>
        </div>
        <div className="flex justify-between items-center space-x-2 bg-gray-100 p-2">
          <p className="text-sm text-muted-foreground font-semibold">Looking for 5 Industrial Drill Machines</p>
          <div className="flex items-center justify-end mt-1">
            <List className='w-4 h-4' />
            <Badge variant="secondary" className="text-sm">5 units</Badge>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-orange-50">
          <div className='flex justify-between items-center w-full'>
            <div className="relative flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className='flex items-center space-x-4'>
                  <h3 className="font-semibold text-gray-700">{selectedContact.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Circle className="h-2 w-2 overflow-hidden bg-green-600 rounded-full border-0 text-transparent" />
                    <span className="text-sm text-muted-foreground">Online</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <Button variant="outline" size="sm" className="text-orange-600 hover:text-orange-600 bg-transparent cursor-pointer hover:bg-transparent border-orange-600 w-32 text-sm font-medium">
                Close Deal
              </Button>
              <LayoutGrid className='w-5 h-5 text-gray-600' />
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => {
          // Show all messages, align right if sent by current user, left otherwise
          const isMine = message.senderId === userId && message.senderType === userType;
          return (
            <div
              key={message.id}
              className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 ${
                  isMine
                    ? 'bg-gray-500 text-white rounded-tl-lg rounded-bl-lg rounded-br-lg'
                    : 'bg-gray-600 text-white rounded-tr-lg rounded-bl-lg rounded-br-lg'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {message.time
                  ? message.time
                  : message.timestamp
                  ? new Date(message.timestamp).toLocaleTimeString()
                  : ""}
                {" "}
                • {isMine ? 'You' : message.senderType}
              </span>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-chat-border bg-background">
        <div className="flex items-center space-x-5">
          <div className="flex-1 relative">
            <Input
              placeholder="Type your message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="p-5 bg-gray-100 rounded-full text-sm placeholder:text-sm placeholder:font-medium tracking-wide focus-visible:ring-0 border-0"
            />
          </div>
          <div className='p-1 rounded-full border-2 border-gray-500 cursor-pointer hover:bg-gray-100'>
            <Paperclip className='w-4 h-4 text-gray-700'/>
          </div>
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="cursor-pointer w-12"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const Chatbot = () => {
  const location = useLocation();
  const { user } = getUserProfile();

  // Try to get IDs from location.state, else fallback to localStorage
  let productId = location.state?.productId;
  let buyerId = location.state?.userId || location.state?.productBuyerId;
  let sellerId = location.state?.sellerId;

  if (!productId || !buyerId || !sellerId) {
    try {
      const stored = localStorage.getItem('chatIds');
      if (stored) {
        const ids = JSON.parse(stored);
        productId = productId || ids.productId;
        // Try both possible keys for buyerId
        buyerId = buyerId || ids.userId || ids.productBuyerId;
        sellerId = sellerId || ids.sellerId;
      }
    } catch (e) {
      // Ignore parse errors
    }
  }

  // FIXED: Better userType determination with validation
  let userType: 'buyer' | 'seller' = 'buyer';
  let currentUserId = user?._id;

  // Error state for rendering after hooks
  let errorMsg: string | null = null;
  if (!currentUserId) {
    console.error('No user ID found');
    errorMsg = "Error: Please log in to access chat";
  } else if (!productId || !buyerId || !sellerId) {
    console.error('Missing required IDs:', { productId, buyerId, sellerId });
    errorMsg = "Error: Missing chat parameters";
  } else if (!(currentUserId === sellerId || currentUserId === buyerId)) {
    console.error('Current user is neither buyer nor seller');
    errorMsg = "Error: Access denied";
  }

  // Determine if current user is buyer or seller
  if (!errorMsg) {
    if (currentUserId === sellerId) {
      userType = 'seller';
    } else if (currentUserId === buyerId) {
      userType = 'buyer';
    }
  }

  // The other party (contact)
  const contact = userType === 'buyer'
    ? {
        id: sellerId,
        name: 'Seller',
        message: '',
        time: '',
        avatar: '',
        isOnline: true,
      }
    : {
        id: buyerId,
        name: 'Buyer',
        message: '',
        time: '',
        avatar: '',
        isOnline: true,
      };

  const [selectedContact, setSelectedContact] = useState(contact);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  // Store sidebar contact info (lastMessage, unreadCount)
  const [sidebarContact, setSidebarContact] = useState(contact);

  useEffect(() => {
    setSelectedContact(contact);
    setSidebarContact(contact);
  }, [contact.id]);

  useEffect(() => {
    if (errorMsg) return; // Don't set up chat if error
    const chatService = ChatService.getInstance();
    chatService.connect();

    // Listen for incoming messages globally
    const handleReceiveMessage = (data: any) => {
      console.log('Received message:', data);

      // Only add if it's not from current user (to avoid duplicates)
      if (data.senderId !== currentUserId) {
        setMessages((prev) => [
          ...prev,
          {
            id: data.id || Date.now().toString() + Math.random(),
            text: data.message,
            senderId: data.senderId,
            senderType: data.senderType,
            time: data.timestamp
              ? new Date(data.timestamp).toLocaleTimeString()
              : data.time || new Date().toLocaleTimeString(),
          },
        ]);
      }

      // Update sidebar contact info with lastMessage and unread counts
      setSidebarContact((prev: any) => ({
        ...prev,
        lastMessage: data.lastMessage,
        buyerUnreadCount: data.buyerUnreadCount,
        sellerUnreadCount: data.sellerUnreadCount,
      }));
    };

    // Listen for sidebar last message update
    const handleLastMessageUpdate = (data: any) => {
      if (data && data.lastMessage) {
        setSidebarContact((prev: any) => ({
          ...prev,
          lastMessage: data.lastMessage,
        }));
      }
    };

    if (!errorMsg && chatService.socket) {
      chatService.socket.on("receive_message", handleReceiveMessage);
      chatService.socket.on("chat_last_message_update", handleLastMessageUpdate);
    }

    return () => {
      if (!errorMsg && chatService.socket) {
        chatService.socket.off("receive_message", handleReceiveMessage);
        chatService.socket.off("chat_last_message_update", handleLastMessageUpdate);
      }
      // Don't disconnect here as it might be used elsewhere
    };
  }, [currentUserId, errorMsg]);

  // Clear chatIds from localStorage when leaving the chat page
  useEffect(() => {
    return () => {
      localStorage.removeItem('chatIds');
    };
  }, []);

  if (errorMsg) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="h-screen flex items-center justify-center">
          <div className="text-center text-red-500 text-lg font-semibold">{errorMsg}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="h-screen border-chat-border rounded-lg overflow-hidden my-5">
        <div className="flex h-full gap-2">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-80 bg-gray-100 border-1 rounded-md">
            <ContactsList
              onSelectContact={setSelectedContact}
              contact={sidebarContact}
              userType={userType}
              user={user}
            />
          </div>

          {/* Mobile Menu Button and Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Mobile Header */}
            <div className="md:hidden sm:p-4 py-2 border-chat-border bg-chat-sidebar">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Messages</h2>
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-80">
                    <ContactsList
                      onSelectContact={(contact) => {
                        setSelectedContact(contact);
                        setIsMobileMenuOpen(false);
                      }}
                      contact={sidebarContact}
                      userType={userType}
                      user={user}
                    />
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Chat Area */}
            <ChatArea
              selectedContact={selectedContact}
              userType={userType}
              userId={currentUserId}
              productId={productId}
              buyerId={buyerId}
              sellerId={sellerId}
              messages={messages}
              setMessages={setMessages}
              onSidebarContactUpdate={setSidebarContact}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;