import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatPrice } from './format';

export interface InvoiceData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
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
  paymentMethod: string;
  items: Array<{
    title: string;
    quantity: number;
    unit_price: number;
    line_total: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  orderDate: Date;
}

export function generateInvoicePDF(data: InvoiceData): jsPDF {
  const doc = new jsPDF();
  
  // Add company header
  doc.setFontSize(24);
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text('FindHive', 20, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Invoice', 20, 32);
  doc.text(`Order #${data.orderNumber}`, 20, 38);
  doc.text(`Date: ${data.orderDate.toLocaleDateString()}`, 20, 44);
  
  // Add customer info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Bill To:', 120, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(data.customerName, 120, 32);
  doc.text(data.customerEmail, 120, 38);
  if (data.customerPhone) {
    doc.text(data.customerPhone, 120, 44);
  }
  
  // Add shipping address
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Ship To:', 120, 55);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const address = data.shippingAddress;
  doc.text(`${address.first_name} ${address.last_name}`, 120, 62);
  doc.text(address.address_line1, 120, 68);
  if (address.address_line2) {
    doc.text(address.address_line2, 120, 74);
  }
  doc.text(`${address.city}, ${address.state} ${address.postal_code}`, 120, address.address_line2 ? 80 : 74);
  doc.text(address.country, 120, address.address_line2 ? 86 : 80);
  
  // Add payment method
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Payment Method: ${data.paymentMethod}`, 20, 55);
  
  // Add items table
  const tableData = data.items.map(item => [
    item.title,
    item.quantity.toString(),
    formatPrice(item.unit_price),
    formatPrice(item.line_total)
  ]);
  
  autoTable(doc, {
    startY: 95,
    head: [['Item', 'Qty', 'Price', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      cellPadding: 5
    }
  });
  
  // Add totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Subtotal:', 140, finalY);
  doc.text(formatPrice(data.subtotal), 180, finalY, { align: 'right' });
  
  doc.text('Shipping:', 140, finalY + 6);
  doc.text(data.shipping === 0 ? 'Free' : formatPrice(data.shipping), 180, finalY + 6, { align: 'right' });
  
  doc.text('Tax:', 140, finalY + 12);
  doc.text(formatPrice(data.tax), 180, finalY + 12, { align: 'right' });
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'bold');
  doc.text('Amount Due:', 140, finalY + 20);
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text(formatPrice(data.total), 180, finalY + 20, { align: 'right' });
  
  // Add footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Thank you for your order!', 105, 280, { align: 'center' });
  doc.text('For questions, contact us at support@findhive.shop', 105, 285, { align: 'center' });
  
  return doc;
}

export function downloadInvoicePDF(data: InvoiceData): void {
  const doc = generateInvoicePDF(data);
  doc.save(`FindHive-Invoice-${data.orderNumber}.pdf`);
}
