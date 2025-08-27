interface SubCategory {
  _id: string;
  name: string;
}

export interface Category {
  _id: string;
  categoryName: string;
  subCategories: SubCategory[];
  __v: number;
  image: string;
  updatedAt: string; 
}
