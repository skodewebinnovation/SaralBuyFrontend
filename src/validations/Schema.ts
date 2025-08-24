import {z} from "zod"


export const CategoryFormchema = z.object({
    gst_requirement:z.string().optional(),
    product_type:z.string().optional(),
})