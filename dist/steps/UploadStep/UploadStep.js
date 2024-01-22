import { jsxs, jsx } from 'react/jsx-runtime';
import { useStyleConfig, ModalBody, Heading, Text, Box, Button } from '@chakra-ui/react';
import { DropZone } from './components/DropZone.js';
import { useRsi } from '../../hooks/useRsi.js';
import { ExampleTable } from './components/ExampleTable.js';
import { useState, useCallback } from 'react';
import { FadingOverlay } from './components/FadingOverlay.js';

const UploadStep = ({ onContinue }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const styles = useStyleConfig("UploadStep");
    const { translations, fields, DownloadDbData } = useRsi(); //SPO-3976
    const handleOnContinue = useCallback(async (data, file) => {
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
    return (jsxs(ModalBody, { children: [jsx(Heading, { sx: styles.heading, children: translations.uploadStep.title }), jsx(Text, { sx: styles.title, children: translations.uploadStep.manifestTitle }), jsx(Text, { sx: styles.subtitle, children: translations.uploadStep.manifestDescription }), jsxs(Box, { sx: styles.tableWrapper, children: [jsx(Button, { onClick: downloaddbData, sx: styles.dropzoneButton, isLoading: downloadLoading, children: translations.uploadStep.downloaddbdata }), jsx(ExampleTable, { fields: fields }), jsx(FadingOverlay, {})] }), jsx(DropZone, { onContinue: handleOnContinue, isLoading: isLoading })] }));
};

export { UploadStep };
