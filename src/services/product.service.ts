
import instance from "@/lib/instance";

class ProductService{
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