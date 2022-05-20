export const parseError = (error: any): string => {
  if (error.status) {
    if (error.data?.message)
      return error.data.message;

    return error.statusText;
  }

  return error.message;
}
