
import instance from "@/lib/instance";

class BidService{
    createBid(sellerId:string,productId:string,dataObj:any){
        return instance.post(`/bid/create/${sellerId}/${productId}`,dataObj,{
            withCredentials:true
        }).then(res => res.data?.data|| res.data)
    }
}
export default new BidService();