import os

from gym import custom_emails


mail_generic = {
    "name": "Get Your Movement",
    "email": os.getenv('EMAIL_FROM'),
}

def feedback_settimanale(feedback):
    personalization = [
        {
            "email": os.getenv('EMAIL_FOR_SURVEY'),
            "data": {
                "name": feedback.form.user.name,
                "surname": feedback.form.user.surname,
                "email": feedback.form.user.email,
                "form": feedback.form.name,
                "critici": feedback.critici,
                "forti": feedback.forti,
                "ese_differenti": feedback.ese_differenti,
                "tempistiche_ok": feedback.tempistiche_ok,
                "altro": feedback.altro,
            }
        }
    ]
    resp = custom_emails.invia_email(mail_recipients=[mail_generic], mail_from=mail_generic, id_template="0r83ql3r0vzlzw1j",
                                personalization=personalization, subject="Feedback Utente Settimanale")
    return resp
    
def feedback_mensile(feedback):
    personalization = [
        {
            "email": os.getenv('EMAIL_FOR_SURVEY'),
            "data": {
                "name": feedback.user.name,
                "surname": feedback.user.surname,
                "email": feedback.user.email,
                "critici": feedback.critici,
                "forti": feedback.forti,
                "ese_differenti": feedback.ese_differenti,
                "tempistiche_ok": feedback.tempistiche_ok,
                "altro": feedback.altro,
            }
        }
    ]
    resp = custom_emails.invia_email(mail_recipients=[mail_generic], mail_from=mail_generic, id_template="0r83ql3kwov4zw1j",
                                personalization=personalization, subject="Feedback Utente Mensile")
    return resp
    