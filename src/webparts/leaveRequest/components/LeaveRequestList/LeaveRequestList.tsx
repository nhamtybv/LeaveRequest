import * as React from 'react';
import { 
    DetailsList, 
    Selection, 
    SelectionMode, 
    IColumn, 
    DetailsListLayoutMode,
    MarqueeSelection
} from 'office-ui-fabric-react';
import ILeaveRequestListProps from './ILeaveRequestListProps';
import ILeaveRequestListState from './ILeaveRequestListState';
import ILeaveRequestItem from '../../models/ILeaveRequestItem';
import * as moment from 'moment';


class LeaveRequestList extends React.Component<ILeaveRequestListProps, ILeaveRequestListState> {
    private _selection: Selection;

    constructor(props: ILeaveRequestListProps){
        super(props);
        this.state = {
            columns: this._setupColumns()
        };
        this._setupColumns = this._setupColumns.bind(this);
    }


    public render(): JSX.Element {
        return (
            <MarqueeSelection selection={this._selection}>
                <DetailsList                    
                    items={this.props.items}
                    columns={this.state.columns}
                    selectionMode={SelectionMode.single}
                    layoutMode={DetailsListLayoutMode.justified}
                    selection={this._selection}/>
            </MarqueeSelection>
        );
    }

    private _setupColumns(): IColumn[] {
        const columnsSingleClient: IColumn[] = [
            {
                key: 'Id',
                name: 'ID',
                fieldName: 'Id',
                minWidth: 20,
                maxWidth: 20,
                isResizable: true,
                isSorted: false,
                isSortedDescending: false,
                data: Number
            },
            {
                key: 'Title',
                name: 'Title',
                fieldName: 'Title',
                minWidth: 100,
                maxWidth: 250,
                isResizable: true,
                isSorted: false,
                isSortedDescending: false,
                data: String
            },
            {
                key: 'LeaveType',
                name: 'LeaveType',
                fieldName: 'LeaveType',
                minWidth: 100,
                maxWidth: 110,
                isResizable: true,
                isSorted: false,
                isSortedDescending: false,
                data: String
            },
            {
                key: 'StartDate',
                name: 'StartDate',
                fieldName: 'StartDate',
                minWidth: 100,
                isResizable: true,
                isSorted: false,
                isSortedDescending: false,
                data: String,
                onRender: (item: ILeaveRequestItem) => {
                    return <span>{moment(item.StartDate).format('L')}</span>;
                }
            },
            {
                key: 'EndDate',
                name: 'EndDate',
                fieldName: 'EndDate',
                minWidth: 100,
                isResizable: true,
                isSorted: false,
                isSortedDescending: false,
                data: String,
                onRender: (item: ILeaveRequestItem) => {
                    return <span>{moment(item.EndDate).format('L')}</span>;
                }
            },
            {
                key: 'Status',
                name: 'Status',
                fieldName: 'Status',
                minWidth: 100,
                isResizable: true,
                isSorted: false,
                isSortedDescending: false,
                data: String
            },
            {
                key: 'Comment',
                name: 'Comment',
                fieldName: 'Comment',
                minWidth: 100,
                isResizable: true,
                isSorted: false,
                isSortedDescending: false,
                data: String
            }
        ];

        return columnsSingleClient;
    }
}

export default LeaveRequestList;