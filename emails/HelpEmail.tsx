import { Html, Section, Text } from '@react-email/components';

type HelpTicketEmailProps = {
    userEmail: string;
    requestType: 'help' | 'feature';
    message: string;
    submittedAt: string;
};

/**
 * This email is sent internally when a user submits a help/feature request.
 */
export default function HelpTicketEmail(props: HelpTicketEmailProps) {
    return (
        <Html>
            <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>
                New {props.requestType === 'help' ? 'Support Ticket' : 'Feature Request'}
            </Text>

            <Section style={{ marginTop: '20px' }}>
                <Text style={{ marginBottom: '10px' }}>
                    <strong>From User:</strong> {props.userEmail}
                </Text>
                <Text style={{ marginBottom: '10px' }}>
                    <strong>Submitted:</strong> {props.submittedAt}
                </Text>
                <Text style={{ marginBottom: '10px' }}>
                    <strong>Type:</strong> {props.requestType === 'help' ? 'Help Request' : 'Feature Request'}
                </Text>
            </Section>

            <Section style={{
                marginTop: '20px',
                padding: '15px',
                background: '#f9fafb',
                borderRadius: '6px'
            }}>
                <Text style={{ fontWeight: 'bold', marginBottom: '10px' }}>Message:</Text>
                <Text style={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.5'
                }}>
                    {props.message}
                </Text>
            </Section>

            <Section style={{ marginTop: '30px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                <Text style={{ fontSize: '14px', color: '#6b7280' }}>
                    This is an automated message from the Rapid Product Launcher help system.
                </Text>
                <Text style={{ fontSize: '14px', color: '#6b7280' }}>
                    Reply directly to this email to respond to the user.
                </Text>
            </Section>
        </Html>
    );
}
