// Mirrors Google's actual account-creation password rules:
// - 8 characters minimum (Google's hard floor)
// - 100 characters maximum
// - No leading or trailing whitespace
// - Must contain a mix of characters (we require at least 2 of: lowercase,
//   uppercase, number, symbol) — Google doesn't force a specific mix but
//   flags/rejects very weak, common, or single-class passwords, so we
//   approximate that with a strength gate rather than a rigid regex.
// - Checked against a short list of the most commonly breached passwords.

const COMMON_PASSWORDS = new Set([
  "password", "password1", "12345678", "123456789", "qwerty123",
  "letmein1", "welcome1", "iloveyou", "admin123", "abc12345",
  "password123", "qwertyuiop", "111111111", "123123123", "monkey123",
  "football1", "dragon123", "master123", "fortnite", "fortnite1",
])

export function scorePassword(pw) {
  if (!pw) return { score: 0, label: "Empty" }
  let classes = 0
  if (/[a-z]/.test(pw)) classes++
  if (/[A-Z]/.test(pw)) classes++
  if (/[0-9]/.test(pw)) classes++
  if (/[^a-zA-Z0-9]/.test(pw)) classes++

  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (classes >= 2) score++
  if (classes >= 3) score++
  if (pw.length >= 16 && classes >= 3) score++

  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Excellent"]
  return { score: Math.min(score, 5), label: labels[Math.min(score, 5)] }
}

/**
 * Validates a password against Google-style account-creation requirements.
 * Returns { valid: boolean, errors: string[] }
 */
export function validatePassword(pw, { username = "", email = "" } = {}) {
  const errors = []

  if (!pw) {
    return { valid: false, errors: ["Enter a password."] }
  }
  if (pw !== pw.trim()) {
    errors.push("Password can't start or end with a space.")
  }
  if (pw.trim().length < 8) {
    errors.push("Use 8 characters or more.")
  }
  if (pw.length > 100) {
    errors.push("Use 100 characters or fewer.")
  }

  const classes = [
    /[a-z]/.test(pw),
    /[A-Z]/.test(pw),
    /[0-9]/.test(pw),
    /[^a-zA-Z0-9]/.test(pw),
  ].filter(Boolean).length

  if (classes < 2) {
    errors.push("Mix letters with numbers or symbols.")
  }

  if (COMMON_PASSWORDS.has(pw.toLowerCase())) {
    errors.push("This password is too common. Choose something harder to guess.")
  }

  const lowerPw = pw.toLowerCase()
  const uname = username.trim().toLowerCase()
  const localEmail = email.split("@")[0]?.toLowerCase() ?? ""
  if (uname && uname.length >= 3 && lowerPw.includes(uname)) {
    errors.push("Password shouldn't contain your username.")
  }
  if (localEmail && localEmail.length >= 3 && lowerPw.includes(localEmail)) {
    errors.push("Password shouldn't contain your email address.")
  }
  if (/^(.)\1+$/.test(pw)) {
    errors.push("Don't repeat a single character.")
  }

  return { valid: errors.length === 0, errors }
}
