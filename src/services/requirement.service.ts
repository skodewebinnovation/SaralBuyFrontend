import instance from "@/lib/instance";

class RequirementService {
    getRecentRequiremnts(){
       return instance.get('requirement/recent-requirements').then(res => res.data?.data|| res.data)
    }
    
}
export default new RequirementService();
