import { Button } from "../../../Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../Components/ui/card"
import { Input } from "../../../Components/ui/input"
import { Label } from "../../../Components/ui/label"
import { Textarea } from "../../../Components/ui/textarea"
import { Upload } from "lucide-react"
import { useForm } from "react-hook-form"
import { useEffect, useRef, useState } from "react"
import { useFetch } from "@/helper/use-fetch"
import userService from "@/services/user.service"
import { getUserProfile } from "@/zustand/userProfile"
import { Spinner } from "../../../Components/ui/shadcn-io/spinner"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProfileSchema } from "@/validations/Schema"

import Authentication from "../../../Components/auth/Authentication"

export function AccountSettings() {
  const docRef = useRef<HTMLInputElement | null>(null)
  const [fileDoc, setFileDoc] = useState<File | null>(null)
  const { user, setUser } = getUserProfile()
  const [open,setOpen]= useState(false)
  const { fn: updateProfilefn, data: updateProfileRes, loading } = useFetch(userService.updateProfile)
  const { fn: logoutFn,data:logoutRes,loading:logoutLoading} = useFetch(userService.logout)
  const { handleSubmit, formState: { errors }, register, reset } = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: '',
      address: "",
      aadhaarNumber: "",
    },
  })

  useEffect(()=>{
    if(logoutRes){
      toast.success('You are Logged out')  
      setUser(null);
      reset({
        phone: '',
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        aadhaarNumber: "",
        
      })
    }
  },[logoutRes])

  useEffect(() => {
    if (user) {
      reset({
        phone: (user as any)?.phone || '',
        firstName: (user as any)?.firstName || "",
        lastName: (user as any)?.lastName || "",
        email: (user as any)?.email || "",
        address: (user as any)?.address || "",
        aadhaarNumber: (user as any)?.aadhaarNumber || "",

      })
    }
  }, [user, reset])

  async function onSubmit(data: any) {
    const formData = new FormData()
    formData.append("firstName", data.firstName)
    formData.append("lastName", data.lastName)
    formData.append("email", data.email)
    formData.append("phone", data.phone)
    formData.append("address", data.address)
    formData.append("aadhaarNumber", data.aadhaarNumber)

    // Append file if selected
    if (fileDoc) {
      formData.append("document", fileDoc)
    }

    await updateProfilefn(formData)
  }

  useEffect(() => {
    if (updateProfileRes) {
      setUser(updateProfileRes);
      toast.success('Profile updated successfully')
    }
  }, [updateProfileRes])

  useEffect(() => {
    if (!user?.firstName && !user?.phone && !user?.lastName && !user?.email && !user?.address) {
      return;
    };
    for (let i = 0; i < Object.entries(errors).length; i++) {
      toast.error(Object.entries(errors)[i][1]?.message)
      break;
    }
  }, [errors])
  return (
    <div className="space-y-6">
      {/* Personal Details */}
    <Authentication setOpen={setOpen} open={open} />
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit, () => {
            if (!user) {
              setOpen(true);
              ;
            }
          })} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  placeholder="Enter first name"
                  {...register("firstName")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  placeholder="Enter last name"
                  {...register("lastName")}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    {...register("email")}
                  />
                  {/* <Button
                    type="button"
                    variant="link"
                    className="p-0 text-orange-600 cursor-pointer"
                  >
                    Verify
                  </Button> */}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  {...register("phone")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                rows={5}
                placeholder="Enter address"
                {...register("address")}
              />
              {/* <Button type="button" variant="link" className="p-0 text-orange-600">
                + Add New Address
              </Button> */}
            </div>

            {/* Aadhaar Verification */}
            <Card>
              <CardHeader>
                <CardTitle>Aadhaar Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhaar-number">Aadhaar Number</Label>
                  <Input
                    id="aadhaar-number"
                    placeholder="Enter Aadhaar Number"
                    {...register("aadhaarNumber")}
                  />
                </div>
                <div
                  className="space-y-2 cursor-pointer"
                  onClick={() => docRef.current?.click()}
                >
                  <Label htmlFor="aadhaar-image">Aadhaar Card Image</Label>
                  <div className="border rounded-md p-4 flex flex-col items-center justify-center text-sm text-muted-foreground">
                    <div className="flex flex-col py-5 items-center">
                      <div className="flex space-x-3 items-center">
                        <Upload className="h-6 w-6 mb-2 text-gray-500" />
                        <Button type="button" variant="link" className="p-0">
                          Upload the Aadhaar Image
                        </Button>
                      </div>
                      {fileDoc && (
                        <p className="text-xs mt-2 text-green-600">
                          {fileDoc.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    hidden
                    ref={docRef}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFileDoc(e.target.files[0])
                      }
                    }}
                  />

                </div>
              </CardContent>
            </Card>

            {/* Submit button */}
            <div className="flex justify-end">
              <Button type="submit" className="cursor-pointer w-32" disabled={loading}>
                {
                  loading ? <Spinner className="w-5 h-5 animate-spin " /> : 'Save Changes'
                }
              </Button>
              <Button
              disabled={!user || logoutLoading}
              className="ml-4 w-32 cursor-pointer" variant="destructive"
              onClick={()=>logoutFn()}
              >Logout</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
