import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export const SelectSearch = ({
  items = [],
  value,
  onChange,
  placeholder = "Select...",
  labelKey = "name",
  valueKey = "_id",
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="h-9 min-w-[160px] border rounded-md px-3 text-sm flex items-center justify-between">
        {value
          ? items.find((i) => i[valueKey] === value)?.[labelKey]
          : placeholder}
      </PopoverTrigger>

      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup>
              {items.map((i) => (
                <CommandItem
                  key={i[valueKey]}
                  value={i[labelKey]}
                  onSelect={() => {
                    onChange(i[valueKey]);
                    setOpen(false);
                  }}
                >
                  {i[labelKey]}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
