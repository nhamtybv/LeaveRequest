import ILeaveRequestItem from '../models/ILeaveRequestItem';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import ILeaveTypeItem from '../models/ILeaveTypeItem';
import IRefDataItem from '../models/IRefDataItem';
import IUserProfile from '../models/IUserProfile';
import IReportSummaryItem from '../models/IReportSummaryItem';

interface ILeaveRequestDataProvider {
    webPartContext: IWebPartContext;
    siteName: string;
    getItems(): Promise<ILeaveRequestItem[]>;
    getLeaveType():Promise<ILeaveTypeItem[]>;
    getRefData():Promise<IRefDataItem[]>;
    getProfile():Promise<IUserProfile>;
    createItem(item:ILeaveRequestItem): Promise<number>;
    updateLeaveQuota(id:number, amount:number):Promise<number>;
    getReportSummary():Promise<IReportSummaryItem[]>;
    getPublicHolidays(fd:Date, td:Date):Promise<number>;
}

export default ILeaveRequestDataProvider;