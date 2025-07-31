// Aggiungi questi metodi alla classe WebAppInterface nel tuo MainActivity.kt

@JavascriptInterface
fun saveToFile(filename: String, content: String) {
    try {
        openFileOutput(filename, Context.MODE_PRIVATE).use {
            it.write(content.toByteArray())
        }
        showToast("✅ File salvato: $filename")
    } catch (e: Exception) {
        showToast("❌ Errore salvataggio: ${e.message}")
    }
}

@JavascriptInterface
fun readFromFile(filename: String): String {
    return try {
        openFileInput(filename).bufferedReader().use { it.readText() }
    } catch (e: Exception) {
        ""
    }
}

@JavascriptInterface
fun listBackupFiles(): String {
    return try {
        val files = fileList().filter { it.contains("backup") || it.endsWith(".json") }
        Gson().toJson(files)
    } catch (e: Exception) {
        "[]"
    }
}

@JavascriptInterface
fun shareBackupFile(filename: String) {
    try {
        val content = readFromFile(filename)
        if (content.isNotEmpty()) {
            val intent = Intent(Intent.ACTION_SEND).apply {
                type = "application/json"
                putExtra(Intent.EXTRA_TEXT, content)
                putExtra(Intent.EXTRA_SUBJECT, "Backup Timer & Abitudini")
            }
            startActivity(Intent.createChooser(intent, "Condividi Backup"))
        } else {
            showToast("❌ File backup non trovato")
        }
    } catch (e: Exception) {
        showToast("❌ Errore condivisione: ${e.message}")
    }
}