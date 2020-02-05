import ILeaveRequestItem from "../../models/ILeaveRequestItem";
import IReportSummaryItem from "../../models/IReportSummaryItem";
import IReportDetailItem from "../../models/IReportDetailItem";

interface ILeaveRequestContainerState {
    leaveRequestItems: ILeaveRequestItem[];
    showDialog:boolean;
    isLoading:boolean;
    currentFilter:string;
    hasError: boolean;
    errorMessage: string;
    showReport: boolean;
    isLoadingReport:boolean;
    reportSummary: IReportSummaryItem[];
    reportDetails: IReportDetailItem[];
    reportButtonLabel:string;
    reportExcelDisable:boolean;
    addNewDisable:boolean;
}

export default ILeaveRequestContainerState;