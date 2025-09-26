# 🚿 AI Bathtub - Environmental Impact Simulator

An interactive educational tool that demonstrates the environmental impact of Large Language Model (LLM) usage through a bathtub metaphor. Users can ask questions to Google's Gemini AI, but each interaction fills a virtual bathtub with water based on token usage.

## 🎯 Mission

Your goal is to get a comprehensive report on the environmental impacts of LLM use from Gemini without overflowing the bathtub! This teaches users about the real environmental costs of AI interactions.

## ✨ Features

- **Interactive Chat Interface**: Ask Gemini anything through a beautiful chat UI
- **Real-time Bathtub Visualization**: Watch the bathtub fill with animated water as you use tokens
- **Environmental Impact Tracking**: See real-time CO₂ emissions and water usage
- **Token Usage Monitoring**: Track cumulative token usage against a 10,000 token limit
- **Overflow Prevention**: Warnings when approaching the bathtub capacity
- **Conversation History**: View detailed history of all interactions and their environmental impact
- **Responsive Design**: Works on desktop and mobile devices
- **Educational Experience**: Learn about AI's environmental footprint through interactive gameplay

## 🛠️ Setup Instructions

### Prerequisites

- Python 3.7 or higher
- Google Cloud account with Gemini API access

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd ai_bathtub
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the project root:
   ```bash
   # Google Cloud API Key for Gemini
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Optional: Port for the server (defaults to 5000)
   PORT=5000
   
   # Optional: Secret key for Flask sessions
   SECRET_KEY=your-secret-key-here
   ```

4. **Get a Gemini API Key**
   
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5000` to start using the application!

## 🎮 How to Play

1. **Start the Challenge**: Your mission is to get a comprehensive report on environmental impacts of LLM use without overflowing the bathtub.

2. **Ask Questions**: Type your questions in the chat interface and press Enter or click Send.

3. **Watch the Bathtub**: Each question fills the bathtub with water based on the number of tokens used.

4. **Monitor Impact**: Keep an eye on the statistics panel showing:
   - Total tokens used
   - CO₂ emissions
   - Water usage
   - Current water level percentage

5. **Stay Under the Limit**: The bathtub has a 10,000 token capacity. Don't let it overflow!

6. **Review History**: Click "View History" to see all your interactions and their environmental impact.

7. **Reset and Try Again**: Use the "Reset Bathtub" button to start fresh.

## 🔧 Technical Details

### Environmental Impact Calculations

The application uses approximate values based on research:
- **CO₂ per token**: ~0.0000004 kg CO₂ (varies by model and infrastructure)
- **Water per token**: 0.1 ml (for visualization purposes)
- **Bathtub capacity**: 10,000 tokens

### API Integration

- **Backend**: Flask web framework
- **AI Model**: Google Gemini Pro via Google Generative AI API
- **Frontend**: Vanilla JavaScript with modern CSS animations
- **Session Management**: Flask sessions for tracking user progress

### File Structure

```
ai_bathtub/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── css/
    │   └── style.css     # Styles and animations
    └── js/
        └── app.js        # Frontend JavaScript
```

## 🎨 Features in Detail

### Bathtub Visualization
- Realistic 3D bathtub design with gradients and shadows
- Smooth water level animations with ripple effects
- Dynamic water color based on usage level
- Overflow warning system

### Chat Interface
- Modern chat UI with message bubbles
- Loading states and error handling
- Keyboard shortcuts (Ctrl/Cmd + Enter to send)
- Auto-scroll to latest messages

### Environmental Tracking
- Real-time token counting from Gemini API
- CO₂ emission calculations
- Water usage visualization
- Historical data tracking

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### Production Deployment
For production deployment, consider using:
- **Gunicorn**: `gunicorn -w 4 -b 0.0.0.0:5000 app:app`
- **Docker**: Create a Dockerfile for containerized deployment
- **Cloud Platforms**: Deploy to Heroku, Google Cloud Run, or AWS

## 🔒 Security Notes

- Keep your API keys secure and never commit them to version control
- Use environment variables for sensitive configuration
- Consider rate limiting for production deployments
- Implement proper session management for multi-user environments

## 🤝 Contributing

Feel free to contribute improvements:
- Add more accurate environmental impact calculations
- Enhance the bathtub visualization
- Add more educational content
- Improve mobile responsiveness
- Add additional environmental metrics

## 📚 Educational Value

This tool helps users understand:
- The environmental cost of AI interactions
- Token usage and its relationship to computational resources
- The importance of efficient AI usage
- Real-world implications of technology choices

## 📄 License

MIT License - feel free to use this for educational purposes!

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Research on AI environmental impact for calculations
- Open source community for inspiration and tools

---

**Happy learning! Remember: every AI interaction has an environmental cost. Use it wisely! 🌍** 