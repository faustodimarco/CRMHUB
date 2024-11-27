import { supabase } from '@/lib/supabase';
import JSZip from 'jszip';

export interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  amount: number;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'pending' | 'paid';
  file_path: string;
  created_at: string;
}

export const uploadInvoice = async (file: File, invoiceData: Omit<Invoice, 'id' | 'created_at' | 'file_path'>) => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${invoiceData.invoice_number}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('invoices')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from('invoices')
    .insert([{ ...invoiceData, file_path: filePath }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getInvoices = async () => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const deleteInvoice = async (id: string, filePath: string) => {
  const { error: storageError } = await supabase.storage
    .from('invoices')
    .remove([filePath]);

  if (storageError) throw storageError;

  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
  const { data, error } = await supabase
    .from('invoices')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const downloadInvoices = async (invoices: Invoice[]) => {
  if (invoices.length === 1) {
    const { data, error } = await supabase.storage
      .from('invoices')
      .download(invoices[0].file_path);

    if (error) throw error;
    return data;
  }

  // Multiple files - create zip
  const zip = new JSZip();
  
  for (const invoice of invoices) {
    const { data, error } = await supabase.storage
      .from('invoices')
      .download(invoice.file_path);

    if (error) throw error;
    zip.file(invoice.file_path, data);
  }

  return await zip.generateAsync({ type: "blob" });
};