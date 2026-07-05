from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from datetime import datetime
import os


def generate_invoice_pdf(sale, customer, stock_item, company):
    folder_path = "generated_invoices"
    os.makedirs(folder_path, exist_ok=True)

    file_name = f"invoice_{sale.invoice_number}.pdf"
    file_path = os.path.join(folder_path, file_name)

    c = canvas.Canvas(file_path, pagesize=A4)
    width, height = A4

    c.setFont("Helvetica-Bold", 22)
    c.drawString(50, height - 50, "Nexa ERP")

    c.setFont("Helvetica", 10)
    c.drawString(50, height - 70, "Billing • Inventory • Accounting")

    c.setStrokeColor(colors.black)
    c.line(50, height - 90, width - 50, height - 90)

    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 125, "TAX INVOICE")

    c.setFont("Helvetica", 11)
    c.drawString(50, height - 155, f"Invoice No: {sale.invoice_number}")
    c.drawString(50, height - 175, f"Date: {sale.created_at.strftime('%d-%m-%Y')}")

    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 215, "Company Details")
    c.setFont("Helvetica", 10)
    c.drawString(50, height - 235, f"Company: {company.company_name if company else 'Nexa Company'}")
    c.drawString(50, height - 250, f"Address: {company.address if company else '-'}")
    c.drawString(50, height - 265, f"GST No: {company.gst_number if company else '-'}")

    c.setFont("Helvetica-Bold", 12)
    c.drawString(320, height - 215, "Customer Details")
    c.setFont("Helvetica", 10)
    c.drawString(320, height - 235, f"Customer: {customer.customer_name if customer else '-'}")
    c.drawString(320, height - 250, f"Mobile: {customer.mobile_number if customer else '-'}")
    c.drawString(320, height - 265, f"GST No: {customer.gst_number if customer else '-'}")

    y = height - 330

    c.setFillColor(colors.lightgrey)
    c.rect(50, y, width - 100, 25, fill=True, stroke=False)
    c.setFillColor(colors.black)

    c.setFont("Helvetica-Bold", 10)
    c.drawString(60, y + 8, "Item")
    c.drawString(230, y + 8, "Qty")
    c.drawString(300, y + 8, "Rate")
    c.drawString(390, y + 8, "GST %")
    c.drawString(470, y + 8, "Total")

    y -= 30

    c.setFont("Helvetica", 10)
    c.drawString(60, y, stock_item.product_name if stock_item else "-")
    c.drawString(230, y, str(sale.quantity))
    c.drawString(300, y, f"Rs. {sale.selling_price}")
    c.drawString(390, y, f"{stock_item.gst_percentage if stock_item else 0}%")
    c.drawString(470, y, f"Rs. {sale.total_amount}")

    y -= 60

    c.line(50, y, width - 50, y)

    y -= 35

    c.setFont("Helvetica-Bold", 13)
    c.drawString(370, y, "Grand Total:")
    c.drawString(470, y, f"Rs. {sale.total_amount}")

    y -= 80

    c.setFont("Helvetica", 10)
    c.drawString(50, y, "Thank you for your business!")

    c.setFont("Helvetica-Bold", 10)
    c.drawString(400, y, "Authorized Signature")

    c.save()

    return file_path