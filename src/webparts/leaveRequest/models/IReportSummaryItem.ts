interface IEmployee {
    FirstName:string;
    LastName:string;
    EMail:string;
}

interface IReportSummaryItem {
    Id: number;
    EmployeeName:string;
    Employee:IEmployee;
    Quota:number;
    Remain:number;
    Used:number;
    Temp:number;
}

export default IReportSummaryItem;