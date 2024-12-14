import jsPDF from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";
import { dateFormat, dateTimeFormat, publicUrl } from "../../../helpers/url";

export const downloadPdf = ({ data, childPartData }) => {
  const fileName = data?.buildLabel || "Traceability_Report";
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [420, 297],
  });

  const logoUrl = data?.modelImage || "";

  const TM_LOGO = `${process.env.PUBLIC_URL}/TM_LOGO.png`;
  const CLIENT_LOGO = `${publicUrl}/${logoUrl}`;

  const calcCycleTime = (start, end, unit = "s") => {
    const endTime = end ? dayjs(end) : dayjs();
    const startTime = dayjs(start);
    return endTime.diff(startTime, unit);
  };

  function addTableHeader(doc) {
    doc.autoTable({
      head: [
        [
          { content: "", colSpan: 1, rowSpan: 2, styles: { cellWidth: 40 } },
          {
            content: "TM Automotive Seating Pvt Ltd, Polivakkam, Tamil Nadu",
            colSpan: 4,
            styles: {
              halign: "center",
              valign: "middle",
              fontSize: 12,
              textColor: [0, 0, 179],
            },
          },
          {
            content: "",
            colSpan: 1,
            rowSpan: 2,
            styles: { cellWidth: 40, minCellHeight: 22 },
          },
        ],
        [
          {
            content: "Seat Traceability Report",
            colSpan: 4,
            styles: {
              halign: "center",
              valign: "middle",
              fontSize: 12,
              textColor: [179, 0, 0],
            },
          },
        ],
        [
          { content: "Date", colSpan: 1 },
          {
            content: dateFormat(data.start),
            colSpan: 1,
            styles: { cellWidth: 40 },
          },
          { content: "Build Label", colSpan: 1, styles: { cellWidth: 45 } },
          { content: data.buildLabel, colSpan: 1, styles: { cellWidth: 72 } },
          { content: "Product Code", colSpan: 1, styles: { cellWidth: 40 } },
          { content: data.productCode, colSpan: 1 },
        ],
        [
          { content: "Shift" },
          {
            content: childPartData[0]?.shiftName || " ",
            colSpan: 1,
            styles: { cellWidth: 40 },
          },
          {
            content: "Model Description",
            colSpan: 1,
            styles: { cellWidth: 45 },
          },
          {
            content: `${data?.model} ${data?.variant}`,
            colSpan: 1,
            styles: { cellWidth: 70 },
          },
          { content: "Seat type", colSpan: 1, styles: { cellWidth: 40 } },
          { content: data?.category || "", colSpan: 1 },
        ],
      ],
      body: [],
      theme: "grid",
      margin: { top: 10, left: 10, right: 10 },
      styles: { lineWidth: 0.5 },
      headStyles: {
        fillColor: null,
        textColor: [0, 0, 0],
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      didDrawCell: function (data) {
        if (data.column.index === 0 && data.row.index === 0) {
          doc.addImage(
            TM_LOGO,
            "PNG",
            data.cell.x + 2,
            data.cell.y + 1,
            35,
            20
          );
        }
        if (data.column.index === 5 && data.row.index === 0 && CLIENT_LOGO) {
          try {
            doc.addImage(
              CLIENT_LOGO,
              "PNG",
              data.cell.x,
              data.cell.y + 1,
              40,
              20
            );
          } catch (error) {
            console.warn("Error adding CLIENT_LOGO image: ", error.message);
          }
        }
      },
    });
  }

  function addFooter(doc, pageNumber) {
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text(
      `Page ${pageNumber}`,
      doc.internal.pageSize.width - 20,
      pageHeight - 10
    );
  }

  function addMainTable(doc) {
    const qaTableStartY = doc.lastAutoTable.finalY + 10;
    const qaTableData = data.assemblyDetails
      ?.sort((a, b) => new Date(a.start) - new Date(b.start))
      ?.map((item, index) => {
        const sno = index + 1;
        const workStationName = item.workStationName;
        const cycleTime = calcCycleTime(item.start, item.end);
        const start = item.start
          ? dayjs(item.start).format("DD/MM/YYYY hh:mm A")
          : " ";
        const end = item.end
          ? dayjs(item.end).format("DD/MM/YYYY hh:mm A")
          : " ";
        const description =
          item.assemblyDetailSubs
            ?.filter((v) => v.deviceType !== "PLC")
            ?.map((e) => e.description) || "N/A";
        const value =
          item.assemblyDetailSubs
            ?.filter((v) => v.deviceType !== "PLC")
            ?.map((e) => {
              if (e.deviceType === "DC TOOL") return `${e.value} Nm`;
              if (e.deviceType === "GOEPEL") return `${e.value} Ohm`;
              return e.value;
            }) || "N/A";
        const expectedValue =
          item.assemblyDetailSubs
            ?.filter((v) => v.deviceType !== "PLC")
            ?.map((e) => {
              if (e.deviceType === "DC TOOL") return `${e.value} Nm`;
              if (e.deviceType === "GOEPEL") return `${e.value} Ohm`;
              return e.value;
            }) || "N/A";
        const status =
          item.assemblyDetailSubs
            ?.filter((v) => v.deviceType !== "PLC")
            ?.map((e) => e.result) || "N/A";
        const operatorName = item.operator || "N/A";
        let defectName = [];
        let defectStatus = [];
        let cycleNumber = [];

        if (item.assemblyQualityResult?.length) {
          defectName = item.assemblyQualityResult?.map(
            (e) => e.assemblyQuality?.defectName
          );
          defectStatus = item.assemblyQualityResult?.map(
            (e) => e.defectStatus || "N/A"
          );
          cycleNumber = item.assemblyQualityResult?.map(
            (e) => e.assemblyQuality?.cycleNumber || "N/A"
          );
        } else {
          defectName = item.assemblyQualitySubs?.map((e) => e.defectName);
          defectStatus = item.assemblyQualitySubs?.map(
            (e) => e.qualityResult?.defectStatus || "N/A"
          );
          cycleNumber = item.assemblyQualitySubs?.map((e) => e.cycleNumber);
        }

        return {
          sno,
          workStationName,
          cycleTime,
          operatorName,
          start,
          end,
          description,
          value,
          status,
          expectedValue,
          defectName,
          defectStatus,
          cycleNumber,
        };
      });

    const tableData = [];
    qaTableData.forEach((row) => {
      const rowCount = Math.max(row.description.length, row.defectName.length);
      for (let i = 0; i < rowCount; i++) {
        if (i === 0) {
          tableData.push([
            {
              content: row.sno,
              rowSpan: rowCount,
              styles: { cellWidth: 10, halign: "center", valign: "middle" },
            },
            {
              content: row.workStationName,
              rowSpan: rowCount,
              styles: { cellWidth: 20, halign: "center", valign: "middle" },
            },
            {
              content: row.cycleTime || " ",
              rowSpan: rowCount,
              styles: { cellWidth: 15, halign: "center", valign: "middle" },
            },
            {
              content: row.operatorName || " ",
              rowSpan: rowCount,
              styles: { cellWidth: 20, halign: "center", valign: "middle" },
            },
            {
              content: row.start || " ",
              rowSpan: rowCount,
              styles: { cellWidth: 20, halign: "center", valign: "middle" },
            },
            {
              content: row.end || " ",
              rowSpan: rowCount,
              styles: { cellWidth: 20, halign: "center", valign: "middle" },
            },
            { content: row.description[i] || " ", styles: { cellWidth: 45 } },
            { content: row.expectedValue[i] || " ", styles: { cellWidth: 40 } },
            { content: row.value[i] || " ", styles: { cellWidth: 40 } },
            { content: row.defectName[i] || " ", styles: { cellWidth: 20 } },
            { content: row.defectStatus[i] || " ", styles: { cellWidth: 15 } },
            { content: row.status[i] || "", styles: { cellWidth: 15 } },
          ]);
        } else {
          tableData.push([
            row.description[i] || "",
            row.expectedValue[i] || "",
            row.value[i] || "",
            row.defectName[i] || "",
            row.defectStatus[i] || "",
            row.status[i] || "",
          ]);
        }
      }
    });

    doc.autoTable({
      startY: qaTableStartY,
      head: [
        [
          {
            content: "FG. No",
            colSpan: 2,
            styles: { fillColor: [144, 238, 144] },
          },
          {
            content: data.fgNo || " ",
            colSpan: 10,
            styles: { fillColor: null },
          },
        ],
        [
          { content: "S.No", styles: { valign: "middle", halign: "center" } },
          {
            content: "Station Name",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Cycle Time (S)",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Operator",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Start Time",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "End Time",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "WI Description",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Expected Value",
            styles: { valign: "middle", halign: "center" },
          },
          { content: "Result", styles: { valign: "middle", halign: "center" } },
          {
            content: "Defects",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Defect Status",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Final Status",
            styles: { valign: "middle", halign: "center" },
          },
        ],
      ],
      body: tableData,
      theme: "grid",
      margin: { top: 10, left: 10, right: 10 },
      styles: {
        lineWidth: 0.5,
        fontSize: 11,
        lineColor: [0, 0, 0],
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [102, 153, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        fontSize: 11,
      },
    });
    // const tableStartY = doc.lastAutoTable.finalY + 10;

    // doc.autoTable({
    //   startY: tableStartY,
    //   head: [
    //     [
    //       {
    //         content: "FG. No",
    //         colSpan: 2,
    //         styles: { fillColor: [144, 238, 144] },
    //       },
    //       {
    //         content: data.fgNo || " ",
    //         colSpan: 8,
    //         styles: { fillColor: null },
    //       },
    //     ],
    //     [
    //       { content: "S.No", styles: { valign: "middle", halign: "center" } },
    //       {
    //         content: "Station Name",
    //         styles: { valign: "middle", halign: "center" },
    //       },
    //       {
    //         content: "Cycle Time (S)",
    //         styles: { valign: "middle", halign: "center" },
    //       },
    //       {
    //         content: "Operator",
    //         styles: { valign: "middle", halign: "center" },
    //       },
    //       {
    //         content: "Start Time",
    //         styles: { valign: "middle", halign: "center" },
    //       },
    //       {
    //         content: "End Time",
    //         styles: { valign: "middle", halign: "center" },
    //       },
    //       {
    //         content: "WI Description",
    //         styles: { valign: "middle", halign: "center" },
    //       },
    //       {
    //         content: "Expected Value",
    //         styles: { valign: "middle", halign: "center" },
    //       },
    //       { content: "Result", styles: { valign: "middle", halign: "center" } },
    //       {
    //         content: "Final Status",
    //         styles: { valign: "middle", halign: "center" },
    //       },
    //     ],
    //   ],
    // });
  }

  async function addImages(doc, images, availableHeight) {
    let xAxis = 15;
    const gapBetweenImages = 10;
    const imageCount = images.length;
    const imageSize =
      (doc.internal.pageSize.width -
        2 * xAxis -
        gapBetweenImages * (imageCount - 1)) /
      imageCount;

    let currentY = doc.lastAutoTable.finalY + 20;

    const header = "Shipping conditions photo of FG";
    doc.setFontSize(16);

    if (currentY + 15 + imageSize > doc.internal.pageSize.height - 15) {
      doc.addPage();
      currentY = 20;
    }

    doc.text(header, xAxis, currentY);
    currentY += 15;

    let rowStartY = currentY;

    images.forEach((image) => {
      if (currentY + imageSize > doc.internal.pageSize.height - 15) {
        doc.addPage();
        currentY = 20;
        rowStartY = currentY;
      }

      if (xAxis + imageSize > doc.internal.pageSize.width - 15) {
        xAxis = 15;
        currentY = rowStartY + imageSize + gapBetweenImages;
      }

      doc.addImage(image.src, "PNG", xAxis, currentY, imageSize, imageSize);
      xAxis += imageSize + gapBetweenImages;
    });
  }

  async function generatePDF() {
    let pageNumber = 1;
    const availableHeight = doc.internal.pageSize.height - 20;

    addTableHeader(doc);
    addMainTable(doc);

    let currentYPosition = doc.lastAutoTable.finalY + 10;
    childPartData
      ?.filter((a) => a.oldChildPartCode !== null)
      ?.forEach((row) => {
        doc.setFontSize(12);
        const textContent =
          `Rework : ${row.oldChildPartCode} Reworked and Changed to ${row.newChildPartCode}`.replace(
            /[\r\n]/g,
            ""
          );

        doc.text(textContent, 10, currentYPosition);
        currentYPosition += 10;
      });
    // let tableData = [];
    // childPartData
    //   ?.filter((a) => a.oldChildPartCode !== null)
    //   .map((row) => {
    //     tableData.push([
    //       {
    //         content:
    //           ` ${row?.oldChildPartCode}REWORKED AND CHANGED TO ${row.newChildPartCode}`.replace(
    //             /[\r\n]/g,
    //             ""
    //           ),
    //       },
    //     ]);
    //   });
    // doc.autoTable({
    //   startY: currentYPosition,
    //   body: tableData,
    //   // theme: "grid",
    //   margin: { top: 10, left: 10, right: 10 },
    //   styles: {
    //     lineWidth: 0.5,
    //     lineColor: [255, 255, 255, 0],
    //   },
    //   headStyles: {
    //     textColor: [0, 0, 0],
    //     lineWidth: 0.5,
    //     lineColor: [0, 0, 0],
    //   },
    // });

    const images = data?.imagePath?.map((path) => `${publicUrl}${path}`);
    if (images) {
      const loadedImages = await Promise.all(images?.map(loadImage));
      await addImages(doc, loadedImages, availableHeight);
    }

    doc.save(`${fileName}.pdf`);
  }

  async function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;

      img.onload = () => resolve(img);
      img.onerror = () => reject(`Failed to load image: ${src}`);
    });
  }

  generatePDF();
};
