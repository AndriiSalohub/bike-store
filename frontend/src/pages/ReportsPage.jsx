import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/dateRangePicker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import jsPDF from "jspdf";
import "jspdf-autotable";

import RobotoRegular from "../assets/fonts/Roboto/Roboto-Regular.ttf";

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [salesReportData, setSalesReportData] = useState([]);
  const [quantityReportData, setQuantityReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSalesReportData = async (useDefaultRange = false) => {
    setLoading(true);
    try {
      const params = useDefaultRange
        ? {
            startDate: new Date(new Date().getFullYear(), 0, 1).toISOString(),
            endDate: new Date().toISOString(),
          }
        : dateRange.from && dateRange.to
          ? {
              startDate: dateRange.from.toISOString(),
              endDate: dateRange.to.toISOString(),
            }
          : null;

      if (!params && !useDefaultRange) {
        alert("Будь ласка, виберіть коректний діапазон дат.");
        setLoading(false);
        return null;
      }

      const response = await axios.get("http://localhost:3000/reports/sales", {
        params,
      });
      setSalesReportData(response.data);
      return response.data;
    } catch (error) {
      console.error("Помилка отримання даних:", error);
      setLoading(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchQuantityReportData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/reports/quantity",
      );
      setQuantityReportData(response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Помилка отримання даних для звіту про кількість товару:",
        error,
      );
      setLoading(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (data, reportTitle, tableColumns, fileName) => {
    let reportData = data;

    if (!reportData || reportData.length === 0) {
      if (fileName.includes("sales")) {
        reportData = await fetchSalesReportData(true);
      } else if (fileName.includes("quantity")) {
        reportData = await fetchQuantityReportData();
      }
    }

    if (!reportData || reportData.length === 0) {
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.addFont(RobotoRegular, "Roboto", "normal");
    doc.setFont("Roboto");
    doc.setFontSize(16);

    doc.text(reportTitle, 20, 20);

    const tableData = reportData.map((item) =>
      Object.values(item).map((value) => value.toString()),
    );

    doc.autoTable({
      head: [tableColumns],
      body: tableData,
      startY: 30,
      styles: {
        font: "Roboto",
        fontStyle: "normal",
      },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
        3: { cellWidth: "auto" },
      },
    });

    const currentDate = new Date().toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    doc.setFontSize(10);
    doc.text(
      `Дата створення звіту: ${currentDate}`,
      20,
      doc.internal.pageSize.height - 10,
    );

    doc.save(fileName);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Звіт по продажах та кількості товару
      </h1>
      <div className="flex space-x-4 mb-6">
        <DatePickerWithRange onChange={setDateRange} />
        <Button onClick={() => fetchSalesReportData()} disabled={loading}>
          {loading ? "Отримується..." : "Звіт по продажах"}
        </Button>
        <Button onClick={fetchQuantityReportData} disabled={loading}>
          {loading ? "Отримується..." : "Звіт по кількості товару"}
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            downloadPDF(
              salesReportData,
              "Звіт по продажах",
              [
                "Назва моделі",
                "Кількість продажів",
                "Загальна сума продажу",
                "Середня ціна",
              ],
              "sales_report.pdf",
            )
          }
        >
          Завантажити PDF (Продажі)
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            downloadPDF(
              quantityReportData,
              "Звіт по кількості товару",
              [
                "Модель велосипеда",
                "Бренд",
                "Тип",
                "Ціна",
                "Колір",
                "Кількість в наявності",
                "Рейтинг",
              ],
              "quantity_report.pdf",
            )
          }
        >
          Завантажити PDF (Кількість товару)
        </Button>
      </div>
      {salesReportData.length > 0 && (
        <div className="bg-white shadow-md rounded p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Назва моделі</TableHead>
                <TableHead>Кількість продажів</TableHead>
                <TableHead>Загальна сума продажу</TableHead>
                <TableHead>Середня ціна</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesReportData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.type_name}</TableCell>
                  <TableCell>{item.sold_count}</TableCell>
                  <TableCell>
                    {Number(item.total_revenue).toFixed(2)} грн
                  </TableCell>
                  <TableCell>{Number(item.avg_price).toFixed(2)} грн</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {quantityReportData.length > 0 && (
        <div className="bg-white shadow-md rounded p-4 mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Модель велосипеда</TableHead>
                <TableHead>Бренд</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Ціна</TableHead>
                <TableHead>Колір</TableHead>
                <TableHead>Кількість в наявності</TableHead>
                <TableHead>Рейтинг</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quantityReportData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.bike_model}</TableCell>
                  <TableCell>{item.brand_name}</TableCell>
                  <TableCell>{item.type_name}</TableCell>
                  <TableCell>{item.bike_price} грн</TableCell>
                  <TableCell>{item.bike_color}</TableCell>
                  <TableCell>{item.bike_quantity}</TableCell>
                  <TableCell>{item.bike_rating}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
