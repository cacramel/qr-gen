let html5QrcodeScanner = null;

function switchTab(tabName, event) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  if (tabName === 'generator') {
    event.target.classList.add('active');
    document.getElementById('generator').classList.add('active');
    stopScanner();
  } else {
    event.target.classList.add('active');
    document.getElementById('scanner').classList.add('active');
  }
}

function generateQR() {
  const text = document.getElementById('qr-text').value.trim();
  const qrImage = document.getElementById('qr-image');
  const downloadLink = document.getElementById('download-link');

  if (!text) {
    alert('Te rog introdu un link sau un text!');
    return;
  }

  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;

  qrImage.src = qrApiUrl;
  qrImage.style.display = 'block';

  downloadLink.href = qrApiUrl;
  downloadLink.target = '_blank';
  downloadLink.style.display = 'inline-block';
}

function startScanner() {
  document.getElementById('start-cam-btn').style.display = 'none';
  document.getElementById('stop-cam-btn').style.display = 'block';

  html5QrcodeScanner = new Html5Qrcode("reader");

  html5QrcodeScanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 200, height: 200 } },
    (decodedText) => {
      const scanResultDiv = document.getElementById('scan-result');
      if (decodedText.startsWith('http://') || decodedText.startsWith('https://')) {
        scanResultDiv.innerHTML = `Rezultat: <a href="${decodedText}" target="_blank" style="color: #ffd59a;">${decodedText}</a>`;
      } else {
        scanResultDiv.innerText = `Rezultat: ${decodedText}`;
      }
    },
    (errorMessage) => {}
  ).catch(err => {
    alert('Nu s-a putut accesa camera. Asigură-te că i-ai dat permisiune!');
    stopScanner();
  });
}

function stopScanner() {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.stop().then(() => {
      document.getElementById('start-cam-btn').style.display = 'block';
      document.getElementById('stop-cam-btn').style.display = 'none';
      document.getElementById('reader').innerHTML = '';
    }).catch(err => console.log(err));
  }
}
