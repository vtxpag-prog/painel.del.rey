/**
 * Validadores e formatadores de dados brasileiros (PT-BR)
 */

export function cleanNumeric(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Validação do algoritmo oficial de dígitos verificadores do CPF
 */
export function validateCPF(cpf: string): boolean {
  const clean = cleanNumeric(cpf);
  if (clean.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(clean)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(clean.charAt(i)) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== Number(clean.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number(clean.charAt(i)) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== Number(clean.charAt(10))) return false;

  return true;
}

export function formatCPF(value: string): string {
  const clean = cleanNumeric(value).slice(0, 11);
  return clean
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

/**
 * Validação do algoritmo oficial de dígitos verificadores do CNPJ
 */
export function validateCNPJ(cnpj: string): boolean {
  const clean = cleanNumeric(cnpj);

  if (clean.length !== 14) return false;

  // Rejeita sequências de dígitos iguais
  if (/^(\d)\1{13}$/.test(clean)) return false;

  // Primeiro dígito verificador
  let length = 12;
  let numbers = clean.substring(0, length);
  const digits = clean.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += Number(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== Number(digits.charAt(0))) return false;

  // Segundo dígito verificador
  length = 13;
  numbers = clean.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += Number(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== Number(digits.charAt(1))) return false;

  return true;
}

export function formatCNPJ(value: string): string {
  const clean = cleanNumeric(value).slice(0, 14);
  return clean
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function formatCEP(value: string): string {
  const clean = cleanNumeric(value).slice(0, 8);
  return clean.replace(/^(\d{5})(\d)/, '$1-$2');
}

export function formatPhone(value: string): string {
  const clean = cleanNumeric(value).slice(0, 11);
  if (clean.length <= 10) {
    return clean.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
  }
  return clean.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function formatDateBR(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTimeBR(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatCurrencyBR(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatPercentBR(value: number): string {
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
}
