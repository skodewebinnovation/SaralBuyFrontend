import React, { useState, useEffect } from 'react'
import ChatService from '../services/chat.service'
import { Search, Send, Menu, Circle, List, LayoutGrid, Paperclip } from 'lucide-react'
import { Input } from '../Components/ui/input'
import { Button } from '../Components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../Components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '../Components/ui/sheet'
import { Badge } from '../Components/ui/badge'
import { fallBackName } from '@/helper/fallBackName'
import { getUserProfile } from "@/zustand/userProfile"
import { useLocation } from 'react-router-dom'
import { toast } from "sonner"
import requirementService from '@/services/requirement.service'

// Sidebar component to display recent chats
const ContactsList = ({
  onSelectContact,
  contacts,
  selectedContactId,
  userType,
  user,
}: {
  onSelectContact: (contact: any) => void;
  contacts: any[];
  selectedContactId: string | null;
  userType: "seller" | "buyer";
  user: any;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredContacts = contacts.filter(
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
        {filteredContacts.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <p>No chats available</p>
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const unreadCount =
              userType === "buyer"
                ? contact.buyerUnreadCount
                : contact.sellerUnreadCount;
            const isSelected = contact.roomId === selectedContactId;
            
            return (
              <div
                key={contact.roomId}
                onClick={() => {
                  if (!isSelected) onSelectContact(contact);
                }}
                className={`px-2 py-1 border-chat-border hover:bg-chat-message-bg cursor-pointer transition-colors ${
                  isSelected ? 'bg-orange-50' : ''
                }`}
              >
                <div className={`flex items-start space-x-3 bg-white p-3 rounded-md ${
                  isSelected ? 'border-2 border-orange-500' : ''
                }`}>
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
                        {contact.lastMessage && contact.lastMessage.timestamp
                          ? new Date(contact.lastMessage.timestamp).toLocaleTimeString()
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] text-muted-foreground font-medium truncate mt-1">
                        {contact.lastMessage && contact.lastMessage.message
                          ? contact.lastMessage.message
                          : "No messages yet"}
                      </p>
                      {!isSelected && unreadCount > 0 && (
                        <span className="ml-2 bg-orange-500 text-white rounded-full px-2 py-0.5 text-xs font-semibold">
                          {unreadCount}
                        </span>
                      )}
                      {/* DEBUG: Show both counts */}
                      {!isSelected && (
                        <span className="ml-2 text-[10px] text-gray-400">
                          [B:{contact.buyerUnreadCount}|S:{contact.sellerUnreadCount}]
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

interface ChatAreaProps {
  selectedContact: any;
  userType: "seller" | "buyer";
  userId: string; // for socket join (buyerId)
  currentUserId: string; // actual logged-in user (senderId)
  productId: string;
  buyerId: string;
  sellerId: string;
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  onSidebarContactUpdate: (roomId: string, updater: (prev: any) => any) => void;
}

const ChatArea = ({
  selectedContact,
  userType,
  userId, // for socket join (buyerId)
  currentUserId, // actual logged-in user (senderId)
  productId,
  buyerId,
  sellerId,
  messages,
  setMessages,
  onSidebarContactUpdate,
}: ChatAreaProps) => {
  const [messageText, setMessageText] = useState('');
  const [chatService] = useState(() => ChatService.getInstance());
  const [isClosingDeal, setIsClosingDeal] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState<number | null>(null);

  useEffect(() => {
    if (!productId || !sellerId || !userType || !buyerId) {
      console.error('Missing required parameters:', { userId, productId, sellerId, userType, buyerId });
      return;
    }
    
    // userId is buyerId for joinRoom
    chatService.joinRoom(buyerId, productId, sellerId, userType);

    // Emit get_chat_history after joining room
    if (chatService.socket) {
      chatService.socket.emit("get_chat_history", {
        buyerId,
        productId,
        sellerId,
        
      });

      const handleChatHistory = (data: any) => {
        if (data && Array.isArray(data.messages)) {
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

          // Update sidebar contact info
          if (typeof onSidebarContactUpdate === "function" && selectedContact) {
            onSidebarContactUpdate(selectedContact.roomId, (prev: any) => ({
              ...prev,
              lastMessage: data.lastMessage,
              buyerUnreadCount: data.buyerUnreadCount,
              sellerUnreadCount: data.sellerUnreadCount,
            }));
          }
        }
      };

      chatService.socket.on("chat_history", handleChatHistory);

      return () => {
        if (chatService.socket) {
          chatService.socket.off("chat_history", handleChatHistory);
        }
      };
    }
  // Only re-run when the actual IDs or selectedContact change
  }, [userId, productId, sellerId, userType, buyerId, selectedContact]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // senderId should be buyerId if userType is buyer, sellerId if userType is seller
      const senderId = userType === "buyer" ? buyerId : sellerId;

      chatService.sendMessage(
        productId,
        sellerId,
        messageText,
        senderId,
        userType,
        buyerId
      );
      
      const newMessage = {
        id: Date.now().toString(),
        text: messageText,
        senderId: senderId,
        senderType: userType,
        time: new Date().toLocaleTimeString(),
      };
      
      setMessages((prev) => [...prev, newMessage]);
      setMessageText('');

      // Update sidebar contact info for this chat immediately
      if (typeof onSidebarContactUpdate === "function" && selectedContact) {
        onSidebarContactUpdate(selectedContact.roomId, (prev: any) => ({
          ...prev,
          lastMessage: {
            message: messageText,
            timestamp: new Date().toISOString(),
            senderId: senderId,
            senderType: userType,
          },
          // Reset unread count for the current user
          buyerUnreadCount: userType === "buyer" ? 0 : prev.buyerUnreadCount,
          sellerUnreadCount: userType === "seller" ? 0 : prev.sellerUnreadCount,
        }));
      }

      setTimeout(() => {
        const chatContainer = document.querySelector('.chat-messages-container');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    }
  };

  const handleCloseDeal = async () => {
    // Always use IDs from selectedContact for robustness
    const sc = selectedContact;
    if (!sc?.productId || !sc?.sellerId || !sc?.buyerId) {
      toast.error("Missing required parameters to close deal.");
      return;
    }
    let amount = budgetAmount;
    if (amount === null || isNaN(amount)) {
      const input = window.prompt("Enter the agreed budget amount to close the deal:");
      if (!input) return;
      amount = Number(input);
      if (isNaN(amount)) {
        toast.error("Invalid budget amount.");
        return;
      }
      setBudgetAmount(amount);
    }
    setIsClosingDeal(true);
    try {
      await requirementService.closeDeal({
        productId: sc.productId,
        sellerId: sc.sellerId,
        buyerId: sc.buyerId,
        finalBudget: amount!,
      });
      toast.success("Deal closed successfully!");
    } catch (err: any) {
      toast.error("Failed to close deal.");
    } finally {
      setIsClosingDeal(false);
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

  // Prevent self-chat: if currentUserId is both buyer and seller, or buyerId === sellerId
  const isSelfChat = (currentUserId === buyerId && currentUserId === sellerId) || buyerId === sellerId;

  return (
    <div className="flex-1 flex flex-col border-1 rounded-md overflow-hidden">
      {/* Chat Header */}
      <div className="border-b border-chat-border bg-background">
        <div className='bg-gray-100 flex justify-between items-center'>
          <p></p>
        </div>
        <div className="flex justify-between items-center space-x-2 bg-gray-100 p-2">
          <p className="text-sm text-muted-foreground font-semibold">
            {selectedContact.productName || 'Product Discussion'}
          </p>
          <div className="flex items-center justify-end mt-1">
            <List className='w-4 h-4' />
            <Badge variant="secondary" className="text-sm">Active</Badge>
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
              <Button
                variant="outline"
                size="sm"
                className="text-orange-600 hover:text-orange-600 bg-transparent cursor-pointer hover:bg-transparent border-orange-600 w-32 text-sm font-medium"
                onClick={handleCloseDeal}
                disabled={isClosingDeal}
              >
                {isClosingDeal ? "Closing..." : "Close Deal"}
              </Button>
              <LayoutGrid className='w-5 h-5 text-gray-600' />
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 chat-messages-container">
        {isSelfChat ? (
          <div className="text-center text-red-500 font-semibold">
            Cannot send messages to yourself. Buyer and seller must be different users.
          </div>
        ) : (
          messages.map((message) => {
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
                  {message.time || (message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : "")}
                  {" "}• {isMine ? 'You' : message.senderType}
                </span>
              </div>
            );
          })
        )}
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
              disabled={isSelfChat}
            />
          </div>
          <div className={`p-1 rounded-full border-2 border-gray-500 ${isSelfChat ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}`}>
            <Paperclip className='w-4 h-4 text-gray-700'/>
          </div>
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="cursor-pointer w-12"
            disabled={isSelfChat}
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

  // Get IDs from location.state or localStorage
  let productId = location.state?.productId;
  let buyerId = location.state?.buyerId;
  let sellerId = location.state?.sellerId;

  if (!productId || !buyerId || !sellerId) {
    try {
      const stored = localStorage.getItem('chatIds');
      if (stored) {
        const ids = JSON.parse(stored);
        productId = productId || ids.productId;
        buyerId = buyerId || ids.buyerId;
        sellerId = sellerId || ids.sellerId;
      }
    } catch (e) {
      console.error('Error parsing chatIds from localStorage:', e);
    }
  }

  const currentUserId = user?._id;
  const [recentChats, setRecentChats] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);

  // Determine userType and userId for socket based on currentUserId
  let userType: 'buyer' | 'seller' = 'buyer';
  let socketUserId = buyerId; // Always use buyerId for socket userId

  if (currentUserId === sellerId) {
    userType = 'seller';
  } else if (currentUserId === buyerId) {
    userType = 'buyer';
  }

  // Step 1: Fetch recent chats on mount
  useEffect(() => {
    if (!currentUserId) return;

    const chatService = ChatService.getInstance();
    chatService.connect();
    
    setIsLoadingChats(true);
    chatService.getRecentChats(currentUserId, (data) => {
      console.log("Recent chats received:", data);
      
      if (data && Array.isArray(data.chats)) {
        // Transform recent chats to match contact format
        const transformedChats = data.chats.map((chat: any) => {
          // Extract product ID from chat object
          const chatProductId = chat.product?._id || chat.productId;
          
          // Extract seller and buyer IDs
          const chatSellerId = chat.seller?._id || chat.sellerId;
          const chatBuyerId = chat.buyer?._id || chat.buyerId;
          
          // Determine the opposite party's name based on userType
          // If current user is buyer, show seller's name; if seller, show buyer's name
          let displayName = 'Unknown';
          let displayAvatar = '';
          
          if (chat.userType === 'buyer') {
            // Current user is buyer, show seller info
            displayName = (chat.seller?.firstName && chat.seller?.lastName)
              ? `${chat.seller.firstName} ${chat.seller.lastName}`
              : chat.seller?.firstName || chat.seller?.lastName || 'Seller';
            displayAvatar = chat.seller?.profileImage || '';
          } else if (chat.userType === 'seller') {
            // Current user is seller, show buyer info
            displayName = (chat.buyer?.firstName && chat.buyer?.lastName)
              ? `${chat.buyer.firstName} ${chat.buyer.lastName}`
              : chat.buyer?.firstName || chat.buyer?.lastName || 'Buyer';
            displayAvatar = chat.buyer?.profileImage || '';
          }
          
          return {
            roomId: chat.roomId,
            productId: chatProductId,
            sellerId: chatSellerId,
            buyerId: chatBuyerId,
            name: displayName,
            avatar: displayAvatar,
            isOnline: true,
            lastMessage: chat.lastMessage,
            buyerUnreadCount: chat.buyerUnreadCount || 0,
            sellerUnreadCount: chat.sellerUnreadCount || 0,
            productName: chat.product?.title || 'Product Discussion',
            userType: chat.userType, // Keep track of userType for this chat
          };
        });
        
        console.log("Transformed chats:", transformedChats);
        setRecentChats(transformedChats);
        
        // Step 2: Check if URL params match any recent chat
        if (productId && sellerId && buyerId) {
          const matchingChat = transformedChats.find(
            (chat: any) =>
              chat.productId === productId &&
              chat.sellerId === sellerId &&
              chat.buyerId === buyerId
          );
          
          if (matchingChat) {
            // Found existing chat - select it
            console.log("Found matching recent chat, loading it");
            setSelectedContact(matchingChat);
          } else {
            // No matching recent chat - create new contact for this conversation
            console.log("No matching recent chat, creating new conversation");
            // Ensure correct assignment of buyerId and sellerId based on userType
            let finalBuyerId = buyerId;
            let finalSellerId = sellerId;
            if (userType === 'buyer') {
              finalBuyerId = currentUserId;
            } else if (userType === 'seller') {
              finalSellerId = currentUserId;
            }
            // Prevent both IDs from being the same
            if (finalBuyerId === finalSellerId) {
              console.error("Cannot create chat: buyerId and sellerId are the same!", { finalBuyerId, finalSellerId });
              return;
            }
            const newContact = {
              roomId: `product_${productId}_buyer_${buyerId}_seller_${sellerId}`,
              productId,
              sellerId: sellerId,
              buyerId: buyerId,
              name: userType === 'buyer' ? 'Seller' : 'Buyer',
              avatar: '',
              isOnline: true,
              lastMessage: null,
              buyerUnreadCount: 0,
              sellerUnreadCount: 0,
              productName: 'Product Discussion',
              userType: userType,
            };
            
            // Add to recent chats only if it's not already there
            setRecentChats((prev) => {
              const exists = prev.some(chat => chat.roomId === newContact.roomId);
              if (exists) return prev;
              return [newContact, ...prev];
            });
            setSelectedContact(newContact);
          }
        } else if (transformedChats.length > 0) {
          // No URL params but we have chats - select first one
          setSelectedContact(transformedChats[0]);
        }
      } else {
        // No recent chats
        if (productId && sellerId && buyerId) {
          // Still allow user to start new chat
          console.log("No recent chats, but IDs provided - creating new conversation");
          // Ensure correct assignment of buyerId and sellerId based on userType
          let finalBuyerId = buyerId;
          let finalSellerId = sellerId;
          if (userType === 'buyer') {
            finalBuyerId = currentUserId;
          } else if (userType === 'seller') {
            finalSellerId = currentUserId;
          }
          // Prevent both IDs from being the same
          if (finalBuyerId === finalSellerId) {
            console.error("Cannot create chat: buyerId and sellerId are the same!", { finalBuyerId, finalSellerId });
            return;
          }
          const newContact = {
            roomId: `product_${productId}_buyer_${buyerId}_seller_${sellerId}`,
            productId,
            sellerId: sellerId,
            buyerId: buyerId,
            name: userType === 'buyer' ? 'Seller' : 'Buyer',
            avatar: '',
            isOnline: true,
            lastMessage: null,
            buyerUnreadCount: 0,
            sellerUnreadCount: 0,
            productName: 'Product Discussion',
            userType: userType,
          };
          
          setRecentChats([newContact]);
          setSelectedContact(newContact);
        }
      }
      
      setIsLoadingChats(false);
    });
  }, [currentUserId, productId, sellerId, buyerId, userType]);

  // Step 3: Set up message listeners
  useEffect(() => {
    if (!currentUserId) return;

    const chatService = ChatService.getInstance();
    chatService.connect();

    const handleReceiveMessage = (data: any) => {
      console.log('Received message:', data);

      const roomIdFromData = data.roomId || `product_${data.productId}_buyer_${data.buyerId}_seller_${data.sellerId}`;
      setRecentChats((prev) =>
        prev.map((chat) => {
          if (chat.roomId === roomIdFromData) {
            // Always update last message
            let lastMessage = data.lastMessage || {
              message: data.message,
              timestamp: data.timestamp,
              senderId: data.senderId,
              senderType: data.senderType
            };

            // If backend provides unread counts, use them; otherwise, handle in frontend
            let buyerUnreadCount = typeof data.buyerUnreadCount === "number"
              ? data.buyerUnreadCount
              : chat.buyerUnreadCount;
            let sellerUnreadCount = typeof data.sellerUnreadCount === "number"
              ? data.sellerUnreadCount
              : chat.sellerUnreadCount;

            // If the message is for the selected chat, reset unread count for the current user
            if (selectedContact && roomIdFromData === selectedContact.roomId) {
              if (currentUserId === chat.buyerId) buyerUnreadCount = 0;
              if (currentUserId === chat.sellerId) sellerUnreadCount = 0;
            } else {
              // If the message is for another chat, increment unread count for the recipient (if backend doesn't provide)
              if (typeof data.buyerUnreadCount !== "number" && data.senderType === "seller") {
                // Only increment for the recipient (buyer)
                if (currentUserId !== chat.buyerId) {
                  buyerUnreadCount = (chat.buyerUnreadCount || 0) + 1;
                }
              }
              if (typeof data.sellerUnreadCount !== "number" && data.senderType === "buyer") {
                // Only increment for the recipient (seller)
                if (currentUserId !== chat.sellerId) {
                  sellerUnreadCount = (chat.sellerUnreadCount || 0) + 1;
                }
              }
            }

            return {
              ...chat,
              lastMessage,
              buyerUnreadCount,
              sellerUnreadCount,
            };
          }
          return chat;
        })
      );

      // Only add to messages if the message belongs to the currently selected chat
      if (
        selectedContact &&
        roomIdFromData === selectedContact.roomId
      ) {
        setMessages((prev) => {
          // Prevent duplicate messages by id and text+timestamp
          const exists = prev.some(
            (msg) =>
              (msg.id && data.id && msg.id === data.id) ||
              (msg.text === data.message &&
                msg.senderId === data.senderId &&
                msg.time === (data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : ""))
          );
          if (exists) return prev;
          return [
            ...prev,
            {
              id: data.id || Date.now().toString() + Math.random(),
              text: data.message,
              senderId: data.senderId,
              senderType: data.senderType,
              time: data.timestamp
                ? new Date(data.timestamp).toLocaleTimeString()
                : new Date().toLocaleTimeString(),
            },
          ];
        });
      }
    };

    const handleLastMessageUpdate = (data: any) => {
      if (data && data.lastMessage) {
        const roomIdFromData = data.roomId || `product_${data.productId}_buyer_${data.buyerId}_seller_${data.sellerId}`;
        setRecentChats((prev) =>
          prev.map((chat) =>
            chat.roomId === roomIdFromData
              ? { ...chat, lastMessage: data.lastMessage }
              : chat
          )
        );
      }
    };

    if (chatService.socket) {
      chatService.socket.on("receive_message", handleReceiveMessage);
      chatService.socket.on("chat_last_message_update", handleLastMessageUpdate);
    }

    return () => {
      if (chatService.socket) {
        chatService.socket.off("receive_message", handleReceiveMessage);
        chatService.socket.off("chat_last_message_update", handleLastMessageUpdate);
      }
    };
  }, [currentUserId, selectedContact]);

  // Clear chatIds from localStorage when leaving
  useEffect(() => {
    // Handler to clear chatIds
    const clearChatIds = () => {
      localStorage.removeItem('chatIds');
    };
  
    // Remove on unmount
    return () => {
      clearChatIds();
    };
  }, []);
  
  // Also clear chatIds on page unload or tab close
  useEffect(() => {
    const clearChatIds = () => {
      localStorage.removeItem('chatIds');
    };
  
    window.addEventListener('beforeunload', clearChatIds);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        clearChatIds();
      }
    });
  
    return () => {
      window.removeEventListener('beforeunload', clearChatIds);
      document.removeEventListener('visibilitychange', clearChatIds);
    };
  }, []);

  const handleSelectContact = (contact: any) => {
    setSelectedContact(contact);
    setMessages([]); // Clear messages when switching contacts

    // Reset unread count for the current user in the selected chat
    setRecentChats((prev) =>
      prev.map((chat) =>
        chat.roomId === contact.roomId
          ? {
              ...chat,
              buyerUnreadCount: currentUserId === chat.buyerId ? 0 : chat.buyerUnreadCount,
              sellerUnreadCount: currentUserId === chat.sellerId ? 0 : chat.sellerUnreadCount,
            }
          : chat
      )
    );
  };

  const handleSidebarContactUpdate = (roomId: string, updater: (prev: any) => any) => {
    setRecentChats((prev) =>
      prev.map((chat) => (chat.roomId === roomId ? updater(chat) : chat))
    );
  };

  // Error handling
  if (!currentUserId) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="h-screen flex items-center justify-center">
          <div className="text-center text-red-500 text-lg font-semibold">
            Error: Please log in to access chat
          </div>
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
            {isLoadingChats ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading chats...</p>
              </div>
            ) : (
              <ContactsList
                onSelectContact={handleSelectContact}
                contacts={recentChats}
                selectedContactId={selectedContact?.roomId || null}
                userType={userType}
                user={user}
              />
            )}
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
                        handleSelectContact(contact);
                        setIsMobileMenuOpen(false);
                      }}
                      contacts={recentChats}
                      selectedContactId={selectedContact?.roomId || null}
                      userType={userType}
                      user={user}
                    />
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Chat Area */}
            {selectedContact ? (
              <ChatArea
                selectedContact={selectedContact}
                userType={userType}
                userId={socketUserId}
                currentUserId={currentUserId}
                productId={selectedContact.productId}
                buyerId={selectedContact.buyerId}
                sellerId={selectedContact.sellerId}
                messages={messages}
                setMessages={setMessages}
                onSidebarContactUpdate={handleSidebarContactUpdate}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-background">
                <div className="text-center text-muted-foreground">
                  <h3 className="text-lg font-medium mb-2">
                    {isLoadingChats ? 'Loading...' : 'No conversation selected'}
                  </h3>
                  <p className="text-sm">
                    {recentChats.length === 0
                      ? 'No chats available'
                      : 'Choose a contact from the sidebar to start messaging'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;