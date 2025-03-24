'use client';
import { renderToStaticMarkup } from 'react-dom/server';
import { InventoryPDF } from '@/components/InventoryPDF';
import { PDFViewer, pdf } from '@react-pdf/renderer';

/**
 * Generate a PDF with inventory data
 * @param {Array} data - The inventory data to display in the PDF
 * @param {String} title - The title of the report
 * @param {Object} options - Additional options
 * @returns {Promise<Boolean>} - Success status
 */
export const generateInventoryPDF = async (data, title = 'Inventory Report', options = {}) => {
  try {
    if (!data || data.length === 0) {
      console.error('No data provided for PDF generation');
      return false;
    }

    const pdfDoc = <InventoryPDF data={data} />;
    const blob = await pdf(pdfDoc).toBlob();
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Open the PDF in a new tab
    const newWindow = window.open(url, '_blank');
    
    // Clean up the URL object when the window loads the PDF
    if (newWindow) {
      newWindow.addEventListener('load', () => {
        URL.revokeObjectURL(url);
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

/**
 * Print an inventory report using the browser's print functionality
 * @param {Array} data - The inventory data to print
 * @param {String} title - The title of the report
 * @returns {void}
 */
export const printReport = (data, title = 'Inventory Report') => {
  try {
    // Create a printable version of the data in the DOM
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Please allow popups to print reports');
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; margin-bottom: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <table>
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Name</th>
                <th>Category</th>
                <th>Stock Level</th>
                <th>Value</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(item => `
                <tr>
                  <td>${item.itemCode}</td>
                  <td>${item.name}</td>
                  <td>${item.category}</td>
                  <td>${item.stockLevel}</td>
                  <td>$${item.value}</td>
                  <td>${item.lastUpdated}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    
    // Add a slight delay to ensure the content is loaded
    setTimeout(() => {
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 250);
    
    return true;
  } catch (error) {
    console.error('Error printing report:', error);
    return false;
  }
};

/**
 * Export inventory data to CSV
 * @param {Array} data - The inventory data to export
 * @param {String} filename - The name of the file to download
 * @returns {Boolean} - Success status
 */
export const exportToCSV = (data, filename = 'inventory-report.csv') => {
  try {
    if (!data || data.length === 0) {
      console.error('No data provided for CSV export');
      return false;
    }
    
    // Create CSV headers
    const headers = Object.keys(data[0]).join(',');
    
    // Create CSV rows
    const rows = data.map(item => 
      Object.values(item).map(value => 
        typeof value === 'string' && value.includes(',') 
          ? `"${value}"`
          : value
      ).join(',')
    );
    
    // Combine headers and rows
    const csv = [headers, ...rows].join('\n');
    
    // Create a Blob with the CSV data
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a link to download the CSV
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';
    
    // Add the link to the DOM and trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return false;
  }
}; 