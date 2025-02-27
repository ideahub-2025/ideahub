import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sys

# Import settings from your Django settings file
from django.conf import settings

# Get email details from settings.py
sender_email = settings.EMAIL_SENDER
receiver_email = settings.EMAIL_RECEIVER
subject = "Test Email"
body = "This is a test email."
app_password = settings.EMAIL_APP_PASSWORD

# Create the email message
message = MIMEMultipart()
message["From"] = sender_email
message["To"] = receiver_email
message["Subject"] = subject
message.attach(MIMEText(body, "plain"))

# Send the email
try:
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender_email, app_password)
        server.sendmail(sender_email, receiver_email, message.as_string())
        print("Email sent successfully!")
except Exception as e:
    print(f"Error: {e}")
