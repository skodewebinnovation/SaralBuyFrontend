import instance from "@/lib/instance";

class CartService {
    // getRecentRequiremnts(){
    //    return instance.get('requirement/recent-requirements').then(res => res.data?.data|| res.data)
    // }

    // getApprovedPendingRequirements() {
    //     return instance.get('/requirement/approved-pending', { withCredentials: true })
    //         .then(res => res.data?.data || res.data);
    // }
    // getCompletedApprovedRequirements() {
    //     return instance.get('/requirement/completed-approved', { withCredentials: true })
    //         .then(res => res.data?.data || res.data);
    // }

    addToCart(params: { productId: string}) {
        return instance.post('/cart/add', params, { withCredentials: true })
            .then(res => res.data?.data || res.data);
    }
    // getCart(params: { productId: string}) {
    //     return instance.get('/cart/get-cart', params, { withCredentials: true })
    //         .then(res => res.data?.data || res.data);
    // }
    getCart() {
        return instance.get('/cart/get-cart', { withCredentials: true })
            .then(res => res.data?.data || res.data);
    }
    
}
export default new CartService();
