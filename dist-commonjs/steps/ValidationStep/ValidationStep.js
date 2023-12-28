'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react$1 = require('react');
var react = require('@chakra-ui/react');
var ContinueButton = require('../../components/ContinueButton.js');
var useRsi = require('../../hooks/useRsi.js');
var dataMutations = require('./utils/dataMutations.js');
var columns = require('./components/columns.js');
var Table = require('../../components/Table.js');
var SubmitDataAlert = require('../../components/Alerts/SubmitDataAlert.js');
var SubmitSuccessAlert = require('../../components/Alerts/SubmitSuccessAlert.js');
var NoDataPresentAlert = require('../../components/Alerts/NoDataPresentAlert.js');

const ValidationStep = ({ initialData, file }) => {
    const { translations, fields, onClose, onSubmit, onDownload, rowHook, tableHook } = useRsi.useRsi(); //SPO-4200
    const styles = react.useStyleConfig("ValidationStep");
    const [data, setData] = react$1.useState(react$1.useMemo(() => dataMutations.addErrorsAndRunHooks(initialData, fields, rowHook, tableHook), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []));
    const [selectedRows, setSelectedRows] = react$1.useState(new Set());
    const [filterByErrors, setFilterByErrors] = react$1.useState(false);
    const [showSubmitAlert, setShowSubmitAlert] = react$1.useState(false);
    const [showSuccessSubmitAlert, setSuccessShowSubmitAlert] = react$1.useState(false); //SPO-4200
    const [showNoDataPresentAlert, setNoDataPresentAlert] = react$1.useState(false); //SPO-4200
    // const [showNoofErrorAlert, setNoofErrorAlert] = useState(false)
    const updateData = react$1.useCallback((rows) => {
        setData(dataMutations.addErrorsAndRunHooks(rows, fields, rowHook, tableHook));
    }, [setData, rowHook, tableHook, fields]);
    const deleteSelectedRows = () => {
        if (selectedRows.size) {
            const newData = data.filter((value) => !selectedRows.has(value.__index));
            updateData(newData);
            setSelectedRows(new Set());
        }
    };
    const updateRow = react$1.useCallback((rows, changedData) => {
        const changes = changedData?.indexes.reduce((acc, index) => {
            // when data is filtered val !== actual index in data
            const realIndex = data.findIndex((value) => value.__index === rows[index].__index);
            acc[realIndex] = rows[index];
            return acc;
        }, {});
        const newData = Object.assign([], data, changes);
        updateData(newData);
    }, [data, updateData]);
    const columns$1 = react$1.useMemo(() => columns.generateColumns(fields), [fields]);
    const tableData = react$1.useMemo(() => {
        if (filterByErrors) {
            return data.filter((value) => {
                if (value?.__errors) {
                    return Object.values(value.__errors)?.filter((err) => err.level === "error").length;
                }
                return false;
            });
        }
        return data;
    }, [data, filterByErrors]);
    const rowKeyGetter = react$1.useCallback((row) => row.__index, []);
    const submitData = async () => {
        const calculatedData = data.reduce((acc, value) => {
            const { __index, __errors, ...values } = value;
            if (__errors) {
                for (const key in __errors) {
                    if (__errors[key].level === "error") {
                        acc.invalidData.push(values);
                        return acc;
                    }
                }
            }
            acc.validData.push(values);
            return acc;
        }, { validData: [], invalidData: [], all: data });
        onSubmit(calculatedData, file);
        setShowSubmitAlert(false);
        setSuccessShowSubmitAlert(true); //SPO-4200
        setTimeout(() => {
            onClose();
        }, 10000);
    };
    //SPO-4200
    // const onClose = async () => {
    //   setSuccessShowSubmitAlert(true)
    //   console.log("hiting")
    // }
    //SPO-4200
    //SPO-3976 download csv
    const downloadData = async () => {
        const calculatedData = data.reduce((acc, value) => {
            const { __index, __errors, ...values } = value;
            if (__errors) {
                for (const key in __errors) {
                    if (__errors[key].level === "error") {
                        acc.invalidData.push(values);
                        return acc;
                    }
                }
            }
            acc.validData.push(values);
            // console.log(acc.invalidData.length)
            return acc;
        }, { validData: [], invalidData: [], all: data });
        onDownload(calculatedData, file);
        // setNoofErrorAlert(true)
        // onClose()
    };
    //SPO-3976 download csv
    const onContinue = () => {
        const invalidData = data.find((value) => {
            if (value?.__errors) {
                return !!Object.values(value.__errors)?.filter((err) => err.level === "error").length;
            }
            return false;
        });
        const validData = data.filter((value) => !value?.__errors).length;
        if (!invalidData) {
            submitData();
        }
        else if (!validData) {
            setNoDataPresentAlert(true); //SPO-4200
        }
        else {
            setShowSubmitAlert(true);
        }
    };
    const [noOfErrors, setNoOfErrors] = react$1.useState(0);
    const [noOfAllRows, setAllRows] = react$1.useState(0);
    const updateNoOfErrors = () => {
        const calculatedData = data.reduce((acc, value) => {
            const { __index, __errors, ...values } = value;
            if (__errors) {
                for (const key in __errors) {
                    if (__errors[key].level === "error") {
                        acc.invalidData.push(values);
                        return acc;
                    }
                }
            }
            acc.validData.push(values);
            // console.log(acc.invalidData.length)
            return acc;
        }, { validData: [], invalidData: [], all: data });
        setNoOfErrors(calculatedData.invalidData.length);
        setAllRows(calculatedData.all.length);
    };
    react$1.useEffect(() => {
        updateNoOfErrors();
    });
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(SubmitDataAlert.SubmitDataAlert, { isOpen: showSubmitAlert, onClose: () => setShowSubmitAlert(false), onConfirm: submitData }), jsxRuntime.jsx(SubmitSuccessAlert.SubmitSuccessAlert, { isOpen: showSuccessSubmitAlert, onClose: () => setSuccessShowSubmitAlert(false) }), jsxRuntime.jsx(NoDataPresentAlert.NoDataPresentAlert, { isOpen: showNoDataPresentAlert, onClose: () => setNoDataPresentAlert(false) }), jsxRuntime.jsxs(react.ModalBody, { pb: 0, children: [jsxRuntime.jsxs(react.Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: "2rem", flexWrap: "wrap", gap: "8px", children: [jsxRuntime.jsx(react.Heading, { sx: styles.heading, children: translations.validationStep.title }), jsxRuntime.jsxs(react.Box, { display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap", children: [noOfErrors > 0 && (jsxRuntime.jsxs(react.Box, { children: [jsxRuntime.jsx(react.Box, { as: "span", color: "red", children: `${noOfErrors}`.trim() }), "/", `${noOfAllRows}`, " ", `${translations.validationStep.noOfErrorRows}`, " ", jsxRuntime.jsx(react.Button, { variant: "outline", size: "sm", onClick: downloadData, children: translations.validationStep.downloadButtonTitle })] })), jsxRuntime.jsx(react.Button, { variant: "outline", size: "sm", onClick: deleteSelectedRows, children: translations.validationStep.discardButtonTitle }), jsxRuntime.jsx(react.Switch, { display: "flex", alignItems: "center", isChecked: filterByErrors, onChange: () => setFilterByErrors(!filterByErrors), children: translations.validationStep.filterSwitchTitle })] })] }), jsxRuntime.jsx(Table.Table, { rowKeyGetter: rowKeyGetter, rows: tableData, onRowsChange: updateRow, columns: columns$1, selectedRows: selectedRows, onSelectedRowsChange: setSelectedRows, components: {
                            noRowsFallback: (jsxRuntime.jsx(react.Box, { display: "flex", justifyContent: "center", gridColumn: "1/-1", mt: "32px", children: filterByErrors
                                    ? translations.validationStep.noRowsMessageWhenFiltered
                                    : translations.validationStep.noRowsMessage })),
                        } })] }), jsxRuntime.jsx(ContinueButton.ContinueButton, { onContinue: onContinue, title: translations.validationStep.nextButtonTitle })] }));
};

exports.ValidationStep = ValidationStep;
