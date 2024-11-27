import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadCsv } from "@/services/financeService";
import { useToast } from "@/components/ui/use-toast";

interface CsvUploaderProps {
  type: 'revenue' | 'expenses';
}

const CsvUploader = ({ type }: CsvUploaderProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);

  const { mutate } = useMutation({
    mutationFn: (file: File) => uploadCsv(file, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
      toast({
        title: "Success",
        description: `${type} data imported successfully`,
      });
      setFile(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to import ${type} data`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      mutate(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        required
      />
      <Button type="submit" disabled={!file}>
        Upload {type === 'revenue' ? 'Revenue' : 'Expenses'} CSV
      </Button>
    </form>
  );
};

export default CsvUploader;