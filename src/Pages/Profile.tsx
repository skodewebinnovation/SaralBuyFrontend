import { AccountSettings } from '@/Components/Profile/account-setting'
import { ProfileHeader } from '@/Components/Profile/profile-header'
import { Button } from '@/Components/ui/button'
import React from 'react'


const Profile = () => {
  return (
    <div className="w-full max-w-7xl mx-auto py-6 space-y-6 px-4">
      <h1 className="text-3xl font-bold">Profile & Settings</h1>
      <div className="grid gap-8">
        <ProfileHeader />
        <div className="grid gap-8 md:grid-cols-[250px_1fr]">
          <div className="hidden md:block space-y-2">
            <div className="font-medium text-lg">Settings</div>
            <nav className="grid gap-1">
              <a href="#account" className="px-3 py-2 text-sm rounded-md bg-muted">
                Profile 
              </a>
              <a href="#cart" className="px-3 py-2 text-sm rounded-md hover:bg-muted">
                Cart
              </a>
              <a href="#bid" className="px-3 py-2 text-sm rounded-md hover:bg-muted">
                Your Bids
              </a>
              <a href="#appearance" className="px-3 py-2 text-sm rounded-md hover:bg-muted">
                Requirements
              </a>
                  <a href="#appearance" className="px-3 py-2 text-sm rounded-md hover:bg-muted">
                Your Deals
              </a>
                 <a href="#appearance" className="px-3 py-2 text-sm rounded-md hover:bg-muted">
                Notification
              </a>
            </nav>
          </div>
          <div className="space-y-10">
            <section id="account">
              <AccountSettings />
            </section>
   
          </div>
         
        </div>
      </div>
            {/* <ProfileOld/> */}
    </div>
  )
}

export default Profile