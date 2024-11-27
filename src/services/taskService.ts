import { supabase } from "@/lib/supabase";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  assigned_to: string | null;
  client_id: number | null;
  position: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export const getTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('position');
  
  if (error) throw error;
  return data;
};

export const addTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User must be authenticated to create tasks');

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...task,
      created_by: user.id
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateTask = async (id: number, updates: Partial<Task>) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteTask = async (id: number) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const updateTaskPosition = async (id: number, newPosition: number) => {
  const { error } = await supabase
    .from('tasks')
    .update({ position: newPosition })
    .eq('id', id);
  
  if (error) throw error;
};

export const deleteCompletedTasks = async () => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('status', 'done');
  
  if (error) throw error;
};