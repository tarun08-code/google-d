import { createClient } from '@supabase/supabase-js';

// Vite exposes env vars on import.meta.env. Cast to any for TypeScript access.
const metaEnv: any = typeof import.meta !== 'undefined' ? (import.meta as any).env : {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface ChatSession {
    id: string;
    user_id: string;
    started_at: Date;
    ended_at?: Date;
    session_name?: string;
}

export const createNewChatSession = async (userId: string): Promise<ChatSession | null> => {
    const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{ user_id: userId }])
        .select()
        .single();

    if (error) {
        console.error('Error creating chat session:', error);
        return null;
    }

    return data;
};

export const updateMessageStatus = async (messageId: string, status: 'sent' | 'delivered' | 'read') => {
    const { error } = await supabase
        .rpc('update_message_status', {
            message_id: messageId,
            new_status: status
        });

    if (error) {
        console.error('Error updating message status:', error);
    }
};

export const uploadAttachment = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `attachments/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('chat-attachments')
        .upload(filePath, file);

    if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return null;
    }

    const { data } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(filePath);

    return data.publicUrl;
};