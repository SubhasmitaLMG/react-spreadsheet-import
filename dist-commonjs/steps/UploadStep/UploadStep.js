'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react$1 = require('@chakra-ui/react');
var DropZone = require('./components/DropZone.js');
var useRsi = require('../../hooks/useRsi.js');
var ExampleTable = require('./components/ExampleTable.js');
var react = require('react');
var FadingOverlay = require('./components/FadingOverlay.js');

const UploadStep = ({ onContinue }) => {
    const [isLoading, setIsLoading] = react.useState(false);
    const [downloadLoading, setDownloadLoading] = react.useState(false);
    const styles = react$1.useStyleConfig("UploadStep");
    const { translations, fields, DownloadDbData } = useRsi.useRsi(); //SPO-3976
    const handleOnContinue = react.useCallback(async (data, file) => {
        setIsLoading(true);
        await onContinue(data, file);
        setIsLoading(false);
    }, [onContinue]);
    //SPO-3976
    const downloaddbData = async () => {
        try {
            setDownloadLoading(true);
            await DownloadDbData();
        }
        finally {
            setDownloadLoading(false);
        }
        // DownloadDbData()
    };
    //SPO-3976
    return (jsxRuntime.jsxs(react$1.ModalBody, { children: [jsxRuntime.jsx(react$1.Heading, { sx: styles.heading, children: translations.uploadStep.title }), jsxRuntime.jsx(react$1.Text, { sx: styles.title, children: translations.uploadStep.manifestTitle }), jsxRuntime.jsx(react$1.Text, { sx: styles.subtitle, children: translations.uploadStep.manifestDescription }), jsxRuntime.jsxs(react$1.Box, { sx: styles.tableWrapper, children: [jsxRuntime.jsx(react$1.Button, { onClick: downloaddbData, sx: styles.dropzoneButton, isLoading: downloadLoading, children: translations.uploadStep.downloaddbdata }), jsxRuntime.jsx(ExampleTable.ExampleTable, { fields: fields }), jsxRuntime.jsx(FadingOverlay.FadingOverlay, {})] }), jsxRuntime.jsx(DropZone.DropZone, { onContinue: handleOnContinue, isLoading: isLoading })] }));
};

exports.UploadStep = UploadStep;
