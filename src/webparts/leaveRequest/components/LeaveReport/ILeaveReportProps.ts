import IReportSummaryItem from "../../models/IReportSummaryItem";
import IReportDetailItem from "../../models/IReportDetailItem";

interface ILeaveReportProps {
    isLoading:boolean;
    onViewReport: () => void;
    reportSummary: IReportSummaryItem[];
    reportDetails: IReportDetailItem[];
}

export default ILeaveReportProps;