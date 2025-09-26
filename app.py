from flask import Flask, render_template, request, jsonify, session
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-here')

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# Initialize the model
model = genai.GenerativeModel('gemini-1.5-pro')

# Environmental impact data (approximate CO2 emissions per token)
# These are rough estimates based on research - actual values vary by model and infrastructure
CO2_PER_TOKEN = 0.0000004  # kg CO2 per token (rough estimate)
WATER_PER_TOKEN = 0.1  # ml of water per token (for visualization)

# Bathtub capacity (in tokens)
BATHTUB_CAPACITY = 10000  # tokens

@app.route('/')
def index():
    """Main page with the bathtub interface"""
    # Initialize session data if not exists
    if 'total_tokens' not in session:
        session['total_tokens'] = 0
        session['total_co2'] = 0
        session['total_water'] = 0
        session['conversation_history'] = []
    
    return render_template('index.html', 
                         total_tokens=session['total_tokens'],
                         total_co2=session['total_co2'],
                         total_water=session['total_water'],
                         bathtub_capacity=BATHTUB_CAPACITY)

@app.route('/ask', methods=['POST'])
def ask_gemini():
    """Handle questions to Gemini and track environmental impact"""
    data = request.get_json()
    question = data.get('question', '')
    
    if not question:
        return jsonify({'error': 'No question provided'}), 400
    
    try:
        # Check if bathtub would overflow
        estimated_tokens = len(question.split()) * 1.5  # Rough estimate
        if session.get('total_tokens', 0) + estimated_tokens > BATHTUB_CAPACITY:
            return jsonify({
                'error': 'Warning: This request might overflow the bathtub! Consider asking a shorter question.',
                'would_overflow': True
            }), 400
        
        # Generate response from Gemini
        response = model.generate_content(question)
        
        # Get token usage information
        # Note: usage_metadata might not be available in all responses
        try:
            prompt_tokens = response.usage_metadata.prompt_token_count
            response_tokens = response.usage_metadata.candidates_token_count
            total_tokens = prompt_tokens + response_tokens
        except AttributeError:
            # Fallback: estimate tokens based on text length
            # Rough estimate: 1 token ≈ 4 characters for English text
            prompt_length = len(question)
            response_length = len(response.text)
            total_tokens = int((prompt_length + response_length) / 4)
        
        # Calculate environmental impact
        co2_emission = total_tokens * CO2_PER_TOKEN
        water_used = total_tokens * WATER_PER_TOKEN
        
        # Update session data
        session['total_tokens'] = session.get('total_tokens', 0) + total_tokens
        session['total_co2'] = session.get('total_co2', 0) + co2_emission
        session['total_water'] = session.get('total_water', 0) + water_used
        
        # Add to conversation history
        conversation_entry = {
            'timestamp': datetime.now().isoformat(),
            'question': question,
            'response': response.text,
            'tokens_used': total_tokens,
            'co2_emission': co2_emission,
            'water_used': water_used
        }
        
        if 'conversation_history' not in session:
            session['conversation_history'] = []
        session['conversation_history'].append(conversation_entry)
        
        # Check if bathtub overflowed
        overflowed = session['total_tokens'] > BATHTUB_CAPACITY
        
        return jsonify({
            'response': response.text,
            'tokens_used': total_tokens,
            'co2_emission': co2_emission,
            'water_used': water_used,
            'total_tokens': session['total_tokens'],
            'total_co2': session['total_co2'],
            'total_water': session['total_water'],
            'overflowed': overflowed,
            'water_level_percentage': min(100, (session['total_tokens'] / BATHTUB_CAPACITY) * 100)
        })
        
    except Exception as e:
        return jsonify({'error': f'Error generating response: {str(e)}'}), 500

@app.route('/reset', methods=['POST'])
def reset_bathtub():
    """Reset the bathtub and clear all tracking data"""
    session['total_tokens'] = 0
    session['total_co2'] = 0
    session['total_water'] = 0
    session['conversation_history'] = []
    
    return jsonify({
        'message': 'Bathtub reset!',
        'total_tokens': 0,
        'total_co2': 0,
        'total_water': 0,
        'water_level_percentage': 0
    })

@app.route('/history')
def get_history():
    """Get conversation history"""
    return jsonify(session.get('conversation_history', []))

@app.route('/stats')
def get_stats():
    """Get current statistics"""
    return jsonify({
        'total_tokens': session.get('total_tokens', 0),
        'total_co2': session.get('total_co2', 0),
        'total_water': session.get('total_water', 0),
        'water_level_percentage': min(100, (session.get('total_tokens', 0) / BATHTUB_CAPACITY) * 100),
        'bathtub_capacity': BATHTUB_CAPACITY
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv('PORT', 5000))) 