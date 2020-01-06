import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, EnvironmentType, Environment } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'LeaveRequestWebPartStrings';
import LeaveRequestContainer from './components/LeaveRequestContainer/LeaveRequestContainer';
import ILeaveRequestDataProvider from './dataProviders/ILeaveRequestDataProvider';
import MockDataProvider from './tests/MockDataProvider';
import ILeaveRequestContainerProps from './components/LeaveRequestContainer/ILeaveRequestContainerProps';
import SharePointDataProvider from './dataProviders/SharePointDataProvider';

export interface ILeaveRequestWebPartProps {
  description: string;
  siteName: string;
}

export default class LeaveRequestWebPart extends BaseClientSideWebPart<ILeaveRequestWebPartProps> {
  private _dataProvider: ILeaveRequestDataProvider;

  protected onInit(): Promise<void>{
    if (DEBUG && Environment.type === EnvironmentType.Local) {
      this._dataProvider = new MockDataProvider();
    } else {
      this._dataProvider = new SharePointDataProvider();
      this._dataProvider.webPartContext = this.context;
      this._dataProvider.siteName = this.properties.siteName;

    }
    
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<ILeaveRequestContainerProps > = React.createElement(
      LeaveRequestContainer,
      {
        dataProvider: this._dataProvider,
        context: this.context,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('siteName', {
                  label: strings.PropertyPaneSiteName
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
