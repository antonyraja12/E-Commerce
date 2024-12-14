import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  getByAltText,
  fireEvent,
} from "@testing-library/react";
import User from "./user";
import { userPageId } from "../../../helpers/page-ids";
import userEvent from "@testing-library/user-event";

describe("User component", () => {
  const setup = () => render(<User pageId={userPageId} />);

  test("check render renders", () => {
    act(() => {
      setup();
    });
    let element = screen.getByText(/User/i);
    expect(element).toBeInTheDocument();
  });
  test("displays the table with columns", () => {
    act(() => {
      setup();
    });
    expect(screen.getByText("User Name")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("E-mail")).toBeInTheDocument();
    expect(screen.getByText("Mobile No")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  test("check add button exists", async () => {
    setup();
    let element = await screen.findByRole("button", {
      name: /add/i,
    });
    await waitFor(() => {
      expect(element).toBeInTheDocument();
    });
  });

  test("Renders List", async () => {
    setup();
    const list = await screen.findAllByTestId("row");
    expect(list).toHaveLength(3);
  });
  test("check add model open", async () => {
    setup();
    let element = await screen.findByRole("button", {
      name: /add/i,
    });

    fireEvent.click(element);
    await waitFor(() => {
      expect(screen.getByText("Add User")).toBeInTheDocument();
    });
  });
  test("check filter", async () => {
    setup();
    let element = screen.getByPlaceholderText("Search...");
    const list = await screen.findAllByTestId("row");
    expect(list).toHaveLength(3);
    await userEvent.type(element, "Madhu");
    expect(element).toHaveValue("Madhu");
    const filteredlist = await screen.findAllByTestId("row");
    expect(filteredlist).toHaveLength(1);
  });
  test("check view popup open", async () => {
    setup();
    const button = await screen.findAllByTestId("view-button");
    fireEvent.click(button[0]);
    await waitFor(() => {
      expect(screen.getByText("View User")).toBeInTheDocument();
    });
  });
  test("check edit popup open", async () => {
    setup();
    const edit = await screen.findAllByRole("button", {
      name: /edit/i,
    });
    fireEvent.click(edit[0]);
    await waitFor(() => {
      expect(screen.getByText("Update User")).toBeInTheDocument();
    });
  });
  test("check delete confirmation popup open", async () => {
    setup();
    const button = await screen.findAllByRole("button", {
      name: /delete/i,
    });
    fireEvent.click(button[0]);
    await waitFor(() => {
      expect(
        screen.getByText("Are you sure to delete this entry?")
      ).toBeInTheDocument();
    });
  });
});
