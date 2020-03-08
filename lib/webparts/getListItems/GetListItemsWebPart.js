var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Version } from '@microsoft/sp-core-library';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { SPHttpClient } from '@microsoft/sp-http';
import { BaseClientSideWebPart, PropertyPaneTextField, PropertyPaneButton, PropertyPaneButtonType } from '@microsoft/sp-webpart-base';
/*import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
*/
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import * as strings from 'GetListItemsWebPartStrings';
//*** Custom Imports ***/
require('popper.js');
import 'jquery';
import 'bootstrap';
import './styles/custom.css';
var GetListItemsWebPart = /** @class */ (function (_super) {
    __extends(GetListItemsWebPart, _super);
    function GetListItemsWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GetListItemsWebPart.prototype._getListData = function () {
        return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + "/_api/web/lists/GetByTitle('Useful Links')/Items?$orderby=LinkGroup&$orderby=LinkID", SPHttpClient.configurations.v1)
            .then(function (response) {
            return response.json();
        });
    };
    GetListItemsWebPart.prototype.ButtonClick = function (oldVal) {
        var currentWebUrl = this.context.pageContext.web.absoluteUrl;
        window.open(currentWebUrl + '/Lists/UsefulLinks/AllItems.aspx', '_blank');
        //return "test"  
    };
    GetListItemsWebPart.prototype._renderListAsync = function () {
        var _this = this;
        if (Environment.type == EnvironmentType.SharePoint ||
            Environment.type == EnvironmentType.ClassicSharePoint) {
            this._getListData()
                .then(function (response) {
                _this._renderList(response.value);
            });
        }
    };
    GetListItemsWebPart.prototype._renderList = function (items) {
        var _this = this;
        var currentWebUrl = this.context.pageContext.web.absoluteUrl;
        var html = '';
        var prevLinkGroup = '';
        var groupCardHTML = '';
        var linkHTML = '';
        var linkCount = 0;
        var groupID = 1;
        console.log(currentWebUrl);
        items.forEach(function (item) {
            var linkGroup = item.LinkGroup;
            var linkTeam = item.LinkTeam;
            var cardIDName = item.LinkGroup.replace(/\s/g, '');
            var linkGroupId = Math.floor(item.LinkGroupID);
            var linkName = item.LinkName;
            var groupRef = "";
            switch (linkGroupId) {
                case 3: {
                    groupRef = "#maxLinks";
                    break;
                }
                case 2: {
                    groupRef = "#buLinks";
                    break;
                }
                case 1: {
                    groupRef = "#teamLinks";
                    break;
                }
            }
            console.log(linkTeam);
            var groupContainer = _this.domElement.querySelector(groupRef);
            if (linkGroup !== prevLinkGroup) {
                groupCardHTML = "<!-- ***** Group " + groupID + (" is the " + item.LinkGroup + " links ***** -->\n                        <div class=\"card\" id=\"usefulLinks") + cardIDName + "\">                     \n                          <a class=\"card-link\" data-toggle=\"collapse\" href=\"#group" + groupID + "\" style=\"text-decoration:none\">\n                            <div class=\"card-header\">\n                              <h5 id=\"groupTitle" + groupID + ("\">" + item.LinkGroup + "</h5>\n                              <div class=\"accordionToggle\"></div> \n                            </div>\n                          </a>\n                          <div id=\"group") + groupID + "\" class=\"card-body collapse\" data-parent=\"#linksAccordion\">\n                            <div class=\"list-group\" id=\"links" + cardIDName + ("\">\n                              <a href=\"" + item.LinkURL + "\" target=\"" + item.LinkBrowse + "\">\n                                <div class=\"list-group-item\">" + item.LinkName + "</div>\n                              </a>\n                            </div>\n                          </div>\n                        </div>");
                groupContainer.innerHTML = groupCardHTML;
                groupID++;
            }
            var linkContainer = _this.domElement.querySelector('#links' + cardIDName);
            if (linkGroup === prevLinkGroup && linkCount > 0) {
                $('#links' + cardIDName).append('<a href="${item.LinkURL}" target="${item.LinkBrowse}"><div class="list-group-item">' + linkName + '</div></a>');
                //linkHTML = `<a href="${item.LinkURL}" target="${item.LinkBrowse}"><div class="list-group-item">${item.LinkName}</div></a>`;
                //linkContainer.innerHTML= linkHTML;
            }
            prevLinkGroup = linkGroup;
            linkCount++;
        });
    };
    GetListItemsWebPart.prototype.render = function () {
        var bootstrapCssURL = "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css";
        var fontawesomeCssURL = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/regular.min.css";
        SPComponentLoader.loadCss(bootstrapCssURL);
        SPComponentLoader.loadCss(fontawesomeCssURL);
        this.domElement.innerHTML = "\n    <div class=\"usefulLinksSection\">\n      <div class=\"row linkContainer\" id=\"usefulLinks\">\n        <div id=\"linksAccordion\" style=\"width:100%\">                        \n          <div id=\"teamLinks\"></div>\n          <div id=\"buLinks\"></div>\n          <div id=\"maxLinks\"></div>\n        </div>\n      </div> \n    </div>";
        this._renderListAsync();
    };
    Object.defineProperty(GetListItemsWebPart.prototype, "dataVersion", {
        get: function () {
            return Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GetListItemsWebPart.prototype, "propertiesMetadata", {
        get: function () {
            return {
                'title': { isSearchablePlainText: true },
                'intro': { isHtmlString: true },
                'image': { isImageSource: true },
                'url': { isLink: true }
            };
        },
        enumerable: true,
        configurable: true
    });
    GetListItemsWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    groups: [
                        {
                            //groupName: strings.BasicGroupName,
                            groupFields: [
                                PropertyPaneTextField('description', {
                                    label: strings.DescriptionFieldLabel
                                }),
                                PropertyPaneButton('Edit Links', {
                                    text: "Edit Links",
                                    buttonType: PropertyPaneButtonType.Primary,
                                    onClick: this.ButtonClick.bind(this)
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return GetListItemsWebPart;
}(BaseClientSideWebPart));
export default GetListItemsWebPart;
//# sourceMappingURL=GetListItemsWebPart.js.map