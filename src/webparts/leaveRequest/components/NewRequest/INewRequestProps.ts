import ILeaveRequestDataProvider from "../../dataProviders/ILeaveRequestDataProvider";
import IUserProfile from "../../models/IUserProfile";

interface INewRequestProps {
    displayDialog:boolean;
    dataProvider: ILeaveRequestDataProvider;
    onDismiss: (refresh:boolean) => void;
}

export default INewRequestProps;