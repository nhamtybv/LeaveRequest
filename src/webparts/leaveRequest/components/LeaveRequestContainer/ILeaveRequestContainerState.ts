import ILeaveRequestItem from "../../models/ILeaveRequestItem";
import IUserProfile from "../../models/IUserProfile";

interface ILeaveRequestContainerState {
    leaveRequestItems: ILeaveRequestItem[];
    showDialog:boolean;
    isLoading:boolean;
}

export default ILeaveRequestContainerState;