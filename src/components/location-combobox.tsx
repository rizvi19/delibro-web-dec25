
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
    { value: "bagerhat", label: "Bagerhat" },
    { value: "bandarban", label: "Bandarban" },
    { value: "barguna", label: "Barguna" },
    { value: "barishal", label: "Barishal" },
    { value: "bhola", label: "Bhola" },
    { value: "bogura", label: "Bogura" },
    { value: "brahmanbaria", label: "Brahmanbaria" },
    { value: "chandpur", label: "Chandpur" },
    { value: "chapainawabganj", label: "Chapainawabganj" },
    { value: "chattogram", label: "Chattogram" },
    { value: "chuadanga", label: "Chuadanga" },
    { value: "comilla", label: "Comilla" },
    { value: "cox's bazar", label: "Cox's Bazar" },
    { value: "dhaka", label: "Dhaka" },
    { value: "dinajpur", label: "Dinajpur" },
    { value: "faridpur", label: "Faridpur" },
    { value: "feni", label: "Feni" },
    { value: "gaibandha", label: "Gaibandha" },
    { value: "gazipur", label: "Gazipur" },
    { value: "gopalganj", label: "Gopalganj" },
    { value: "habiganj", label: "Habiganj" },
    { value: "jamalpur", label: "Jamalpur" },
    { value: "jashore", label: "Jashore" },
    { value: "jhalokati", label: "Jhalokati" },
    { value: "jhenaidah", label: "Jhenaidah" },
    { value: "joypurhat", label: "Joypurhat" },
    { value: "khagrachhari", label: "Khagrachhari" },
    { value: "khulna", label: "Khulna" },
    { value: "kishoreganj", label: "Kishoreganj" },
    { value: "kurigram", label: "Kurigram" },
    { value: "kushtia", label: "Kushtia" },
    { value: "lakshmipur", label: "Lakshmipur" },
    { value: "lalmonirhat", label: "Lalmonirhat" },
    { value: "madaripur", label: "Madaripur" },
    { value: "magura", label: "Magura" },
    { value: "manikganj", label: "Manikganj" },
    { value: "meherpur", label: "Meherpur" },
    { value: "moulvibazar", label: "Moulvibazar" },
    { value: "munshiganj", label: "Munshiganj" },
    { value: "mymensingh", label: "Mymensingh" },
    { value: "naogaon", label: "Naogaon" },
    { value: "narail", label: "Narail" },
    { value: "narayanganj", label: "Narayanganj" },
    { value: "narsingdi", label: "Narsingdi" },
    { value: "natore", label: "Natore" },
    { value: "netrokona", label: "Netrokona" },
    { value: "nilphamari", label: "Nilphamari" },
    { value: "noakhali", label: "Noakhali" },
    { value: "pabna", label: "Pabna" },
    { value: "panchagarh", label: "Panchagarh" },
    { value: "patuakhali", label: "Patuakhali" },
    { value: "pirojpur", label: "Pirojpur" },
    { value: "rajbari", label: "Rajbari" },
    { value: "rajshahi", label: "Rajshahi" },
    { value: "rangamati", label: "Rangamati" },
    { value: "rangpur", label: "Rangpur" },
    { value: "satkhira", label: "Satkhira" },
    { value: "shariatpur", label: "Shariatpur" },
    { value: "sherpur", label: "Sherpur" },
    { value: "sirajganj", label: "Sirajganj" },
    { value: "sunamganj", label: "Sunamganj" },
    { value: "sylhet", label: "Sylhet" },
    { value: "tangail", label: "Tangail" },
    { value: "thakurgaon", label: "Thakurgaon" },
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
            ? districts.find((district) => district.value === value)?.label
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
                      value === district.value ? "opacity-100" : "opacity-0"
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
