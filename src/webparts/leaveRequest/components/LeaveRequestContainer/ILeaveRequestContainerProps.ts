import ILeaveRequestDataProvider from "../../dataProviders/ILeaveRequestDataProvider";
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface ILeaveRequestContainerProps {
    dataProvider: ILeaveRequestDataProvider;
    context: WebPartContext;
}

export default ILeaveRequestContainerProps;
