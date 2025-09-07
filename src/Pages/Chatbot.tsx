import React, { useState } from 'react'
import { Search, Send, Menu, X, Circle } from 'lucide-react'
import { Input } from '../Components/ui/input'
import { Button } from '../Components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../Components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '../Components/ui/sheet'
import { Badge } from '../Components/ui/badge'
import { fallBackName } from '@/helper/fallBackName'

// Mock data for contacts
const contacts = [
  {
    id: 1,
    name: 'Eten Hunt',
    message: 'Thank you very much, I\'m glad...',
    time: '22 m Ago',
    avatar: 'https://github.com/shubhamsharma20007.png',
    isOnline: true
  },
  {
    id: 2,
    name: 'Jakob Saris',
    message: 'You - Sure! let me tell you about w...',
    time: '22 m Ago',
    avatar: 'https://github.com/shubhamsharma20007.png',
    isOnline: false
  },
  {
    id: 3,
    name: 'Jeremy Zucker',
    message: 'You - Sure! let me teach you about ...',
    time: '4 m Ago',
    avatar: 'https://github.com/shubhamsharma20007.png',
    isOnline: false
  },
  {
    id: 4,
    name: 'Nadia Lauren',
    message: 'Is there anything I can help? Just ...',
    time: '6 m Ago',
    avatar: 'https://github.com/shubhamsharma20007.png',
    isOnline: false
  },
  {
    id: 5,
    name: 'Jeremy Zucker',
    message: 'You - Sure! let me teach you about ...',
    time: '8 m Ago',
    avatar: 'https://github.com/shubhamsharma20007.png',
    isOnline: false
  }
]

const messages = [
  { id: 1, text: 'Hey!', sender: 'other', time: 'Today 11:51' },
  { id: 2, text: 'I had few offers for your product requirement', sender: 'other', time: 'Today 11:53' },
  { id: 3, text: 'Yes Please I be glad to ans you query', sender: 'user', time: 'Today 11:56' }
]

const ContactsList = ({ onSelectContact }: { onSelectContact: (contact: any) => void }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col bg-chat-sidebar border-r-0 border-chat-border">
      
      {/* Fixed Search Input Header */}
      <div className="p-4  border-b border-chat-border">
        <h2 className="text-lg font-semibold mb-2 text-gray-600 ">Messaging</h2>
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

      {/* Scrollable Contact List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.map((contact) => (
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
                  <span className="text-xs text-muted-foreground ml-2">{contact.time}</span>
                </div>
                <p className="text-[13px] text-muted-foreground font-medium truncate mt-1">{contact.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


const ChatArea = ({ selectedContact }: { selectedContact: any }) => {
  const [messageText, setMessageText] = useState('')

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle message sending logic here
      setMessageText('')
    }
  }

  if (!selectedContact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
          <p className="text-sm">Choose a contact from the sidebar to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col  border-1 rounded-md overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-chat-border bg-background">
        <div className='bg-gray-100 flex justify-between items-center '>
            <p></p>

        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {selectedContact.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-chat-online border-2 border-white rounded-full"></div>
              )}
            </div>
            <div>
              <h3 className="font-medium text-foreground">{selectedContact.name}</h3>
              <div className="flex items-center space-x-2">
                <Circle className="h-2 w-2 fill-chat-online text-chat-online" />
                <span className="text-sm text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Looking for 5 Industrial Drill Machines</p>
              <div className="flex items-center justify-end space-x-2 mt-1">
                <Badge variant="secondary" className="text-xs">5 units</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-orange-600 border-orange-600 hover:bg-orange-50">
              Close Deal
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-chat-bubble-sent text-white'
                  : 'bg-chat-bubble-received text-foreground'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        {messages.length > 0 && (
          <div className="flex justify-end">
            <span className="text-xs text-muted-foreground">
              {messages[messages.length - 1].time}
            </span>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-chat-border bg-background">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              placeholder="Type your message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="pr-12 bg-chat-message-bg border-chat-border"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
              😊
            </button>
          </div>
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="bg-chat-bubble-sent hover:bg-chat-bubble-sent/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

const Chatbot = () => {
  const [selectedContact, setSelectedContact] = useState(contacts[0])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="h-screen   border-chat-border rounded-lg overflow-hidden  my-5">
        <div className="flex h-full gap-2">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-80 bg-gray-100 border-1 rounded-md">
            <ContactsList onSelectContact={setSelectedContact} />
          </div>

          {/* Mobile Menu Button and Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Mobile Header */}
            <div className="md:hidden sm:p-4 py-2  border-chat-border bg-chat-sidebar">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Messages</h2>
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-80">
                    <ContactsList onSelectContact={(contact) => {
                      setSelectedContact(contact)
                      setIsMobileMenuOpen(false)
                    }} />
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Chat Area */}
            <ChatArea selectedContact={selectedContact} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatbot