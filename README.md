# SRM College Complain Box 🏫📢

The **SRM College Complain Box** is a **React.js**-based web application designed to provide a platform for students and staff to easily report and track complaints within the college. The application uses **Supabase** for the backend, offering secure user authentication and a robust database to manage complaints efficiently.

## Features ✨

- **User Registration & Authentication** 🔐  
  Users can securely register and log in to the system to submit and track complaints. All authentication is handled through **Supabase**.

- **Complaint Submission** 📝  
  Users can submit complaints by entering details such as the nature of the issue, the relevant department, and additional descriptions. Complaints are stored and managed for follow-up.

- **Complaint Tracking** 🔍  
  Each user can view the status of their complaints, allowing them to track whether they are resolved, pending, or being processed.

- **Admin Dashboard** 📊  
  Admins have access to a dedicated dashboard where they can manage and resolve complaints. They can view all complaints, filter by category or status, and take necessary actions.

- **Real-time Updates** ⚡  
  Notifications are sent to users when there are updates to their complaints, ensuring they are informed about the resolution process.

## Tech Stack ⚙️

- **Frontend**: React.js
- **Backend**: Supabase (for database and authentication)
- **UI Components**: Material-UI (optional, if used for styling)
- **Deployment**: Netlify/Vercel (optional, based on hosting preferences)

## Installation 🛠️

To set up the project locally:

1. **Clone the repository**  
   Use the following command to clone the repository:

   ```bash
   git clone https://github.com/sanjay-here/SRM_College_Complaint_box.git
Navigate to the project directory:

cd college-complain-box
Install dependencies:

npm install

Set up Supabase credentials:

Create a .env file in the root directory and add the following:

REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_KEY=your_supabase_key
Make sure to replace your_supabase_url and your_supabase_key with your actual Supabase credentials.

Start the development server:

npm run dev
The app will run locally at http://localhost:3000.

Usage 🖥️
For Users:
Once logged in, users can submit complaints, track their status, and view their complaint history.

For Admins:
Admins have a separate login page to manage all complaints. They can resolve complaints, mark them as in-progress, or pending, and handle various actions based on the complaint status.

Contributing 🤝
Feel free to contribute to this project by forking it and submitting pull requests. If you have any issues or suggestions, please open an issue in the GitHub repository.

Acknowledgments 🙏
Supabase for providing an easy-to-use backend-as-a-service platform.

React.js for its powerful UI development capabilities.
