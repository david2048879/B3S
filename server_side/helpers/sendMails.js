exports.validateEmailParams = (email, token) => {
    return {
        Source: process.env.EMAIL_FROM,
        Destination: {
          ToAddresses: [email],
        },
        ReplyToAddresses: [process.env.EMAIL_TO],
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: `
                    <html>
                        <h3 style="color: purple;">Activate your account</h3>
                        <p>Please use the following link to complete the activation of your account:</p>
                        <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                    </html>
                    `,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: "Complete your account activation!",
          },
        },
      };
}

exports.forgotPasswordEmailParams = (email, token) => {
  return {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [email],
      },
      ReplyToAddresses: [process.env.EMAIL_TO],
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
                  <html>
                      <h3 style="color: purple;">Reset Password Link</h3>
                      <p>Please use the following link to reset your password:</p>
                      <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                  </html>
                  `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Resetting my password!",
        },
      },
    };
}
