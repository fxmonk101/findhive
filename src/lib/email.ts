// Email notification configuration
export const EMAIL_RECIPIENTS = {
  ORDER_NOTIFICATIONS: [
    "warrenharry01@gmail.com",
    "teddyfx909@gmail.com"
  ]
};

export interface OrderNotificationData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  total: number;
  paymentMethod: string;
  items: Array<{
    title: string;
    quantity: number;
    unit_price: number;
  }>;
  shippingAddress: {
    first_name: string;
    last_name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

// Note: This is a placeholder for email functionality
// In production, you would integrate with an email service like:
// - Supabase Edge Functions with Resend/SendGrid
// - Nodemailer with SMTP
// - Email API services (SendGrid, Mailgun, AWS SES)

export async function sendOrderNotification(data: OrderNotificationData): Promise<void> {
  // TODO: Implement actual email sending
  // This would typically be done via a Supabase Edge Function
  console.log("Order notification to be sent to:", EMAIL_RECIPIENTS.ORDER_NOTIFICATIONS);
  console.log("Order data:", data);
  
  // Example implementation with Supabase Edge Function:
  // const { error } = await supabase.functions.invoke('send-order-email', {
  //   body: {
  //     recipients: EMAIL_RECIPIENTS.ORDER_NOTIFICATIONS,
  //     orderData: data
  //   }
  // });
  
  // For now, we'll log the notification
  console.log(`[EMAIL NOTIFICATION] Order ${data.orderNumber} - Total: $${data.total}`);
}

export async function sendInvoiceEmail(data: OrderNotificationData, invoiceUrl: string): Promise<void> {
  // TODO: Implement invoice email sending
  console.log("Invoice email to be sent to:", EMAIL_RECIPIENTS.ORDER_NOTIFICATIONS);
  console.log("Invoice URL would be:", invoiceUrl);
  
  // This would send the PDF invoice as an attachment
}
