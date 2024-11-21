import io
import datetime

from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle

class GeneratePdf(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        account_data = request.data.get('accounts', [])

        # Check if data is provided
        if not account_data:
            return Response({"error": "Account data is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Create a buffer to store PDF
        buffer = io.BytesIO()
        pdf_canvas = canvas.Canvas(buffer, pagesize=A4)

        # --- PDF Settings ---
        page_margin = 50
        page_width, page_height = A4
        table_width = page_width - 2 * page_margin
        row_height = 20
        rows_per_page = 30 
        # ---------------------

        # Draw Title
        pdf_canvas.drawString(page_margin, page_height - page_margin, "Sunhill LMS Generated User Accounts")

        # --- Extract and display distinct User Roles and Branches ---
        user_roles = set([account.get('role', 'N/A') for account in account_data])
        branches = set([account.get('branch_name', 'N/A') for account in account_data])

        pdf_canvas.drawString(page_margin, page_height - page_margin - 20, 
                                f"User Role: {', '.join(user_roles)}")
        pdf_canvas.drawString(page_margin, page_height - page_margin - 35, 
                                f"Branch: {', '.join(branches)}")
        # ----------------------------------------------------------------

        # Data for the table (header and content)
        data = [
            ["Username", "Password"],  # Header row
        ]
        data.extend([account.get('username', ''), account.get('password', '')] for account in account_data)

        # Calculate table height and number of pages
        table_height = len(data) * row_height
        num_pages = (len(data) - 1) // rows_per_page + 1

        # Iterate over pages
        for page in range(num_pages):
            pdf_canvas.setFont("Helvetica", 12)
            # Calculate starting and ending row for each page
            start_row = page * rows_per_page + 1
            end_row = min((page + 1) * rows_per_page + 1, len(data))

            # Get data for the current page
            page_data = data[0:1] + data[start_row:end_row]  # Include header on each page

            # Create table for the current page
            table = Table(page_data, colWidths=[table_width/2, table_width/2])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('FONTSIZE', (0, 0), (-1, -1), 10),  # Set font size
            ]))

            # Calculate the y-coordinate for table placement
            title_height = 40
            y = page_height - page_margin - title_height - (len(page_data) * row_height)

            # Place the table on the PDF
            table.wrapOn(pdf_canvas, table_width, table_height)
            table.drawOn(pdf_canvas, page_margin + 10, y - 20)

            # Add page number if multiple pages
            if num_pages > 1:
                pdf_canvas.drawString(page_margin, page_margin // 2, f"Page {page + 1} of {num_pages}")

            # Start a new page if it's not the last page
            if page < num_pages - 1:
                pdf_canvas.showPage()

        # Finalize the PDF
        pdf_canvas.save()

        # Move buffer's position to the beginning
        buffer.seek(0)

        # Generate filename with current date
        today = datetime.date.today()
        formatted_date = today.strftime("%Y-%m-%d") # Format date as YYYY-MM-DD
        filename = f"Sunhill-LMS-Generated-Accounts-{formatted_date}.pdf"

        # Return PDF as a response
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'

        return response
    
class GeneratePdfWithParent(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        account_data = request.data.get('accounts', [])

        # Check if data is provided
        if not account_data:
            return Response({"error": "Account data is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Create a buffer to store PDF
        buffer = io.BytesIO()
        pdf_canvas = canvas.Canvas(buffer, pagesize=A4)

        # --- PDF Settings ---
        page_margin = 50
        page_width, page_height = A4
        table_width = page_width - 2 * page_margin
        row_height = 20
        rows_per_page = 30 
        # ---------------------

        # Draw Title
        pdf_canvas.drawString(page_margin, page_height - page_margin, "Sunhill LMS Generated User Accounts")

        # --- Extract and display distinct User Roles and Branches ---
        user_roles = set([account.get('role', 'N/A') for account in account_data])
        branches = set([account.get('branch_name', 'N/A') for account in account_data])

        # If "student" is present in user_roles, explicitly add "teacher"
        if "student" in user_roles:
            user_roles.add("parent")

        # Ensure "student" appears first, followed by other roles
        ordered_roles = ["student" if "student" in user_roles else None] + sorted(user_roles - {"student"})

        # Convert the roles list into a string and join with commas
        user_roles_display = ", ".join(filter(None, ordered_roles))

        pdf_canvas.drawString(page_margin, page_height - page_margin - 20, 
                                f"User Role: {user_roles_display}")
        pdf_canvas.drawString(page_margin, page_height - page_margin - 35, 
                                f"Branch: {', '.join(branches)}")
        # ----------------------------------------------------------------

        # Data for the table (header and content)
        data = [
            ["Student Username", " Student Password", "Parent Username", "Parent Password"],  # Header row
        ]
        data.extend([account.get('username', ''), account.get('password', '') , account.get('parent_username', ''), account.get('parent_password', ''), ] for account in account_data)

        # Calculate table height and number of pages
        table_height = len(data) * row_height
        num_pages = (len(data) - 1) // rows_per_page + 1

        # Iterate over pages
        for page in range(num_pages):
            pdf_canvas.setFont("Helvetica", 12)
            # Calculate starting and ending row for each page
            start_row = page * rows_per_page + 1
            end_row = min((page + 1) * rows_per_page + 1, len(data))

            # Get data for the current page
            page_data = data[0:1] + data[start_row:end_row]  # Include header on each page

            # Create table for the current page
            table = Table(page_data, colWidths=[table_width/4, table_width/4, table_width/4, table_width/4])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('FONTSIZE', (0, 0), (-1, -1), 10),  # Set font size
            ]))

            # Calculate the y-coordinate for table placement
            title_height = 40
            y = page_height - page_margin - title_height - (len(page_data) * row_height)

            # Place the table on the PDF
            table.wrapOn(pdf_canvas, table_width, table_height)
            table.drawOn(pdf_canvas, page_margin + 10, y - 20)

            # Add page number if multiple pages
            if num_pages > 1:
                pdf_canvas.drawString(page_margin, page_margin // 2, f"Page {page + 1} of {num_pages}")

            # Start a new page if it's not the last page
            if page < num_pages - 1:
                pdf_canvas.showPage()

        # Finalize the PDF
        pdf_canvas.save()

        # Move buffer's position to the beginning
        buffer.seek(0)

        # Generate filename with current date
        today = datetime.date.today()
        formatted_date = today.strftime("%Y-%m-%d") # Format date as YYYY-MM-DD
        filename = f"Sunhill-LMS-Generated-Accounts-{formatted_date}.pdf"

        # Return PDF as a response
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'

        return response