import os
import logging
from mailersend import emails

logger = logging.getLogger(__name__)

def invia_email(mail_recipients, mail_from, id_template, personalization, subject):
    logger.info('Preparazione invio Email "' + subject + '".')
    mailer = emails.NewEmail(mailersend_api_key=os.getenv('MAILERSEND_API_KEY'))
    mail_body = {}
    mailer.set_mail_from(mail_from, mail_body)
    mailer.set_mail_to(mail_recipients, mail_body)
    mailer.set_subject(subject, mail_body)
    mailer.set_template(id_template, mail_body)
    mailer.set_advanced_personalization(personalization, mail_body)
    resp = mailer.send(mail_body)

    try:
        if int(resp) == 202:
            logger.info('Email "' + subject + '" inviata.')
        else:
            logger.error('Email ' + subject + ' non inviata correttamente: ' + resp)
        return resp
    except ValueError as e:
        logger.error('Email ' + subject + ' non inviata correttamente: ' + resp)
        return resp