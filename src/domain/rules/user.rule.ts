export const UserRule = {
  login: {
    maxCharacters: 254,
  },
  password: {
    regexp: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/
  }
} as const