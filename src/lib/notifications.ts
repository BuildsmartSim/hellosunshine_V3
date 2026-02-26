export async function sendTelegramMessage(token: string, chatId: string, text: string) {
    try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'HTML'
            }),
        });

        if (!response.ok) {
            const errData = await response.json();
            console.error('Telegram API error:', errData);
            return { success: false, error: errData.description };
        }

        return { success: true };
    } catch (err: any) {
        console.error('Failed to send Telegram message:', err);
        return { success: false, error: err.message };
    }
}
