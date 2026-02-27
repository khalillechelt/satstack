import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SatInput from "@/components/SatInput";

describe("SatInput", () => {
  it("displays the initial value formatted with commas", () => {
    render(<SatInput value={1_000_000} onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveValue("1,000,000");
  });

  it("shows the BTC equivalent below the input", () => {
    render(<SatInput value={100_000_000} onChange={() => {}} />);
    // 100,000,000 sats = 1 BTC
    expect(screen.getByText("1.00000000 BTC")).toBeInTheDocument();
  });

  it("shows the correct BTC equivalent for 1 sat", () => {
    render(<SatInput value={1} onChange={() => {}} />);
    expect(screen.getByText("0.00000001 BTC")).toBeInTheDocument();
  });

  it("calls onChange with a numeric value when the user types", async () => {
    const onChange = vi.fn();
    render(<SatInput value={0} onChange={onChange} />);
    const input = screen.getByRole("textbox");

    await userEvent.clear(input);
    await userEvent.type(input, "500000");

    expect(onChange).toHaveBeenLastCalledWith(500000);
  });

  it("strips non-numeric characters from input", async () => {
    const onChange = vi.fn();
    render(<SatInput value={0} onChange={onChange} />);
    const input = screen.getByRole("textbox");

    await userEvent.clear(input);
    await userEvent.type(input, "abc123");

    expect(onChange).toHaveBeenLastCalledWith(123);
  });

  it("renders the sats label", () => {
    render(<SatInput value={0} onChange={() => {}} />);
    expect(screen.getByText(/satoshis/i)).toBeInTheDocument();
  });
});
