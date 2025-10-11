import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# configure gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# initialize the model
model = genai.GenerativeModel('gemini-2.5-flash')

async def generate_summary(content: str, max_length: int = 150) -> str:
    """
    Generate a concise summary of the note content using Gemini.
    
    Args:
        content: The full note content
        max_length: Maximum length of summary in words
        
    Returns:
        A concise summary string
    """
    try:
        prompt = f"""
        Summarize the following note content in a clear and concise way. 
        Keep the summary under {max_length} words.
        Focus on the main points and key information.
        
        Content:
        {content}
        
        Summary:
        """
        
        response = model.generate_content(prompt)
        return response.text.strip()
    
    except Exception as e:
        print(f"❌ Error generating summary: {e}")
        # Fallback: return first 150 characters
        return content[:150] + "..." if len(content) > 150 else content


async def suggest_category(title: str, content: str) -> str:
    """
    Suggest an appropriate category for the note based on title and content.
    
    Args:
        title: The note title
        content: The note content
        
    Returns:
        A suggested category name
    """
    try:
        prompt = f"""
        Based on the following note title and content, suggest a single, concise category name.
        
        Choose from common categories like: Personal, Work, Ideas, Tasks, Learning, Health, Finance, Travel, etc.
        Or suggest a new relevant category if none fit.
        
        Respond with ONLY the category name, nothing else.
        
        Title: {title}
        Content: {content[:500]}  # First 500 chars
        
        Category:
        """
        
        response = model.generate_content(prompt)
        category = response.text.strip()
        
        # Clean up response (remove quotes, extra text)
        category = category.replace('"', '').replace("'", '').split('\n')[0]
        
        return category if len(category) <= 100 else "General"
    
    except Exception as e:
        print(f"❌ Error suggesting category: {e}")
        return "General"


async def extract_key_points(content: str, num_points: int = 5) -> list[str]:
    """
    Extract key points from the note content.
    
    Args:
        content: The note content
        num_points: Number of key points to extract
        
    Returns:
        List of key points
    """
    try:
        prompt = f"""
        Extract the {num_points} most important key points from the following content.
        Present them as a bullet list, one point per line.
        Keep each point concise (under 20 words).
        
        Content:
        {content}
        
        Key Points:
        """
        
        response = model.generate_content(prompt)
        
        # Parse the response into a list
        points = [
            line.strip().lstrip('•-*').strip() 
            for line in response.text.strip().split('\n') 
            if line.strip()
        ]
        
        return points[:num_points]
    
    except Exception as e:
        print(f"❌ Error extracting key points: {e}")
        return []


async def enhance_note(title: str, content: str) -> dict:
    """
    Enhance a note with AI-generated summary, category, and key points.
    
    Args:
        title: The note title
        content: The note content
        
    Returns:
        Dictionary with summary, category, and key_points
    """
    try:
        summary = await generate_summary(content)
        category = await suggest_category(title, content)
        key_points = await extract_key_points(content)
        
        return {
            "summary": summary,
            "category": category,
            "key_points": key_points
        }
    
    except Exception as e:
        print(f"❌ Error enhancing note: {e}")
        return {
            "summary": content[:150] + "..." if len(content) > 150 else content,
            "category": "General",
            "key_points": []
        }