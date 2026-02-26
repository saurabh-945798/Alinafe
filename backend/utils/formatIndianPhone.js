const INDIAN_PHONE_REGEX = /^\+91[0-9]{10}$/;

export const formatIndianPhone = (input = "") => {
  const raw = String(input ?? "").trim();
  if (!raw) {
    throw new Error("Invalid Indian mobile number");
  }

  let digits = raw.replace(/\D/g, "");

  // Remove international prefix like 0091XXXXXXXXXX
  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  // Remove country code when present as digits (91XXXXXXXXXX)
  if (digits.startsWith("91") && digits.length === 12) {
    digits = digits.slice(2);
  }

  // Remove leading 0 for local format (0XXXXXXXXXX)
  if (digits.startsWith("0") && digits.length === 11) {
    digits = digits.slice(1);
  }

  if (!/^[0-9]{10}$/.test(digits)) {
    throw new Error("Invalid Indian mobile number");
  }

  // Optional Indian mobile guard: 6-9 start
  if (!/^[6-9][0-9]{9}$/.test(digits)) {
    throw new Error("Invalid Indian mobile number");
  }

  const formatted = `+91${digits}`;
  if (!INDIAN_PHONE_REGEX.test(formatted)) {
    throw new Error("Invalid Indian mobile number");
  }

  return formatted;
};

export default formatIndianPhone;
