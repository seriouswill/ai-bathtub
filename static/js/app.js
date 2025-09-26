// DOM elements
const chatForm = document.getElementById('chat-form');
const questionInput = document.getElementById('question-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');
const waterLevel = document.getElementById('water-level');
const waterPercentage = document.getElementById('water-percentage');
const totalTokens = document.getElementById('total-tokens');
const totalCo2 = document.getElementById('total-co2');
const totalWater = document.getElementById('total-water');
const resetButton = document.getElementById('reset-button');
const historyButton = document.getElementById('history-button');
const historyModal = document.getElementById('history-modal');
const historyContent = document.getElementById('history-content');
const overflowWarning = document.getElementById('overflow-warning');
const acknowledgeOverflow = document.getElementById('acknowledge-overflow');
const closeModal = document.querySelector('.close');

// Initialize water level on page load
document.addEventListener('DOMContentLoaded', function() {
    updateWaterLevel();
});

// Chat form submission
chatForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const question = questionInput.value.trim();
    if (!question) return;
    
    // Add user message to chat
    addMessage('user', question);
    questionInput.value = '';
    
    // Show loading state
    sendButton.classList.add('loading');
    sendButton.disabled = true;
    
    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: question })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Add assistant response to chat
            addMessage('assistant', data.response);
            
            // Update stats
            updateStats(data);
            
            // Update water level with animation
            updateWaterLevel(data.water_level_percentage);
            
            // Check for overflow
            if (data.overflowed) {
                showOverflowWarning();
            }
        } else {
            // Handle error
            if (data.would_overflow) {
                addMessage('system', `⚠️ ${data.error}`);
            } else {
                addMessage('system', `❌ Error: ${data.error}`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('system', '❌ Network error. Please try again.');
    } finally {
        // Hide loading state
        sendButton.classList.remove('loading');
        sendButton.disabled = false;
        questionInput.focus();
    }
});

// Add message to chat
function addMessage(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Format content based on type
    if (type === 'assistant') {
        // Convert line breaks to <br> tags for better formatting
        messageContent.innerHTML = content.replace(/\n/g, '<br>');
    } else {
        messageContent.textContent = content;
    }
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Update statistics display
function updateStats(data) {
    totalTokens.textContent = data.total_tokens;
    totalCo2.textContent = `${data.total_co2.toFixed(6)} kg`;
    totalWater.textContent = `${data.total_water.toFixed(1)} ml`;
}

// Update water level with smooth animation
function updateWaterLevel(percentage = null) {
    if (percentage === null) {
        // Get current percentage from the page
        const currentTokens = parseInt(totalTokens.textContent) || 0;
        const capacity = 10000; // This should match BATHTUB_CAPACITY from Flask
        percentage = Math.min(100, (currentTokens / capacity) * 100);
    }
    
    waterLevel.style.height = `${percentage}%`;
    waterPercentage.textContent = `${Math.round(percentage)}%`;
    
    // Add splash effect when water level increases
    if (percentage > 0) {
        waterLevel.style.animation = 'none';
        setTimeout(() => {
            waterLevel.style.animation = 'splash 0.5s ease-out';
        }, 10);
    }
}

// Reset bathtub
resetButton.addEventListener('click', async function() {
    try {
        const response = await fetch('/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Update stats
            updateStats(data);
            
            // Reset water level
            updateWaterLevel(0);
            
            // Clear chat messages except the welcome message
            const messages = chatMessages.querySelectorAll('.message:not(.system)');
            messages.forEach(msg => msg.remove());
            
            // Add reset confirmation message
            addMessage('system', '🔄 Bathtub has been reset! Start fresh with your environmental impact report.');
        }
    } catch (error) {
        console.error('Error resetting:', error);
        addMessage('system', '❌ Error resetting bathtub. Please try again.');
    }
});

// Show history modal
historyButton.addEventListener('click', async function() {
    try {
        const response = await fetch('/history');
        const history = await response.json();
        
        if (history.length === 0) {
            historyContent.innerHTML = '<p>No conversation history yet.</p>';
        } else {
            let historyHTML = '';
            history.forEach((entry, index) => {
                const date = new Date(entry.timestamp).toLocaleString();
                historyHTML += `
                    <div class="history-entry" style="border: 1px solid #eee; padding: 15px; margin-bottom: 15px; border-radius: 8px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: 600; color: #666;">
                            <span>Question ${index + 1}</span>
                            <span>${date}</span>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <strong>Question:</strong> ${entry.question}
                        </div>
                        <div style="margin-bottom: 10px;">
                            <strong>Response:</strong> ${entry.response.substring(0, 200)}${entry.response.length > 200 ? '...' : ''}
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 0.9em; color: #666;">
                            <div><strong>Tokens:</strong> ${entry.tokens_used}</div>
                            <div><strong>CO₂:</strong> ${entry.co2_emission.toFixed(6)} kg</div>
                            <div><strong>Water:</strong> ${entry.water_used.toFixed(1)} ml</div>
                        </div>
                    </div>
                `;
            });
            historyContent.innerHTML = historyHTML;
        }
        
        historyModal.style.display = 'block';
    } catch (error) {
        console.error('Error loading history:', error);
        historyContent.innerHTML = '<p>Error loading conversation history.</p>';
        historyModal.style.display = 'block';
    }
});

// Close modal
closeModal.addEventListener('click', function() {
    historyModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === historyModal) {
        historyModal.style.display = 'none';
    }
});

// Show overflow warning
function showOverflowWarning() {
    overflowWarning.classList.remove('hidden');
}

// Acknowledge overflow warning
acknowledgeOverflow.addEventListener('click', function() {
    overflowWarning.classList.add('hidden');
});

// Add splash animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes splash {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+Enter or Cmd+Enter to send message
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        chatForm.dispatchEvent(new Event('submit'));
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        historyModal.style.display = 'none';
        overflowWarning.classList.add('hidden');
    }
});

// Auto-resize text input
questionInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 100) + 'px';
});

// Focus input on page load
window.addEventListener('load', function() {
    questionInput.focus();
}); 