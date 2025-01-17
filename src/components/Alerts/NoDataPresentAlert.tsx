//SPO-4200
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react"
import { useRef } from "react"
import { useRsi } from "../../hooks/useRsi"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const NoDataPresentAlert = ({ isOpen, onClose }: Props) => {
  const { allowInvalidSubmit, translations } = useRsi()
  const cancelRef = useRef<HTMLButtonElement | null>(null)

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef} isCentered id="rsi">
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {translations.alerts.noValidDataFound.headerTitle}
          </AlertDialogHeader>
          <AlertDialogBody>{translations.alerts.noValidDataFound.successMessage}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} variant="secondary">
              {translations.alerts.submitIncomplete.cancelButtonTitle}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
