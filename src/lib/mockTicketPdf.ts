import { jsPDF } from "jspdf";

export type MockTicketPdfData = {
  pnr: string;
  orderId: string;
  train: { number: string; name: string };
  from: string;
  to: string;
  travelDate: string;
  travelClass: string;
  passengers: Array<{ name: string; age: string; berth: string; seat: string }>;
};

const ink: [number, number, number] = [23, 37, 31];
const cream: [number, number, number] = [248, 245, 237];
const pale: [number, number, number] = [239, 235, 221];
const orange: [number, number, number] = [216, 82, 38];
const lime: [number, number, number] = [215, 255, 88];
const muted: [number, number, number] = [145, 150, 142];

function label(doc: jsPDF, text: string, x: number, y: number, align: "left" | "right" = "left") {
  doc.setFont("courier", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...muted);
  doc.text(text.toUpperCase(), x, y, { align });
}

export function downloadMockTicketPdf(data: MockTicketPdfData) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [190, 154] });
  const width = 190;
  doc.setFillColor(...cream);
  doc.rect(0, 0, width, 154, "F");

  doc.setFillColor(...ink);
  doc.rect(0, 0, width, 11, "F");
  doc.setFont("courier", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("MOCK TICKET - INDEPENDENT HACKATHON PROTOTYPE, NOT VALID FOR TRAVEL", 8, 7.2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...ink);
  doc.text("TatkalEase", 9, 27);
  doc.setFont("courier", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...orange);
  doc.text("E-TICKET / MOCK DATA", 9, 34);
  label(doc, "PNR", 181, 22, "right");
  doc.setFont("courier", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...ink);
  doc.text(data.pnr, 181, 30, { align: "right" });

  doc.setDrawColor(192, 194, 185);
  doc.setLineDashPattern([1.5, 1.5], 0);
  doc.line(9, 41, 181, 41);
  doc.setLineDashPattern([], 0);

  label(doc, "From", 9, 52);
  label(doc, "To", 181, 52, "right");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...ink);
  doc.text(data.from, 9, 60);
  doc.setTextColor(...orange);
  doc.text("->", 95, 59, { align: "center" });
  doc.setTextColor(...ink);
  doc.text(data.to, 181, 60, { align: "right" });

  const stats = [["TRAIN", `${data.train.number} - ${data.train.name}`], ["DATE", data.travelDate], ["CLASS", data.travelClass]];
  stats.forEach(([title, value], index) => {
    const x = 9 + index * 59;
    doc.setFillColor(...pale);
    doc.roundedRect(x, 68, 54, 17, 3, 3, "F");
    label(doc, title, x + 5, 74);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...ink);
    doc.text(value, x + 5, 80.5, { maxWidth: 45 });
  });

  label(doc, "Passengers", 9, 101);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text("Name", 9, 110);
  doc.text("Age", 56, 110);
  doc.text("Seat / berth", 181, 110, { align: "right" });
  data.passengers.slice(0, 4).forEach((passenger, index) => {
    const y = 119 + index * 9;
    doc.setTextColor(...ink);
    doc.setFontSize(8.5);
    doc.text(passenger.name, 9, y, { maxWidth: 42 });
    doc.text(passenger.age, 56, y);
    doc.text(`${passenger.seat} - ${passenger.berth}`, 181, y, { align: "right" });
  });

  doc.setDrawColor(224, 225, 216);
  doc.line(9, 135, 181, 135);
  label(doc, "Order ID", 9, 143);
  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...ink);
  doc.text(data.orderId, 9, 149);
  doc.setFillColor(...lime);
  doc.roundedRect(143, 140, 38, 11, 5.5, 5.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...ink);
  doc.text("CONFIRMED", 162, 147, { align: "center" });
  doc.save(`tatkalease-mock-ticket-${data.pnr}.pdf`);
}
