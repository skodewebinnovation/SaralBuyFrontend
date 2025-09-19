import { Bell, Book, MapPin, Menu, MessageSquareText, SearchIcon, ShoppingCart, User, UserRound, Zap } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../Components/ui/accordion";
import { Button } from "../../Components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../Components/ui/sheet";
import { useDebounce } from 'use-debounce';
import { Skeleton } from "../../Components/ui/skeleton"
//Logo and Icons
import saralBuyLogo from "../../image/Logo/saralBuyLogo.png";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { useFetch } from "@/helper/use-fetch";
import ProductService from "@/services/product.service";
import { useEffect, useRef, useState } from "react";
import TooltipComp from "@/utils/TooltipComp";
import { getLocation } from "@/helper/locationAPI";
import { getUserProfile } from "@/zustand/userProfile";
import userService from "@/services/user.service";
import ChatService from "@/services/chat.service";
interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}


const menu: MenuItem[] = [
  {
    title: "Cart",
    url: "/",
    icon: <ShoppingCart className="w-4 h-4 text-orange-500" />,
  },
  {
    title: "Categories",
    url: "#",
    icon: <Book className="w-4 h-4 text-blue-500" />,
    items: [
      {
        title: "Electronics",
        url: "/categories/electronics",
        description: "Mobiles, laptops, accessories, and more",
        icon: <Zap className="w-4 h-4" />,
      },
      {
        title: "Fashion",
        url: "/categories/fashion",
        description: "Clothing, shoes, and accessories",
        icon: <User className="w-4 h-4" />,
      },
      {
        title: "Books",
        url: "/categories/books",
        description: "Explore a wide variety of books",
        icon: <Book className="w-4 h-4" />,
      },
    ],
  },
];



type ProductsType = { title: string, image: string, _id: string, description: string }




