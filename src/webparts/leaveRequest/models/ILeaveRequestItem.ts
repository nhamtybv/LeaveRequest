interface ILeaveRequestItem {
    Id: number;
    Title: string;
    StartDate: string;
    EndDate: string;
    Amount:number;
    RefID:number;
    Status: string;
    Comment: string;
    LeaveType:string|number;
}

export default ILeaveRequestItem;