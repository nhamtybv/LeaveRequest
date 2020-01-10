import * as React from 'react';
import styles from './LeaveRequestContainer.module.scss';
import { Fabric, CommandButton, Spinner, SpinnerSize, IIconProps, IContextualMenuProps } from 'office-ui-fabric-react';
import ILeaveRequestContainerProps from './ILeaveRequestContainerProps';
import ILeaveRequestContainerState from './ILeaveRequestContainerState';
import LeaveRequestList from '../LeaveRequestList/LeaveRequestList';
import ILeaveRequestItem from '../../models/ILeaveRequestItem';
import NewRequest from '../NewRequest/NewRequest';
import LeaveReport from '../LeaveReport/LeaveReport';
import IReportSummaryItem from '../../models/IReportSummaryItem';
import * as XLSX from 'xlsx';

const addRequestIcon: IIconProps = { iconName: 'AddEvent' };
const excelIcon: IIconProps = { iconName: 'ExcelLogoInverse' };
const viewReportIcon: IIconProps = { iconName: 'ReportDocument' };

class LeaveRequestContainer extends React.Component<ILeaveRequestContainerProps, ILeaveRequestContainerState> {
   
    constructor(props:ILeaveRequestContainerProps){
        super(props);
        this.state = {
            leaveRequestItems: [],
            showDialog:false,
            isLoading:true,
            currentFilter: 'All Tasks',
            hasError: false,
            errorMessage: '',
            showReport: false,
            isLoadingReport: false,
            reportSummary: [],
            reportDetails: [],
            reportButtonLabel: 'View Report',
            reportExcelDisable: true,
            addNewDisable: false
        };

        this._loadItem= this._loadItem.bind(this);
        this._onDismissDialog = this._onDismissDialog.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this._loadReport = this._loadReport.bind(this);
        this._exportExcel = this._exportExcel.bind(this);
    }

    private _loadItem(): void{
        this.props.dataProvider.getItems().then(
        (items: ILeaveRequestItem[]) => {
            this.setState({ leaveRequestItems: items, isLoading: false });
        });
    }

    private _loadReport = async () => {
        try {
            this.setState({ isLoadingReport: true });
            const items:IReportSummaryItem[] = await this.props.dataProvider.getReportSummary();
            items.forEach((elm) => {
                elm.EmployeeName = elm.Employee.FirstName + ' ' + elm.Employee.LastName;
            });
            this.setState({ reportSummary:items, isLoadingReport: false });
        } catch (error) {
            this.setState({ hasError: true, errorMessage: error.message });
        }
        
    }

    public componentDidMount() {
        this._loadItem();
    }

    private _onRefresh = (ev?: any) => {
        this._loadItem();
    }

    private _onDismissDialog = (refresh: boolean): void => {
        if (refresh) {
          this.setState({ showDialog: false });
          this._onRefresh();
        } else {
          this.setState({ showDialog: false });
        }
    }

    private _exportExcel():void {
        let _data:any[];
        let _cols:string[] = [];
        _data = new Array(this.state.reportSummary.length + 1);

        _cols[0] = 'Employee Name';
        _cols[1] = 'Total leave day(s)';
        _cols[2] = 'Used leave day(s)';
        _cols[3] = 'Remain leave day(s)';
        _cols[4] = 'Pending leave day(s)';
        _data[0] = _cols;
        let iRow:number= 1;
        if ((this.state.reportSummary !== undefined) && (this.state.reportSummary.length > 0)) {
            this.state.reportSummary.forEach((item:IReportSummaryItem) => {
                let _row:string[] = [];
                _row[0] = item.EmployeeName;
                _row[1] = String(item.Quota);
                _row[2] = String(item.Used);
                _row[3] = String(Math.round(item.Remain));
                _row[4] = String(item.Temp);
                _data[iRow] = _row;
                iRow++;
            });
        }
        const ws = XLSX.utils.aoa_to_sheet(_data);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Leave Summary Report");
		/* generate XLSX file and send to client */
		XLSX.writeFile(wb, "leave_report.xlsx");
    }

    public render(): JSX.Element {
        return (
            <div className={styles.leaveRequest}>
                <div className={styles.container}>
                {     
                    this.state.isLoading ? (
                        <Spinner size={SpinnerSize.medium}></Spinner>
                    ) : (
                        <>
                            <Fabric>
                                <div className={styles.commandButtonsWrapper}>
                                    <CommandButton
                                        iconProps={addRequestIcon}
                                        text="New Request"
                                        style={{ flexGrow: 8, paddingRight: 10 }}
                                        disabled={this.state.addNewDisable}
                                        onClick={(ev: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
                                            this.setState({ showDialog: true });
                                        }}
                                    />                                    
                                    <CommandButton
                                        iconProps={excelIcon}
                                        text='Export to Excel'                                      
                                        disabled={this.state.reportExcelDisable}
                                        onClick={(ev: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
                                            this._exportExcel();                                   
                                        }}
                                    />
                                    <CommandButton
                                        iconProps={viewReportIcon}
                                        text={ this.state.reportButtonLabel }                                        
                                        disabled={false}
                                        onClick={(ev: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
                                            if (this.state.showReport) {
                                                this.setState({ 
                                                    showReport: false, 
                                                    reportButtonLabel: 'View Report', 
                                                    reportExcelDisable: true,
                                                    addNewDisable: false
                                                 });
                                            } else {
                                                this.setState({ 
                                                    showReport: true, 
                                                    reportButtonLabel: 'Request List', 
                                                    reportExcelDisable: false,
                                                    addNewDisable: true
                                                 });
                                            }                                            
                                        }}
                                    />
                                </div>
                                <div>
                                    {
                                        this.state.showReport === false &&
                                        <LeaveRequestList items={this.state.leaveRequestItems} /> 
                                    }
                                    {
                                        this.state.showReport && 
                                        <LeaveReport reportSummary={this.state.reportSummary} 
                                            reportDetails={this.state.reportDetails} 
                                            onViewReport={this._loadReport}
                                            isLoading={this.state.isLoadingReport} />
                                    }
                                    {
                                        this.state.showDialog && (
                                            <NewRequest displayDialog={this.state.showDialog} 
                                                        onDismiss={this._onDismissDialog}
                                                        dataProvider={this.props.dataProvider}/>
                                        )
                                    }
                                </div>
                            </Fabric>
                        </>
                    )
                }
                </div>
            </div>
        );
    }
}

export default LeaveRequestContainer;