describe("Internet test", () => {
  it("Should be able to connect to the internet", () => {
    cy.visit("https://www.google.com");
    cy.get("#hplogo").should("be.visible");
  });
});
