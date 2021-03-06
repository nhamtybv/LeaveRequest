import * as moment from 'moment';
import ILeaveRequestDataProvider from "./ILeaveRequestDataProvider";
import ILeaveRequestItem from "../models/ILeaveRequestItem";
import { IWebPartContext } from "@microsoft/sp-webpart-base";
import {
    SPHttpClient,
    SPHttpClientResponse
  } from "@microsoft/sp-http";
import ILeaveTypeItem from "../models/ILeaveTypeItem";
import IRefDataItem from '../models/IRefDataItem';
import IUserProfile from '../models/IUserProfile';
import IReportSummaryItem from '../models/IReportSummaryItem';

class SharePointDataProvider implements ILeaveRequestDataProvider {
    private _items: ILeaveRequestItem[];
    private _leaveTypes: ILeaveTypeItem[];
    private _refDataItem: IRefDataItem[];
    private _webPartContext: IWebPartContext;
    private _listsUrl: string;
    private _listItemEntityTypeName: string = undefined;
    private _leaveQuotaEntityTypeName: string = undefined;
    private _siteName:string = 'BackOffice';
    private _curentUserId:number = 0;

    public set webPartContext(value: IWebPartContext) {
        this._webPartContext = value;
        this._listsUrl = `${this._webPartContext.pageContext.web.absoluteUrl}/_api/web/lists`;
    }
    
    public set siteName(value: string) {
        this._siteName = value;
        this._listsUrl = `${this._webPartContext.pageContext.web.absoluteUrl}/_api/web/lists`;
    }

    public get webPartContext(): IWebPartContext {
        return this._webPartContext;
    }

    public async getLeaveType(): Promise<ILeaveTypeItem[]> {
        const listTitle: string = 'leave_categories';
        const queryUrl: string = `${this._listsUrl}/GetByTitle('${listTitle}')/items`;
        
        const response = await this._webPartContext.spHttpClient.get(queryUrl, SPHttpClient.configurations.v1);
        const json = await response.json();
        return this._leaveTypes = json.value;
    }
    
