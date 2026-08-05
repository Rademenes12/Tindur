"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils"; // Zakładając standardową funkcję cn z shadcn

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SelectProps<T extends SelectOption> {
  options: T[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  multi?: boolean;
  disabled?: boolean;
  className?: string;
  renderOption?: (option: T) => React.ReactNode;
}

const Select = React.forwardRef<
  HTMLButtonElement,
  SelectProps<SelectOption>
>(({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select...", 
  multi = false, 
  disabled = false, 
  className,
  renderOption 
}, ref) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(multi ? [] : "");
  };

  const handleSelect = (optionValue: string) => {
    if (multi) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setOpen(false);
    }
  };

  const isValueSelected = () => {
    if (multi && Array.isArray(value)) return value.length > 0;
    return !!value;
  };

  return (
    <div className={cn("relative w-full", className)}>
      <SelectPrimitive.Root open={open} onOpenChange={setOpen}>
        <SelectPrimitive.Trigger
          ref={ref}
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            disabled && "opacity-50",
            !isValueSelected() && "text-muted-foreground"
          )}
        >
          <div className="flex flex-wrap gap-1 overflow-hidden">
            {multi && Array.isArray(value) ? (
              value.length > 0 ? (
                value.map((v) => (
                  <span key={v} className="inline-flex items-center rounded bg-secondary px-1 text-xs">
                    {options.find(o => o.value === v)?.label}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )
            ) : (
              <span>
                {options.find((o) => o.value === value)?.label || placeholder}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {value && !multi && (
              <button onClick={handleClear} className="hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            )}
            <SelectPrimitive.Icon>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </SelectPrimitive.Icon>
          </div>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center border-b px-3 py-2">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                className="flex h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <SelectPrimitive.Viewport className="p-1">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No results found.
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    onClick={() => handleSelect(option.value)}
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    {renderOption ? (
                      renderOption(option)
                    ) : (
                      <>
                        {option.icon && <span className="mr-2">{option.icon}</span>}
                        <span>{option.label}</span>
                      </>
                    )}
                    <SelectPrimitive.ItemIndicator className="absolute left-2 flex h-full w-5 items-center">
                      <Check className="h-4 w-4" />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))
              )}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
});

Select.displayName = "Select";

export { Select };