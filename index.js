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
  // const googlekey = "6Le-wvkSAAAAAPBMRTvw0Q4Muexq9bi0DJwx_mJ-";
  const googlekey = "6LeOURwTAAAAALi7wL3ndLPAIgV7m_3klbrjBlNa";
  // const pageurl = "https://www.google.com/recaptcha/api2/demo";
  const pageurl =
    "https://consulta.detran.ro.gov.br/CentralDeConsultasInternet/Software/ViewConsultaVeiculos.aspx";
  const captchaResolved = await resolveCaptcha({ googlekey, pageurl });
  const { text: captcha_token } = captchaResolved;
  return { captcha_token };
}

async function processReCaptcha() {
  const { captcha_token } = await runResolverReCaptcha();
  console.log("captcha_token :", captcha_token);
  // const captcha_token =
  //   "03AGdBq25vi-t5NXKln1_l-vsSohxmCH994L6rZaMyy_YH68ZDL76EDg3ONI9qnoK_hDAYewspkZJEHoLtNc5_I6HHWB45nFZDhAateVtl4TYSfSQr-AoxD_6Q14Z6v_nCF1h5RbqwyMDsLICWl5jBYzrTQtS3y7dksQn9SL6yePs2W8k0YcXYJScIWAA3JdCaIrsh87TFzCUDegg2FMVToM3alqmIZHy3pCjFAayscupTBY_jbIu4ccTBrmgjK1fLCQiTdjf8vUo0xaI2piBiXfmgEA0zQ-7GM5mWHAvH4O7OaeQuvUqJGz2iu5MfOgKkk3o_JIrIFSkrQEkM1NDElueosA3HEutQXA5R5i_cRWyc6IfazZ05M1Na68PKIXMTf2O_no5PIwSLWn9mOgo1OVs7_qqCflKHdoHLOOVKHNbm9aOnia3r7tLBBFG6TPgU50P0HC5epbfd7RaXvShHVHb6xDiilAvZP9mabpyWz2F3reniNzrPg6phaADjnqAWXFecXPdjyxD26TzJxrZrGTWrMFVFIBuFbOZr11Q_c1hHhe7vTKdqod8";
}
processReCaptcha();
