import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../Components/ui/breadcrumb";
import { Outlet } from "react-router-dom";
import { SquarePen } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "../../Components/ui/avatar";
import { NavLink } from 'react-router-dom';




const tags = [
  {
    title: 'Profile',
    value: 'profile'
  },
  {
    title: "Cart",
    value: 'cart'
  },
  {
    title: "Your Biding",
    value: 'your_biding'
  }, {
    title: "Requirements",
    value: 'requirements'
  }, {
    title: "Your Deal",
    value: 'your_deal'
  },
  {
    title: 'Notifications',
    value: 'notifications'
  }
]

const Profile = () => {
  const getRoutePath = (value: string) => {
    switch (value) {
      case 'profile':
        return '/account';
      case 'your_biding':
        return '/account/bid';
      case 'requirements':
        return '/account/requirements';
      case 'your_deal':
        return '/account/deal';
      case 'notifications':
        return '/account/notification';
      case 'cart':
        return '/account/cart';
      default:
        return '/account';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 space-y-6 px-4">
      {/* Breadcrumb */}
      <Breadcrumb className="hidden sm:block">
        <BreadcrumbList>
          <BreadcrumbItem className="flex items-center gap-2 cursor-pointer">
            <BreadcrumbPage className="capitalize font-regular text-gray-500">Home</BreadcrumbPage>
            <BreadcrumbSeparator />
            <BreadcrumbPage className="capitalize font-regular text-orange-600">Account</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-8">
        <div className="grid gap-8 md:grid-cols-[250px_1fr]">
          {/* Sidebar */}
          <div className="hidden md:block space-y-2 bg-gray-50 p-4 rounded-md  sticky top-4  self-start">
            <div className='flex justify-center items-center mt-2 mb-5 relative'>
              <div className='relative'>
                <Avatar className='w-28 h-28 ring-orange-200 ring-2'>
                  <AvatarImage src="https://avatars.githubusercontent.com/u/108955538?v=4" />
                  <AvatarFallback>SS</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-2 cursor-pointer right-0 bg-white p-1 rounded-full shadow-md hover:bg-gray-100">
                  <SquarePen className='w-4 h-4' />
                </button>
              </div>
            </div>

            <div className="grid gap-1 text-gray-600">
              {tags.map((tag) => {
                const routePath = getRoutePath(tag.value);
                return (
                  <NavLink
                    key={tag.title}
                    to={routePath}
                    end={tag.value === 'profile'}
                    className={({ isActive }) =>
                      `text-left px-3 py-2 cursor-pointer text-sm rounded-md hover:bg-muted ${isActive ? 'bg-muted text-gray-600 font-semibold' : ''
                      }`
                    }
                  >
                    {tag.title}
                  </NavLink>
                );
              })}
            </div>

          </div>

          {/* Main Content */}
          <div className="space-y-10">
            <section id="account" className="min-h-screen">
              <Outlet />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
