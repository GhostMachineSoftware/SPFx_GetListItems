import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration, IWebPartPropertiesMetadata } from '@microsoft/sp-webpart-base';
import 'jquery';
import 'bootstrap';
import './styles/custom.css';
export interface IGetListItemsWebPartProps {
    description: string;
}
export interface ISPLists {
    value: ISPList[];
}
export interface ISPList {
    LinkGroup: string;
    LinkGroupID: number;
    LinkTeam: string;
    LinkID: number;
    LinkName: string;
    LinkURL: string;
    LinkBrowse: string;
}
export default class GetListItemsWebPart extends BaseClientSideWebPart<IGetListItemsWebPartProps> {
    private _getListData;
    private ButtonClick;
    private _renderListAsync;
    private _renderList;
    render(): void;
    protected readonly dataVersion: Version;
    protected readonly propertiesMetadata: IWebPartPropertiesMetadata;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=GetListItemsWebPart.d.ts.map