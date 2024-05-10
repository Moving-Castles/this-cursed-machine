export const parseError = (errorString: string): string => {
  // Improved regex to match text after "reason:" and before "Contract" if it appears, or till the end of the line otherwise.
  const regex = /reason:(.*)/;

  const match = regex.exec(errorString);

  if (match === null || match[1] === undefined) {
    return "unexpected error";
  } else {
    // This trims the result to remove any leading or trailing whitespace and handles if "Contract" is part of the error message.
    const errorMessage = match[1].split('Contract')[0].trim();
    return errorMessage;
  }
}