const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const status = document.querySelector("#contact-status");
  const linkedInFallback = document.querySelector("#contact-status-link");
  const buttonLabel = submitButton.textContent;
  let submitting = false;

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting || !contactForm.reportValidity()) return;

    submitting = true;
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    status.textContent = "Sending your message...";
    delete status.dataset.state;
    linkedInFallback.hidden = true;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error("Submission failed");

      contactForm.reset();
      status.dataset.state = "success";
      status.textContent = "Thank you. Your message has been received. We'll be in touch soon.";
    } catch {
      status.dataset.state = "error";
      status.textContent = "We couldn't send your message right now. Please try again or connect with us on LinkedIn.";
      linkedInFallback.hidden = false;
    } finally {
      clearTimeout(timeout);
      submitting = false;
      submitButton.disabled = false;
      submitButton.textContent = buttonLabel;
    }
  });
}
