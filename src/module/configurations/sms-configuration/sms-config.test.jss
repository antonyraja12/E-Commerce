import { render, screen } from "@testing-library/react";
import SmsAndMailConfiguration from "./sms-config";
beforeEach(() => {
  // Render the component before each test
  render(<SmsAndMailConfiguration />);
});
test("SMTP SERVER FIELD RENDERED", () => {
  const element = screen.getByText(/SMTP Server/i);
  expect(element).toBeInTheDocument();
});
test("SMTP POST FIELD RENDERED", () => {
  const element = screen.getByText(/SMTP Port/i);
  expect(element).toBeInTheDocument();
});
test("SMTP POST FIELD RENDERED", () => {
  const element = screen.getByText(/From Mail Account User/i);
  expect(element).toBeInTheDocument();
});

test("SMTP POST FIELD RENDERED", async () => {
  const element = screen.getByText(/From Mail Account Password/i);
  expect(element).toBeInTheDocument();
});
