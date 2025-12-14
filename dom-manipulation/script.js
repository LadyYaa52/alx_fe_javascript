
    // Load quotes from localStorage or use defaults
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
      { text: "Stay hungry, stay foolish.", category: "Motivation" },
      { text: "Simplicity is the ultimate sophistication.", category: "Philosophy" },
      { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
    ];

    // Populate category dropdown
    function populateCategories() {
      const categoryFilter = document.getElementById("categoryFilter");

      // Extract unique categories
      const categories = [...new Set(quotes.map(q => q.category))];

      // Reset dropdown
      categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

      // Add categories
      categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
      });

      // Restore last selected filter
      const savedFilter = localStorage.getItem("selectedCategory");
      if (savedFilter) {
        categoryFilter.value = savedFilter;
      }
    }

    // Filter and display quotes
    function filterQuotes() {
      const selectedCategory = document.getElementById("categoryFilter").value;
      const quotesContainer = document.getElementById("quotesContainer");

      // Save filter selection
      localStorage.setItem("selectedCategory", selectedCategory);

      // Clear display
      quotesContainer.innerHTML = "";

      // Filter logic
      const filteredQuotes = selectedCategory === "all"
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

      // Display quotes
      filteredQuotes.forEach(q => {
        const p = document.createElement("p");
        p.textContent = `"${q.text}" — ${q.category}`;
        quotesContainer.appendChild(p);
      });
    }

    // Add a new quote
    function addQuote() {
      const textInput = document.getElementById("quoteInput").value.trim();
      const categoryInput = document.getElementById("categoryInput").value.trim();

      if (!textInput || !categoryInput) {
        alert("Please enter both a quote and a category.");
        return;
      }

      const newQuote = { text: textInput, category: categoryInput };

      quotes.push(newQuote);
      localStorage.setItem("quotes", JSON.stringify(quotes));

      // Update categories and refresh display
      populateCategories();
      filterQuotes();

      // Clear inputs
      document.getElementById("quoteInput").value = "";
      document.getElementById("categoryInput").value = "";
    }

    // Initialize on page load
    window.onload = function () {
      populateCategories();
      filterQuotes();
    };




  
