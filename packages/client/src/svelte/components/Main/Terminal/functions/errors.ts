// Handle contract errors
export const parseError = (string: string) => {
  const regex = /(?<=following reason:)([\s\S]*?)(?=Contract)/

  const match = regex.exec(string)

  if (match === null) {
    return "unexpected error"
  } else {
    return match[0].trim()
  }
}