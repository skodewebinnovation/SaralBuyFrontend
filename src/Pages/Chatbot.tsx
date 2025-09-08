import React, { useState } from 'react'
import { Search, Send, Menu, X, Circle, List, LayoutGrid, Paperclip } from 'lucide-react'
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
    name: 'Shubham Sharma',
    message: 'Thank you very much, I\'m glad...',
    time: '22 m Ago',
    avatar: 'https://github.com/shubhamsharma20007.png',
    isOnline: true
  },

]

const messages = [
  { id: 1, text: 'Hey!', sender: 'other', time: 'Today 11:51' },
  { id: 2, text: 'I had few offers for your product requirement', sender: 'other', time: 'Today 11:53' },
  { id: 3, text: 'Yes Please I be glad to ans you query', sender: 'user', time: 'Today 11:56' },
    { id: 1, text: 'Hey!', sender: 'other', time: 'Today 11:51' },
  { id: 2, text: 'I had few offers for your product requirement', sender: 'other', time: 'Today 11:53' },
  { id: 3, text: 'Yes Please I be glad to ans you query', sender: 'user', time: 'Today 11:56' },
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
      <div className=" border-b border-chat-border bg-background">
        <div className='bg-gray-100 flex justify-between items-center '>
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
                    <Circle className="h-2 w-2  overflow-hidden bg-green-600 rounded-full border-0 text-transparent" />
                    <span className="text-sm text-muted-foreground">Online</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <Button variant="outline" size="sm" className="text-orange-600 hover:text-orange-600 bg-transparent cursor-pointer hover:bg-transparent border-orange-600 w-32 text-sm font-medium ">
                Close Deal
              </Button>
              <LayoutGrid className='w-5 h-5 text-gray-600' />
            </div>
          </div>
        </div>

      </div>

      {/* Messages Area */}
      <div className="flex-1  overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'
              }`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 ${message.sender === 'user'
                  ? 'bg-gray-500 text-white rounded-tl-lg rounded-bl-lg rounded-br-lg'
                  : 'bg-gray-600 text-white rounded-tr-lg rounded-bl-lg rounded-br-lg'
                }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
            <span className="text-xs text-muted-foreground mt-1">{message.time}</span>
          </div>
        ))}
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
              className="p-5 bg-gray-100 rounded-full text-sm placeholder:text-sm placeholder:font-medium tracking-wide focus-visible:ring-0 border-0 "
            />
          </div>
          <div className='p-1 rounded-full border-2 border-gray-500 cursor-pointer hover:bg-gray-100' >
            <Paperclip className='w-4 h-4 text-gray-700'/>
          </div>
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="cursor-pointer"
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