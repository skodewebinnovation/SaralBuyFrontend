import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Camera, Mail, MapPin } from "lucide-react"

export function ProfileHeader() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
              <AvatarFallback>SS</AvatarFallback>
            </Avatar>
            <Button size="icon" variant="outline" className="absolute bottom-1 cursor-pointer -right-1 h-8 w-8 rounded-full">
              <Camera className="h-4 w-4" />
              <span className="sr-only">Change avatar</span>
            </Button>
          </div>
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold text-gray-600">Shubham Sharma</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>shubham@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Alwar</span>
            </div>
          </div>
          <div className="md:ml-auto">
            <Button className="cursor-pointer">Edit Profile</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

