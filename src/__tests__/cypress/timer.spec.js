/* eslint-disable no-undef */
import { mount } from "@cypress/vue";
import Timer from "../../components/Timer/index.vue";
import { tasks } from "../utils";
import "../../assets/main.css";

describe("Timer component", () => {
  beforeEach(() => {
    mount(Timer, {
      propsData: {
        task: tasks[0],
      },
    });
  });

  it("Should render the component", () => {
    cy.get("[data-test-id*=current-time]").contains("25:00");
  });

  it("Should run the timer", () => {
    cy.clock();
    cy.get("[data-test-id*=btn-play]").click();
    cy.tick(2000);
    cy.get("[data-test-id*=current-time]").contains("24:58");
    cy.get("[data-test-id*=btn-play]").click();
  });
});
