import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Separator } from "../ui/separator"
import { Upload } from "lucide-react"

export function AccountSettings() {
  return (
    <div className="space-y-6">
      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" placeholder="Enter first name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" placeholder="Enter last name" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex items-center gap-2">
                <Input id="email" type="email" placeholder="Enter email" />
                <Button variant="link" className="p-0 text-orange-600 cursor-pointer">Verify</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Enter phone number" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" placeholder="Enter address" />
            <Button variant="link" className="p-0 text-orange-600">+ Add New Address</Button>
          </div>
        </CardContent>
      </Card>

      {/* Aadhaar Verification */}
      <Card>
        <CardHeader>
          <CardTitle>Aadhaar Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aadhaar-number">Aadhaar Number</Label>
            <Input id="aadhaar-number" placeholder="Enter Aadhaar Number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aadhaar-image">Aadhaar Card Image</Label>
            <div className="border rounded-md p-4 flex flex-col items-center justify-center text-sm text-muted-foreground">
              <div className="flex space-x-3 py-5 items-center">
<Upload className="h-6 w-6 mb-2 text-gray-500" /> 
              <Button variant="link" className="p-0">Upload the Aadhaar Image </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
       <div className="flex justify-end">
            <Button className="cursor-pointer">Submit Changes</Button>
          </div>
    </div>
  )
}
