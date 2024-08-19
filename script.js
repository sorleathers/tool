document.addEventListener('DOMContentLoaded', function () {
    const quantityInput = document.getElementById('quantityInput');
    const addQuantityButton = document.getElementById('addQuantity');
    const calculateAverageButton = document.getElementById('calculateAverage');
    const downloadRecordButton = document.getElementById('downloadRecord'); // Add this line
    const quantityTable = document.getElementById('quantityTable').getElementsByTagName('tbody')[0];
    const averageResult = document.getElementById('averageResult');
    const quantityCount = document.getElementById('quantityCount');
    const quantitySum = document.getElementById('quantitySum');

    let quantities = [];

    const getQuantityValue = (quantity) => {
        const [whole, decimal] = quantity.split('.');
        let value = parseFloat(whole);
        if (decimal) {
            switch (decimal) {
                case '1': value += 0.25; break;
                case '2': value += 0.50; break;
                case '3': value += 0.75; break;
                default: break;
            }
        }
        return value;
    };

    const updateQuantityCount = () => {
        quantityCount.textContent = `Total Quantities: ${quantities.length}`;
    };

    const updateQuantitySum = () => {
        const totalSum = quantities.reduce((sum, item) => sum + item.value, 0);
        quantitySum.textContent = `Sum: ${totalSum.toFixed(2)}`;
    };

    const addQuantity = () => {
        const quantity = quantityInput.value;
        if (quantity && /^[0-9]+(\.[1-3])?$/.test(quantity)) {
            const value = getQuantityValue(quantity);
            quantities.push({ quantity, value });
            renderTable();
            updateQuantityCount();
            updateQuantitySum();
            quantityInput.value = '';
        } else {
            alert('Please enter a valid quantity (e.g., 4, 4.2, 0.3)');
        }
    };

    const renderTable = () => {
        quantityTable.innerHTML = '';
        quantities.forEach((item, index) => {
            const row = quantityTable.insertRow();
            row.insertCell(0).textContent = item.quantity;
            row.insertCell(1).textContent = item.value.toFixed(2);
            const actionsCell = row.insertCell(2);
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = () => editQuantity(index);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteQuantity(index);
            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
        });
    };

    const editQuantity = (index) => {
        const newQuantity = prompt('Enter new quantity:', quantities[index].quantity);
        if (newQuantity && /^[0-9]+(\.[1-3])?$/.test(newQuantity)) {
            quantities[index] = { quantity: newQuantity, value: getQuantityValue(newQuantity) };
            renderTable();
            updateQuantityCount();
            updateQuantitySum();
        } else {
            alert('Please enter a valid quantity (e.g., 4, 4.2, 0.3)');
        }
    };

    const deleteQuantity = (index) => {
        quantities.splice(index, 1);
        renderTable();
        updateQuantityCount();
        updateQuantitySum();
    };

    const calculateAverage = () => {
        if (quantities.length === 0) {
            averageResult.textContent = 'No quantities to calculate.';
            return;
        }
        const total = quantities.reduce((sum, item) => sum + item.value, 0);
        const average = total / quantities.length;
        averageResult.textContent = `Average: ${average.toFixed(2)}`;
    };

    const downloadRecord = () => {
        let record = 'Quantity,Value\n';
        quantities.forEach(item => {
            record += `${item.quantity},${item.value.toFixed(2)}\n`;
        });

        if (quantities.length > 0) {
            const total = quantities.reduce((sum, item) => sum + item.value, 0);
            const average = total / quantities.length;
            record += `\nTotal Quantities: ${quantities.length}\nSum: ${total.toFixed(2)}\nAverage: ${average.toFixed(2)}`;
        }

        const blob = new Blob([record], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'calculation_record.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    addQuantityButton.addEventListener('click', addQuantity);
    calculateAverageButton.addEventListener('click', calculateAverage);
    downloadRecordButton.addEventListener('click', downloadRecord); // Add this line

    quantityInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addQuantity();
            event.preventDefault();
        }
    });

    updateQuantityCount();
    updateQuantitySum();
});
