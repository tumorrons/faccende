# 🏠⏱️ Timer & Abitudini PWA

Una Progressive Web App completa per la gestione del tempo, faccende domestiche e tracciamento delle abitudini, ora con funzionalità avanzate di backup e ripristino.

## ✨ Caratteristiche Principali

### 🏠 **Dashboard Home**
- Panoramica rapida di tutte le attività
- Statistiche in tempo reale
- Faccende da completare oggi
- Barra di progresso visuale

### ⏱️ **Timer Pomodoro Avanzato**
- Timer con funzionamento in background
- Notifiche browser e vibrazione
- Modalità automatica e manuale
- Persistenza dello stato anche chiudendo l'app
- Suoni di allarme personalizzati

### 📋 **Gestione Faccende**
- Aggiunta rapida di nuove faccende
- Livelli di difficoltà (Facile, Medio, Difficile)
- Drag & drop per riordinare
- Faccende per "oggi" separate dalla lista principale
- Pulizia automatica delle faccende completate

### 🌟 **Tracciamento Abitudini**
- Calendario mensile interattivo
- Colori personalizzabili per ogni abitudine
- Statistiche avanzate (streak, successo, record)
- Notifiche per traguardi raggiunti
- Visualizzazione progressi nel tempo

### 💾 **Backup e Ripristino** ⭐ NUOVO
- **Esportazione completa**: Scarica tutti i tuoi dati in formato JSON
- **Importazione sicura**: Ripristina i dati da backup precedenti
- **Riepilogo dati**: Visualizza quante faccende, abitudini e dimensione dati
- **Reset completo**: Elimina tutti i dati con conferme di sicurezza
- **Validazione file**: Controlli automatici per file di backup corrotti
- **Metadata**: Informazioni su data di esportazione e versione app

### 📱 **Progressive Web App**
- Installabile su desktop e mobile
- Funziona offline
- Service Worker per prestazioni ottimali
- Notifiche native del sistema
- Supporto completo per iOS e Android

## 🚀 Come Usare

### Installazione
1. Apri l'app nel browser
2. Clicca su "Installa" quando appare il banner
3. L'app sarà disponibile come app nativa

### Backup dei Dati
1. Vai alla tab **💾 Backup**
2. Visualizza il riepilogo dei tuoi dati
3. Clicca **"📤 Scarica Backup"** per esportare
4. Il file JSON verrà scaricato automaticamente

### Ripristino dei Dati
1. Nella tab Backup, clicca **"📁 Seleziona File"**
2. Scegli un file di backup precedente (.json)
3. Clicca **"📥 Ripristina Dati"**
4. Conferma l'operazione (sostituirà i dati attuali)

### Funzionalità Avanzate
- **Spazio**: Avvia/metti in pausa il timer (nella tab Timer)
- **Drag & Drop**: Riordina faccende e spostale tra liste
- **Tocco prolungato**: Accesso rapido alle azioni sui dispositivi touch

## 🗂️ Struttura File

```
faccende/
├── index.html          # App principale con tutte le funzionalità
├── manifest.json       # Configurazione PWA
├── sw.js              # Service Worker per funzionalità offline
└── README.md          # Documentazione
```

## 💾 Formato Backup

Il file di backup contiene:

```json
{
  "exportDate": "2025-01-XX",
  "appVersion": "2.0.0",
  "data": {
    "tasks": [...],
    "todayTasks": [...], 
    "habits": [...],
    "timerSettings": {...}
  },
  "metadata": {
    "tasksCount": 0,
    "habitsCount": 0,
    "exportedBy": "Timer & Abitudini PWA"
  }
}
```

## 🔧 Configurazione

### Timer
- **Tempo lavoro**: 1-180 minuti (default: 25)
- **Tempo riposo**: 1-60 minuti (default: 5)
- **Modalità manuale**: Disabilita l'auto-switch

### Abitudini
- **Frequenza**: Quotidiana o Settimanale
- **Colori**: 6 colori predefiniti personalizzabili
- **Calendario**: Navigazione per mese

### Backup
- **Auto-salvataggio**: I dati vengono salvati automaticamente
- **Backup manuale**: Consigliato settimanalmente
- **Formati supportati**: .json, .bak

## 🔒 Privacy e Sicurezza

- **Dati locali**: Tutti i dati rimangono sul tuo dispositivo
- **Nessun server**: Non inviamo dati a server esterni
- **Backup sicuri**: I file di backup sono in formato JSON leggibile
- **Controlli integrità**: Validazione automatica dei file importati

## 🎯 Consigli d'Uso

### Per la Produttività
1. Inizia con sessioni Pomodoro di 25 minuti
2. Aggiungi le faccende più importanti alla lista "Oggi"
3. Usa i livelli di difficoltà per organizzare il carico di lavoro

### Per le Abitudini
1. Inizia con 1-2 abitudini semplici
2. Scegli colori diversi per categorie (es: blu per sport, verde per salute)
3. Controlla regolarmente le statistiche per motivarti

### Per i Backup
1. Esporta un backup ogni settimana
2. Salva i file in un posto sicuro (cloud, email)
3. Testa l'importazione occasionalmente per verificare

## 🆕 Novità Versione 2.0

- ✅ **Sistema di backup completo**
- ✅ **Validazione file di backup**
- ✅ **Statistiche dettagliate sui dati**
- ✅ **Reset dati con conferme multiple**
- ✅ **Metadata nei file di backup**
- ✅ **Supporto file handler per backup**
- ✅ **Miglioramenti UI per la sezione backup**

## 🐛 Risoluzione Problemi

### Timer non funziona in background
- Verifica le autorizzazioni notifiche
- Assicurati che l'app sia installata come PWA

### Backup non scarica
- Controlla i permessi download del browser
- Verifica lo spazio disponibile sul dispositivo

### File backup non valido
- Assicurati che il file sia in formato JSON
- Verifica che non sia corrotto o modificato manualmente

## 📈 Versioni Future

- [ ] Sincronizzazione cloud opzionale
- [ ] Esportazione in altri formati (CSV, Excel)
- [ ] Backup automatici programmati
- [ ] Temi personalizzabili
- [ ] Statistiche avanzate con grafici

---

**Sviluppato con ❤️ per la produttività quotidiana**

*Versione 2.0.0 - Gennaio 2025*