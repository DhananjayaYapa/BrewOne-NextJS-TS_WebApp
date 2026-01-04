import { MAX_SIGN_IN_ATTEMPTS } from "./configs";

export const API_MESSAGES = {
    FAILED_GET: 'Something went wrong with the API. Please try again later.'
}

export const SIGN_IN_MESSAGES = {
    CONTACT_ADMIN: "Please contact the system administrator to reset your password.",
    INCORRECT_CREDENTIAL: (attemptsLeft: number) => `Incorrect username or password. You have ${attemptsLeft} attempts left. ${MAX_SIGN_IN_ATTEMPTS} attempts`,
    USERNAME_ERROR: "Email is required.",
    PASSWORD_ERROR: "Password is required.",
    SIGN_IN_ERROR: "Error signing in. Please try again.",
    SIGN_IN_OUT_ERROR: "Error signing out."
}

export const CHANGE_PASSWORD_MESSAGES= {
    CURRENT_PASSWORD_REQUIRED : "Old password required.",
    NEW_PASSWORD_REQUIRED: "New Password is required.",
    CONFIRMED_PASSWORD_REQUIRED: "Please confirm your new password.",
    CURRENT_PASSWORD_INCORRECT: "Incorrect old password.",
    NEW_PASSWORD_AND_CONFIRMATION_PASSWORD_NOT_MATCH: "Password do not match.",
    CHANGE_PASSWORD_ERROR : "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character (e.g., Example1!).",
    ERROR_OCCURRED : "Error occurred.",
    SUCCESSFULLY_UPDATED_PASSWORD: "You have successfully updated your password. Please sign in with your new password.",
}

export const EDIT_LOT_FIELD_ERRORS = {
    STORE_ADDRESS_REQUIRED: "Store address is required.",
    STANDARD_NAME_REQUIRED: "Standard name is required.",
    MAIN_BUYER_REQUIRED: "Main buyer is required.",
    ITEM_CODE_REQUIRED: "Item code is required.",
    NUMBER_OF_BAGS_REQUIRED: "Changing the number of bags is required.",
    WEIGHT_PER_BAG_REQUIRED: "Changing the Weight per bag is required.",
    PRICE_REQUIRED: "Price is required.",
    PRICE_ZERO: "Price cannot be zero.",
    PRICE_NEGATIVE: "Price cannot be negative.",
    POSTING_DATE_REQUIRED: "Posting date is required.",
    SAVE_CHANGES:"Please save or cancel your changes before leaving.",
    CANCEL_MESSAGE :"Are you sure you want to cancel? Any unsaved changes will be lost."
};

export const EDIT_GRADING_FIELD_ERRORS ={
    STANDARD_ERROR: "Cannot clear standard field values.",
    PRICE_ERROR: "Price field values cannot be 0, less than 0 or empty",
    BUYER_ERROR: "Cannot clear buyer field values."
}
