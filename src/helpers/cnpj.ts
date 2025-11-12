export const removeCnpjPunctuation = (cnpj: string) => {
  return cnpj.replace(/[^\d]/g, "");
};

export const formatCNPJ = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};

export const isValidCNPJ = (cnpj: string): boolean => {
  const cleaned = cnpj.replace(/\D/g, "");
  if (cleaned.length !== 14) return false;

  if (/^(\d)\1+$/.test(cleaned)) return false;

  const toDigits = (s: string) => s.split("").map((d) => parseInt(d, 10));

  const numbers = toDigits(cleaned);

  const calcVerifier = (nums: number[], weights: number[]) => {
    const sum = nums.reduce((acc, num, idx) => acc + num * weights[idx], 0);
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const base12 = numbers.slice(0, 12);
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const v1 = calcVerifier(base12, weights1);
  if (v1 !== numbers[12]) return false;

  const base13 = [...base12, v1];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const v2 = calcVerifier(base13, weights2);
  return v2 === numbers[13];
};
