
import instance from "@/lib/instance";

class ProductService{
  addProduct(categoryId:string,subCategoryId:string,productObj:any){
    return instance.post(`/product/add-product/${categoryId}/${subCategoryId}`,productObj,{
      withCredentials:true
    }).then(res => res.data?.data|| res.data)
  }
    getSeachProduct(productName:string){
        return instance.get('/product/get-product/'+productName).then(res => res.data?.data|| res.data)
    }
   getProductByTitle(title: string, page: number = 1, limit: number = 10) {
  return instance.get("/product/get-products-by-title/search", {
    params: {
      title,
      page,
      limit,
    },
  });
}

}
export default new ProductService();