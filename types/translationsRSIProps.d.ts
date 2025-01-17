import type { DeepPartial } from "ts-essentials";
export declare const translations: {
    uploadStep: {
        title: string;
        manifestTitle: string;
        manifestDescription: string;
        downloaddbdata: string;
        maxRecordsExceeded: (maxRecords: string) => string;
        dropzone: {
            title: string;
            errorToastDescription: string;
            activeDropzoneTitle: string;
            buttonTitle: string;
            loadingTitle: string;
        };
        selectSheet: {
            title: string;
            nextButtonTitle: string;
        };
    };
    selectHeaderStep: {
        title: string;
        nextButtonTitle: string;
    };
    matchColumnsStep: {
        title: string;
        nextButtonTitle: string;
        userTableTitle: string;
        templateTitle: string;
        selectPlaceholder: string;
        ignoredColumnText: string;
        subSelectPlaceholder: string;
        matchDropdownTitle: string;
        unmatched: string;
        duplicateColumnWarningTitle: string;
        duplicateColumnWarningDescription: string;
    };
    validationStep: {
        title: string;
        nextButtonTitle: string;
        noRowsMessage: string;
        noRowsMessageWhenFiltered: string;
        discardButtonTitle: string;
        filterSwitchTitle: string;
        downloadButtonTitle: string;
        noOfErrorRows: string;
    };
    alerts: {
        confirmClose: {
            headerTitle: string;
            bodyText: string;
            cancelButtonTitle: string;
            exitButtonTitle: string;
        };
        submitIncomplete: {
            headerTitle: string;
            bodyText: string;
            bodyTextSubmitForbidden: string;
            cancelButtonTitle: string;
            finishButtonTitle: string;
        };
        unmatchedRequiredFields: {
            headerTitle: string;
            bodyText: string;
            listTitle: string;
            cancelButtonTitle: string;
            continueButtonTitle: string;
        };
        submitSuccess: {
            headerTitle: string;
            successMessage: string;
            closeButtonTitle: string;
        };
        noValidDataFound: {
            headerTitle: string;
            successMessage: string;
        };
        toast: {
            error: string;
        };
    };
};
export type TranslationsRSIProps = DeepPartial<typeof translations>;
export type Translations = typeof translations;
