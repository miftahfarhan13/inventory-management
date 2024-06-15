export function showAlertConfirmation(message: string, callback: any) {
  const userConfirmed = window.confirm(message);
  callback(userConfirmed);
}
