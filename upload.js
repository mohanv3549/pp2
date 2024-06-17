function homomorphicEncryption(data) {
    return data.map(value => value * 7);
}

// Function to handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function() {
        const content = reader.result;
        const rows = content.split('\n');
        const headers = rows[0].split(',');

        // Populate dropdown menus with column names
        const xColumnSelect = document.getElementById('x-column');
        const yColumnSelect = document.getElementById('y-column');

        xColumnSelect.innerHTML = '';
        yColumnSelect.innerHTML = '';

        for (let i = 0; i < headers.length; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.text = headers[i];
            xColumnSelect.appendChild(option);

            const optionCopy = option.cloneNode(true);
            yColumnSelect.appendChild(optionCopy);
        }

        // Generate plot when columns are selected
        generatePlot();
    };

    reader.readAsText(file);
}

// Function to generate plot based on selected columns and plot type
function generatePlot() {
const xColumnIndex = document.getElementById('x-column').value;
const yColumnIndex = document.getElementById('y-column').value;
const plotType = document.querySelector('input[name="plot-type"]:checked').value;

const fileInput = document.getElementById('upload');
const file = fileInput.files[0];
const reader = new FileReader();

reader.onload = function() {
    const content = reader.result;
    const rows = content.split('\n').map(row => row.split(','));
    const xData = rows.slice(1).map(row => row[xColumnIndex]);
    const yData = rows.slice(1).map(row => row[yColumnIndex]);

    // Decrypt the data by dividing each element by 7
    const decryptedXData = xData.map(value => parseFloat(value) / 7);
    const decryptedYData = yData.map(value => parseFloat(value) / 7);

    if (plotType === 'line') {
        // Create data for the line plot
        const trace = {
            x: decryptedXData,
            y: decryptedYData,
            type: 'scatter',
            mode: 'lines+markers'
        };

        // Create layout for the line plot
        const layout = {
            title: `${document.getElementById('y-column').options[yColumnIndex].text} vs ${document.getElementById('x-column').options[xColumnIndex].text}`,
            xaxis: { title: document.getElementById('x-column').options[xColumnIndex].text },
            yaxis: { title: document.getElementById('y-column').options[yColumnIndex].text }
        };

        // Plot the line plot
        Plotly.newPlot('plot-container', [trace], layout);
    } else if (plotType === 'histogram') {
        // Create data for the histogram
        const trace = {
            x: decryptedYData,
            type: 'histogram'
        };

        // Create layout for the histogram
        const layout = {
            title: `${document.getElementById('y-column').options[yColumnIndex].text} Histogram`,
            xaxis: { title: document.getElementById('y-column').options[yColumnIndex].text },
            yaxis: { title: 'Frequency' }
        };

        // Plot the histogram
        Plotly.newPlot('plot-container', [trace], layout);
    } else if (plotType === 'pie') {
        // Create data for the pie chart
        const data = [{
            values: decryptedYData,
            labels: decryptedXData,
            type: 'pie'
        }];

        // Create layout for the pie chart
        const layout = {
            title: `${document.getElementById('y-column').options[yColumnIndex].text} Pie Chart`
        };

        // Plot the pie chart
        Plotly.newPlot('plot-container', data, layout);
    }
};

reader.readAsText(file);
}

// Function to download the visualization as an image
function downloadVisualization() {
    // Convert the plot to an image URL
    Plotly.toImage(document.getElementById('plot-container'), {format: 'png'}).then(function(url) {
        // Create a temporary link element
        var link = document.createElement('a');
        link.href = url;
        link.download = 'visualization.png'; // Set the download attribute with desired file name
        link.click(); // Trigger the download
    });
}