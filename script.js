// Array to store products
let products = [];

// Function to add a new product row
function addNewProduct() {
    const newRow = `<tr>
        <td><input type="text" class="form-control" placeholder="Description" /></td>
        <td><input type="number" min="1" class="form-control" placeholder="Quantity" /></td>
        <td><input type="number" min="0.01" step="0.01" class="form-control" placeholder="Unit Price" /></td>
        <td>0.00</td>
        <td><button class="btn btn-danger" onclick="removeProduct(this)">Remove</button></td>
    </tr>`;
    $('#product-list tbody').append(newRow);
}

// Function to remove a product row
function removeProduct(btn) {
    $(btn).closest('tr').remove();
    calculateTotal();
}

// Function to calculate total amount
function calculateTotal() {
    let total = 0;
    $('#product-list tbody tr').each(function() {
        const quantity = $(this).find('input:eq(1)').val();
        const price = $(this).find('input:eq(2)').val();
        const subtotal = quantity * price;
        total += subtotal;
        $(this).find('td:eq(3)').text(subtotal.toFixed(2));
    });
    $('#total-amount').text(total.toFixed(2));
}

document.getElementById('name').addEventListener('input', validateInputs);
document.getElementById('mobile').addEventListener('input', validateInputs);

// Function to validate input fields
function validateInputs() {
    const nameInput = document.getElementById('name');
    const mobileInput = document.getElementById('mobile');
    const nameError = document.getElementById('nameError');
    const mobileError = document.getElementById('mobileError');

    const nameRegex = /[A-Za-z\s]{3,}/;
    const mobileRegex = /[0-9]{10}/;

    let valid = true;

    if (!nameRegex.test(nameInput.value)) {
        nameError.textContent = "Name should only contain letters and spaces, minimum length 3";
        valid = false;
    } else {
        nameError.textContent = "";
    }

    if (!mobileRegex.test(mobileInput.value)) {
        mobileError.textContent = "Mobile number should be 10 digits";
        valid = false;
    } else {
        mobileError.textContent = "";
    }

    return valid;
}

// Function to generate the invoice
function generateInvoice() {
    if (!validateInputs()) {
        return; // Stop execution if validation fails
    }
    
    const name = $('#name').val();
    const mobile = $('#mobile').val();
    const date = new Date().toLocaleDateString();
    $('#user-name').text(name);
    $('#user-mobile').text(mobile);
    $('#system-date').text(date);
    products = [];
    $('#product-list tbody tr').each(function() {
        const description = $(this).find('input:eq(0)').val();
        const quantity = $(this).find('input:eq(1)').val();
        const price = $(this).find('input:eq(2)').val();
        const subtotal = quantity * price;
        products.push({
            description: description,
            quantity: quantity,
            price: price,
            subtotal: subtotal.toFixed(2)
        });
    });
    calculateTotal();

    // Populate preview modal
    let modalContent = '';
    modalContent += `<p><strong>Name:</strong> ${name}</p>`;
    modalContent += `<p><strong>Mobile Number:</strong> ${mobile}</p>`;
    modalContent += `<p><strong>Date:</strong> ${date}</p>`;
    modalContent += '<table class="table">';
    modalContent += '<thead><tr><th>Item Description</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr></thead>';
    modalContent += '<tbody>';
    products.forEach(product => {
        modalContent += `<tr><td>${product.description}</td><td>${product.quantity}</td><td>${product.price}</td><td>${product.subtotal}</td></tr>`;
    });
    modalContent += '</tbody></table>';
    modalContent += `<p><strong>Total Amount:</strong> ₹${$('#total-amount').text()}</p>`;
    
    $('#previewBody').html(modalContent);
    $('#previewModal').modal('show');
}

function printPreview() {
    const previewBody = document.getElementById('previewBody').innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Invoice Preview</title>');
    printWindow.document.write('<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">');
    
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; }');
    printWindow.document.write('th, td { padding: 8px; border: 1px solid #fff}'); // Remove borders from th and td
    printWindow.document.write('.header { text-align: center; }');
    printWindow.document.write('.dateTime { text-align: left; }');
    printWindow.document.write('.preview-text { text-align: center; margin: 5px 0; }'); // Style for preview text
    printWindow.document.write('</style>');
    
    printWindow.document.write('</head><body>');
    printWindow.document.write('<div class="header">');
    printWindow.document.write('<p class="preview-text" style="font-size: 32px;"><b><i>SHUBHAM CENTER</i></b></p>');
    printWindow.document.write('<p class="preview-text"><i>Bazar Chowk, Angul, Odisha Pin:759122</i></p>');
    printWindow.document.write('<p class="preview-text"><i>Phone: 9861221490, 9040221490</i></p>');
    printWindow.document.write('</div>');

    // Add current date and time
    const currentDateTime = new Date().toLocaleString();
    const [date, time] = currentDateTime.split(', ');

    printWindow.document.write('<p class="dateTime"><strong>Date:</strong> ' + date + '</p>');
    printWindow.document.write('<p class="dateTime"><strong>Time:</strong> ' + time + '</p>');

    printWindow.document.write('<hr>');
    printWindow.document.write(previewBody);
    printWindow.document.write('<hr>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}
// Function to download preview
function downloadPreview() {
    const pdf = new jsPDF('p', 'pt', 'letter');
    const pdfContent = document.getElementById('previewBody').innerHTML;

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const pdfHtml = `<html><head><meta charset="UTF-8"></head><body style="font-size: 12px;"></hr>${pdfContent}</hr></body></html>`;
    const specialElementHandlers = {
        '#previewBody': function (element, renderer) {
            return true;
        }
    };

    pdf.fromHTML(pdfHtml, 15, 15, {
        'width': pdfWidth - 30,
        'elementHandlers': specialElementHandlers
    });

    pdf.save('invoice-preview.pdf');
}

// Call calculateTotal on input change
$('#product-list tbody').on('input', 'input', calculateTotal);
