
const form = document.getElementById("scope-form");
const emptyState = document.getElementById("empty-state");
const scopeDocument = document.getElementById("scope-document");
const documentContent = document.getElementById("document-content");
const copyButton = document.getElementById("copy-button");
const printButton = document.getElementById("print-button");
const actionStatus = document.getElementById("action-status");

// Safely display text entered by users.
function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Turn multiline text into readable HTML paragraphs.
function formatText(value) {
  const lines = String(value || "")
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return "<p>Not specified</p>";
  }

  return lines
    .map((line) => `<p>${escapeHTML(line)}</p>`)
    .join("");
}

// Make a label and value section.
function makeSection(title, content) {
  return `
    <section class="document-section">
      <h3>${escapeHTML(title)}</h3>
      ${content}
    </section>
  `;
}

// Generate the project scope document.
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const projectName =
    document.getElementById("project-name").value.trim();

  const clientName =
    document.getElementById("client-name").value.trim();

  const description =
    document.getElementById("project-description").value.trim();

  const deliverables =
    document.getElementById("deliverables").value.trim();

  const deadline =
    document.getElementById("deadline").value;

  const revisions =
    document.getElementById("revisions").value;

  const budget =
    document.getElementById("budget").value.trim();

  const exclusions =
    document.getElementById("exclusions").value.trim();

  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const formattedDeadline = deadline
    ? new Date(deadline + "T12:00:00").toLocaleDateString(
        undefined,
        {
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      )
    : "To be agreed";

  const formattedBudget = budget || "To be agreed";

  documentContent.innerHTML = `
    <div class="document-heading">
      <p class="document-eyebrow">PROJECT AGREEMENT</p>
      <h2>${escapeHTML(projectName)}</h2>
      <p class="document-meta">Prepared on ${escapeHTML(today)}</p>
    </div>

    ${makeSection(
      "Project Overview",
      formatText(description)
    )}

    ${makeSection(
      "Client",
      `<p>${escapeHTML(clientName || "Not specified")}</p>`
    )}

    ${makeSection(
      "Project Deliverables",
      formatText(deliverables)
    )}

    ${makeSection(
      "Timeline",
      `<p>Target deadline: ${escapeHTML(formattedDeadline)}</p>`
    )}

    ${makeSection(
      "Budget",
      `<p>${escapeHTML(formattedBudget)}</p>`
    )}

    ${makeSection(
      "Revisions",
      `<p>${escapeHTML(revisions)} round(s) of revisions</p>`
    )}

    ${makeSection(
      "Out of Scope",
      formatText(
        exclusions ||
        "No exclusions specified. Any additional work should be agreed upon separately."
      )
    )}

    <p class="document-footer">
      This document outlines the proposed project scope.
      Both parties should review and agree on the details
      before work begins.
    </p>
  `;

  emptyState.hidden = true;
  scopeDocument.hidden = false;

  actionStatus.textContent =
    "Your project scope document is ready!";

  scopeDocument.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// Copy the generated document as plain text.
copyButton.addEventListener("click", async function () {
  const textToCopy = documentContent.innerText;

  try {
    await navigator.clipboard.writeText(textToCopy);
    actionStatus.textContent = "Document copied to clipboard!";
  } catch (error) {
    // Fallback for browsers where clipboard access is unavailable.
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);
    textArea.select();

    const copied = document.execCommand("copy");
    textArea.remove();

    actionStatus.textContent = copied
      ? "Document copied to clipboard!"
      : "Copy failed. Please select and copy the document manually.";
  }
});

// Print the document or save it as a PDF.
printButton.addEventListener("click", function () {
  window.print();
});
