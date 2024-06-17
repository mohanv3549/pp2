let dataRows = [];

function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function() {
        const content = reader.result;
        dataRows = content.split('\n').map(row => row.split(','));
        updateData();
    };

    reader.readAsText(file);
}

function updateData() {
    const encryptionCheckbox = document.getElementById('encryption-checkbox');
    const decryptionCheckbox = document.getElementById('decryption-checkbox');

    // Ensure only one checkbox is checked at a time
    if (encryptionCheckbox.checked) {
        decryptionCheckbox.checked = false;
        encryptData();
    } else if (decryptionCheckbox.checked) {
        encryptionCheckbox.checked = false;
        decryptData();
    }
}

function encryptData() {
    const newDataRows = dataRows.map(row => {
        return row.map(value => {
            if (!isNaN(parseFloat(value)) && isFinite(value)) {
                return parseFloat(value) * 7;
            } else {
                return value;
            }
        });
    });
    const csvContent = newDataRows.map(row => row.join(',')).join('\n');
    enableDownloadButton(csvContent);
}

function decryptData() {
    const newDataRows = dataRows.map(row => {
        return row.map(value => {
            if (!isNaN(parseFloat(value)) && isFinite(value)) {
                return parseFloat(value) / 7;
            } else {
                return value;
            }
        });
    });
    const csvContent = newDataRows.map(row => row.join(',')).join('\n');
    enableDownloadButton(csvContent);
}

function enableDownloadButton(content) {
    const downloadButton = document.getElementById('download-btn');
    downloadButton.style.display = 'block';
    downloadButton.dataset.content = content; // Store content in data attribute
}

function downloadData() {
    const content = document.getElementById('download-btn').dataset.content;
    const downloadLink = document.createElement('a');
    downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(content);
    downloadLink.target = '_blank';
    downloadLink.download = 'output.csv';
    downloadLink.click();
}
