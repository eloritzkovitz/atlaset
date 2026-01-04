/// <reference types="cypress" />

describe("Layers", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('button[aria-label="Layers"],button[title="Layers"]')
      .should("be.visible")
      .click();
    cy.contains(/layers/i).should("be.visible");
  });

  const layerName = `Test Layer`;
  const updatedLayerName = `Updated Layer`;

  it("can add a layer", () => {
    cy.get('button[aria-label="Add Layer"],button[title="Add Layer"]')
      .first()
      .click();

    cy.get('input[placeholder="Name"],input[name="name"]')
      .should("be.visible")
      .type(layerName);

    cy.get("form").within(() => {
      cy.contains("button", "Add Layer").click();
    });

    cy.contains(layerName).should("exist");
  });

  it("can edit a layer", () => {
    // Edit layer
    cy.get(".panel-list-item").contains(layerName).click();
    cy.get(".panel-list-item")
      .contains(layerName)
      .parents(".panel-list-item")
      .find('button[aria-label="Edit"],button[title="Edit"]')
      .click();
    cy.get('input[placeholder="Name"],input[name="name"]')
      .clear()
      .type(updatedLayerName);
    cy.get("form").within(() => {
      cy.contains("button", "Save Changes").click();
    });

    // Wait for updated layer to appear
    cy.contains(updatedLayerName).should("exist");
  });

  it("can delete a layer", () => {
    // Delete layer
    cy.get(".panel-list-item").contains(updatedLayerName).click();
    cy.get(".panel-list-item")
      .contains(updatedLayerName)
      .parents(".panel-list-item")
      .find('button[aria-label="Remove"],button[title="Remove"]')
      .click();

    // Wait for layer to be removed
    cy.contains(updatedLayerName).should("not.exist");
  });
});