const HomeNavbar = () => {
  const navigate = useNavigate()

  const { user } = getUserProfile();
  // Remove notificationCount, use notifications.length for badge
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const { fn, data } = useFetch(ProductService.getSeachProduct)
  const [text, setText] = useState('');
  const [products, setProducts] = useState<ProductsType[]>([]);
  const [value, { isPending, flush }] = useDebounce(text, 1000);
  const [currenLocation, setCurrentLocation] = useState('')
  const [showDropdown, setShowDropdown] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);
  const { fn: updateProfile } = useFetch(userService.updateProfile)
  const handleRaiseAReuirement = () => {
    navigate("/requirement");
  };
  const handleProfileClick = () => {
    navigate("/account");
  };
  const handleInputValue = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setText(value)
  }

  // --- Chat notification logic ---
  useEffect(() => {
    const chatService = ChatService.getInstance();
    chatService.connect();
    if (user?._id) {
      chatService.identify(user._id);
    }
    // Listen for new message notifications
    chatService.onNewMessageNotification((data) => {
      setNotifications((prev) => {
        // Uniqueness by roomId + lastMessage.timestamp (or message)
        const isDuplicate = prev.some(
          (n) =>
            n.roomId === data.roomId &&
            n.lastMessage?.timestamp === data.lastMessage?.timestamp &&
            n.lastMessage?.message === data.lastMessage?.message
        );
        if (isDuplicate) return prev;
        return [
          {
            roomId: data.roomId,
            lastMessage: data.lastMessage,
          },
          ...prev,
        ];
      });
    });
  }, [user?._id]);

  // Show/hide notification dropdown (do NOT clear notifications here)
  const handleBellClick = () => {
    setShowNotifDropdown((prev) => !prev);
    // Do not clear notifications here; let user see them in dropdown
  };

  // Remove notification on click and optionally navigate to chat
  const handleNotificationClick = (roomId: string) => {
    setNotifications((prev) => prev.filter((n) => n.roomId !== roomId));
    setShowNotifDropdown(false);
    // Example: navigate(`/chat?roomId=${roomId}`);
  };

  async function getGeoLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const location = await getLocation(longitude, latitude)
          setCurrentLocation(location)
          await updateProfile({ currentLocation: location })


        },
        (err) => console.log(err),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }



  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key.toLowerCase();
    if (key === 'enter' && value.trim() !== '') {
      setShowDropdown(false);
      setProducts([]);
      setText('');
      flush();
      navigate(`/product-listing?title=${encodeURIComponent(value)}&key=enter`);
    }
  }


  useEffect(() => {
    if (value.trim().length > 1) {
      fn(value);
      setShowDropdown(true);
    } else {
      setProducts([]);
      setShowDropdown(false)
    }
  }, [value]);

  useEffect(() => {
    setProducts(data)
  }, [data])
  useEffect(() => {
    if ((!user?.currenLocation || user?.currenLocation === '') && user) {
      getGeoLocation();
    } else {
      setCurrentLocation(user?.currenLocation)
    }
  }, [user])


  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (showDropdown && productsRef.current) {
        if (!productsRef.current.contains(event.target as Node)) {
          setShowDropdown(false);
          setText('');
          setProducts([]);
        }
      }
    }

    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [showDropdown, productsRef]);
  return (
    <section className="mb-2 relative z-9">
      <div className="mx-auto bg-gray-50 p-3 sticky top-0">
        {/* Desktop Menu */}
        <nav className="hidden justify-evenly lg:flex items-center gap-5 ">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to={'/'} className="flex items-center gap-2">

              <img
                src={saralBuyLogo}
                className="max-h-20 mix-blend-darken  dark:invert"
                alt={'company logo'}
              />
            </Link>
            <div className="flex items-center relative ">
              <MapPin className="w-4 h-4  text-orange-500 rounded-full  absolute top-1/2 left-3  -translate-1/2"></MapPin>
              <Input readOnly placeholder="Location..." className="border-b-[1.5px] bg-transparent pl-6 text-sm border-x-0 border-t-0 shadow-none rounded-none  border-b-black focus-visible:ring-0 focus:outline-0 focus:shadow-none " defaultValue={currenLocation} />
              {/* <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu> */}
            </div>
          </div>
          {/* search */}
          <div className="relative w-1/2">
            <Input
              type="search"
              onInput={handleInputValue}
              value={text}
              onKeyPress={handleKeyPress}
              placeholder="Looking For..."
              className="pl-8 rounded-full focus-visible:ring-0 border border-gray-300 shadow-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 pointer-events-none opacity-50" />

            {/* Search Dropdown */}
            {showDropdown && (
              <div
                ref={productsRef}
                className="absolute top-full mt-2 w-full z-[99] max-h-[300px] overflow-y-auto bg-white rounded-lg shadow-lg p-2 space-y-2">
                {isPending() ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-md w-full" />
                  ))
                ) : products?.length > 0 ? (
                  products.map((p: ProductsType) => (
                    <Card
                      key={p._id}
                      className="p-2 rounded-xl shadow-md bg-white cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        setShowDropdown(false);
                        setProducts([]);
                        setText('');
                        flush();
                        navigate(`/product-listing?_id=${encodeURIComponent(p._id)}&title=${encodeURIComponent(p.title)}`);
                      }}

                    >
                      <div className="flex gap-4">
                        <img
                          className="w-14 h-14 object-contain rounded-lg"
                          src={p.image || '/no-image.webp'}
                          alt={p.title}
                        />
                        <div className="flex-1">
                          <p className="text-md font-semibold text-orange-600 ">{p.title}</p>
                          <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 p-2 text-center">No results found.</p>
                )}
              </div>
            )}
          </div>


          <div className="flex gap-4 items-center">
            <TooltipComp key={'messaging'} hoverChildren={<Button variant="secondary" size="icon" className="cursor-pointer">
              <MessageSquareText className="w-5 h-5" />
            </Button>} contentChildren={<p >Messaging</p>} />

            <TooltipComp key={'notification'} hoverChildren={
              <div className="relative">
                <Button
                  variant="secondary"
                  size="icon"
                  className="cursor-pointer relative"
                  onClick={handleBellClick}
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs font-bold">
                      {notifications.length}
                    </span>
                  )}
                </Button>
                {/* Notification Dropdown */}
                {showNotifDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-3 border-b font-semibold text-gray-700">New Chats</div>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-gray-500 text-sm">No new chat messages</div>
                    ) : (
                      <ul>
                        {notifications.map((notif, idx) => (
                          <li
                            key={idx}
                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                            onClick={() => handleNotificationClick(notif.roomId)}
                          >
                            <div className="font-medium text-gray-800">
                              {notif.lastMessage?.senderType === "buyer"
                                ? "Buyer"
                                : notif.lastMessage?.senderType === "seller"
                                ? "Seller"
                                : "User"}
                            </div>
                            <div className="text-gray-600 text-sm">
                              {notif.lastMessage?.message}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {notif.lastMessage?.timestamp
                                ? new Date(notif.lastMessage.timestamp).toLocaleTimeString()
                                : ""}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            } contentChildren={<p >Notifications</p>} />


            <TooltipComp key={'cart'} hoverChildren={
              <Button variant="secondary" size="icon" className="cursor-pointer">
                <ShoppingCart className="w-5 h-5" />
              </Button>
            } contentChildren={<p >Cart</p>} />

            <Button onClick={handleRaiseAReuirement} variant="ghost" size="lg" className="border  shadow-orange-500 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white cursor-pointer">
              Raise a Requirement
            </Button>
            <Button onClick={handleProfileClick} size="icon" className="cursor-pointer">
              <UserRound className="w-5 h-5" />
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src={saralBuyLogo}
                className="max-h-8 dark:invert"
                alt={'company logo'}
              />
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link to="/" className="flex items-center gap-2">
                      <img
                        src={saralBuyLogo}
                        className="max-h-8 dark:invert"
                        alt={'company logo'}
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-1 flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">

                  </div>
                </div>
                <SheetFooter>
                  <Button
                    onClick={handleRaiseAReuirement}
                    variant="ghost"
                    size="lg"
                    className="border shadow-orange-500 border-orange-500 text-orange-500 transition-all ease-in-out duration-300 hover:bg-orange-500 hover:text-white cursor-pointer"
                  >
                    Raise a Requirement
                  </Button>

                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};




const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="hover:bg-muted hover:text-accent-foreground flex select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-muted-foreground text-sm leading-snug">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export default HomeNavbar;
