// Cấu hình Supabase (Lấy Project URL và Anon Key trong phần Project Settings -> API của Supabase)
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Load lịch sử chat từ Supabase khi mở web
async function loadHistory() {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Lỗi tải lịch sử:', error);
        return;
    }

    chatBox.innerHTML = '';
    data.forEach(msg => {
        appendMessage(msg.content, msg.role);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

function appendMessage(text, role) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', role);
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function handleSendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Hiện tin nhắn của User lên UI
    appendMessage(text, 'user');
    userInput.value = '';

    // Lưu tin nhắn user vào Supabase
    await supabase.from('messages').insert([{ role: 'user', content: text }]);

    // TODO: Gọi API AI (Gemini) ở đây để lấy phản hồi
    // Tạm thời giả lập AI trả lời sau 1 giây:
    setTimeout(async () => {
        const aiReply = "Chào bạn, tôi là AI tích hợp trên Supabase & Vercel!";
        appendMessage(aiReply, 'assistant');
        
        // Lưu tin nhắn AI vào Supabase
        await supabase.from('messages').insert([{ role: 'assistant', content: aiReply }]);
    }, 1000);
}

sendBtn.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
});

// Chạy load lịch sử lúc đầu
loadHistory();
