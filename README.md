# Event Hub - Hackathon Management System

A modern web application for managing hackathon events, participant registration, and admin operations.

## 🚀 Features

- **User Registration & Login** - Easy signup and login for participants
- **Admin Panel** - Complete event management for organizers
- **Event Creation** - Create and manage hackathon events
- **Event Registration** - Participants can register for events
- **Dashboard** - User-friendly interface for both users and admins
- **Responsive Design** - Works on all devices

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL database)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🔑 Login Instructions

### For Regular Users (Members):

1. Click "Join Event" on the homepage
2. Enter any email and password
3. You'll be logged into the member dashboard

### For Admins:

1. Click the shield icon (🛡️) in the top-right corner
2. Enter any email and password
3. You'll be logged into the admin panel

**Note**: Authentication is bypassed for demo purposes - any email/password combination will work!

## 📱 How to Use

### As a Member:

1. **Sign up/Login** using any email
2. **Browse Events** on your dashboard
3. **Register** for events you want to attend
4. **View** your registered events

### As an Admin:

1. **Login** to the admin panel
2. **Create Events** with details like date, time, location
3. **Manage Events** - edit or delete existing events
4. **View Participants** for each event
5. **Monitor** event registrations

## 🎯 Key Pages

- **Homepage** (`/`) - Landing page with event information
- **Dashboard** (`/dashboard`) - Member dashboard with events
- **Admin Panel** (`/admin`) - Admin interface for event management

## 🎨 Features Overview

### Event Management

- Create unlimited events
- Set participant limits
- Multiple event categories (Workshop, Networking, Presentation, Competition)
- Event status tracking (Upcoming, Ongoing, Completed)

### User Experience

- Clean, modern interface
- Mobile-responsive design
- Real-time updates
- Easy navigation

### Admin Features

- Complete event CRUD operations
- Participant management
- Event analytics
- User management

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Project Structure

```
src/
├── components/          # React components
├── services/           # API services
├── lib/               # Utilities and config
└── main.tsx           # App entry point
```

## 🌐 Database Setup (Optional)

If you want to use real Supabase database:

1. Check `SUPABASE_SETUP.md` for database setup
2. Update Supabase credentials in `src/lib/supabase.ts`
3. Run the SQL scripts provided

## 📝 Notes

- This project is currently in **demo mode** with bypassed authentication
- All data is stored in browser localStorage
- Perfect for demonstrations and testing
- Can be easily connected to real Supabase backend

## 🎉 Demo Ready

This application is ready for:

- **Live demonstrations**
- **Portfolio showcases**
- **Prototype presentations**
- **Development testing**

No complex setup needed - just install and run! 🚀

---

**Built with ❤️ for hackathon management**
