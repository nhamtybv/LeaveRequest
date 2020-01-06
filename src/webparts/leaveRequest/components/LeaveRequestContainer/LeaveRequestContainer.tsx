import * as React from 'react';
import styles from './LeaveRequestContainer.module.scss';
import { Fabric, CommandButton } from 'office-ui-fabric-react';
import ILeaveRequestContainerProps from './ILeaveRequestContainerProps';
import ILeaveRequestContainerState from './ILeaveRequestContainerState';
import LeaveRequestList from '../LeaveRequestList/LeaveRequestList';
import ILeaveRequestItem from '../../models/ILeaveRequestItem';
import NewRequest from '../NewRequest/NewRequest';
import IUserProfile from '../../models/IUserProfile';

class LeaveRequestContainer extends React.Component<ILeaveRequestContainerProps, ILeaveRequestContainerState> {
    constructor(props:ILeaveRequestContainerProps){
        super(props);
        this.state = {
            leaveRequestItems: [],
            showDialog:false
        };

        this._loadItem= this._loadItem.bind(this);
        this._onDismissDialog = this._onDismissDialog.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
    }

    private _loadItem(): void{
        this.props.dataProvider.getItems().then(
        (items: ILeaveRequestItem[]) => {
            this.setState({ leaveRequestItems: items });
        });
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

    public render(): JSX.Element {
        return (
            <div className={styles.leaveRequest}>
            <Fabric>
                <div className={styles.commandButtonsWrapper}>
                    <CommandButton
                        iconProps={{ iconName: 'add' }}
                        text="Add"
                        style={{ flexGrow: 8, paddingRight: 10 }}
                        disabled={false}
                        onClick={(ev: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
                            this.setState({ showDialog: true });
                        }}
                    />
                </div>
                <LeaveRequestList items={this.state.leaveRequestItems} />
                {this.state.showDialog && (
                  <NewRequest displayDialog={this.state.showDialog} 
                            onDismiss={this._onDismissDialog}
                            dataProvider={this.props.dataProvider}/>
                )}
            </Fabric>
            </div>
        );
    }
}

export default LeaveRequestContainer;