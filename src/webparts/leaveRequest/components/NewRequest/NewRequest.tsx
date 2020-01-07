import * as React from 'react';
import * as moment from 'moment';
import INewRequestProps from './INewRequestProps';
import INewRequestState from './INewRequestState';
import {
    Dialog,
    DialogFooter,
    DialogType,
    MessageBar,
    MessageBarType,
    TextField,
    Spinner,
    SpinnerType,
    Stack,
    DatePicker,
    DayOfWeek,
    PrimaryButton,
    DefaultButton,
    ITextFieldProps,
    IDatePickerStrings,
    Dropdown,
    IDropdownOption,
    IDropdownProps,
    IStackTokens,
    mergeStyleSets,
} from 'office-ui-fabric-react';
import styles from './NewRequest.module.scss';
import ILeaveTypeItem from '../../models/ILeaveTypeItem';
import IRefDataItem from '../../models/IRefDataItem';
import ILeaveRequestItem from '../../models/ILeaveRequestItem';

const DayPickerStrings: IDatePickerStrings = {
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
  
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  
    shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  
    goToToday: 'Go to today',
    prevMonthAriaLabel: 'Go to previous month',
    nextMonthAriaLabel: 'Go to next month',
    prevYearAriaLabel: 'Go to previous year',
    nextYearAriaLabel: 'Go to next year',
    closeButtonAriaLabel: 'Close date picker',
    isRequiredErrorMessage: 'Field is required.',
    invalidInputErrorMessage: 'Invalid date format.'
};

const textFieldStylesdatePicker: ITextFieldProps = {
    style: { display: 'flex', justifyContent: 'flex-start', marginLeft: 15 },
    iconProps: { style: { left: 0 } }
};

const controlClass = mergeStyleSets({
    control: {
      margin: '0 0 15px 0',
      maxWidth: '400px'
    }
  });

const sectionStackTokens: IStackTokens = { childrenGap: 10 };

export default class NewRequest extends React.Component<INewRequestProps, INewRequestState> {
    private _LeaveTypeOption: IDropdownOption[] = [];
    private _leaveTypes: ILeaveTypeItem[];
    private _refData: IRefDataItem[];
    
    constructor(props: INewRequestProps) {
        super(props);
       
        this.state = {
            isLoading: false,
            hideDialog: !this.props.displayDialog,
            hasError: false,
            errorMessage: '',
            title:'',
            startDate:'',
            endDate:'',
            comment:'',
            disableAdd:false,
            leaveDays: 0,
            remainLeaveDays:0,
            leaveType:'',
            refId:0,
            tempLeaves:0
        };

        this._closeDialog = this._closeDialog.bind(this);
        this._onTitleChange = this._onTitleChange.bind(this);
        this._onCommentChange = this._onCommentChange.bind(this);
        this._onFormatDate = this._onFormatDate.bind(this);
        this._onSelectStartDate = this._onSelectStartDate.bind(this);
        this._onSelectEndDate = this._onSelectEndDate.bind(this);
        this._onAddTask = this._onAddTask.bind(this);
        this._getDaysBetween = this._getDaysBetween.bind(this);
        this._onLeaveTypeChange = this._onLeaveTypeChange.bind(this);
    }
    
    private _closeDialog = (ev?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        this.setState({ hideDialog: true });
        this.props.onDismiss(false);
    }

    private _onAddTask = async (ev?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        this.setState({ hideDialog: true });
    }

