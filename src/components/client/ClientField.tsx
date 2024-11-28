import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ClientFieldProps {
  label: string;
  value: string;
  field: string;
  isEditing: boolean;
  editedValue?: string;
  onChange?: (value: string) => void;
  isLink?: boolean;
}

const ClientField = ({ 
  label, 
  value, 
  field, 
  isEditing, 
  editedValue, 
  onChange,
  isLink 
}: ClientFieldProps) => {
  if (isEditing && !['activeProjects', 'totalRevenue'].includes(field)) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <Input
          value={editedValue}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="p-3 bg-secondary/40 rounded-full">
        {isLink ? (
          value ? (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {value}
            </a>
          ) : (
            "Not provided"
          )
        ) : (
          value
        )}
      </div>
    </div>
  );
};

export default ClientField;