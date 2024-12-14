import ExcelJS from "exceljs";
import moment from "moment";
import CurrentUserService from "../services/user-list-current-user-service";

const service = new CurrentUserService();
const generateRandomNumber = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
const getCurrentUser = async () => {
  const { data } = await service.getUser();
  return data?.userName;
};

const excelExport = async ({ title, columns, data }) => {
  const currentUserName = await getCurrentUser();
  try {
    const response = await fetch(`${process.env.PUBLIC_URL}/byteFactory.png`);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const logoBase64 = reader.result;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("data");

        if (logoBase64) {
          const logoImage = workbook.addImage({
            base64: logoBase64,
            extension: "png",
          });

          worksheet.addImage(logoImage, {
            tl: { col: 0.5, row: 2 },
            ext: { width: 100, height: 25 },
          });
        }

        // Merge cells for the header based on the report type
        if (title === "Checklist Execution Report") {
          worksheet.mergeCells("A1:G5");
        } else if (title === "Resolution Work Order Report") {
          worksheet.mergeCells("A1:P5");
        } else if (title === "Dailywise Energy Report - Excel") {
          worksheet.mergeCells("A1:E5");
        } else {
          worksheet.mergeCells("A1:F5");
        }

        // Rich text content for the header
        const richText = [
          { text: `${title}`, font: { bold: true, size: 11, name: "Calibri" } },
          { text: "\n" },
          {
            text: `Date: ${new Date().toLocaleDateString()}`,
            font: { bold: true, size: 11, name: "Calibri" },
          },
          { text: "\n" },
          {
            text: `ExecutedBy: ${currentUserName}`,
            font: { bold: true, size: 11, name: "Calibri" },
          },
          { text: "\n" },
          {
            text: `Document ID: ${generateRandomNumber()}`,
            font: { bold: true, size: 11, name: "Calibri" },
          },
        ];

        // Apply rich text to the merged cells
        const headerCell = worksheet.getCell("E1");
        headerCell.value = { richText: richText };
        headerCell.alignment = {
          vertical: "middle",
          horizontal: "right",
          wrapText: true,
        };
        headerCell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        // Add headers with borders
        columns.forEach((column, index) => {
          worksheet.getColumn(index + 1).width = column.width || 20;
          const cell = worksheet.getCell(6, index + 1);
          cell.value = column.title;
          cell.font = { bold: true };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });

        // Add data cells with borders
        data.forEach((row, rowIndex) => {
          columns.forEach((column, columnIndex) => {
            const value = column.dataIndex ? row[column.dataIndex] : "";
            const cell = worksheet.getCell(rowIndex + 7, columnIndex + 1);

            if (column.dataIndex === "assetIds") {
              cell.value = rowIndex + 1;
            } else if (
              column.dataIndex === "date" ||
              column.dataIndex === "timestamp"
            ) {
              cell.value = moment(row[column.dataIndex]).format("DD-MM-YYYY");
            } else if (
              title === "Resolution Work Order Report" &&
              column.dataIndex === "status"
            ) {
              switch (value) {
                case 0:
                  cell.value = "Opened";
                  break;
                case 1:
                  cell.value = "Assigned";
                  break;
                case 2:
                  cell.value = "Resolved";
                  break;
                case 3:
                  cell.value = "Verified";
                  break;
                case 4:
                case 5:
                  cell.value = "Completed";
                  break;
                case 6:
                  cell.value = "Approved";
                  break;
                default:
                  cell.value = row[column.dataIndex];
              }
            } else {
              cell.value = row[column.dataIndex];
            }

            // Apply borders to data cells
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          });
        });

        workbook.xlsx
          .writeBuffer()
          .then((buffer) => {
            resolve(buffer);
          })
          .catch((error) => {
            reject(error);
          });
      };

      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error loading image:", error);
    throw error;
  }
};

export default excelExport;
