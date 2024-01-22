import type XLSX from "xlsx-ugnis"
import { Box, Heading, ModalBody, Text, useStyleConfig, Button } from "@chakra-ui/react"
import { DropZone } from "./components/DropZone"
import { useRsi } from "../../hooks/useRsi"
import { ExampleTable } from "./components/ExampleTable"
import { useCallback, useState } from "react"
import { FadingOverlay } from "./components/FadingOverlay"
import type { themeOverrides } from "../../theme"

type UploadProps = {
  onContinue: (data: XLSX.WorkBook, file: File) => Promise<void>
}

export const UploadStep = ({ onContinue }: UploadProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const styles = useStyleConfig("UploadStep") as (typeof themeOverrides)["components"]["UploadStep"]["baseStyle"]
  const { translations, fields, DownloadDbData } = useRsi() //SPO-3976
  const handleOnContinue = useCallback(
    async (data: XLSX.WorkBook, file: File) => {
      setIsLoading(true)
      await onContinue(data, file)
      setIsLoading(false)
    },
    [onContinue],
  )
  //SPO-3976
  const downloaddbData = async () => {
    try {
      setDownloadLoading(true)
      await DownloadDbData()
    } finally {
      setDownloadLoading(false)
    }
    // DownloadDbData()
  }
  //SPO-3976
  return (
    <ModalBody>
      <Heading sx={styles.heading}>{translations.uploadStep.title}</Heading>
      <Text sx={styles.title}>{translations.uploadStep.manifestTitle}</Text>
      <Text sx={styles.subtitle}>{translations.uploadStep.manifestDescription}</Text>
      <Box sx={styles.tableWrapper}>
        {/* //SPO-3976 */}
        <Button onClick={downloaddbData} sx={styles.dropzoneButton} isLoading={downloadLoading}>
          {translations.uploadStep.downloaddbdata}
        </Button>
        {/* //SPO-3976 */}
        <ExampleTable fields={fields} />
        <FadingOverlay />
      </Box>
      <DropZone onContinue={handleOnContinue} isLoading={isLoading} />
    </ModalBody>
  )
}
