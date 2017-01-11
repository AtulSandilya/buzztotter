const dbRules =
// To change the database rules paste this into the firebase console ->
// database -> rules section
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
