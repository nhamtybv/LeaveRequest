import { IColumn } from "office-ui-fabric-react/lib/DetailsList";

interface ILeaveReportState {
    isLoading: boolean;
    currentYear: string;
    columns?: IColumn[];
}

export default ILeaveReportState;