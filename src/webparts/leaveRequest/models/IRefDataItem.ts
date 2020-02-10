import ILeaveTypeItem from "./ILeaveTypeItem";

interface IRefDataItem {
    Id:number;
    Title:string;
    EmployeeId:number;
    Quota:number;
    Remain:number;
    Used:number;
    Temp:number;
    Etag:string;
    LeaveType: ILeaveTypeItem;
}

export default IRefDataItem;