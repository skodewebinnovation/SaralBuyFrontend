import { z } from "zod";

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
