import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
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

const SearchableSelect = ({
  form,
  name,
  label,
  options,
  placeholder,
  emptyMessage,
  isRequired,
  onCreateClick,
  onChange,
  disabled,
  id,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            {label} {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  id={id || name}
                  ref={field.ref}
                  disabled={disabled}
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {/* --- SỬA Ở ĐÂY --- */}
                  {field.value
                    ? options.find((item) => item.value === field.value)
                        ?.label || field.value
                    : placeholder}
                  {/* ---------------- */}

                  <div className="flex items-center ml-2 h-4 w-4 shrink-0 opacity-50">
                    {field.value ? (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          form.setValue(name, "");
                          if (onChange) onChange("");
                        }}
                        className="hover:bg-slate-200 rounded-full p-0.5 cursor-pointer transition-colors"
                      >
                        <X className="h-3 w-3 text-black" />
                      </div>
                    ) : (
                      <ChevronsUpDown className="h-4 w-4" />
                    )}
                  </div>
                </Button>
              </FormControl>
            </PopoverTrigger>

            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput
                  name={`${name}-search`}
                  id={`${name}-search-input`}
                  placeholder={`Search ${label.toLowerCase()}...`}
                />
                <CommandList>
                  <CommandEmpty>
                    {emptyMessage}
                    {onCreateClick && (
                      <Button
                        variant="link"
                        className="mt-2 h-auto p-0 text-[#6A38C2]"
                        onClick={onCreateClick}
                      >
                        + Create new
                      </Button>
                    )}
                  </CommandEmpty>

                  <CommandGroup>
                    {options.map((item) => (
                      <CommandItem
                        key={item.value}
                        value={item.label}
                        onSelect={() => {
                          form.setValue(name, item.value);
                          setOpen(false);
                          if (onChange) onChange(item.value);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            item.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {item.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <input type="hidden" name={name} value={field.value || ""} />

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SearchableSelect;
