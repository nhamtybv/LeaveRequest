import * as React from 'react';
import { 
    DetailsList, 
    Selection, 
    SelectionMode, 
    IColumn, 
    DetailsListLayoutMode,
    MarqueeSelection,
    MessageBar,
    MessageBarType,
    Spinner,
    SpinnerSize
} from 'office-ui-fabric-react';
import ILeaveReqortProps from './ILeaveReportProps';
import ILeaveReportState from './ILeaveReportState';

class LeaveReport extends React.Component<ILeaveReqortProps, ILeaveReportState>  {
    private _selection: Selection;

    constructor(props: ILeaveReqortProps) {
        super(props);
        let cy:number = new Date().getFullYear();
        this.state = {
            isLoading: this.props.isLoading,
            currentYear: String(cy),
            columns: this._setupColumns()
        };
        this._setupColumns = this._setupColumns.bind(this);
    }

    public componentDidMount() {
        this.props.onViewReport();
    }

    public render(): JSX.Element {
        return (
            <div>
                {
                this.state.isLoading ? (
                        <Spinner size={SpinnerSize.medium}></Spinner>
                    ) : (
                        <>
                            <div>
                            {((this.props.reportSummary === undefined) || (this.props.reportSummary.length === 0)) ? (
                                    <MessageBar messageBarType={MessageBarType.error}>
                                        No data found.
                                    </MessageBar>
                            ) :(
                                <>
                                    <MarqueeSelection selection={this._selection}>
                                        <DetailsList                    
                                            items={this.props.reportSummary}
                                            columns={this.state.columns}
                                            selectionMode={SelectionMode.single}
                                            layoutMode={DetailsListLayoutMode.justified}
                                            selection={this._selection}/>
                                    </MarqueeSelection>
                                </>
                            )}
                            </div>
                        </>)
                }
            
            </div>
        );
    }

    private _setupColumns(): IColumn[] {
        const columnsSingleClient: IColumn[] = [
            {
                key: 'EmployeeName',
                name: 'Employee Name',
                fieldName: 'EmployeeName',
                minWidth: 100,
                maxWidth: 250,
                isResizable: true,
                isSorted: false,
                isSortedDescending: false,
                data: String
            },
            {
                key: 'Quota',
                name: 'Total leave day(s)',
                fieldName: 'Quota',
                minWidth: 100,
                maxWidth: 120,
                isResizable: true,
                isSorted: false,
                isSortedDescending: false,
                data: Number
            },
            {
                key: 'Used',
                name: 'Used leave day(s)',
                fieldName: 'Used',
                minWidth: 100,
                maxWidth: 120,
                isResizable: true,
                isSorted: false,
                isSortedDescending: false,
                data: Number
            },
            {
                key: 'Used',
                name: 'Remain leave day(s)',
                fieldName: 'Used',
                minWidth: 100,
                maxWidth: 120,
                isResizable: true,
                isSorted: false,
                isSortedDescending: false,
                data: Number
            },
            {
                key: 'Temp',
                name: 'Pending leave day(s)',
                fieldName: 'Temp',
                minWidth: 100,
                maxWidth: 120,
                isResizable: true,
                isSorted: false,
                isSortedDescending: false,
                data: Number
            }
        ];

        return columnsSingleClient;
    }
}

export default LeaveReport;