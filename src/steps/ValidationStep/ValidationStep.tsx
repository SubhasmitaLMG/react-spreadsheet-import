import { useCallback, useMemo, useState, useEffect } from "react"
import { Box, Button, Heading, ModalBody, Switch, useStyleConfig, Input } from "@chakra-ui/react"
import { ContinueButton } from "../../components/ContinueButton"
import { useRsi } from "../../hooks/useRsi"
import type { Meta } from "./types"
import { addErrorsAndRunHooks } from "./utils/dataMutations"
import { generateColumns } from "./components/columns"
import { Table } from "../../components/Table"
import { SubmitDataAlert } from "../../components/Alerts/SubmitDataAlert"
import type { Data } from "../../types"
import type { themeOverrides } from "../../theme"
import type { RowsChangeData } from "react-data-grid"

type Props<T extends string> = {
  initialData: Data<T>[]
  file: File
}

export const ValidationStep = <T extends string>({ initialData, file }: Props<T>) => {
  const { translations, fields, onClose, onSubmit, onDownload, rowHook, tableHook } = useRsi<T>()
  const styles = useStyleConfig(
    "ValidationStep",
  ) as (typeof themeOverrides)["components"]["ValidationStep"]["baseStyle"]

  const [data, setData] = useState<(Data<T> & Meta)[]>(
    useMemo(
      () => addErrorsAndRunHooks<T>(initialData, fields, rowHook, tableHook),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    ),
  )
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<number | string>>(new Set())
  const [filterByErrors, setFilterByErrors] = useState(false)
  const [showSubmitAlert, setShowSubmitAlert] = useState(false)
  // const [showNoofErrorAlert, setNoofErrorAlert] = useState(false)

  const updateData = useCallback(
    (rows: typeof data) => {
      setData(addErrorsAndRunHooks<T>(rows, fields, rowHook, tableHook))
    },
    [setData, rowHook, tableHook, fields],
  )

  const deleteSelectedRows = () => {
    if (selectedRows.size) {
      const newData = data.filter((value) => !selectedRows.has(value.__index))
      updateData(newData)
      setSelectedRows(new Set())
    }
  }

  const updateRow = useCallback(
    (rows: typeof data, changedData?: RowsChangeData<(typeof data)[number]>) => {
      const changes = changedData?.indexes.reduce((acc, index) => {
        // when data is filtered val !== actual index in data
        const realIndex = data.findIndex((value) => value.__index === rows[index].__index)
        acc[realIndex] = rows[index]
        return acc
      }, {} as Record<number, (typeof data)[number]>)
      const newData = Object.assign([], data, changes)
      updateData(newData)
    },
    [data, updateData],
  )

  const columns = useMemo(() => generateColumns(fields), [fields])

  const tableData = useMemo(() => {
    if (filterByErrors) {
      return data.filter((value) => {
        if (value?.__errors) {
          return Object.values(value.__errors)?.filter((err) => err.level === "error").length
        }
        return false
      })
    }
    return data
  }, [data, filterByErrors])

  const rowKeyGetter = useCallback((row: Data<T> & Meta) => row.__index, [])

  const submitData = async () => {
    const calculatedData = data.reduce(
      (acc, value) => {
        const { __index, __errors, ...values } = value
        if (__errors) {
          for (const key in __errors) {
            if (__errors[key].level === "error") {
              acc.invalidData.push(values as unknown as Data<T>)
              return acc
            }
          }
        }
        acc.validData.push(values as unknown as Data<T>)
        return acc
      },
      { validData: [] as Data<T>[], invalidData: [] as Data<T>[], all: data },
    )
    onSubmit(calculatedData, file)
    setShowSubmitAlert(false)
    onClose()
  }
  //SPO-3976 download csv
  const downloadData = async () => {
    const calculatedData = data.reduce(
      (acc, value) => {
        const { __index, __errors, ...values } = value
        if (__errors) {
          for (const key in __errors) {
            if (__errors[key].level === "error") {
              acc.invalidData.push(values as unknown as Data<T>)
              return acc
            }
          }
        }
        acc.validData.push(values as unknown as Data<T>)
        console.log(acc.invalidData.length)
        return acc
      },
      { validData: [] as Data<T>[], invalidData: [] as Data<T>[], all: data },
    )
    onDownload(calculatedData, file)
    // setNoofErrorAlert(true)
    // onClose()
  }
  //SPO-3976 download csv
  const onContinue = () => {
    const invalidData = data.find((value) => {
      if (value?.__errors) {
        return !!Object.values(value.__errors)?.filter((err) => err.level === "error").length
      }
      return false
    })
    if (!invalidData) {
      submitData()
    } else {
      setShowSubmitAlert(true)
    }
  }

  const [noOfErrors, setNoOfErrors] = useState(0)
  const [noOfAllRows, setAllRows] = useState(0)

  const updateNoOfErrors = () => {
    const calculatedData = data.reduce(
      (acc, value) => {
        const { __index, __errors, ...values } = value
        if (__errors) {
          for (const key in __errors) {
            if (__errors[key].level === "error") {
              acc.invalidData.push(values as unknown as Data<T>)
              return acc
            }
          }
        }
        acc.validData.push(values as unknown as Data<T>)
        console.log(acc.invalidData.length)
        return acc
      },
      { validData: [] as Data<T>[], invalidData: [] as Data<T>[], all: data },
    )
    setNoOfErrors(calculatedData.invalidData.length)
    setAllRows(calculatedData.all.length)
  }

  useEffect(() => {
    updateNoOfErrors()
  })

  return (
    <>
      <SubmitDataAlert isOpen={showSubmitAlert} onClose={() => setShowSubmitAlert(false)} onConfirm={submitData} />
      {/* <SubmitDataAlert isOpen={showNoofErrorAlert} onClose={() => setNoofErrorAlert(false)} onConfirm={submitData} /> */}
      <ModalBody pb={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb="2rem" flexWrap="wrap" gap="8px">
          <Heading sx={styles.heading}>{translations.validationStep.title}</Heading>
          <Box display="flex" gap="16px" alignItems="center" flexWrap="wrap">
            {/* //SPO-3976 show no of error */}
            {/* <Box>
              <Box as="span" color={noOfErrors > 0 ? "red" : "inherit"}>
                {`${noOfErrors}`.trim()}
              </Box>
              /{`${noOfAllRows}`} {`${translations.validationStep.noOfErrorRows}`}.
              <Button variant="outline" size="sm" onClick={downloadData}>
                {translations.validationStep.downloadButtonTitle}
              </Button>
            </Box> */}
            {/* //SPO-3976 download csv */}
            {/* //SPO-3976 download csv */}
            {noOfErrors > 0 && (
              <Box>
                {/* //SPO-3976 show no of error */}
                <Box as="span" color="red">
                  {`${noOfErrors}`.trim()}
                </Box>
                /{`${noOfAllRows}`} {`${translations.validationStep.noOfErrorRows}`}
                {/* //SPO-3976 show no of error */}{" "}
                <Button variant="outline" size="sm" onClick={downloadData}>
                  {translations.validationStep.downloadButtonTitle}
                </Button>
              </Box>
            )}
            {/* //SPO-3976 download csv */}
            <Button variant="outline" size="sm" onClick={deleteSelectedRows}>
              {translations.validationStep.discardButtonTitle}
            </Button>
            <Switch
              display="flex"
              alignItems="center"
              isChecked={filterByErrors}
              onChange={() => setFilterByErrors(!filterByErrors)}
            >
              {translations.validationStep.filterSwitchTitle}
            </Switch>
          </Box>
        </Box>
        <Table
          rowKeyGetter={rowKeyGetter}
          rows={tableData}
          onRowsChange={updateRow}
          columns={columns}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
          components={{
            noRowsFallback: (
              <Box display="flex" justifyContent="center" gridColumn="1/-1" mt="32px">
                {filterByErrors
                  ? translations.validationStep.noRowsMessageWhenFiltered
                  : translations.validationStep.noRowsMessage}
              </Box>
            ),
          }}
        />
      </ModalBody>
      <ContinueButton onContinue={onContinue} title={translations.validationStep.nextButtonTitle} />
    </>
  )
}
