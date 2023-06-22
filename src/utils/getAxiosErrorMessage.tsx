import { AxiosError } from 'axios';

function isAxiosError(error: any): error is AxiosError<Error> {
  return (
    error.isAxiosError &&
    error.response.data &&
    'message' in error.response.data
  );
}

export function getPossibleAxiosErrorMessage(error: unknown): string {
  console.log(error);
  if (!isAxiosError(error)) {
    return String(error);
  } else {
    let errMsg = 'An error occurred';
    // AxiosError has a 'message' property directly
    if (error.message) {
      errMsg = error.message;
    }
    // The error response might have more specific details
    if (error.response?.data) {
      errMsg = error.response.data.message;
    }
    return errMsg;
  }
}
