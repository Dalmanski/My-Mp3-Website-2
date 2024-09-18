from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr

app = Flask(__name__)
CORS(app)

def send_confirmation_email(recipient_email):
    sender_email = "jayraldjohndalman@gmail.com"
    sender_password = os.getenv('EMAIL_PASSWORD')
    sender_name = "Log-in Website"

    msg = MIMEMultipart()
    msg['From'] = formataddr((sender_name, sender_email))
    msg['To'] = recipient_email
    msg['Subject'] = "Login Confirmation"

    email_body = """
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                background-color: #f4f4f4;
                color: #333;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            h1 {
                color: #007BFF;
            }
            p {
                font-size: 16px;
                line-height: 1.5;
            }
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome!</h1>
            <p>Dear User,</p>
            <p>Your email account has been successfully created.</p>
            <p>You can now log in and access all the features available to you. If you have any questions or encounter issues, feel free to reach out to our support team.</p>
            <p>Best regards,<br>The Team</p>
            <div class="footer">
                If you did not request this, please ignore this email.
            </div>
        </div>
    </body>
    </html>
    """

    msg.attach(MIMEText(email_body, 'html'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, recipient_email, msg.as_string())
        server.quit()
        print(f"Email sent to {recipient_email}")
    except Exception as e:
        print(f"Failed to send email. Error: {e}")

# pls input "python app.py" first in terminal to activate server

@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.json
    recipient_email = data.get('email')
    if not recipient_email:
        return jsonify({'error': 'No email provided'}), 400
    try:
        send_confirmation_email(recipient_email)
        return jsonify({'message': 'Email sent successfully'}), 200
    except Exception as e:
        print(f"Failed to send email. Error: {e}")
        return jsonify({'error': 'Failed to send email'}), 500

if __name__ == '__main__':
    app.run(debug=True)