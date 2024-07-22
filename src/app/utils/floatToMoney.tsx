export function floatToMoney(number:number) {
    if (typeof number !== 'number' || isNaN(number)) {
      return 'Erro: Número inválido';
    }
  
    const numeroFormatado = number.toFixed(2);
  
    const [intPart, decimalPart] = numeroFormatado.split('.');
  
    const moneyFormat = intPart + '.' + decimalPart;
    return moneyFormat;
  }