import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { phonePrefixes } from "@/data/phonePrefixes";

interface PhoneInputProps {
  phonePrefix: string;
  phoneNumber: string;
  onPrefixChange: (value: string) => void;
  onNumberChange: (value: string) => void;
}

// Group countries by prefix
const groupedPrefixes = phonePrefixes.reduce((acc, curr) => {
  const key = curr.prefix;
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key].push(curr);
  return acc;
}, {} as Record<string, typeof phonePrefixes>);

const PhoneInput = ({ 
  phonePrefix, 
  phoneNumber, 
  onPrefixChange, 
  onNumberChange 
}: PhoneInputProps) => {
  // Extract the country code from the phonePrefix (e.g., "+1-US" -> "USA")
  const getDisplayValue = (value: string) => {
    const [_, countryCode] = value.split('-');
    return countryCode || value;
  };

  return (
    <div className="grid grid-cols-[120px_1fr] gap-2">
      <div className="space-y-2">
        <Label>Phone Prefix</Label>
        <Select
          value={phonePrefix}
          onValueChange={onPrefixChange}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Prefix">
              {getDisplayValue(phonePrefix)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <div className="max-h-[200px] overflow-y-auto">
              {Object.entries(groupedPrefixes).map(([prefix, countries]) => (
                countries.map((country, index) => (
                  <SelectItem 
                    key={`${country.code}-${prefix}`} 
                    value={`${prefix}-${country.code}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">
                        {country.country}
                      </span>
                      <span>{prefix}</span>
                    </span>
                  </SelectItem>
                ))
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={(e) => onNumberChange(e.target.value)}
          placeholder="Enter phone number"
          required
        />
      </div>
    </div>
  );
};

export default PhoneInput;