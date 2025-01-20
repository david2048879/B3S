
import { toast } from "react-toastify"
export const archivingValidation = (documentType, document) => {
    if (documentType.docType === "Loan document") {
        if (document.Customer_ID.length !== 10 && document.Customer_ID.length !== 7) {
            toast.error("Customer number can be between 10 and 7 only")
            return
        }
    }
    return true;
}