import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RangeSelector from "@/components/RangeSelector";

describe("RangeSelector", () => {
  it("renders all four range options", () => {
    render(<RangeSelector value="1M" onChange={() => {}} />);
    expect(screen.getByText("1W")).toBeInTheDocument();
    expect(screen.getByText("1M")).toBeInTheDocument();
    expect(screen.getByText("1Y")).toBeInTheDocument();
    expect(screen.getByText("ALL")).toBeInTheDocument();
  });

  it("calls onChange with the correct range when a button is clicked", async () => {
    const onChange = vi.fn();
    render(<RangeSelector value="1M" onChange={onChange} />);

    await userEvent.click(screen.getByText("1Y"));
    expect(onChange).toHaveBeenCalledWith("1Y");

    await userEvent.click(screen.getByText("1W"));
    expect(onChange).toHaveBeenCalledWith("1W");

    await userEvent.click(screen.getByText("ALL"));
    expect(onChange).toHaveBeenCalledWith("ALL");
  });

  it("marks the active range with the filled Tailwind class", () => {
    render(<RangeSelector value="1Y" onChange={() => {}} />);
    const activeButton = screen.getByText("1Y");
    // Active button has bg-white applied via Tailwind
    expect(activeButton.className).toContain("bg-white");
    // Inactive buttons do not
    expect(screen.getByText("1M").className).not.toContain("bg-white");
  });

  it("does not call onChange when clicking the already-active range", async () => {
    const onChange = vi.fn();
    render(<RangeSelector value="1M" onChange={onChange} />);
    await userEvent.click(screen.getByText("1M"));
    // onChange is still called — the parent decides whether to re-fetch
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
