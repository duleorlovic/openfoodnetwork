import { Controller } from "stimulus";

// Allows a form section to "pop out" and show additional options
export default class PopoutController extends Controller {
  static targets = ["button", "dialog"];

  connect() {
    this.first_input = this.dialogTarget.querySelector("input");

    // Show when click or down-arrow on button
    this.buttonTarget.addEventListener("click", this.show.bind(this));
    this.buttonTarget.addEventListener("keydown", this.showIfDownArrow.bind(this));

    // Close when click or tab outside of dialog. Run async (don't block primary event handlers).
    this.closeIfOutsideBound = this.closeIfOutside.bind(this); // Store reference for removing listeners later.
    document.addEventListener("click", this.closeIfOutsideBound, { passive: true });
    document.addEventListener("focusin", this.closeIfOutsideBound, { passive: true });
  }

  disconnect() {
    // Clean up handlers registered outside the controller element.
    // (jest cleans up document too early)
    if (document) {
      document.removeEventListener("click", this.closeIfOutsideBound);
      document.removeEventListener("focusin", this.closeIfOutsideBound);
    }
  }

  show(e) {
    this.dialogTarget.style.display = "block";
    this.first_input.focus();
    e.preventDefault();
  }

  showIfDownArrow(e) {
    if (e.keyCode == 40) {
      this.show(e);
    }
  }

  closeIfOutside(e) {
    if (!this.dialogTarget.contains(e.target)) {
      this.dialogTarget.style.display = "none";
    }
  }
}
