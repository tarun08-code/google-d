-- Enable the necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum types for message status and sender type
create type message_status as enum ('sent', 'delivered', 'read');
create type sender_type as enum ('user', 'bot');

-- Create the users table
create table if not exists users (
    id uuid primary key default uuid_generate_v4(),
    email text unique not null,
    created_at timestamptz default now(),
    last_seen timestamptz
);

-- Create the chat_sessions table
create table if not exists chat_sessions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id),
    started_at timestamptz default now(),
    ended_at timestamptz,
    session_name text,
    created_at timestamptz default now()
);

-- Create the messages table
create table if not exists messages (
    id uuid primary key default uuid_generate_v4(),
    session_id uuid references chat_sessions(id),
    content text not null,
    sender sender_type not null,
    status message_status default 'sent',
    attachment_url text,
    attachment_type text,
    timestamp timestamptz default now(),
    metadata jsonb
);

-- Create indexes for better performance
create index if not exists idx_messages_session_id on messages(session_id);
create index if not exists idx_chat_sessions_user_id on chat_sessions(user_id);

-- Create a view for recent messages
create or replace view recent_messages as
select m.*, cs.user_id
from messages m
join chat_sessions cs on m.session_id = cs.id
where m.timestamp > now() - interval '7 days'
order by m.timestamp desc;

-- Set up row level security (RLS)
alter table users enable row level security;
alter table chat_sessions enable row level security;
alter table messages enable row level security;

-- Create policies
create policy "Users can view their own data"
on users for select
using (auth.uid() = id);

create policy "Users can insert their own data"
on users for insert
with check (auth.uid() = id);

create policy "Users can view their own chat sessions"
on chat_sessions for select
using (auth.uid() = user_id);

create policy "Users can create their own chat sessions"
on chat_sessions for insert
with check (auth.uid() = user_id);

create policy "Users can view messages in their sessions"
on messages for select
using (
    session_id in (
        select id from chat_sessions
        where user_id = auth.uid()
    )
);

create policy "Users can insert messages in their sessions"
on messages for insert
with check (
    session_id in (
        select id from chat_sessions
        where user_id = auth.uid()
    )
);

-- Create function to update message status
create or replace function update_message_status(
    message_id uuid,
    new_status message_status
) returns void as $$
begin
    update messages
    set status = new_status
    where id = message_id
    and session_id in (
        select id from chat_sessions
        where user_id = auth.uid()
    );
end;
$$ language plpgsql security definer;