    private _onFormatDate = (date:Date): string => {
        let yy = date.getFullYear();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();
        return [(mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd, yy].join('/');
    }

    private _onSelectStartDate = (date: Date | null | undefined): void => {
        let ed:Date = (this.state.endDate === '' ? date : moment(this.state.endDate, 'MM/DD/YYYY').toDate());
        let ld:number = this._getDaysBetween(date, ed);
        if (ld < 0) {
            this.setState({ hasError: true, errorMessage: "End Date should greater than Start Date.", leaveDays: -1 });
        } else {
            this.setState({ startDate: this._onFormatDate(date), leaveDays: ld , hasError: false, errorMessage: ''});
        }
    }

    private _onSelectEndDate = (date: Date | null | undefined): void => {
        let sd:Date = (this.state.startDate === '' ? date : moment(this.state.startDate, 'MM/DD/YYYY').toDate());
        let ld:number = this._getDaysBetween(sd, date);
        if (ld < 0) {
            this.setState({ hasError: true, errorMessage: "End Date should greater than Start Date.", leaveDays: -1 });
        } else {
            this.setState({endDate: this._onFormatDate(date), leaveDays: ld, hasError: false, errorMessage: ''});
        }
    }

    private _onRenderPlaceholder = (props: IDropdownProps): JSX.Element => {
        return (
          <div className={styles.selectPlanContainer}>
            <span>{props.placeholder}</span>
          </div>
        );
    }

    private _onLeaveTypeChange = async (event: React.FormEvent<HTMLDivElement>, leaveType: IDropdownOption) => {
        let _remainLeaves:number = 0;
        let _refId:number = 0;
        let _tempLeave:number = 0;
        if (leaveType.key === 'Annual Leave') {   
            if (this._refData.length > 0) {
                _remainLeaves = Math.round(this._refData[0].Remain) - this._refData[0].Temp;
                _refId = this._refData[0].Id;
                _tempLeave = this._refData[0].Temp;
            }
        }
        this.setState({ leaveType: leaveType.key, remainLeaveDays: _remainLeaves, refId: _refId, tempLeaves: _tempLeave});        
    }

    private _getLeaveTypes = async () => {
        try {
            this._leaveTypes = await this.props.dataProvider.getLeaveType();
            if (this._leaveTypes.length > 0) {
                for (const lt of this._leaveTypes){
                    this._LeaveTypeOption.push({ key: String(lt.Title), text: lt.Title });
                }
            } else {
                this._LeaveTypeOption.push({ key: "1", text: "plan.title _01" });
                this._LeaveTypeOption.push({ key: "2", text: "plan.title _02" });
            }
            let _remainLeaves:number = 0;
            let _refId:number = 0;
            let _tempLeave:number = 0;
            this._refData = await this.props.dataProvider.getRefData();
            if (this._refData.length > 0){
                _remainLeaves = Math.round(this._refData[0].Remain) - this._refData[0].Temp;
                _refId = this._refData[0].Id;
                _tempLeave = this._refData[0].Temp;
            } 
            this.setState({ leaveType: this._LeaveTypeOption[0].key, remainLeaveDays: _remainLeaves, refId: _refId, tempLeaves: _tempLeave });  

        } catch (error) {
          this.setState({ hasError: true, errorMessage: error.message });
        }
    }

    public async componentDidMount(): Promise<void> {
        this._getLeaveTypes();
    }
    
    private _validateForm():boolean {
        let flag:boolean = true;
        if (this.state.title === ''){
            this.setState({hasError:true, errorMessage: 'Title can not be null.'});
            flag = false;
        } else if (this.state.title.length < 10){
            this.setState({hasError:true, errorMessage: 'Title too short.'});
            flag = false;
        } else if (this.state.startDate === ''){
            this.setState({hasError:true, errorMessage: 'Start Date is invalid.'});
            flag = false;
        } else if (this.state.endDate === ''){
            this.setState({hasError:true, errorMessage: 'End Date is invalid.'});
            flag = false;
        } else if (this.state.leaveDays < 0){
            this.setState({hasError:true, errorMessage: 'Start Date or End Date is invalid.'});
            flag = false;
        } else if (this.state.leaveDays > this.state.remainLeaveDays){
            if (this.state.leaveType === 'Annual Leave'){
                this.setState({hasError:true, errorMessage: `You can not leave more than ${this.state.remainLeaveDays}.`});
                flag = false;
            }
        }
        return flag;
    }
    private _onAddNewRequest = async (ev?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (this._validateForm()){
            let item:ILeaveRequestItem = {
                Id: 0,
                Title: this.state.title,
                StartDate: this.state.startDate,
                EndDate: this.state.endDate,
                Amount: this.state.leaveDays,
                LeaveType: this.state.leaveType,
                RefID: this.state.refId,
                Status: 'Pending',
                Comment: this.state.comment
            };
            const result = await this.props.dataProvider.createItem(item);
            if (result == 201){
                if (this.state.refId > 0) {
                    const res = await this.props.dataProvider.updateLeaveQuota(this.state.refId, this.state.leaveDays + this.state.tempLeaves);
                }
                
                this.setState({ hideDialog: true });
                this.props.onDismiss(true);
            } else {
                this.setState({hasError:true, errorMessage: result.toString()});
            }
        }
    }

    private _onTitleChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string){
        this.setState({
            title: newValue
        });        
    }

