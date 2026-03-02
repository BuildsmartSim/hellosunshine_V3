import { TicketEmail } from '@/emails/TicketEmail';
import { render } from '@react-email/components';

export default async function EmailPreviewPage() {
    const htmlSnippet = await render(
        <TicketEmail
            customerName="John Doe"
            eventTitle="Brighton Sanctuary"
            passName="General Entry"
            date="24 Oct"
            ticketId="demo-ticket-id"
        />
    );

    return (
        <div style={{ padding: '20px', backgroundColor: '#e0e0e0', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
            <div
                style={{ width: '600px', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                dangerouslySetInnerHTML={{ __html: htmlSnippet }}
            />
        </div>
    );
}
