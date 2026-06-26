import axios from "axios";

export const removeCpfPunctuation = (cpf: string) => {
  return cpf.replace(/[\.\-]/g, "");
};

export const maskCPF = (value: string) => {
  const digits = value.replace(/\D/g, "");
  const truncated = digits.slice(0, 11);

  return truncated
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const validarCpfLocalmente = (cpf: string): boolean => {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);

  let firstVerifier = (sum * 10) % 11;
  firstVerifier = firstVerifier === 10 ? 0 : firstVerifier;

  if (firstVerifier !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);

  let secondVerifier = (sum * 10) % 11;
  secondVerifier = secondVerifier === 10 ? 0 : secondVerifier;

  return secondVerifier === parseInt(cpf.charAt(10));
};

export const isValideCPF = async (cpf: string): Promise<boolean> => {
  const cleaned = removeCpfPunctuation(cpf);

  if (!validarCpfLocalmente(cleaned)) {
    return false;
  }

  try {
    const response = await axios.get(
      `https://valida-cpf-api.vercel.app/api/validar/${cleaned}`,
      {
        timeout: 4000,
      },
    );
    return !!response.data?.valido;
  } catch (error) {
    console.warn(
      "[CPF_API_WARNING] Falha na comunicação com API de CPF. Usando fallback local.",
      error,
    );
    return true;
  }
};