    private _onCommentChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string){
        this.setState({
            comment: newValue
        });
    }
    
    private _getDaysBetween(startDate:Date, endDate:Date):number {
        let res:number = 0;
        let wds:number = 0;
        let adj:number = 0;
        let swk:number = 0;
        let ewk:number = 0;
        let sdate:Date = startDate;
        let edate:Date = endDate;

        if (endDate < startDate) return -1;

        if (startDate.getDay() === 0) adj = 1;
        if (startDate.getDay() === 6) adj = 2;
        sdate = moment(startDate).add(adj, 'days').toDate();

        if (endDate.getDay() === 0) adj = -2;
        if (endDate.getDay() === 6) adj = -1;
        edate = moment(endDate).add(adj, 'days').toDate();

        if (edate < sdate) return -1;
        wds = moment(edate).diff(moment(sdate), 'days');
        swk = moment(sdate).isoWeek();
        ewk = moment(edate).isoWeek();
        if (swk !== ewk) {
            let wkc:number = Math.floor(wds/7);
            if (wkc === 0) {
                wds -= 2;
            } else {
                wds -= wkc*2;
                if (sdate.getDay() > edate.getDay()) {
                    wds -= 2;
                } 
            }
        }
        
        res = wds + 1;
        return res;
    }

    public render(): React.ReactElement<INewRequestProps> {        
        const hideDialog: boolean = this.state.hideDialog;

        return (
            <div>
                <Dialog
                    hidden={hideDialog}
                    onDismiss={this._closeDialog}
                    minWidth={400}
                    maxWidth={400}
                    dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Add New Request'
                    }}>
                    {
                        this.state.isLoading ? (
                            <Spinner type={SpinnerType.normal} label='loading...' />
                        ) : (
                        <>
                            <Stack tokens={sectionStackTokens}>
                                <>
                                    <Dropdown
                                        placeholder='Select leave type'
                                        title='Select leave type'
                                        label=''
                                        ariaLabel='Select leave type'
                                        required={true}
                                        onRenderPlaceholder={this._onRenderPlaceholder}
                                        //onRenderTitle={this._onRenderTitle}
                                        //onRenderOption={this._onRenderOption}
                                        options={this._LeaveTypeOption}
                                        selectedKey={this.state.leaveType}
                                        onChange={this._onLeaveTypeChange}
                                    />                         
                                    <TextField
                                        title='Title'
                                        placeholder='Please enter title'
                                        required
                                        validateOnLoad={false}
                                        value={this.state.title}
                                        onChange={this._onTitleChange}
                                    />
                                    <DatePicker
                                        title='Select start date'
                                        firstDayOfWeek={DayOfWeek.Sunday}
                                        strings={DayPickerStrings}
                                        showWeekNumbers={true}
                                        firstWeekOfYear={1}
                                        showGoToToday={true}
                                        showMonthPickerAsOverlay={true}
                                        isRequired={true}
                                        placeholder='Set start date (mm/dd/yyyy)'
                                        ariaLabel='Set start date'
                                        formatDate={this._onFormatDate}
                                        onSelectDate={this._onSelectStartDate}                                        
                                        value={this.state.startDate !== '' ? moment(this.state.startDate, 'MM/DD/YYYY').toDate():undefined}
                                    />
                                    <DatePicker
                                        title='Select end date'
                                        firstDayOfWeek={DayOfWeek.Sunday}
                                        strings={DayPickerStrings}
                                        showWeekNumbers={true}
                                        firstWeekOfYear={1}
                                        showGoToToday={true}
                                        isRequired={true}
                                        showMonthPickerAsOverlay={true}
                                        placeholder='Set end date (mm/dd/yyyy)'
                                        ariaLabel='Set end date'
                                        onSelectDate={this._onSelectEndDate}
                                        formatDate={this._onFormatDate}
                                        value={this.state.endDate !== '' ? moment(this.state.endDate, 'MM/DD/YYYY').toDate():undefined}
                                    />
                                    <TextField
                                        title='Comment'
                                        placeholder='Please enter short comment'
                                        multiline={true}
                                        rows={3}
                                        validateOnLoad={false}
                                        value={this.state.comment}
                                        onChange={this._onCommentChange}
                                    />
                                    <MessageBar>
                                        Available: {this.state.remainLeaveDays}, Leave: {this.state.leaveDays}
                                    </MessageBar>
                                    <div>
                                        {
                                            this.state.hasError && <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
                                            { this.state.errorMessage } </MessageBar>                                        
                                        }
                                    </div>                                    
                                </>
                            </Stack>
                            <DialogFooter>
                                <PrimaryButton onClick={this._onAddNewRequest} text='Add' disabled={this.state.disableAdd} />
                                <DefaultButton onClick={this._closeDialog} text='Cancel' />
                            </DialogFooter>
                        </>
                    )}
                </Dialog>
            </div>
        ); 
    }     
}