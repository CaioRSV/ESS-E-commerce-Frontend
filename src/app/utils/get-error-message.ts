export const getErrorMessage = (error: any, message?: string) => {
  return error?.response?.data?.messages.join(',') || message || 'Erro ao processar requisição';
}