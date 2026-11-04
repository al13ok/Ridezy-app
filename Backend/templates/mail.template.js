// Same colours as the app (brand green + ink greys) so the mails don't look like
// they came from a different product. Inline styles only, mail clients strip <style>.
const logoUrl = `${process.env.CLIENT_URL || ""}/logo-Ridezy.png`;

let emailTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{title}}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f2f4f7; color: #344054; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
    <div style="max-width: 560px; margin: 0 auto; padding: 32px 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="${logoUrl}" alt="Ridezy" style="height: 44px;" />
      </div>

      <div style="background: #ffffff; border-radius: 20px; padding: 32px 28px; box-shadow: 0 4px 16px rgba(16, 24, 40, 0.06);">
        <h2 style="margin: 0 0 16px; font-size: 22px; color: #0b1220;">{{title}}</h2>
        <p style="margin: 0 0 12px;">Hi {{name}},</p>
        <p style="margin: 0 0 24px; line-height: 1.6;">{{message}}</p>

        <div style="text-align: center; margin: 28px 0;">
          <a
            href="{{cta_link}}"
            target="_blank"
            style="display: inline-block; padding: 14px 32px; background-color: #12b76a; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 14px;"
          >{{cta_text}}</a>
        </div>

        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #667085;">{{note}}</p>
      </div>

      <div style="margin-top: 24px; text-align: center; font-size: 13px; color: #98a2b3;">
        &mdash; Team Ridezy
        <br />
        Questions? Write to us at
        <a href="mailto:${process.env.MAIL_USER}" style="color: #039855;">${process.env.MAIL_USER}</a>
      </div>
    </div>
  </body>
</html>
`;

const fillTemplate = (data, template = emailTemplate) => {
  return template
    .replace(/{{title}}/g, data.title || "")
    .replace(/{{name}}/g, data.name || "there")
    .replace(/{{message}}/g, data.message || "")
    .replace(/{{cta_link}}/g, data.cta_link || "")
    .replace(/{{cta_text}}/g, data.cta_text || "Click Here")
    .replace(/{{note}}/g, data.note || "");
};

module.exports = { emailTemplate, fillTemplate };
