// Заглушка: в оригинале — серверный мок CMS на SQLite, в браузере сайта не используется.
export async function executeServerDatabaseQuery() {
  throw new Error("SqliteDatabase is not available in the local build")
}
