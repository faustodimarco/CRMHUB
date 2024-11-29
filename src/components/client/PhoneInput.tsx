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

const PhoneInput = ({ 
  phonePrefix, 
  phoneNumber, 
  onPrefixChange, 
  onNumberChange 
}: PhoneInputProps) => {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-2">
      <div className="space-y-2">
        <Label>Phone Prefix</Label>
        <Select
          value={phonePrefix}
          onValueChange={onPrefixChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select prefix" />
          </SelectTrigger>
          <SelectContent position="popper">
            {phonePrefixes.map((prefix) => (
              <SelectItem 
                key={`${prefix.code}-${prefix.prefix}`} 
                value={prefix.prefix}
              >
                <span className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">
                    {prefix.country}
                  </span>
                  <span>{prefix.prefix}</span>
                </span>
              </SelectItem>
            ))}
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