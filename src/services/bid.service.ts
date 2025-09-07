
import instance from "@/lib/instance";

class BidService{
    createBid(sellerId:string,productId:string,dataObj:any){
        return instance.post(`/bid/create/${sellerId}/${productId}`,dataObj,{
            withCredentials:true
        }).then(res => res.data?.data|| res.data)
    }
    getAllBids(){
        return instance.get('/bid/get-all-bid',{withCredentials:true}).then(res => res.data?.data|| res.data)
    }
    bidOverViewbyId(bidId:string){
        return instance.get(`/bid/bid-overview/${bidId}`,{withCredentials:true}).then(res => res.data?.data|| res.data)
    };
    updateUserBidDets(id:string,dataObj:any){
        return instance.put(`/bid/update-bid-user-dets/${id}`,dataObj,{withCredentials:true}).then(res => res.data?.data|| res.data)
    }
}
export default new BidService();