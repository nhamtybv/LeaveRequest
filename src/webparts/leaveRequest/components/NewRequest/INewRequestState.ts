interface INewRequestState {
    hideDialog: boolean;
    isLoading:boolean;
    hasError:boolean;
    errorMessage:string;
    title:string;
    startDate:string;
    endDate:string;
    comment:string;
    disableAdd:boolean;
    leaveDays:number;
    remainLeaveDays:number;
    leaveType:string|number;
    refId:number;
}

export default INewRequestState;