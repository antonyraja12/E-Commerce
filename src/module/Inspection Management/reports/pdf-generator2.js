import { DescriptionsContext } from "antd/es/descriptions";
import jsPDF from "jspdf";
import moment from "moment";
import CurrentUserService from "../../../services/user-list-current-user-service";
const service = new CurrentUserService();
const generateRandomNumber = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
const getCurrentUser = async () => {
  const { data } = await service.getUser();
  return data?.userName;
};
const getStatusText = (value) => {
  switch (value) {
    case 0:
      return "Opened";
    case 1:
      return "Assigned";
    case 2:
      return "Resolved";
    case 3:
      return "Verified";
    case 4:
    case 5:
      return "Completed";
    case 6:
      return "Approved";
    default:
      return value;
  }
};

const downloadPdf = async ({ title, columns, data, currentUser }) => {
  const currentUserName = await getCurrentUser();
  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: [297, 290],
  });

  const logoWidth = 25;
  const logoHeight = 0;

  doc.addImage(
    `${process.env.PUBLIC_URL}/byteFactory.png`,
    "PNG",
    10,
    10,
    logoWidth,
    logoHeight
  );

  const textX = doc.internal.pageSize.width - 65;
  doc.setFontSize(12);
  doc.text(`${title}`, textX, 7);
  doc.setFontSize(12);
  doc.text(`Date:${new Date().toLocaleDateString()}`, textX, 13);
  doc.text(`ExecutedBy:${currentUserName}`, textX, 19);
  doc.text(`Document ID:${generateRandomNumber()}`, textX, 25);

  const tableStyles = {
    lineColor: [0, 0, 0], // Black color
    lineWidth: 0.2,
    cellWidth: title === "Resolution Work Order Report" ? 22 : "auto",
  };
  doc.setLineWidth(tableStyles.lineWidth);
  doc.setDrawColor(
    tableStyles.lineColor[0],
    tableStyles.lineColor[1],
    tableStyles.lineColor[2]
  );

  doc.autoTable({
    head: [columns?.map((col) => col.title)],
    body: [
      ...data.map((row, index) =>
        columns.map((col) => {
          if (col.dataIndex === "assetIds") {
            return index + 1;
          } else if (col.dataIndex === "date") {
            // Assuming 'date' is the dataIndex for your date column
            return moment(row[col.dataIndex]).format("DD-MM-YYYY");
          } else if (
            title === "Resolution Work Order Report" &&
            col.dataIndex === "status"
          ) {
            return getStatusText(row[col.dataIndex]);
          } else {
            return row[col.dataIndex];
          }
        })
      ),
    ],
    startY: 30,
    // tableWidth: "auto",
    styles: tableStyles,
    overflow: "linebreak",
    // didDrawPage: addImageToAllPages, // Add image on every page
  });

  doc.save(`${title}.pdf`);
};

export default downloadPdf;