    public async createItem(item:ILeaveRequestItem):Promise<number>{
        const listTitle: string = 'Leave Request';
        const listItemEntityTypeName = await this._getListItemEntityTypeName(listTitle);
        const data: string = JSON.stringify({
            '__metadata':{
                'type': listItemEntityTypeName
            },
            'Title': item.Title,
            'StartDate': item.StartDate? moment(item.StartDate).format('YYYY-MM-DD').concat('T08:00:00.000Z'): undefined,
            'EndDate': item.EndDate? moment(item.EndDate).format('YYYY-MM-DD').concat('T08:00:00.000Z'): undefined,
            'Status': item.Status,
            'Comment':item.Comment,
            'RefID':item.RefID,
            'Amount': item.Amount,            
            'LeaveType': item.LeaveType
        });

        let queryUrl: string = `${this._listsUrl}/getbytitle('${listTitle}')/items`;
        const response = await this._webPartContext.spHttpClient.post(queryUrl, SPHttpClient.configurations.v1,
                {
                  headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'Content-type': 'application/json;odata=verbose',
                    'odata-version': ''
                  },
                  body: data
                });
        return response.status;
    }

    public async getItems(): Promise<ILeaveRequestItem[]> {
        let listTitle: string = 'Leave Request';
        if (this._curentUserId === 0) {
            let _currentProfile: IUserProfile = await this.getProfile();
            this._curentUserId = _currentProfile.Id;
        }
        let queryUrl: string = `${this._listsUrl}/GetByTitle('${listTitle}')/items?$filter=AuthorId eq ${this._curentUserId}&$orderby=Id desc`;
 
        const response = await this._webPartContext.spHttpClient.get(queryUrl, SPHttpClient.configurations.v1);
        const json = await response.json();
        // console.log(json);
        return this._items = json.value;
    }

    public async getRefData():Promise<IRefDataItem[]>{
        let listTitle: string = 'leave_quota';
        let myEmail: string = this._webPartContext.pageContext.user.email;
        let selectStatement:string = 'Id, Employee/EMail, Quota, Used, Remain, Temp, LeaveType/Title';
        let queryUrl: string = `${this._listsUrl}/GetByTitle('${listTitle}')/items?$select=${selectStatement}&$expand=Employee,LeaveType&$filter=Employee/EMail eq '${myEmail}'`;

        const response = await this._webPartContext.spHttpClient.get(queryUrl, SPHttpClient.configurations.v1);
        const json = await response.json();
       
        return this._refDataItem = json.value;
    }

    public async getProfile():Promise<IUserProfile>{
        //let queryUrl:string = `${this._webPartContext.pageContext.web.absoluteUrl}/_api/SP.UserProfiles.PeopleManager/getmyproperties`;
        let queryUrl:string = `${this._webPartContext.pageContext.web.absoluteUrl}/_api/web/currentUser`;
        const response = await this._webPartContext.spHttpClient.get(queryUrl, SPHttpClient.configurations.v1,    
            {    
                headers: {    
                    'Accept': 'application/json;odata=nometadata',    
                    'odata-version': ''    
                }    
            });
        const json = await response.json();
        //console.log(json);
        return json;
    }

    private async _getListItemEntityTypeName(listTitle:string): Promise<string>{
        if ((this._listItemEntityTypeName) && (listTitle === 'Leave Request')){
            return this._listItemEntityTypeName;
        }

        if ((this._leaveQuotaEntityTypeName) && (listTitle === 'leave_quota')){
            return this._leaveQuotaEntityTypeName;
        }

        const queryUrl: string = `${this._listsUrl}/GetByTitle('${listTitle}')?$select=ListItemEntityTypeFullName`;
        const response = await this._webPartContext.spHttpClient.get(queryUrl, SPHttpClient.configurations.v1, 
            {
                headers: {
                'Accept': 'application/json;odata=nometadata',
                'odata-version': ''
                }
            });
        const json = await response.json();
        
        if (listTitle === 'leave_quota'){
            this._leaveQuotaEntityTypeName = json.ListItemEntityTypeFullName;
        } else {
            this._listItemEntityTypeName = json.ListItemEntityTypeFullName;
        }
        return json.ListItemEntityTypeFullName;
    }

    public async updateLeaveQuota(id:number, amount:number):Promise<number>{
        let listTitle: string = 'leave_quota';
        const listItemEntityTypeName = await this._getListItemEntityTypeName(listTitle);
        const data: string = JSON.stringify({
            '__metadata':{
                'type': listItemEntityTypeName
            },  
            'Id': id,         
            'Temp': amount
        });
        // console.log(data);
        let queryUrl: string = `${this._listsUrl}/getbytitle('${listTitle}')/items(${id})`;
        const response = await this._webPartContext.spHttpClient.post(queryUrl, SPHttpClient.configurations.v1,
            {
              headers: {
                'Accept': 'application/json;odata=nometadata',
                'Content-type': 'application/json;odata=verbose',
                'odata-version': '',
                'IF-MATCH': "*",
                'X-HTTP-Method': 'MERGE'
              },
              body: data
            });
        // console.log(response);
        return response.status;
    }

    public async getReportSummary():Promise<IReportSummaryItem[]>{
        let listTitle: string = 'leave_quota';
        let myEmail: string = this._webPartContext.pageContext.user.email;
        let selectStatement:string = 'Id, Employee/Name, Employee/FirstName, Employee/LastName, Employee/EMail, Quota, Used, Remain, Temp';
        let filterStatement:string = `&$filter=Employee/EMail eq '${myEmail}'`;
        let myProfile:IUserProfile = await this.getProfile();
        
        if (myProfile.IsSiteAdmin) {
            filterStatement = '';
        }
        let queryUrl: string = `${this._listsUrl}/GetByTitle('${listTitle}')/items?$select=${selectStatement}&$expand=Employee${filterStatement}`;
        const response = await this._webPartContext.spHttpClient.get(queryUrl, SPHttpClient.configurations.v1);
        const json = await response.json();
        //console.log(json);
        return this._refDataItem = json.value;
    }

    public async getPublicHolidays(fd:Date, td:Date):Promise<number>{
        let listTitle: string = 'CalendarEvents';
        let filter:string = `?$filter=Category eq 'Holiday' and EventDate ge datetime'${moment(fd).format('YYYY-MM-DD')}T00:00:00.000Z' and EventDate le datetime'${moment(td).format('YYYY-MM-DD')}T23:59:00.000Z'` ;
        let queryUrl: string = `${this._listsUrl}/GetByTitle('${listTitle}')/items${filter}'`;
        
        const response = await this._webPartContext.spHttpClient.get(queryUrl, SPHttpClient.configurations.v1);
        const json = await response.json();
        let result:number = 0;
        const items = json.value;
        
        if (items.length > 0) {
            items.map((item:any) =>{
                let n:number = moment(item.EventDate).diff(moment(item.EndDate), 'days');
                //console.log(n);
                n += 1;
                result += n;
            });
        }
        
        return result;
    }
}

export default SharePointDataProvider;