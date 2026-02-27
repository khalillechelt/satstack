import { describe, it, expect, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CurrencySelector from "@/components/CurrencySelector";

describe("CurrencySelector", () => {
  it("renders all nine supported currencies", () => {
    render(<CurrencySelector value="usd" onChange={() => {}} />);
    const select = screen.getByRole("combobox");
    const options = Array.from(select.querySelectorAll("option"));
    const labels = options.map((o) => o.textContent);

    expect(labels).toContain("USD");
    expect(labels).toContain("EUR");
    expect(labels).toContain("GBP");
    expect(labels).toContain("JPY");
    expect(labels).toContain("CHF");
    expect(labels).toContain("AUD");
    expect(labels).toContain("CAD");
    expect(labels).toContain("BRL");
    expect(labels).toContain("SGD");
    expect(options).toHaveLength(9);
  });

  it("shows the current currency as selected", () => {
    render(<CurrencySelector value="eur" onChange={() => {}} />);
    expect(screen.getByRole("combobox")).toHaveValue("eur");
  });

  it("calls onChange with the new currency code when changed", async () => {
    const onChange = vi.fn();
    render(<CurrencySelector value="usd" onChange={onChange} />);

    await userEvent.selectOptions(screen.getByRole("combobox"), "jpy");
    expect(onChange).toHaveBeenCalledWith("jpy");
  });

  it("calls onChange with the correct code for each currency", async () => {
    const currencies = ["eur", "gbp", "chf", "aud", "cad", "brl", "sgd"];
    for (const code of currencies) {
      const onChange = vi.fn();
      render(<CurrencySelector value="usd" onChange={onChange} />);
      await userEvent.selectOptions(screen.getByRole("combobox"), code);
      expect(onChange).toHaveBeenCalledWith(code);
      cleanup(); // unmount between iterations so only one combobox exists
    }
  });
});
