# EchoNotes v2 🎵

A modern, AI-powered note-taking application with smart summarization and categorization.

## Features

- 📝 Create, read, update, and delete notes
- 🤖 AI-powered automatic summarization using Google Gemini
- 🏷️ Smart category suggestions
- 🔍 Real-time search functionality
- ✨ Beautiful, responsive UI
- 💾 PostgreSQL database for reliable storage

## Tech Stack

**Backend:**
- FastAPI
- PostgreSQL
- SQLAlchemy (Async)
- Google Generative AI (Gemini)

**Frontend:**
- React
- Vite
- Axios
- Lucide React Icons

## Local Development

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 12+

### Backend Setup

1. Clone the repository

git clone https://github.com/yourusername/echonotes-v2.git
cd echonotes-v2

2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

3. Install dependencies
pip install -r requirements.txt

4. Set up environment variables
Create a .env file:
DATABASE_URL=postgresql+asyncpg://postgres:yourpassword@localhost:5432/echonotes_v2
GEMINI_API_KEY=your_gemini_api_key

5. Run the backend
uvicorn main:app --reload


Frontend Setup

1. Navigate to frontend directory
cd frontend

2. Install dependencies
npm install

3. Run the development server
npm run dev

Visit http://localhost:5173 to see the app!
Deployment
See deployment guide for pxxl.app deployment instructions.

License
MIT

Author
uzoechi david chikamdabere 