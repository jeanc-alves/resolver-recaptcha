const dbc = require("./deathbycaptcha");

const {
  password: user_password,
  username: user_username,
} = require("./config");

const username = user_username; // DBC account username
const password = user_password; // DBC account password

async function resolveCaptcha({ googlekey, pageurl }) {
  const token_params = JSON.stringify({
    proxy: "http://username:password@proxy.example:3128",
    proxytype: "HTTP",
    googlekey,
    pageurl,
  });
  const client = new dbc.HttpClient(username, password);
  return new Promise((resolve, reject) => {
    client.decode(
      { extra: { type: 4, token_params: token_params } },
      (captcha) => {
        if (captcha) {
          if (captcha.is_correct === true) {
            const { captcha: captcha_id, text, is_correct, status } = captcha;
            return resolve({ captcha_id, text, is_correct, status });
          }
          return reject(captcha.captcha, captcha.is_correct);
        }
      }
    );
  });
}

async function runResolverReCaptcha() {
  const googlekey = "6LeOURwTAAAAALi7wL3ndLPAIgV7m_3klbrjBlNa";

  const pageurl =
    "https://consulta.detran.ro.gov.br/CentralDeConsultasInternet/Software/ViewConsultaVeiculos.aspx";
  const captchaResolved = await resolveCaptcha({ googlekey, pageurl });
  const { text: captcha_token } = captchaResolved;
  return captcha_token;
}

async function processReCaptcha() {
  return runResolverReCaptcha();
}

module.exports = { processReCaptcha };
