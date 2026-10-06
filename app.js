document.addEventListener("DOMContentLoaded", () => {
  // Add Application modal
  const modalRoot = document.getElementById("modalRoot");
  document.querySelectorAll("[data-open-modal]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!modalRoot) return;
      modalRoot.innerHTML = `
        <div class="modal-backdrop" data-close-modal>
          <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <div class="modal-head">
              <h2 id="modalTitle">Add New Application</h2>
              <button class="modal-close" data-close-modal>×</button>
            </div>
            <form class="modal-form" id="applicationForm">
              <label>Company Name *
                <input required name="company" placeholder="e.g. Google">
              </label>
              <label>Job / Internship Role *
                <input required name="role" placeholder="e.g. Software Engineering Intern">
              </label>
              <label>Location
                <input name="location" placeholder="e.g. Bengaluru, India">
              </label>
              <div class="form-grid">
                <label>Application Date<input type="date" name="date"></label>
                <label>Optional Deadline<input type="date" name="deadline"></label>
              </div>
              <div class="form-grid">
                <label>Application Link<input type="url" name="link" placeholder="https://..."></label>
                <label>Status
                  <select name="status"><option>Applied</option><option>Wishlist</option><option>Assessment</option><option>Interview</option><option>Selected</option><option>Rejected</option></select>
                </label>
              </div>
              <label>Notes
                <textarea name="notes" placeholder="Add any additional notes..."></textarea>
              </label>
              <div class="modal-actions">
                <button type="button" class="btn btn-secondary" data-close-modal>Cancel</button>
                <button class="btn btn-primary" type="submit">Save Application</button>
              </div>
            </form>
          </div>
        </div>`;
      modalRoot.querySelector(".modal-backdrop").addEventListener("click", e => {
        if (e.target.matches("[data-close-modal]")) modalRoot.innerHTML = "";
      });
      modalRoot.querySelector("#applicationForm").addEventListener("submit", e => {
        e.preventDefault();
        const form = new FormData(e.target);
        const saved = JSON.parse(localStorage.getItem("hiretrackApplications") || "[]");
        saved.push(Object.fromEntries(form.entries()));
        localStorage.setItem("hiretrackApplications", JSON.stringify(saved));
        modalRoot.innerHTML = "";
        alert("Application saved successfully.");
      });
    });
  });

  // Application search + filter
  const search = document.getElementById("searchInput");
  const status = document.getElementById("statusFilter");
  const cards = [...document.querySelectorAll(".application-card")];
  function filterCards() {
    if (!cards.length) return;
    const q = (search?.value || "").toLowerCase().trim();
    const s = status?.value || "All Status";
    cards.forEach(card => {
      const haystack = `${card.dataset.company} ${card.dataset.role}`.toLowerCase();
      const matchesSearch = !q || haystack.includes(q);
      const matchesStatus = s === "All Status" || card.dataset.status === s;
      card.style.display = matchesSearch && matchesStatus ? "" : "none";
    });
  }
  search?.addEventListener("input", filterCards);
  status?.addEventListener("change", filterCards);

  // Theme
  document.querySelectorAll("[data-theme]").forEach(btn => {
    btn.addEventListener("click", () => {
      const dark = btn.dataset.theme === "dark";
      document.body.classList.toggle("dark", dark);
      localStorage.setItem("hiretrackTheme", dark ? "dark" : "light");
      document.querySelectorAll("[data-theme]").forEach(b => b.classList.toggle("active", b === btn));
    });
  });
  if (localStorage.getItem("hiretrackTheme") === "dark") {
    document.body.classList.add("dark");
    document.querySelectorAll('[data-theme="dark"]').forEach(b => b.classList.add("active"));
    document.querySelectorAll('[data-theme="light"]').forEach(b => b.classList.remove("active"));
  }

  // Demo data clearing
  document.getElementById("clearData")?.addEventListener("click", () => {
    if (confirm("Clear all HireTrack demo data from this browser?")) {
      localStorage.removeItem("hiretrackApplications");
      localStorage.removeItem("hiretrackTheme");
      alert("Local demo data cleared.");
    }
  });
});