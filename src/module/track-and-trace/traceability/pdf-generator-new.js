import jsPDF from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";
import { publicUrl, remoteAsset } from "../../../helpers/url";

export const FileDownload = async ({ data }) => {
  const fileName = data?.buildLabel ? data.buildLabel : "Traceability_Report";

  const currentTime = dayjs().format("DD-MM-YYYY | hh:mm A");

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [420, 297],
  });
  const img = new Image();
  img.src = `${process.env.PUBLIC_URL}/TM_LOGO.png`;

  img.onload = () => {
    const bodyData = data.assemblyDetails
      ?.filter((e) => e.wsType === "MES")
      ?.sort((a, b) => new Date(a.start) - new Date(b.start))
      ?.map((item) => {
        const workStationName = item.workStationName || "N/A";
        const stationType = item.wsType || "N/A";
        const deviceType =
          item.assemblyDetailSubs
            ?.filter((v) => v.action === "READ")
            ?.map((e) => e.deviceType) || "N/A";
        const productCode =
          item.assemblyDetailSubs
            ?.filter((v) => v.deviceType === "SCANNER")
            ?.map((e) => e.value) || "N/A";
        const description =
          item.assemblyDetailSubs
            ?.filter((v) => v.deviceType === "DC TOOL" && v.action === "READ")
            ?.map((e) => e.description) || "N/A";
        const value =
          item.assemblyDetailSubs
            ?.filter((v) => v.deviceType === "DC TOOL" && v.action === "READ")
            ?.map((e) => e.value) || "N/A";

        const scannerPresent = item.assemblyDetailSubs?.find(
          (e) => e.deviceType === "SCANNER"
        )
          ? "ENABLED"
          : "DISABLED";
        const dcToolPresent = item.assemblyDetailSubs?.find(
          (e) => e.deviceType === "DC TOOL"
        )
          ? "ENABLED"
          : "DISABLED";
        const status = data?.status || "N/A";
        const operatorName = item.operator || "N/A";

        return {
          workStationName: workStationName,
          stationType: stationType,
          deviceType: deviceType,
          productCode: productCode,
          description: description,
          value: value,
          status: status,
          operatorName: operatorName,
          scannerPresent,
          dcToolPresent,
        };
      });

    let imageDrawn = false;

    const body = [];
    bodyData?.forEach((row) => {
      const scannerCount = row.deviceType.filter(
        (type) => type === "SCANNER"
      ).length;
      const dcToolCount = row.deviceType.filter(
        (type) => type === "DC TOOL"
      ).length;
      const rowCount = Math.max(scannerCount, dcToolCount);

      for (let i = 0; i < rowCount; i++) {
        if (i === 0) {
          body.push([
            {
              content: row.workStationName,
              rowSpan: rowCount,
              styles: { halign: "center", valign: "middle" },
            },
            {
              content: row.scannerPresent,
              styles: { halign: "center", valign: "middle" },
              rowSpan: rowCount,
            },
            {
              content: row.productCode[i] || "",
              styles: { cellWidth: 20 },
            },
            {
              content: row.dcToolPresent,
              rowSpan: rowCount,
              styles: { halign: "center", valign: "middle" },
            },
            {
              content: row.description[i] || "",
            },

            {
              content: row.value[i] || "",
            },

            {
              content: row.status || "N/A",
              rowSpan: rowCount,
              styles: { halign: "center", valign: "middle" },
            },
            {
              content: row.operatorName || "N/A",
              rowSpan: rowCount,
              styles: { halign: "center", valign: "middle" },
            },
          ]);
        } else {
          body.push([
            row.productCode[i] || "",
            row.description[i] || "",
            row.value[i] || "",
          ]);
        }
      }
    });

    doc.autoTable({
      startY: 20,
      head: [
        [
          {
            content: "",
            colSpan: 1,
            styles: {
              halign: "center",
              valign: "middle",
              cellPadding: 5,
            },
          },
          {
            content: "FRONT LINE SEAT MANUFACTURING REPORT",
            colSpan: 7,
            styles: {
              halign: "center",
              fontSize: 14,
              cellPadding: 5,
              valign: "middle",
            },
          },
        ],

        [
          {
            content: "Product Code",
            colSpan: 1,
            styles: { halign: "center" },
          },
          {
            content: data?.productCode,
            colSpan: 2,
            styles: {
              halign: "center",
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
            },
          },
          {
            content: "Build Label",
            colSpan: 1,
            styles: { halign: "center" },
          },
          {
            content: data?.buildLabel,
            colSpan: 2,
            styles: {
              halign: "center",
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
            },
          },
          {
            content: "Date & Time",
            colSpan: 1,
            styles: { halign: "center" },
          },
          {
            content: currentTime,
            colSpan: 1,
            styles: {
              halign: "center",
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: "Model",
            colSpan: 1,
            styles: { halign: "center" },
          },
          {
            content: data?.model,
            colSpan: 2,
            styles: {
              halign: "center",
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
            },
          },
          {
            content: "Variant",
            colSpan: 1,
            styles: { halign: "center" },
          },
          {
            content: data.variant,
            colSpan: 2,
            styles: {
              halign: "center",
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
            },
          },
          {
            content: "Seat Type",
            colSpan: 1,
            styles: { halign: "center" },
          },
          {
            content: data.category,
            colSpan: 1,
            styles: {
              halign: "center",
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
            },
          },
        ],

        [
          {
            content: "Station No & Name",
            styles: { cellWidth: 30, valign: "middle", halign: "center" },
          },

          {
            content: "Scanner",
            styles: { cellWidth: 30, valign: "middle", halign: "center" },
          },
          {
            content: "Scanner Code",
            styles: {
              cellWidth: 45,
              valign: "middle",
              halign: "center",
            },
          },
          {
            content: "DC Tool",
            styles: { cellWidth: 30, valign: "middle", halign: "center" },
          },
          {
            content: "Description",
            styles: { cellWidth: 55, valign: "middle", halign: "center" },
          },
          {
            content: "Value",
            styles: { cellWidth: 20, valign: "middle", halign: "center" },
          },
          {
            content: "Status",
            styles: { cellWidth: 30, valign: "middle", halign: "center" },
          },
          {
            content: "Operator Name",
            styles: { cellWidth: 30, valign: "middle", halign: "center" },
          },
        ],
      ],
      body: body,
      theme: "grid",
      styles: {
        fontSize: 7,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        overflow: "linebreak",
      },
      headStyles: {
        // lineHeight: 1.8,
        // cellPadding: 2,
        fillColor: "#92cddc",
        textColor: [0, 0, 0],
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },

      didDrawCell: (data) => {
        if (!imageDrawn && data.row.index === 0 && data.column.index === 0) {
          doc.setFillColor(255, 255, 255);
          doc.rect(
            data.cell.x,
            data.cell.y,
            data.cell.width,
            data.cell.height,
            "F"
          );
          doc.addImage(img, "PNG", data.cell.x + 2, data.cell.y + 2, 26, 16);

          imageDrawn = true;
        }
      },
    });

    const qaTableStartY = doc.lastAutoTable.finalY + 10;
    const qaTableData = data.assemblyDetails
      ?.filter((e) => ["QA", "Rework"].includes(e.wsType))
      ?.sort((a, b) => new Date(a.start) - new Date(b.start))
      ?.map((item) => {
        const workStationName = item.workStationName;

        const description =
          item.assemblyDetailSubs
            ?.filter((v) => v.deviceType !== "PLC")
            ?.map((e) => e.description) || "N/A";
        const value =
          item.assemblyDetailSubs
            ?.filter((v) => v.deviceType !== "PLC")
            ?.map((e) => e.value) || "N/A";
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

        const productCode = item.assemblyReworkSubs?.map((e) => e.qrCode);
        const reworkStatus = item.assemblyReworkSubs?.map(
          (e) => e?.reworkStatus
        );
        const remarks = item.assemblyReworkSubs?.map((e) => e.remarks);
        const status = item.status;
        const operatorName = item.operator || "N/A";
        return {
          workStationName: workStationName,
          productCode: productCode,
          description: description,
          value: value,
          defectName: defectName,
          status: status,
          operatorName: operatorName,
          defectStatus: defectStatus,
          cycleNumber: cycleNumber,
          reworkStatus: reworkStatus,
          remarks: remarks,
          status: item?.status || "N/A",
          operatorName: data?.operator || "N/A",
        };
      });

    const qaData = [];
    qaTableData.forEach((row) => {
      const rowCount = Math.max(row.description.length, row.defectName.length);

      for (let i = 0; i < rowCount; i++) {
        if (i === 0) {
          qaData.push([
            {
              content: row.workStationName,
              rowSpan: rowCount,
              styles: { cellWidth: 25, halign: "center", valign: "middle" },
            },
            {
              content: row.defectName[i],
              styles: { cellWidth: 30 },
            },
            {
              content: row.defectStatus[i] || " ",
              styles: { cellWidth: 15 },
            },
            {
              content: row.cycleNumber[i] || " ",
              styles: { cellWidth: 15 },
            },
            {
              content: row.productCode[i] || " ",
              styles: { cellWidth: 30 },
            },
            {
              content: row.reworkStatus[i] || " ",
              styles: { cellWidth: 15 },
            },
            {
              content: row.remarks[i] || " ",
              styles: { cellWidth: 30 },
            },
            {
              content: row.description[i] || "",
              styles: { cellWidth: 40 },
            },
            {
              content: row.value[i] || "",
              styles: { cellWidth: 30 },
            },

            {
              content: row.status,
              rowSpan: rowCount,
              styles: { cellWidth: 20, halign: "center", valign: "middle" },
            },
            {
              content: row.operatorName,
              rowSpan: rowCount,
              styles: { cellWidth: 20, halign: "center", valign: "middle" },
            },
          ]);
        } else {
          qaData.push([
            row.defectName[i] || "",
            row.defectStatus[i] || "",
            row.cycleNumber[i] || "",
            row.productCode[i] || "",
            row.reworkStatus[i] || "",
            row.remarks[i] || "",
            row.description[i] || "",
            row.value[i] || "",
          ]);
        }
      }
    });

    doc.autoTable({
      startY: qaTableStartY,
      head: [
        [
          {
            content: "Station No & Name",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Defect Name",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Defect Status",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Cycle No",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Product Code",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Rework Status",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Remarks",
            styles: { valign: "middle", halign: "center" },
          },

          {
            content: "Description",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Value",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Status",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Operator",
            styles: { valign: "middle", halign: "center" },
          },
        ],
      ],
      body: qaData,
      theme: "grid",
      styles: {
        fontSize: 8,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        overflow: "linebreak",
      },
      headStyles: {
        lineHeight: 1.8,
        fillColor: "#92cddc",
        textColor: [0, 0, 0],
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
    });

    const imageAdd = async () => {
      let finalYPosition = doc.lastAutoTable.finalY + 10;
      let xAxis = 15;
      let gapBetweenImages = 10;
      let imageCount = data.imagePath?.length;
      const widthPercentage =
        imageCount > 3
          ? 0.2
          : imageCount > 2
          ? 0.28
          : imageCount > 1
          ? 0.4
          : 0.4;
      let imageWidth = doc.internal.pageSize.width * widthPercentage;
      let imageHeight =
        imageCount > 3 ? 50 : imageCount > 2 ? 60 : imageCount > 1 ? 70 : 70;
      doc.text("Completed Seat Images ", 15, finalYPosition, {
        fontSize: 14,
        textColor: [255, 0, 0],
        fontStyle: "bold",
      });
      finalYPosition += 10;

      imageDrawn = false;

      if (data.imagePath?.length) {
        for (const path of data.imagePath) {
          try {
            const img = await loadImageAsync(`${publicUrl}${path}`);
            doc.addImage(
              img,
              "PNG",
              xAxis,
              finalYPosition,
              imageWidth,
              imageHeight
            );
            xAxis += imageWidth + gapBetweenImages;
          } catch (error) {
            console.error(`Error loading image at ${path}:`, error);
          }
        }
      }

      imageDrawn = true;
    };

    const loadImageAsync = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });

    imageAdd().then(() => {
      doc.save(`${fileName}.pdf`);
    });
  };
};
