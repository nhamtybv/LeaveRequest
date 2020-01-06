import ILeaveRequestDataProvider from "../dataProviders/ILeaveRequestDataProvider";
import ILeaveRequestItem from "../models/ILeaveRequestItem";
import * as moment from 'moment';
import * as lodash from '@microsoft/sp-lodash-subset';
import { IWebPartContext } from "@microsoft/sp-webpart-base";
import ILeaveTypeItem from "../models/ILeaveTypeItem";
import IRefDataItem from "../models/IRefDataItem";
import IUserProfile from "../models/IUserProfile";

class MockDataProvider implements ILeaveRequestDataProvider {
    private _idCounter: number;
    private _items: ILeaveRequestItem[];
    private _webPartContext: IWebPartContext;
    private _siteName: string;

    constructor() {
        this._idCounter = 0;
        let sd: Date = moment().toDate();
        this._items = [            
            this._createItem("Xin nghi le", sd.toLocaleDateString(), moment(sd).add(2, 'days').toDate().toLocaleDateString(), "Pending"),
            this._createItem("Xin nghi tet", sd.toLocaleDateString(), moment(sd).add(1, 'days').toDate().toLocaleDateString(), "Approved"),
            this._createItem("Xin nghi choi", sd.toLocaleDateString(), moment(sd).add(3, 'days').toDate().toLocaleDateString(), "Rejected"),
            this._createItem("Xin nghi om", sd.toLocaleDateString(), moment(sd).add(1, 'days').toDate().toLocaleDateString(), "Pending"),
        ];
    }

    public set siteName(value: string){
        this._siteName = value;
    }
    public set webPartContext(value: IWebPartContext) {
        this._webPartContext = value;
    }
    
    public get webPartContext(): IWebPartContext {
        return this._webPartContext;
    }

    public getLeaveType(): Promise<ILeaveTypeItem[]> {
        let result: ILeaveTypeItem[] = lodash.clone(this._items);
        return new Promise<ILeaveTypeItem[]>((resolve) => {
            setTimeout(() => resolve(result), 500);
        });
    }

    public getItems(): Promise<ILeaveRequestItem[]> {
        let result: ILeaveRequestItem[] = lodash.clone(this._items);
        return new Promise<ILeaveRequestItem[]>((resolve) => {
            setTimeout(() => resolve(result), 500);
        });
    }

    public createItem(item:ILeaveRequestItem): Promise<number>{
        return new Promise<number>((resolve) => {
            resolve(1);
        });
    }

    public getProfile():Promise<IUserProfile>{
        return new Promise<IUserProfile>((resolve) => {
            let items:IUserProfile;
            resolve(items);
        });
    }

    public getRefData():Promise<IRefDataItem[]>{
        return new Promise<IRefDataItem[]>((resolve) => {
            let items:IRefDataItem[];
            resolve(items);
        });
    }
    private _createItem(title:string, startDate: string, endDate: string, status: string): ILeaveRequestItem {
        const mockItem: ILeaveRequestItem = {
            Id: this._idCounter++,
            Title: title,
            StartDate: startDate,
            EndDate: endDate,
            Amount:1,
            RefID:1,
            Status: status,
            Comment: "Init comment",
            LeaveType: "Annual Leave",
        };
        return mockItem;
    }
    public updateLeaveQuota(id:number, amount:number):Promise<number>{
        return new Promise<number>((resolve) => {
            resolve(1);
        });
    }
}

export default MockDataProvider;