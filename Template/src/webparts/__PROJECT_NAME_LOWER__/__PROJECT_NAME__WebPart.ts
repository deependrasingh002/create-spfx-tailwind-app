import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import "../../tailwind.generated.css";
import * as strings from 'TemplateSpfxWebPartStrings';
import __PROJECT_NAME__ from "./components/__PROJECT_NAME__";
import { I__PROJECT_NAME__Props } from './components/I__PROJECT_NAME__Props';
import $ from "jquery";
export interface I__PROJECT_NAME__WebPartProps {
  description: string;
}

export default class __PROJECT_NAME__WebPart extends BaseClientSideWebPart<I__PROJECT_NAME__WebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = "";
  public getCurrentUserGroups(requester: SPHttpClient, siteUrl: string): any {
    try {
      return requester
        .get(
          `${siteUrl}/_api/web/currentuser/?$select=Title,Email,LoginName,Id&$expand=groups`,
          SPHttpClient.configurations.v1,
          {
            headers: {
              Accept: "application/json;odata=verbose",
              "odata-version": "",
            },
          },
        )
        .then((response: SPHttpClientResponse) => {
          return response.json();
        })
        .then((json: any) => {
          return json;
        });
    } catch (error: any) {
      console.log(
        `Error occured in getEntity method in factory.ts. Error message: ${error.message}`,
      );
      throw error;
    }
  }

  public render(): void {
    this.getCurrentUserGroups(
      this.context.spHttpClient,
      this.context.pageContext.web.absoluteUrl,
    ).then((currentUser: any) => {
      const element: React.ReactElement<I__PROJECT_NAME__Props> =
        React.createElement(__PROJECT_NAME__, {
          newcontext: this.context,
          newsiteUrl: this.context.pageContext.web.absoluteUrl,
          newlistName: "",
          newspHttpClient: this.context.spHttpClient,
          newrelativeUrl: this.context.pageContext.web.serverRelativeUrl,
          newcurrentUserId: currentUser?.d?.Id ? currentUser.d.Id : -1,
          newcurrentUserName: currentUser?.d?.Title ? currentUser.d.Title : "",
          newgroups: currentUser?.d?.Groups?.results || [],
          newcurrentUserEmail: this.context.pageContext.user.email,
        });

      ReactDom.render(element, this.domElement);
    });
  }

  protected onInit(): Promise<void> {
    return super.onInit().then(() => {
      document.title = "MIS Repository";

      // Add body class safely
      $("body").addClass("ms-backgroundImage");

      // Inject CSS (FIXED - all rules together)
      const style = document.createElement("style");
      style.innerHTML = `
      #spLeftNav,
      #SuiteNavWrapper,
      #CommentsWrapper,
      #sp-appBar,
      .headerRow-107,
      .commandBarButtonHeightAndColor,
      .fui-Toolbar,
      .simpleFooterContainer-196,
      .p_i-Dej_1x34n,
      div[data-automation-id="pageHeader"],
      div[data-automation-id="SiteHeader"],
      div[data-automation-id="MegaFooter"],
      div[data-automation-id="gradientBox"],
      div[data-automation-id="LeftNavGroups"] {
        display: none !important;
      }
    `;
      document.head.appendChild(style);

      // Delay + repeat (IMPORTANT for SPFx dynamic DOM)
      const hideElements = () => {
        $("div[data-automation-id='pageHeader']").hide();
        $("div[data-automation-id='SiteHeader']").hide();
        $("div[data-automation-id='SimpleFooter']").parent().hide();
        $("div[data-automation-id='SiteHeaderOverlay']").parent().hide();
        $("div[data-automation-id='MegaFooter']").hide();
        $("div[data-automation-id='gradientBox']").parent().hide();
        $("div[data-automation-id='LeftNavGroups']").parent().hide();

        $("#spLeftNav").hide();
        $("#SuiteNavWrapper").hide();
        $("#CommentsWrapper").hide();
        $("#sp-appBar").hide();

        $(".headerRow-107").hide();
        $(".commandBarButtonHeightAndColor").hide();
        $(".fui-Toolbar").hide();
      };

      // Run multiple times (handles re-render)
      const interval = setInterval(hideElements, 1000);

      // Stop after 10 seconds (optional cleanup)
      setTimeout(() => clearInterval(interval), 10000);

     
    });
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty(
        "--bodyText",
        semanticColors.bodyText || null,
      );
      this.domElement.style.setProperty("--link", semanticColors.link || null);
      this.domElement.style.setProperty(
        "--linkHovered",
        semanticColors.linkHovered || null,
      );
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
