import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './formatters';

interface ExportColumn<T> {
  id: string;
  label: string | React.ReactNode;
  accessor: (row: T) => unknown;
  exportLabel?: string;
}

export const formatExportValue = (val: unknown, columnId: string) => {
  if (val === null || val === undefined) return '';
  
  const id = columnId.toLowerCase();
  if (id.includes('amount') || id.includes('balance') || id.includes('variance')) {
    const numVal = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]+/g, ''));
    return isNaN(numVal) ? String(val) : formatCurrency(numVal);
  }
  
  return String(val);
};

export const exportToCSV = <T>(
  data: T[], 
  columns: ExportColumn<T>[], 
  title: string
) => {
  const headers = columns.map((c) => c.exportLabel || (typeof c.label === 'string' ? c.label : String(c.id)));
  const rows = data.map((row) => 
    columns.map((col) => formatExportValue(col.accessor(row), col.id))
  );
  
  const csvContent = [
    headers.join(','), 
    ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToPDF = <T>(
  data: T[], 
  columns: ExportColumn<T>[], 
  title: string
) => {
  const headers = columns.map((c) => c.exportLabel || (typeof c.label === 'string' ? c.label : String(c.id)));
  const rows = data.map((row) => 
    columns.map((col) => formatExportValue(col.accessor(row), col.id))
  );
  
  const doc = new jsPDF({ orientation: headers.length > 6 ? 'landscape' : 'portrait' });
  doc.setFontSize(14).text(title, 14, 18);
  
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 30,
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [33, 150, 243], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] }
  });
  
  doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
};
