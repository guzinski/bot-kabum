const axios = require('axios').default;

let occurencies = [];

async function getData() {
  return axios.get('https://radar.tntbrasil.com.br/radar/public/localizacaoSimplificadaDetail/sJPtS557dHDHihyvaWiiYw')
    .then(response => {
      const lines = response.data.split('\n');
      const json = JSON.parse(lines[224].trim().slice(24, -2));
      return json.viewOptions.gridOcorrencias.aaData;
    }).catch(error => {
      console.error(error);
    });

}

async function verifyNews() {
  const data = await getData();
  data
    .filter(row => !occurencies.some(row2 => row2.timeDate === row.timeDate))
    .forEach(async row => {
      occurencies.push(row);
      await sendTelegram(`O que? ${row.occurrence} \n Onde? ${row.branch} \n Quando? ${row.timeDate}`);
    });
  sendTelegram('Nada Ainda');
  console.log('Aline')
  setTimeout(verifyNews, 600000);
}
verifyNews();

async function sendTelegram(text) {
  await axios.post('https://api.telegram.org/bot1288327201:AAGfEGaWW1ZFKOSmpKr_eKgC-reUKgIvzVM/sendMessage', {
    chat_id: 1154010765,
    text: text
  });
}
