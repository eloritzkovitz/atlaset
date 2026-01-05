/// <reference types="cypress" />

describe("Trips", () => {
  const tripName = "Cypress Test Trip";
  const editedTripName = "Cypress Edited Trip";
  const today = new Date().toISOString().slice(0, 10);

  it("should access trips page, add, edit, and delete a trip", () => {
    // Visit the trips page
    cy.visit("/trips");

    // Wait for trips to load
    cy.get("body").then(($body) => {
      if ($body.find("table").length) {
        cy.get("table").should("exist");
      } else {
        cy.contains("No trips yet.").should("exist");
      }
    });

    // Add a trip
    cy.get('[aria-label="Add Trip"]').click();

    // Fill out the required fields
    cy.get('input[name="name"], .form-field[required]', { timeout: 8000 })
      .should("be.visible")
      .first()
      .clear()
      .type(tripName);
    cy.get('input[type="date"]').first().type("2025-01-01");
    cy.get('input[type="date"]').eq(1).type("2025-01-10");

    // Select countries (open modal, search "United Kingdom", select, save)
    cy.contains("button", /select countries|edit countries/i).click();

    // Select the "United Kingdom" checkbox
    cy.get('[placeholder="Search countries"]')
      .should("be.visible")
      .clear()
      .type("United Kingdo");

    // Select the "United Kingdom" checkbox
    cy.contains("label", /united kingdom/i)
      .find('input[type="checkbox"]')
      .check({ force: true });

    // Save/confirm selection
    cy.get("button")
      .contains(/save|done|close|confirm/i)
      .click();

    // Open the categories dropdown
    cy.contains("label", /categories/i)
      .parent()
      .find(".form-field")
      .click();

    // Select the "Architectural" option from the dropdown menu
    cy.get("#dropdown-menu-portal")
      .contains(/architectural/i)
      .click();

    // Save the trip
    cy.get('button[type="submit"], button')
      .contains(/add trip|save/i)
      .click();

    // Confirm trip appears in the table
    cy.contains(tripName).should("exist");

    // Open the actions menu for the created trip
    cy.contains("tr", tripName).find('[aria-label="More actions"]').click();

    // Wait for the menu and the Edit button to exist and be visible
    cy.get("body")
      .find(".trips-actions-menu", { timeout: 8000 })
      .should("exist")
      .should("be.visible")
      .contains("Edit")
      .should("exist")
      .should("be.visible");

    // Click the Edit button
    cy.get("body")
      .find(".trips-actions-menu")
      .contains("Edit")
      .click({ force: true });

    // Edit the trip name
    cy.get('input[name="name"], .form-field[required]')
      .first()
      .clear()
      .type(editedTripName);
    cy.get('button[type="submit"], button').contains(/save/i).click();

    // Confirm edited trip appears
    cy.contains(editedTripName).should("exist");

    // Open the actions menu for the created trip
    cy.contains("tr", editedTripName)
      .find('[aria-label="More actions"]')
      .click();

    // Wait for the menu to appear, then click Delete
    cy.get("body")
      .find(".trips-actions-menu")
      .contains("Delete")
      .click({ force: true });    

    // Confirm trip is gone
    cy.contains(editedTripName).should("not.exist");
  });
});
