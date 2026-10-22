export function authErrorMessage(error, sendsEmail = false) {
  if (error.response?.data?.message) return error.response.data.message;
  if (sendsEmail && (!error.response || error.code === 'ECONNABORTED')) {
    return 'No pudimos confirmar el resultado. Revisa tu correo y la carpeta de spam antes de volver a intentarlo; el envío podría haberse completado.';
  }
  return 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.';
}
