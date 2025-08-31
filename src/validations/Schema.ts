import { email, z } from "zod";

export const CategoryFormchema = z.object({
  title: z.string().min(1, "Title is required"), // ensures empty string also fails

  categroy_type: z.string().min(1, "Category is required"), // matches your form
  quantity: z.string().min(1, "Quantity is required"),

  minimumBudget: z.string().optional(),
  productType: z.string().optional(),

  oldProductValue: z.object({
    min: z.string().optional(),
    max: z.string().optional(),
  }),

  productCondition: z.string().optional(),

  image: z.string().optional(),
  document: z.string().optional(),
  description: z.string().min(1, "Description is required"),

  paymentAndDelivery: z.object({
    ex_deliveryDate: z.date().optional(),
    paymentMode: z.string().optional(),
    gstNumber: z.string().optional(),
    organizationName: z.string().optional(),
    organizationAddress: z.string().optional(),
  }),

  draft: z.boolean().optional(),
  gst_requirement: z.string().optional(),
});

export const ProfileSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  aadhaarNumber:z.string().refine((value)=> !value || /^[2-9]{1}[0-9]{11}$/.test(value),{
    message: 'Invalid Aadhaar Number'
  })
})