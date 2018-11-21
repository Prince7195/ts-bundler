import * as requirejs from "requirejs";
import { Store } from "./GlobalConnector";

export class ReactLoader {
    widgets: any[];
    widgetInstances: any;
    basePath: string;
    onLoad: Function;
    localizationBase: string;
    subject: any;

    constructor() { 
        this.subject = Store.GlobalListener;
    }

    getBaseConfig() {
        let self = this;
        // RequireJS configuration object with default settings
        const baseConfig = {
            enforceDefine: true,
            baseUrl: self.basePath,
            paths: {
                "react": "react/umd/react.production.min",
                "react-dom": "react-dom/umd/react-dom.production.min"
            },
            onNodeCreated: function (node: any) {
                node.setAttribute("crossorigin", "anonymous");
            }
        };
        return baseConfig;
    }

    setBasePath(pathName: string) {
        this.basePath = pathName;
    }

    setLocalizationBase(pathName: string) {
        this.localizationBase = pathName;
    }

    addModule(widgetName: string, widgetPath: string) {
        this.widgets.push({
            widgetName: widgetName,
            widgetPath: widgetPath
        });
    }

    renderComponent(widgetName: string, rootElem: any, widgetProps: any) {
        var self = this;
        var widgetInstance = self.widgetInstances[widgetName];
        widgetInstance.CreateWidgetInstance(rootElem, widgetProps);
    }

    run() {
        var self = this;
        requirejs.config(self.getBaseConfig());
        self.pullWidgets()
            .then(function () {
                self.onLoad.call(self, { RenderComponent: self.renderComponent.bind(self) });
            })
            .catch(function (err: any) {
                console.error(err);
            });
    }

    pullWidgets() {
        var self = this;
        return new Promise(function (resolve: any, reject: any) {
            try {
                var pullCompleted = 0;
                self.widgets.forEach(function (widgetInfo) {
                    requirejs([widgetInfo.widgetPath], function (widget: any) {
                        self.widgetInstances[widgetInfo.widgetName] = widget.default;
                        pullCompleted++;
                        if (pullCompleted == self.widgets.length) {
                            resolve();
                        }
                    });
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }

    __loadLocalization(localeKey: any, localeUrl: any, headers: any) {
        return new Promise(function (resolve: any, reject: any) {
            var request = new Request(localeUrl, {
                method: 'GET',
                mode: 'cors',
                headers: new Headers(Object.assign({}, {
                    'Content-Type': 'application/json'
                }, headers))
            });
            fetch(request)
                .then(function (response) {
                    return response.json();
                })
                .then(function (json) {
                    resolve({
                        widgetName: localeKey,
                        messages: json
                    });
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    }
    preloadLocale(localeConfig, headers) {
        var self = this;
        return Promise.all(Object.keys(localeConfig).map(function (key) {
            return self.__loadLocalization(key, localeConfig[key], headers);
        }));
    }
}