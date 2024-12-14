import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import UserForm from "./userform";
import { userPageId } from "../../../helpers/page-ids";
import userEvent from "@testing-library/user-event";
describe("User form component", () => {
  let open = true;
  const setup = () => render(<UserForm mode="Add" open={open} />);
  const togglePopup = jest.fn(() => {
    open = !open;
  });
  test("check content renders", async () => {
    setup();

    expect(await screen.findByLabelText("User Name")).toBeInTheDocument();
    expect(await screen.findByLabelText("Role")).toBeInTheDocument();
    expect(await screen.findByLabelText("E-mail")).toBeInTheDocument();
    expect(await screen.findByLabelText("Mobile No.")).toBeInTheDocument();
    expect(await screen.findByLabelText("Password")).toBeInTheDocument();
    expect(await screen.findByText("Status")).toBeInTheDocument();
  });
  test("check required fields", async () => {
    setup();
    fireEvent.click(
      screen.getByRole("button", {
        name: "Save",
      })
    );

    expect(await screen.findByText(/Please select role!/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/Please enter your e-mail id!/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Please enter your mobile no!/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Please enter your password!/i)
    ).toBeInTheDocument();
  });
});
