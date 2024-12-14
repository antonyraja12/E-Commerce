import jsPDF from "jspdf";

const generateRandomNumber = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const downloadPdf = ({ columns, data, currentUser }) => {
  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: [297, 250],
  });

  const logoWidth = 25;
  const logoHeight = 0;

  doc.addImage("/bytefactory.png", "PNG", 10, 10, logoWidth, logoHeight);

  const textX = doc.internal.pageSize.width - 55;
  doc.setFontSize(12);
  doc.text("Alert Report", textX, 7);
  doc.setFontSize(12);
  doc.text(`Date:${new Date().toLocaleDateString()}`, textX, 13);
  doc.text(`Document ID:${generateRandomNumber()}`, textX, 19);
  // doc.text(`ExecutedBy:${currentUser}`, textX, 19);
  // doc.text(`Document ID:${generateRandomNumber()}`, textX, 25);

  const tableStyles = {
    lineColor: [0, 0, 0], // Black color
    lineWidth: 0.2,
  };

  doc.setLineWidth(tableStyles.lineWidth);
  doc.setDrawColor(
    tableStyles.lineColor[0],
    tableStyles.lineColor[1],
    tableStyles.lineColor[2]
  );

  doc.autoTable({
    head: [columns.map((col) => col.title)],
    body: [
      ...data.map((row, index) =>
        columns.map((col) =>
          col.dataIndex === "assetId" ? index + 1 : row[col.dataIndex]
        )
      ),
    ],
    startY: 30,
    tableWidth: "auto",
    // styles: tableStyles,
  });

  doc.save("Alert Report.pdf");
};

export default downloadPdf;
