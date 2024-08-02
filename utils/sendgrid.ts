import sgMail, { MailDataRequired } from '@sendgrid/mail'

type Props = {
  to: string
  templateName: 'BookingSubmition'
  dynamicTemplateData?: Record<string, any>
}

export const sendEmail = async ({ to, templateName, dynamicTemplateData }: Props) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);



  const msg = {
    to: 'test@example.com',
    from: 'alexcol123456@gmail.com', // Use the email address or domain you verified above
    name: 'Alex test name',
    templateId: templates[templateName],
    dynamicTemplateData

  };

  try {
    await sgMail.send(msg);
    console.log('Email sent============================================================================================')
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body)
    }
  }

}

const templates = {
  BookingSubmition: 'd-5c3968727f1f4cfd80ee5a8fa617d2dd'
}