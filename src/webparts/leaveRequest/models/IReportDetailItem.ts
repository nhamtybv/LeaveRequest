interface IReportDetailItem {
    Id: number;
    StartDate: string;
    EndDate: string;
    Amount:number;
    RefID:number;
    Status: string;
    LeaveType:string|number;
    Title: string;
}

export default IReportDetailItem;