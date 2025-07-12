
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const districts = [
    { value: "Bagerhat", label: "Bagerhat" },
    { value: "Bandarban", label: "Bandarban" },
    { value: "Barguna", label: "Barguna" },
    { value: "Barishal", label: "Barishal" },
    { value: "Bhola", label: "Bhola" },
    { value: "Bogura", label: "Bogura" },
    { value: "Brahmanbaria", label: "Brahmanbaria" },
    { value: "Chandpur", label: "Chandpur" },
    { value: "Chapainawabganj", label: "Chapainawabganj" },
    { value: "Chattogram", label: "Chattogram" },
    { value: "Chuadanga", label: "Chuadanga" },
    { value: "Comilla", label: "Comilla" },
    { value: "Cox's Bazar", label: "Cox's Bazar" },
    { value: "Dhaka", label: "Dhaka" },
    { value: "Dinajpur", label: "Dinajpur" },
    { value: "Faridpur", label: "Faridpur" },
    { value: "Feni", label: "Feni" },
    { value: "Gaibandha", label: "Gaibandha" },
    { value: "Gazipur", label: "Gazipur" },
    { value: "Gopalganj", label: "Gopalganj" },
    { value: "Habiganj", label: "Habiganj" },
    { value: "Jamalpur", label: "Jamalpur" },
    { value: "Jashore", label: "Jashore" },
    { value: "Jhalokati", label: "Jhalokati" },
    { value: "Jhenaidah", label: "Jhenaidah" },
    { value: "Joypurhat", label: "Joypurhat" },
    { value: "Khagrachhari", label: "Khagrachhari" },
    { value: "Khulna", label: "Khulna" },
    { value: "Kishoreganj", label: "Kishoreganj" },
    { value: "Kurigram", label: "Kurigram" },
    { value: "Kushtia", label: "Kushtia" },
    { value: "Lakshmipur", label: "Lakshmipur" },
    { value: "Lalmonirhat", label: "Lalmonirhat" },
    { value: "Madaripur", label: "Madaripur" },
    { value: "Magura", label: "Magura" },
    { value: "Manikganj", label: "Manikganj" },
    { value: "Meherpur", label: "Meherpur" },
    { value: "Moulvibazar", label: "Moulvibazar" },
    { value: "Munshiganj", label: "Munshiganj" },
    { value: "Mymensingh", label: "Mymensingh" },
    { value: "Naogaon", label: "Naogaon" },
    { value: "Narail", label: "Narail" },
    { value: "Narayanganj", label: "Narayanganj" },
    { value: "Narsingdi", label: "Narsingdi" },
    { value: "Natore", label: "Natore" },
    { value: "Netrokona", label: "Netrokona" },
    { value: "Nilphamari", label: "Nilphamari" },
    { value: "Noakhali", label: "Noakhali" },
    { value: "Pabna", label: "Pabna" },
    { value: "Panchagarh", label: "Panchagarh" },
    { value: "Patuakhali", label: "Patuakhali" },
    { value: "Pirojpur", label: "Pirojpur" },
    { value: "Rajbari", label: "Rajbari" },
    { value: "Rajshahi", label: "Rajshahi" },
    { value: "Rangamati", label: "Rangamati" },
    { value: "Rangpur", label: "Rangpur" },
    { value: "Satkhira", label: "Satkhira" },
    { value: "Shariatpur", label: "Shariatpur" },
    { value: "Sherpur", label: "Sherpur" },
    { value: "Sirajganj", label: "Sirajganj" },
    { value: "Sunamganj", label: "Sunamganj" },
    { value: "Sylhet", label: "Sylhet" },
    { value: "Tangail", label: "Tangail" },
    { value: "Thakurgaon", label: "Thakurgaon" },
];

export function LocationCombobox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? districts.find((district) => district.value.toLowerCase() === value)?.label
            : "Select district..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search district..." />
          <CommandList>
            <CommandEmpty>No district found.</CommandEmpty>
            <CommandGroup>
              {districts.map((district) => (
                <CommandItem
                  key={district.value}
                  value={district.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === district.value.toLowerCase() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {district.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
