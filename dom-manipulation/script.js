// ===============================
// Dynamic Quote Generator with Sync
// ===============================

// --- Local Storage Helpers ---
function saveLocalQuotes(quotes) {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function getLocalQuotes() {
  return JSON.parse(localStorage.getItem('quotes')) || [];
}

// --- Server Simulation (JSONPlaceholder) ---
async function fetchQuotesFromServer() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const quotes = await response.json();
  return quotes.map(q => ({ id: q.id, text: q.title })); // Simplify to id + text
}

async function addQuoteToServer(quote) {
  await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(quote),
    headers: { 'Content-Type': 'application/json' }
  });
}

// --- Conflict Resolution ---
function resolveConflicts(localQuotes, serverQuotes) {
  const merged = [];
  const localMap = new Map(localQuotes.map(q => [q.id, q]));

  serverQuotes.forEach(serverQuote => {
    if (localMap.has(serverQuote.id)) {
      const localQuote = localMap.get(serverQuote.id);
      if (localQuote.text !== serverQuote.text) {
        // Conflict detected → server wins
        notifyConflict(localQuote.text, serverQuote.text);
      }
    }
    merged.push(serverQuote);
  });

  return merged;
}

function notifyConflict(localQuote, serverQuote) {
  alert(`Conflict detected!\nLocal: "${localQuote}"\nServer: "${serverQuote}"\nServer version applied.`);
}

// --- Sync Logic ---
async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    const localQuotes = getLocalQuotes();

    const mergedQuotes = resolveConflicts(localQuotes, serverQuotes);

    saveLocalQuotes(mergedQuotes);
    renderQuotes(mergedQuotes);
  } catch (error) {
    console.error('Error syncing quotes:', error);
  }
}
console.log("Quotes synced with server!");
    // Or update the UI:
    const status = document.getElementById('sync-status');
    if (status) status.textContent = "Quotes synced with server!";
  } catch (error) {
    console.error('Error syncing quotes:', error);
  }
}

// --- UI Rendering ---
function renderQuotes(quotes) {
  const container = document.getElementById('quote-container');
  container.innerHTML = '';
  quotes.forEach(q => {
    const div = document.createElement('div');
    div.textContent = q.text;
    container.appendChild(div);
  });
}

// --- Add New Quote ---
async function addQuote(text) {
  const localQuotes = getLocalQuotes();
  const newQuote = { id: Date.now(), text };

  localQuotes.push(newQuote);
  saveLocalQuotes(localQuotes);
  renderQuotes(localQuotes);

  await addQuoteToServer(newQuote);
}

// --- Periodic Sync ---
setInterval(syncQuotes, 10000); // every 10 seconds

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
  const quotes = getLocalQuotes();
  renderQuotes(quotes);
  syncQuotes();
});

  

