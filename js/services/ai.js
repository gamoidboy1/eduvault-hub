// js/services/ai.js — Acadex AI Assistant (Gemini Integration)
window.AIService = {
    apiKey: 'AIzaSyDAIOOCF-2J0YWxUcr9vODV322KvgZGyIo',
    isOpen: false,
    context: null,
    chatHistory: [],

    init() {
        if (document.getElementById('ai-chat-overlay')) return;

        // Add Chat CSS
        const style = document.createElement('style');
        style.textContent = `
            #ai-chat-overlay {
                display: none;
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.6);
                backdrop-filter: blur(5px);
                z-index: 100000;
                align-items: center;
                justify-content: center;
                padding: 20px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            #ai-chat-container {
                width: 100%;
                max-width: 600px;
                height: 85vh;
                max-height: 800px;
                background: var(--surface);
                border: 1px solid rgba(139,92,246,0.3);
                border-radius: var(--r-xl);
                box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transform: scale(0.95);
                transition: transform 0.3s ease;
            }
            .ai-chat-header {
                padding: 16px 20px;
                background: linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.1));
                border-bottom: 1px solid rgba(139,92,246,0.2);
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .ai-chat-title {
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 1.1rem;
                font-weight: 800;
                color: #fff;
            }
            .ai-chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .ai-msg, .user-msg {
                display: flex;
                flex-direction: column;
            }
            .user-msg { align-items: flex-end; }
            .ai-msg { align-items: flex-start; }
            .msg-bubble {
                max-width: 85%;
                padding: 12px 16px;
                border-radius: 16px;
                font-size: 0.95rem;
                line-height: 1.5;
                word-wrap: break-word;
            }
            .msg-bubble.user {
                background: linear-gradient(135deg, #8B5CF6, #3B82F6);
                color: white;
                border-bottom-right-radius: 4px;
            }
            .msg-bubble.ai {
                background: var(--surface-2);
                color: var(--text);
                border: 1px solid var(--border);
                border-bottom-left-radius: 4px;
            }
            .ai-chat-input-area {
                padding: 16px 20px;
                background: var(--surface);
                border-top: 1px solid var(--border);
                display: flex;
                gap: 12px;
            }
            .ai-chat-input-area input {
                flex: 1;
                background: var(--surface-2);
                border: 1px solid var(--border);
                color: var(--text);
                padding: 12px 20px;
                border-radius: 100px;
                font-size: 1rem;
                outline: none;
                transition: border-color 0.2s;
            }
            .ai-chat-input-area input:focus { border-color: #8B5CF6; }
            .ai-chat-send-btn {
                background: linear-gradient(135deg, #8B5CF6, #3B82F6);
                border: none;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                cursor: pointer;
                transition: transform 0.2s;
            }
            .ai-chat-send-btn:hover { transform: scale(1.05); }
            
            /* Typing dots */
            .typing-dots { display: flex; gap: 4px; padding: 4px; }
            .typing-dots span {
                width: 6px; height: 6px; background: var(--text-muted); border-radius: 50%;
                animation: typing 1.4s infinite ease-in-out both;
            }
            .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
            .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
            @keyframes typing { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
            
            /* Markdown styling in AI bubble */
            .msg-bubble.ai strong { color: #fff; font-weight: 700; }
            .msg-bubble.ai pre { background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; overflow-x: auto; margin: 8px 0; border: 1px solid var(--border); }
            .msg-bubble.ai code { font-family: monospace; font-size: 0.85em; background: rgba(0,0,0,0.3); padding: 2px 4px; border-radius: 4px; }
            .msg-bubble.ai p { margin: 0 0 10px 0; }
            .msg-bubble.ai p:last-child { margin: 0; }
            .msg-bubble.ai ul, .msg-bubble.ai ol { margin: 8px 0; padding-left: 20px; }
            .msg-bubble.ai li { margin-bottom: 4px; }
        `;
        document.head.appendChild(style);

        // Add Chat HTML
        const overlay = document.createElement('div');
        overlay.id = 'ai-chat-overlay';
        overlay.innerHTML = `
            <div id="ai-chat-container">
                <div class="ai-chat-header">
                    <div class="ai-chat-title">
                        <div style="width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg, #8B5CF6, #3B82F6); display:flex; align-items:center; justify-content:center; box-shadow:0 2px 10px rgba(139,92,246,0.3);">
                            <span style="font-size:1.1rem;">✨</span>
                        </div>
                        <div>
                            <div style="line-height:1.2;">Acadex AI</div>
                            <div style="font-size:0.7rem; color:var(--text-muted); font-weight:600;">Subject Assistant</div>
                        </div>
                    </div>
                    <button id="ai-chat-close" style="background:none; border:none; color:var(--text-muted); font-size:1.8rem; cursor:pointer; padding:0 8px; line-height: 1;">&times;</button>
                </div>
                <div id="ai-chat-messages" class="ai-chat-messages"></div>
                <div class="ai-chat-input-area">
                    <input type="text" id="ai-chat-input" placeholder="Ask a doubt about PYQs..." autocomplete="off">
                    <button id="ai-chat-send" class="ai-chat-send-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Bind events
        document.getElementById('ai-chat-close').onclick = () => this.closeChat();
        document.getElementById('ai-chat-send').onclick = () => this.handleSend();
        document.getElementById('ai-chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSend();
        });
        
        // Close on clicking overlay (outside container)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeChat();
        });
    },

    openChat(subjectName, pyqData) {
        this.context = { subjectName, pyqData };
        this.chatHistory = [];
        
        const msgs = document.getElementById('ai-chat-messages');
        msgs.innerHTML = '';
        
        const overlay = document.getElementById('ai-chat-overlay');
        const container = document.getElementById('ai-chat-container');
        
        overlay.style.display = 'flex';
        // Trigger reflow
        void overlay.offsetWidth;
        overlay.style.opacity = '1';
        container.style.transform = 'scale(1)';
        
        this.isOpen = true;
        
        // Initial greeting
        setTimeout(() => {
            this.addMessage(`Hi! I'm your Acadex AI for **${subjectName}**. I've reviewed the Previous Year Questions in this list. What do you need help with?`, 'ai');
        }, 300);
        
        setTimeout(() => {
            const input = document.getElementById('ai-chat-input');
            if(input) input.focus();
        }, 400);
    },

    closeChat() {
        const overlay = document.getElementById('ai-chat-overlay');
        const container = document.getElementById('ai-chat-container');
        
        overlay.style.opacity = '0';
        container.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            overlay.style.display = 'none';
            this.isOpen = false;
        }, 300);
    },

    async handleSend() {
        const input = document.getElementById('ai-chat-input');
        const text = input.value.trim();
        if (!text) return;
        
        input.value = '';
        this.addMessage(text, 'user');

        const prompt = this.buildPrompt(text);
        
        const typingId = 'typing-' + Date.now();
        this.addTypingIndicator(typingId);

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 800,
                    }
                })
            });

            const data = await response.json();
            this.removeTypingIndicator(typingId);

            if (data.candidates && data.candidates[0].content.parts[0].text) {
                const aiReply = data.candidates[0].content.parts[0].text;
                this.chatHistory.push({ role: 'user', text });
                this.chatHistory.push({ role: 'model', text: aiReply });
                this.addMessage(aiReply, 'ai');
            } else if (data.error) {
                console.error("Gemini API Error:", data.error);
                this.addMessage(`API Error: ${data.error.message}`, 'ai', true);
            } else {
                this.addMessage("Sorry, I couldn't process that. Please try again.", 'ai', true);
            }
        } catch (error) {
            console.error("AI Request failed:", error);
            this.removeTypingIndicator(typingId);
            this.addMessage("Network error. Please check your connection and try again.", 'ai', true);
        }
    },

    addMessage(text, sender, isError = false) {
        const msgs = document.getElementById('ai-chat-messages');
        const div = document.createElement('div');
        div.className = `${sender}-msg`;
        
        let formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');

        div.innerHTML = `
            <div class="msg-bubble ${sender}" ${isError ? 'style="border: 1px solid #ef4444; color: #ef4444;"' : ''}>
                ${formattedText}
            </div>
        `;
        msgs.appendChild(div);
        
        // Ensure scroll to bottom
        setTimeout(() => msgs.scrollTop = msgs.scrollHeight, 10);
    },

    addTypingIndicator(id) {
        const msgs = document.getElementById('ai-chat-messages');
        const div = document.createElement('div');
        div.className = 'ai-msg typing-indicator';
        div.id = id;
        div.innerHTML = `
            <div class="msg-bubble ai" style="display: flex; align-items: center; padding: 16px;">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
    },

    removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    },

    buildPrompt(userText) {
        let pyqContext = "No PYQs available for this subject.";
        if (this.context.pyqData && this.context.pyqData.length > 0) {
            pyqContext = JSON.stringify(this.context.pyqData);
        }

        let systemPrompt = `You are Acadex AI, an intelligent, helpful, and concise tutor integrated into the Acadex student platform.
The student is currently looking at the section for the subject: ${this.context.subjectName}.
Here are the PYQs (Previous Year Questions) available in their current view:
${pyqContext}

Your goal is to answer the student's question clearly. If they ask about a PYQ, refer to the provided PYQ data.
You can format your responses with basic markdown. Provide brief, correct, and educational answers.
`;
        
        let promptText = systemPrompt + "\n\n";
        
        if (this.chatHistory.length > 0) {
            promptText += "--- Conversation History ---\n";
            this.chatHistory.forEach(msg => {
                promptText += `${msg.role === 'user' ? 'Student' : 'You'}: ${msg.text}\n`;
            });
            promptText += "----------------------------\n\n";
        }

        promptText += `Student: ${userText}\nYou:`;

        return promptText;
    }
};

// Auto-initialize when file is loaded if body is ready, else wait for DOMContentLoaded
if (document.body) {
    window.AIService.init();
} else {
    document.addEventListener('DOMContentLoaded', () => window.AIService.init());
}
