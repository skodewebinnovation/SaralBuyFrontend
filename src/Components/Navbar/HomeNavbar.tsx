import { Bell, Book, LocateFixed, MapPin, Menu, MessageSquareText, SearchIcon, ShoppingCart, Sunset, Trees, User, Zap } from "lucide-react";

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

//Logo and Icons
import saralBuyLogo from "../../image/Logo/saralBuyLogo.png";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../ui/input";

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




const HomeNavbar = () => {
  const navigate = useNavigate()
  const handleRaiseAReuirement = () => {
    navigate("/requirement");
  };
    const handleProfileClick = () => {
    navigate("/profile");
  };
  return (
    <section className="py-4 mb-2">
      <div className="px-4 mx-auto">
        {/* Desktop Menu */}
        <nav className="hidden justify-evenly lg:flex items-center gap-5">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to={'/'} className="flex items-center gap-2">
           
              <img
                src={saralBuyLogo}
                className="max-h-16 dark:invert"
                alt={'company logo'}
              />
            </Link>
            <div className="flex items-center relative ">
              <MapPin className="w-4 h-4  text-orange-500 rounded-full  absolute top-1/2 left-3  -translate-1/2"></MapPin>
              <Input placeholder="Location..." className="border-b-[1.5px] pl-6 text-sm border-x-0 border-t-0 shadow-none rounded-none border-b-black focus-visible:ring-0 focus:outline-0 focus:shadow-none "/>
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
        type="text"
        placeholder="Search..."
        className="pl-8 rounded-full focus-visible:ring-0 border border-gray-300 shadow-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
      />
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 pointer-events-none opacity-50" />
    </div>
          <div className="flex gap-4 items-center">
            <Button  variant="secondary" size="icon" className="cursor-pointer"> 
              <MessageSquareText className="w-5 h-5"/>
            </Button>
              <Button  variant="secondary" size="icon" className="cursor-pointer">
              <Bell className="w-5 h-5"/>
            </Button>
             <Button  variant="secondary" size="icon" className="cursor-pointer">
              <ShoppingCart className="w-5 h-5"/>
            </Button>
             <Button onClick={handleRaiseAReuirement}  variant="ghost" size="lg" className="border  shadow-orange-500 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white cursor-pointer">
            Raise a Requirement
            </Button>
               <Button onClick={handleProfileClick}  variant="secondary" size="icon" className="cursor-pointer">
              <User className="w-5 h-5"/>
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
                    <Button onClick={handleRaiseAReuirement}  variant="ghost" size="lg" className="border  shadow-orange-500 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white cursor-pointer">
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
