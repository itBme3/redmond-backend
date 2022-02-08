import { Injectable } from '@angular/core';
import { WindowRef } from '../services/window-ref';
import { DocumentRef } from './document-ref';
import { setTimeout$ } from './funcs';

@Injectable({
  providedIn: 'root'
})
export class PdfViewerService {
    constructor(private windowRef: WindowRef, private documentRef: DocumentRef) {}

    readyPromise: Promise<any> = new Promise((resolve) => {
        if (this.windowRef.nativeWindow.AdobeDC || !!!this.documentRef?.nativeDocument?.addEventListener) {
            resolve(null);
        } else {
            /* Wait for Adobe Document Services PDF Embed API to be ready */
            this.documentRef.nativeDocument.addEventListener('adobe_dc_view_sdk.ready', () => {
                resolve(null);
            });
        }
    });
    adobeDCView: any;

    ready() {
        return this.readyPromise;
    }

    previewFile(src:string, divId: string, viewerConfig: any) {
        const config: any = {
            /* Pass your registered client id */
            clientId: 'ed898bb5c1634224a6520d4df609dcd1',
        };
        if (divId) { /* Optional only for Light Box embed mode */
            /* Pass the div id in which PDF should be rendered */
            config.divId = divId;
        }
        /* Initialize the AdobeDC View object */
        this.adobeDCView = new this.windowRef.nativeWindow.AdobeDC.View(config);

        /* Invoke the file preview API on Adobe DC View object */
        const previewFilePromise = this.adobeDCView.previewFile({
            /* Pass information on how to access the file */
            content: {
                /* Location of file where it is hosted */
                location: {
                    url: src,
                    /*
                    If the file URL requires some additional headers, then it can be passed as follows:-
                    headers: [
                        {
                            key: '<HEADER_KEY>',
                            value: '<HEADER_VALUE>',
                        }
                    ]
                    */
                },
          },
          /*
            // Pass meta data of file 
            metaData: {
                // file name 
                fileName: 'Bodea Brochure.pdf',
                // file ID 
                id: '6d07d124-ac85-43b3-a867-36930f502ac6',
            }
            */
        }, viewerConfig);

        return previewFilePromise;
    }

    previewFileUsingFilePromise(divId: string, filePromise: Promise<string | ArrayBuffer>, fileName: any) {
        /* Initialize the AdobeDC View object */
        this.adobeDCView = new this.windowRef.nativeWindow.AdobeDC.View({
            /* Pass your registered client id */
            clientId: 'ed898bb5c1634224a6520d4df609dcd1',
            /* Pass the div id in which PDF should be rendered */
            divId,
        });

        /* Invoke the file preview API on Adobe DC View object */
        this.adobeDCView.previewFile({
            /* Pass information on how to access the file */
            content: {
                /* pass file promise which resolve to arrayBuffer */
                promise: filePromise,
            },
            /* Pass meta data of file */
            metaData: {
                /* file name */
                fileName
            }
        }, {});
    }

    registerSaveApiHandler() {
        /* Define Save API Handler */
        const saveApiHandler = (metaData: any, content: any, options: any) => {
            console.log(metaData, content, options);
            return new Promise((resolve) => {
                /* Dummy implementation of Save API, replace with your business logic */
                setTimeout$(() => {
                    const response = {
                        code: this.windowRef.nativeWindow.AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
                        data: {
                            metaData: Object.assign(metaData, { updatedAt: new Date().getTime() })
                        },
                    };
                    resolve(response);
                }, 2000);
            });
        };

        this.adobeDCView.registerCallback(
            this.windowRef.nativeWindow.AdobeDC.View.Enum.CallbackType.SAVE_API,
            saveApiHandler,
            {}
        );
    }

    registerEventsHandler() {
        /* Register the callback to receive the events */
        this.adobeDCView.registerCallback(
            /* Type of call back */
            this.windowRef.nativeWindow.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
            /* call back function */
            (event: any) => {
                console.log(event);
            },
            /* options to control the callback execution */
            {
                /* Enable PDF analytics events on user interaction. */
                enablePDFAnalytics: true,
            }
        );
    }
}

