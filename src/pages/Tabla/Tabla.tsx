import { useForm } from 'react-hook-form'
import { KInputTable } from 'src/components/KInput/KInputTable'
import jsPDF from 'jspdf'
import autoTable, { HAlignType, RowInput } from 'jspdf-autotable'
import { useEffect, useState } from 'react'
import logo from '../../assets/logo.jpg'
import { KInputArea } from 'src/components/KInput/KInputArea'
import { KInputUpload } from 'src/components/KInput/KInputUpload'
import Chart, { ChartTypeRegistry } from 'chart.js/auto'
import Plotly, { Layout } from "plotly.js-dist-min";

export const Tabla = (): JSX.Element => {
  const [data, setData] = useState([
    { tiempo: '0:00', hora: '12:00 AM', slump: '', tc: '', ta: '', operador: '' },
    { tiempo: '0:30', hora: '12:30 AM', slump: '', tc: '', ta: '', operador: '' },
    { tiempo: '1:00', hora: '1:00 AM', slump: '', tc: '', ta: '', operador: '' },
    { tiempo: '1:30', hora: '1:30 AM', slump: '', tc: '', ta: '', operador: '' },
    { tiempo: '2:00', hora: '2:00 AM', slump: '', tc: '', ta: '', operador: '' },
    { tiempo: '2:30', hora: '2:30 AM', slump: '', tc: '', ta: '', operador: '' },
    { tiempo: '3:00', hora: '3:00 AM', slump: '', tc: '', ta: '', operador: '' }
  ])

  const [file, setFile] = useState<File | null>(null)
  const [file1, setFile1] = useState<File | null>(null)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const onSubmit = (formData: any) => {
    generatePDF(formData)
  }

  const createChartAsBase64 = async (formData: any) => {
    const data = [
      {
        x: ["", "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", ""],
        y: [
          null,
          Number(formData.slump0),
          Number(formData.slump1),
          Number(formData.slump2),
          Number(formData.slump3),
          Number(formData.slump4),
          Number(formData.slump5),
          Number(formData.slump6),
          null
        ],
        mode: "lines+markers",
        name: "33-SQM-TI-28",
        line: {
          color: "red",
          shape: "linear",
        },
        marker: {
          size: 8,
          color: "red",
        },
      },
    ];
  
    const layout = {
      title: {
        text: "SOQUIMIC",
        font: {
          size: 16,
        },
      },
      xaxis: {
        title: {
          text: "",
        },
        showgrid: false,
      },
      yaxis: {
        title: {
          text: "",
        },
        range: [0, 10],
        dtick: 1,
        showgrid: true,
      },
      showlegend: true,
      legend: {
        orientation: "h",
        x: 0.5,
        xanchor: "center",
        y: -0.3,
      },
    };
  
    const canvas = document.createElement("div");
    await Plotly.newPlot(canvas, data, layout as Partial<Layout>, { responsive: false });

    await new Promise((resolve) => setTimeout(resolve, 500));

    const base64 = await Plotly.toImage(canvas, { format: "png", width: 800, height: 400 });
  
    return base64;
  };

  const readFileAsBase64 = async (file: File): Promise<string> => {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => { resolve(reader.result as string) }
      reader.onerror = (error) => { reject(error) }
      reader.readAsDataURL(file)
    })
  }

  const generatePDF = async (formData: any) => {

    const chartBase64 = await createChartAsBase64(formData);

    if (!chartBase64) {
      console.error("Error al generar el gráfico.");
      return;
    }

    const fecha = new Date()
    const formatoFecha = fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    const fechaActual = new Date().toLocaleDateString('es-ES')

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.height

    const tableHeadHeaders = [
      [
        { content: '', rowSpan: 3, styles: { halign: 'center' } },
        'SOQUIMIC S.A.C.',
        'CÓDIGO',
        'AVT-0001'
      ],
      [
        { content: 'ACTA DE VISITA TÉCNICA', rowSpan: 2 },
        'VERSIÓN',
        '1'
      ],
      ['FECHA', fechaActual]
    ]

    const tableHeadRows = [
      [
        { content: 'FECHA', colSpan: 1 },
        { content: fechaActual, colSpan: 3, styles: { halign: 'center' } }
      ],
      [
        { content: 'CLIENTE (S)', colSpan: 1 },
        { content: 'SOQUIMIC', colSpan: 3, styles: { halign: 'center' } }
      ],
      [
        { content: 'PROYECTO (S)', colSpan: 1 },
        { content: 'SOQUIMIC', colSpan: 3, styles: { halign: 'center' } }
      ],
      [
        { content: 'LUGAR (DEPART. – PROVINCIA)', colSpan: 1 },
        { content: 'LIMA-LURIN', colSpan: 3, styles: { halign: 'center' } }
      ],
      [
        { content: 'PERSONAS CONTACTADAS (TELEF.)', colSpan: 1 },
        { content: '', colSpan: 3, styles: { halign: 'center' } }
      ],
      [
        { content: 'ASESOR (ES) TÉCNICO (S)', colSpan: 1 },
        { content: 'LUIS ARIMANA', colSpan: 3, styles: { halign: 'center' } }
      ]
    ]

    autoTable(doc, {
      startY: 10,
      head: tableHeadHeaders as RowInput[],
      body: tableHeadRows.map((row) =>
        row.map((cell) => ({
          ...cell,
          styles: (cell.styles != null)
            ? { ...cell.styles, halign: cell.styles.halign as HAlignType }
            : undefined
        }))
      ),
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 2,
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        valign: 'middle',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 50 }
      },
      didDrawCell: (data) => {
        if (data.section === 'head' && data.row.index === 0 && data.column.index === 0) {
          doc.addImage(logo, 'JPG', data.cell.x + 2, data.cell.y + 2, 40, 15)
        }
      }
    })

    // aaaaaaaaaaaaaaaaaaaaa
    const tablenewHeaders = [
      [
        { content: 'Volumen', colSpan: 1, styles: { halign: 'center' } },
        { content: 'x³', colSpan: 1, styles: { halign: 'center' } },
        { content: '1.00', colSpan: 1, styles: { halign: 'center' } },
        { content: '5.00', colSpan: 1, styles: { halign: 'center' } },
        { content: '8.00', colSpan: 1, styles: { halign: 'center' } },
      ]
    ]

    const tablenewRows = [
      [
        { content: 'CEMENTO', colSpan: 1, styles: { halign: 'center' } },
        { content: 'Kg', colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('cemento')) / Number(watch('tanda')))
        ? ((Number(watch('cemento')) / Number(watch('tanda')) || 0).toFixed(2))
        : '0.00'}`, colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('cemento')) / Number(watch('tanda')))
        ? ((Number(watch('cemento')*5) / Number(watch('tanda')) || 0).toFixed(2))
        : '0.00'}`, colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('cemento')) / Number(watch('tanda')))
        ? ((Number(watch('cemento')*8) / Number(watch('tanda')) || 0).toFixed(2))
        : '0.00'}`, colSpan: 1, styles: { halign: 'center' } },
      ],
      [
        { content: 'AGUA', colSpan: 1, styles: { halign: 'center' } },
        { content: 'Lt', colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('agua')) / Number(watch('tanda')))
        ? (Number(watch('agua')) / Number(watch('tanda')) || 0).toFixed(2)
        : '0.00'}`, colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('agua')) / Number(watch('tanda')))
        ? (Number(watch('agua')*5) / Number(watch('tanda')) || 0).toFixed(2)
        : '0.00'}`, colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('agua')) / Number(watch('tanda')))
        ? (Number(watch('agua')*8) / Number(watch('tanda')) || 0).toFixed(2)
        : '0.00'}`, colSpan: 1, styles: { halign: 'center' } },
      ],
      [
        { content: 'ARENA', colSpan: 1, styles: { halign: 'center' } },
        { content: 'Kg', colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('arena')) / Number(watch('tanda')))
        ? ((Number(watch('arena')) / Number(watch('tanda')) || 0).toFixed(2))
        : "0.00"}`, colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('arena')) / Number(watch('tanda')))
        ? ((Number(watch('arena')*5) / Number(watch('tanda')) || 0).toFixed(2))
        : "0.00"}`, colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('arena')) / Number(watch('tanda')))
        ? ((Number(watch('arena')*8) / Number(watch('tanda')) || 0).toFixed(2))
        : "0.00"}`, colSpan: 1, styles: { halign: 'center' } },
      ],
      [
        { content: 'ARENA 2', colSpan: 1, styles: { halign: 'center' } },
        { content: 'Kg', colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('arena2')) / Number(watch('tanda')))
        ? ((Number(watch('arena2')) / Number(watch('tanda')) || 0).toFixed(2))
        : "0.00"}`, colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('arena2')) / Number(watch('tanda')))
        ? ((Number(watch('arena2')*5) / Number(watch('tanda')) || 0).toFixed(2))
        : "0.00"}`, colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('arena2')) / Number(watch('tanda')))
        ? ((Number(watch('arena2')*8) / Number(watch('tanda')) || 0).toFixed(2))
        : "0.00"}`, colSpan: 1, styles: { halign: 'center' } },
      ],
      [
        { content: 'PIEDRA', colSpan: 1, styles: { halign: 'center' } },
        { content: 'Kg', colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('piedra')) / Number(watch('tanda')))
        ? (Number(watch('piedra')) / Number(watch('tanda')) || 0).toFixed(2)
        : '0.00'}`, colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('piedra')) / Number(watch('tanda')))
        ? (Number(watch('piedra')*5) / Number(watch('tanda')) || 0).toFixed(2)
        : '0.00'}`, colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('piedra')) / Number(watch('tanda')))
        ? (Number(watch('piedra')*8) / Number(watch('tanda')) || 0).toFixed(2)
        : '0.00'}`, colSpan: 1, styles: { halign: 'center' } },
      ],
      [
        { content: 'PIEDRA 2', colSpan: 1, styles: { halign: 'center' } },
        { content: 'Kg', colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('piedra2')) / Number(watch('tanda')))
        ? (Number(watch('piedra2')) / Number(watch('tanda')) || 0).toFixed(2)
        : '0.00'}`, colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('piedra2')) / Number(watch('tanda')))
        ? (Number(watch('piedra2')*5) / Number(watch('tanda')) || 0).toFixed(2)
        : '0.00'}`, colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('piedra2')) / Number(watch('tanda')))
        ? (Number(watch('piedra2')*8) / Number(watch('tanda')) || 0).toFixed(2)
        : '0.00'}`, colSpan: 1, styles: { halign: 'center' } },
      ],
      [
        { content: 'Aditivo 1200', colSpan: 1, styles: { halign: 'center' } },
        { content: 'Kg', colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('n1200')) / Number(watch('tanda')))
        ? (Number(watch('n1200')) / Number(watch('tanda')) || 0).toFixed(2)
        : '0.00'}`, colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('n1200')) / Number(watch('tanda')))
        ? (Number(watch('n1200')*5) / Number(watch('tanda')) || 0).toFixed(2)
        : '0.00'}`, colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('n1200')) / Number(watch('tanda')))
        ? (Number(watch('n1200')*8) / Number(watch('tanda')) || 0).toFixed(2)
        : '0.00'}`, colSpan: 1, styles: { halign: 'center' } },
      ],
      [
        { content: 'Aditivo RF 25', colSpan: 1, styles: { halign: 'center' } },
        { content: 'Kg', colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('rf25')) / Number(watch('tanda')))
        ? (Number(watch('rf25')) / Number(watch('tanda')) || 0).toFixed(2)
        : '0.00'}`, colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('rf25')) / Number(watch('tanda')))
        ? (Number(watch('rf25')*5) / Number(watch('tanda')) || 0).toFixed(2)
        : '0.00'}`, colSpan: 1, styles: { halign: 'center' } },
        { content: `${Number.isFinite(Number(watch('rf25')) / Number(watch('tanda')))
        ? (Number(watch('rf25')*8) / Number(watch('tanda')) || 0).toFixed(2)
        : '0.00'}`, colSpan: 1, styles: { halign: 'center' } },
      ],
      [
        { content: 'Agregados Total', colSpan: 1, styles: { halign: 'center' } },
        { content: 'Kg', colSpan: 1, styles: { halign: 'center' } },
        { content: `${(
          (Number.isFinite(Number(watch('cemento')) / Number(watch('tanda'))) ? (Number(watch('cemento')) / Number(watch('tanda')) || 0) : 0) +
          (Number.isFinite(Number(watch('agua')) / Number(watch('tanda'))) ? (Number(watch('agua')) / Number(watch('tanda')) || 0) : 0) +
          (Number.isFinite(Number(watch('arena')) / Number(watch('tanda'))) ? (Number(watch('arena')) / Number(watch('tanda')) || 0) : 0) +
          (Number.isFinite(Number(watch('arena2')) / Number(watch('tanda'))) ? (Number(watch('arena2')) / Number(watch('tanda')) || 0) : 0) +
          (Number.isFinite(Number(watch('piedra')) / Number(watch('tanda'))) ? (Number(watch('piedra')) / Number(watch('tanda')) || 0) : 0) +
          (Number.isFinite(Number(watch('piedra2')) / Number(watch('tanda'))) ? (Number(watch('piedra2')) / Number(watch('tanda')) || 0) : 0) +
          (Number.isFinite(Number(watch('n1200')) / Number(watch('tanda'))) ? (Number(watch('n1200')) / Number(watch('tanda')) || 0) : 0) +
          (Number.isFinite(Number(watch('rf25')) / Number(watch('tanda'))) ? (Number(watch('rf25')) / Number(watch('tanda')) || 0) : 0)
        ).toFixed(2)}`, colSpan: 1, styles: { halign: 'center' } },
        { content: `${(
          ((Number.isFinite(Number(watch('cemento')) / Number(watch('tanda'))) ? (Number(watch('cemento')) / Number(watch('tanda')) || 0) : 0) +
          (Number.isFinite(Number(watch('agua')) / Number(watch('tanda'))) ? (Number(watch('agua')) / Number(watch('tanda')) || 0) : 0) +
          (Number.isFinite(Number(watch('arena')) / Number(watch('tanda'))) ? (Number(watch('arena')) / Number(watch('tanda')) || 0) : 0) +
          (Number.isFinite(Number(watch('arena2')) / Number(watch('tanda'))) ? (Number(watch('arena2')) / Number(watch('tanda')) || 0) : 0) +
          (Number.isFinite(Number(watch('piedra')) / Number(watch('tanda'))) ? (Number(watch('piedra')) / Number(watch('tanda')) || 0) : 0) +
          (Number.isFinite(Number(watch('piedra2')) / Number(watch('tanda'))) ? (Number(watch('piedra2')) / Number(watch('tanda')) || 0) : 0) +
          (Number.isFinite(Number(watch('n1200')) / Number(watch('tanda'))) ? (Number(watch('n1200')) / Number(watch('tanda')) || 0) : 0) +
          (Number.isFinite(Number(watch('rf25')) / Number(watch('tanda'))) ? (Number(watch('rf25')) / Number(watch('tanda')) || 0) : 0))*5
        ).toFixed(2)}`, colSpan: 1, styles: { halign: 'center' } },
        { content: `${(
          ((Number.isFinite(Number(watch('cemento')) / Number(watch('tanda'))) ? (Number(watch('cemento')) / Number(watch('tanda')) || 0) : 0) +
          (Number.isFinite(Number(watch('agua')) / Number(watch('tanda'))) ? (Number(watch('agua')) / Number(watch('tanda')) || 0) : 0) +
          (Number.isFinite(Number(watch('arena')) / Number(watch('tanda'))) ? (Number(watch('arena')) / Number(watch('tanda')) || 0) : 0) +
          (Number.isFinite(Number(watch('arena2')) / Number(watch('tanda'))) ? (Number(watch('arena2')) / Number(watch('tanda')) || 0) : 0) +
          (Number.isFinite(Number(watch('piedra')) / Number(watch('tanda'))) ? (Number(watch('piedra')) / Number(watch('tanda')) || 0) : 0) +
          (Number.isFinite(Number(watch('piedra2')) / Number(watch('tanda'))) ? (Number(watch('piedra2')) / Number(watch('tanda')) || 0) : 0) +
          (Number.isFinite(Number(watch('n1200')) / Number(watch('tanda'))) ? (Number(watch('n1200')) / Number(watch('tanda')) || 0) : 0) +
          (Number.isFinite(Number(watch('rf25')) / Number(watch('tanda'))) ? (Number(watch('rf25')) / Number(watch('tanda')) || 0) : 0))*8
        ).toFixed(2)}`, colSpan: 1, styles: { halign: 'center' } },
      ]
    ]

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: tablenewHeaders as RowInput[],
      body: tablenewRows.map((row) =>
        row.map((cell) => ({
          ...cell,
          styles: (cell.styles != null)
            ? { ...cell.styles, halign: cell.styles.halign as HAlignType }
            : undefined
        }))
      ),
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 2,
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        valign: 'middle',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 50 }
      },
      // didDrawCell: (data) => {
      //   if (data.section === 'head' && data.row.index === 0 && data.column.index === 0) {
      //     doc.addImage(logo, 'JPG', data.cell.x + 2, data.cell.y + 2, 40, 15)
      //   }
      // }
    })
    // aaaaaaaaaaaaaaaaaaaaa

    const tableHeaders = [
      [
        { content: 'DISEÑOS DE PLANTA LURIN', colSpan: 3, styles: { halign: 'center' } }
      ],
      [
        { content: 'Parámetro', rowSpan: 2, colSpan: 1 },
        { content: 'Unidad', rowSpan: 2, colSpan: 1 },
        { content: `${formatoFecha}`, colSpan: 1, styles: { halign: 'center' } }
      ],
      [
        { content: 'Prb. N° 01', styles: { fontSize: 10, halign: 'center' } }
      ]
    ]

    const tableRows = data.map((row, index) => [
    `Slump a 0${row.tiempo} horas`,
    'Pulg.',
    formData[`slump${index}`] || ''
    ])

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: tableHeaders as RowInput[],
      body: tableRows,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 2,
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: [229, 231, 235],
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        valign: 'middle',
        halign: 'center'
      }
    })
    const titlecomment = 'Comentario Prueba 1';
    const titlecommentWidth = doc.getTextWidth(titlecomment);
    let currentY1 = (doc as any).lastAutoTable?.finalY + 10 || 10
    doc.text(titlecomment, 20, currentY1);
    const commentario = formData.comment
    const maxWidth = pageWidth - 20
    const fontSize = 10
    doc.setFontSize(fontSize)

    const lines = doc.splitTextToSize(commentario, maxWidth)
    const lineHeight = fontSize * 0.60 // Más compacto
    let currentY = (doc as any).lastAutoTable?.finalY + 20 || 10

    lines.forEach((line: string) => {
      // if (currentY + lineHeight > pageHeight - 20) {
      //   doc.addPage()
      //   currentY = 10
      // }
      doc.text(line, 30, currentY)
      currentY += lineHeight
    })

    doc.addPage(); // Siempre fuerza un salto de página
    currentY = 10; // Reinicia la posición vertical

    doc.setFontSize(16);
    const title1 = 'PANEL FOTOGRÁFICO';
    const title1Width = doc.getTextWidth(title1);
    doc.text(title1, (pageWidth - title1Width) / 2, currentY);
    currentY += 20;
    let height = 0;
    if (file != null) {
      try {
        const imgData = await readFileAsBase64(file)

        const image = new Image()
        image.src = imgData

        await new Promise((resolve, reject) => {
          image.onload = resolve
          image.onerror = reject
        })

        const originalWidth = image.width
        const originalHeight = image.height

        const maxWidth = 80
        const maxHeight = 80
        let width = originalWidth
        height = originalHeight

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height

          if (width > height) {
            width = maxWidth
            height = maxWidth / aspectRatio
          } else {
            height = maxHeight
            width = maxHeight * aspectRatio
          }
        }

        if (currentY + height > pageHeight - 20) {
          doc.addPage()
          currentY = 10
        }
        if(file1){
          const imageX = (pageWidth - 40) / 2;
          doc.addImage(imgData, 'JPEG', 20, currentY, width, height)
        }else{
          const imageX = (pageWidth - 90) / 2;
          doc.addImage(imgData, 'JPEG', imageX, currentY, width, height)
        }
        
        
      } catch (error) {
        console.error('Error al cargar la imagen:', error)
      }
    }
    if (file1 != null) {
      try {
        const imgData = await readFileAsBase64(file1)

        const image = new Image()
        image.src = imgData

        await new Promise((resolve, reject) => {
          image.onload = resolve
          image.onerror = reject
        })

        const originalWidth = image.width
        const originalHeight = image.height

        const maxWidth = 80
        const maxHeight = 80
        let width = originalWidth
        height = originalHeight

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height

          if (width > height) {
            width = maxWidth
            height = maxWidth / aspectRatio
          } else {
            height = maxHeight
            width = maxHeight * aspectRatio
          }
        }

        if (currentY + height > pageHeight - 20) {
          doc.addPage()
          currentY = 10
        }
        if(file){
          const imageX = (pageWidth + 20) / 2;
          doc.addImage(imgData, 'JPEG', imageX, currentY, width, height)
        }else{
          const imageX = (pageWidth - 80) / 2;
          doc.addImage(imgData, 'JPEG', imageX, currentY, width, height)
        }
      } catch (error) {
        console.error('Error al cargar la imagen:', error)
      }
    }
    currentY += height + 10; // Deja un margen de 10 después de la imagen

    if (currentY + 90 > pageHeight - 20) { // Si la gráfica no cabe
      doc.addPage();
      currentY = 10;
    }
    const graficX = (pageWidth - 190) / 2;
    doc.addImage(chartBase64, "PNG", graficX, currentY, 190, 90);

    const pdfBlob = doc.output('blob')
    const pdfUrl = URL.createObjectURL(pdfBlob)
    window.open(pdfUrl, '_blank')
  }

  return (
    <div className="">
    <div className="mx-auto rounded-bl-md rounded-br-md overflow-hidden w- shadow-md overflow-x-auto mb-8">
        <div className="bg-gray-300 p-1 sm:p-4 flex  flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <img
              src={logo}
              alt="Logo de la empresa"
              className="h-8 sm:h-16 w-auto mr-4"
            />
            <div>
              <h2 className="text-xl font-bold">SOQUIMIC S.A.C.</h2>
              <p className="text-sm text-gray-600">Acta de Visita Técnica</p>
              <p className="text-sm text-gray-600">Usuario: Pablo González</p>
            </div>
          </div>

          <div className="text-right flex flex-row sm:flex-col">
            <p className="text-gray-700 text-left text-lg">Fecha:&nbsp;&nbsp; </p>
            <p className="text-lg font-bold text-gray-800">
              {new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

    <div className="p-1 md:p-4 flex w-screen  justify-center px-1 md:px-8 ">
    <form action="" onSubmit={handleSubmit(onSubmit)} 
    // onKeyDown={(e) => {
    //   if (e.key === 'Enter') {
    //     e.preventDefault(); // Evita el submit al presionar Enter
    //   }
    // }}
    autoComplete="false" className="w-full">
    <div className="border mx-auto rounded-lg max-w-7xl overflow-hidden shadow-md overflow-x-auto">
        <div className="bg-gray-200 text-center p-2 font-bold">
          <div>{' '} &nbsp; &nbsp;</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
            <tbody>
                <tr
                  className={'bg-white'}
                >
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300  py-2 text-center">
                    CEMENTO (Kg)
                  </td>
                  <td className={'border border-gray-300 min-w-[150px] w-40 text-center h-10'}>
                    <KInputTable type='string' label="" placeholder='' reactHookForm={{ ...register('cemento'), defaultValue: '' }} />
                  </td>
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300 px-4 py-2 text-center">
                    {
                      Number.isFinite(Number(watch('cemento')) / Number(watch('tanda')))
                        ? ((Number(watch('cemento')) / Number(watch('tanda')) || 0).toFixed(2))
                        : '0.00'
                    }
                  </td>
                  <td className="border min-w-[150px] border-gray-300 px-4 py-2 text-center">
                    A/C
                  </td>
                  <td className="border min-w-[150px] w-40 max-w-[239px] border-gray-300 px-4 py-2 text-center">
                  {watch('agua') && watch('cemento') ? (watch('agua') / watch('cemento')).toFixed(2) : '0.00'}
                  </td>
                </tr>

                <tr
                  className={'bg-white'}
                >
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300  py-2 text-center">
                    AGUA (Lt)
                  </td>
                  <td className={'border border-gray-300 min-w-[150px] w-40 text-center h-10'}>
                    <KInputTable type='string' label="" placeholder='' reactHookForm={{ ...register('agua'), defaultValue: '' }} />
                  </td>
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300 px-4 py-2 text-center">
                  {
                    Number.isFinite(Number(watch('agua')) / Number(watch('tanda')))
                      ? (Number(watch('agua')) / Number(watch('tanda')) || 0).toFixed(2)
                      : '0.00'
                  }
                  </td>
                  <td className="border min-w-[150px] border-gray-300 px-4 py-2 text-center">
                    PESO TEORICO
                  </td>
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300 px-4 py-2 text-center">
                  {(  
                        (Number.isFinite(Number(watch('cemento')) / Number(watch('tanda'))) 
                        ? (Number(watch('cemento')) / Number(watch('tanda')) || 0) 
                        : 0) 
                      +
                      (Number.isFinite(Number(watch('arena')) / Number(watch('tanda'))) 
                        ? (Number(watch('arena')) / Number(watch('tanda')) || 0) 
                        : 0) 
                      +
                      (Number.isFinite(Number(watch('agua')) / Number(watch('tanda'))) 
                        ? (Number(watch('agua')) / Number(watch('tanda')) || 0) 
                        : 0) 
                      +
                      (Number.isFinite(Number(watch('piedra')) / Number(watch('tanda'))) 
                        ? (Number(watch('piedra')) / Number(watch('tanda')) || 0) 
                        : 0)
                      +
                      (Number.isFinite(Number(watch('arena2')) / Number(watch('tanda'))) 
                        ? (Number(watch('arena2')) / Number(watch('tanda')) || 0) 
                        : 0) 
                      +
                      (Number.isFinite(Number(watch('piedra2')) / Number(watch('tanda'))) 
                        ? (Number(watch('piedra2')) / Number(watch('tanda')) || 0) 
                        : 0)
                    ).toFixed(2) || '0.00'}
                  </td>
                </tr>

                <tr
                  className={'bg-white'}
                >
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300  py-2 text-center">
                    ARENA 1 (Kg)
                  </td>
                  <td className={'border border-gray-300 min-w-[150px] w-40 text-center h-10'}>
                    <KInputTable type='text' label="" placeholder='' reactHookForm={{ ...register('arena'), defaultValue: '' }} />
                  </td>
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300 px-4 py-2 text-center">
                  {
                    Number.isFinite(Number(watch('arena')) / Number(watch('tanda')))
                      ? ((Number(watch('arena')) / Number(watch('tanda')) || 0).toFixed(2))
                      : "0.00"
                  }
                  </td>
                  <td className="border min-w-[150px] border-gray-300 px-4 py-2 text-center">
                    RF. ARENA 1
                  </td>
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300 px-4 py-2 text-center">
                  { 
  Number.isFinite(
    100 *
    (
      (Number.isFinite(Number(watch('arena')) / Number(watch('tanda')))
        ? (Number(watch('arena')) / Number(watch('tanda')))
        : 0
      ) /
      (
        (Number.isFinite(Number(watch('arena')) / Number(watch('tanda')))
          ? (Number(watch('arena')) / Number(watch('tanda')))
          : 0
        ) +
        (Number.isFinite(Number(watch('piedra')) / Number(watch('tanda')))
          ? (Number(watch('piedra')) / Number(watch('tanda')))
          : 0
        ) +
        (Number.isFinite(Number(watch('arena2')) / Number(watch('tanda')))
          ? (Number(watch('arena2')) / Number(watch('tanda')))
          : 0
        ) +
        (Number.isFinite(Number(watch('piedra2')) / Number(watch('tanda')))
          ? (Number(watch('piedra2')) / Number(watch('tanda')))
          : 0
        )
      )
    )
  ) 
    ? (100 *
      (
        (Number.isFinite(Number(watch('arena')) / Number(watch('tanda')))
          ? (Number(watch('arena')) / Number(watch('tanda')))
          : 0
        ) /
        (
          (Number.isFinite(Number(watch('arena')) / Number(watch('tanda')))
            ? (Number(watch('arena')) / Number(watch('tanda')))
            : 0
          ) +
          (Number.isFinite(Number(watch('piedra')) / Number(watch('tanda')))
            ? (Number(watch('piedra')) / Number(watch('tanda')))
            : 0
          )+
          (Number.isFinite(Number(watch('arena2')) / Number(watch('tanda')))
            ? (Number(watch('arena2')) / Number(watch('tanda')))
            : 0
          ) +
          (Number.isFinite(Number(watch('piedra2')) / Number(watch('tanda')))
            ? (Number(watch('piedra2')) / Number(watch('tanda')))
            : 0
          )
        )
      )
    ).toFixed(2) 
    : '0.00'
}

                  </td>
                </tr>

                <tr
                  className={'bg-white'}
                >
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300  py-2 text-center">
                    ARENA 2 (Kg)
                  </td>
                  <td className={'border border-gray-300 min-w-[150px] w-40 text-center h-10'}>
                    <KInputTable type='text' label="" placeholder='' reactHookForm={{ ...register('arena2'), defaultValue: '' }} />
                  </td>
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300 px-4 py-2 text-center">
                  {
                    Number.isFinite(Number(watch('arena2')) / Number(watch('tanda')))
                      ? ((Number(watch('arena2')) / Number(watch('tanda')) || 0).toFixed(2))
                      : "0.00"
                  }
                  </td>
                  <td className="border min-w-[150px] border-gray-300 px-4 py-2 text-center">
                    RF. ARENA 2
                  </td>
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300 px-4 py-2 text-center">
                  { 
                    Number.isFinite(
                      100 *
                      (
                        (Number.isFinite(Number(watch('arena2')) / Number(watch('tanda')))
                          ? (Number(watch('arena2')) / Number(watch('tanda')))
                          : 0
                        ) /
                        (
                          (Number.isFinite(Number(watch('arena')) / Number(watch('tanda')))
                            ? (Number(watch('arena')) / Number(watch('tanda')))
                            : 0
                          ) +
                          (Number.isFinite(Number(watch('piedra')) / Number(watch('tanda')))
                            ? (Number(watch('piedra')) / Number(watch('tanda')))
                            : 0
                          ) +
                          (Number.isFinite(Number(watch('arena2')) / Number(watch('tanda')))
                            ? (Number(watch('arena2')) / Number(watch('tanda')))
                            : 0
                          ) +
                          (Number.isFinite(Number(watch('piedra2')) / Number(watch('tanda')))
                            ? (Number(watch('piedra2')) / Number(watch('tanda')))
                            : 0
                          )
                        )
                      )
                    ) 
                      ? (100 *
                        (
                          (Number.isFinite(Number(watch('arena2')) / Number(watch('tanda')))
                            ? (Number(watch('arena2')) / Number(watch('tanda')))
                            : 0
                          ) /
                          (
                            (Number.isFinite(Number(watch('arena')) / Number(watch('tanda')))
                              ? (Number(watch('arena')) / Number(watch('tanda')))
                              : 0
                            ) +
                            (Number.isFinite(Number(watch('piedra')) / Number(watch('tanda')))
                              ? (Number(watch('piedra')) / Number(watch('tanda')))
                              : 0
                            ) +
                            (Number.isFinite(Number(watch('arena2')) / Number(watch('tanda')))
                              ? (Number(watch('arena2')) / Number(watch('tanda')))
                              : 0
                            ) +
                            (Number.isFinite(Number(watch('piedra2')) / Number(watch('tanda')))
                              ? (Number(watch('piedra2')) / Number(watch('tanda')))
                              : 0
                            )
                          )
                        )
                      ).toFixed(2) 
                      : '0.00'
                  }

                  </td>
                </tr>

                <tr
                  className={'bg-white'}
                >
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300  py-2 text-center">
                    PIEDRA 1 (Kg)
                  </td>
                  <td className={'border border-gray-300 min-w-[150px] w-40 text-center h-10'}>
                    <KInputTable type='text' label="" placeholder='' reactHookForm={{ ...register('piedra'), defaultValue: '' }} />
                  </td>
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300 px-4 py-2 text-center">
                  {
                    Number.isFinite(Number(watch('piedra')) / Number(watch('tanda')))
                      ? (Number(watch('piedra')) / Number(watch('tanda')) || 0).toFixed(2)
                      : '0.00'
                  }

                  </td>
                  <td className="border min-w-[150px] border-gray-300 px-4 py-2 text-center">
                    RF. PIEDRA 1
                  </td>
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300 px-4 py-2 text-center">
                  { 
                    Number.isFinite(
                      100 *
                      (
                        (Number.isFinite(Number(watch('piedra')) / Number(watch('tanda')))
                          ? (Number(watch('piedra')) / Number(watch('tanda')))
                          : 0
                        ) /
                        (
                          (Number.isFinite(Number(watch('arena')) / Number(watch('tanda')))
                            ? (Number(watch('arena')) / Number(watch('tanda')))
                            : 0
                          ) +
                          (Number.isFinite(Number(watch('piedra')) / Number(watch('tanda')))
                            ? (Number(watch('piedra')) / Number(watch('tanda')))
                            : 0
                          )+
                          (Number.isFinite(Number(watch('arena2')) / Number(watch('tanda')))
                            ? (Number(watch('arena2')) / Number(watch('tanda')))
                            : 0
                          ) +
                          (Number.isFinite(Number(watch('piedra2')) / Number(watch('tanda')))
                            ? (Number(watch('piedra2')) / Number(watch('tanda')))
                            : 0
                          )
                        )
                      )
                    ) 
                      ? (
                        100 *
                        (
                          (Number.isFinite(Number(watch('piedra')) / Number(watch('tanda')))
                            ? (Number(watch('piedra')) / Number(watch('tanda')))
                            : 0
                          ) /
                          (
                            (Number.isFinite(Number(watch('arena')) / Number(watch('tanda')))
                              ? (Number(watch('arena')) / Number(watch('tanda')))
                              : 0
                            ) +
                            (Number.isFinite(Number(watch('piedra')) / Number(watch('tanda')))
                              ? (Number(watch('piedra')) / Number(watch('tanda')))
                              : 0
                            )+
                            (Number.isFinite(Number(watch('arena2')) / Number(watch('tanda')))
                              ? (Number(watch('arena2')) / Number(watch('tanda')))
                              : 0
                            ) +
                            (Number.isFinite(Number(watch('piedra2')) / Number(watch('tanda')))
                              ? (Number(watch('piedra2')) / Number(watch('tanda')))
                              : 0
                            )
                          )
                        )
                      ).toFixed(2) 
                      : '0.00'
                  }

                  </td>
                </tr>

                <tr
                  className={'bg-white'}
                >
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300  py-2 text-center">
                    PIEDRA 2 (Kg)
                  </td>
                  <td className={'border border-gray-300 min-w-[150px] w-40 text-center h-10'}>
                    <KInputTable type='text' label="" placeholder='' reactHookForm={{ ...register('piedra2'), defaultValue: '' }} />
                  </td>
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300 px-4 py-2 text-center">
                  {
                    Number.isFinite(Number(watch('piedra2')) / Number(watch('tanda')))
                      ? (Number(watch('piedra2')) / Number(watch('tanda')) || 0).toFixed(2)
                      : '0.00'
                  }

                  </td>
                  <td className="border min-w-[150px] border-gray-300 px-4 py-2 text-center">
                    RF. PIEDRA 2
                  </td>
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300 px-4 py-2 text-center">
                  { 
                    Number.isFinite(
                      100 *
                      (
                        (Number.isFinite(Number(watch('piedra2')) / Number(watch('tanda')))
                          ? (Number(watch('piedra2')) / Number(watch('tanda')))
                          : 0
                        ) /
                        (
                          (Number.isFinite(Number(watch('arena')) / Number(watch('tanda')))
                            ? (Number(watch('arena')) / Number(watch('tanda')))
                            : 0
                          ) +
                          (Number.isFinite(Number(watch('piedra')) / Number(watch('tanda')))
                            ? (Number(watch('piedra')) / Number(watch('tanda')))
                            : 0
                          )+
                          (Number.isFinite(Number(watch('arena2')) / Number(watch('tanda')))
                            ? (Number(watch('arena2')) / Number(watch('tanda')))
                            : 0
                          ) +
                          (Number.isFinite(Number(watch('piedra2')) / Number(watch('tanda')))
                            ? (Number(watch('piedra2')) / Number(watch('tanda')))
                            : 0
                          )
                        )
                      )
                    ) 
                      ? (
                        100 *
                        (
                          (Number.isFinite(Number(watch('piedra2')) / Number(watch('tanda')))
                            ? (Number(watch('piedra2')) / Number(watch('tanda')))
                            : 0
                          ) /
                          (
                            (Number.isFinite(Number(watch('arena')) / Number(watch('tanda')))
                            ? (Number(watch('arena')) / Number(watch('tanda')))
                            : 0
                          ) +
                          (Number.isFinite(Number(watch('piedra')) / Number(watch('tanda')))
                            ? (Number(watch('piedra')) / Number(watch('tanda')))
                            : 0
                          )+
                          (Number.isFinite(Number(watch('arena2')) / Number(watch('tanda')))
                            ? (Number(watch('arena2')) / Number(watch('tanda')))
                            : 0
                          ) +
                          (Number.isFinite(Number(watch('piedra2')) / Number(watch('tanda')))
                            ? (Number(watch('piedra2')) / Number(watch('tanda')))
                            : 0
                          )
                          )
                        )
                      ).toFixed(2) 
                      : '0.00'
                  }

                  </td>
                </tr>

                <tr
                  className={'bg-white'}
                >
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300  py-2 text-center">
                    Aditivo 1200 (Gr)
                  </td>
                  <td className={'border border-gray-300 min-w-[150px] w-40 text-center h-10'}>
                    <KInputTable type='text' label="" placeholder='' reactHookForm={{ ...register('n1200'), defaultValue: '' }} />
                  </td>
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300 px-4 py-2 text-center">
                  {
  Number.isFinite(Number(watch('n1200')) / Number(watch('tanda')))
    ? (Number(watch('n1200')) / Number(watch('tanda')) || 0).toFixed(2)
    : '0.00'
}

                  </td>
                  <td className="border min-w-[150px] border-gray-300 px-4 py-2 text-center">
                    Aditivo 1200 (Gr)
                  </td>
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300 px-4 py-2 text-center">
                  {(
                    100 * (Number(watch('n1200')) / Number(watch('tanda')) || 0) /
                    (Number(watch('cemento')) / Number(watch('tanda')) || 1)
                  ).toFixed(2)}
                  </td>
                </tr>
                <tr
                  className={'bg-white'}
                >
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300  py-2 text-center">
                  Aditivo RF 25 (Gr)
                  </td>
                  <td className={'border border-gray-300 min-w-[150px] w-40 text-center h-10'}>
                    <KInputTable type='text' label="" placeholder='' reactHookForm={{ ...register('rf25'), defaultValue: '' }} />
                  </td>
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300 px-4 py-2 text-center">
                  {
  Number.isFinite(Number(watch('rf25')) / Number(watch('tanda')))
    ? (Number(watch('rf25')) / Number(watch('tanda')) || 0).toFixed(2)
    : '0.00'
}

                  </td>
                  <td className="border min-w-[150px] border-gray-300 px-4 py-2 text-center">
                    Aditivo RF 25
                  </td>
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300 px-4 py-2 text-center">
                  { 
  Number.isFinite(
    100 * (Number(watch('rf25')) / Number(watch('tanda'))) /
    (Number(watch('cemento')) / Number(watch('tanda')) || 1)
  )
    ? (
      100 * (Number(watch('rf25')) / Number(watch('tanda'))) /
      (Number(watch('cemento')) / Number(watch('tanda')) || 1)
    ).toFixed(2)
    : "0.00"
}

                  </td>
                </tr>
                <tr
                  className={'bg-white'}
                >
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300  py-2 text-center">
                    TANDA
                  </td>
                  <td className={'border border-gray-300 min-w-[150px] w-40 text-center h-10'}>
                    <KInputTable type='text' label="" placeholder='' reactHookForm={{ ...register('tanda'), defaultValue: '' }} />
                  </td>
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300 px-4 py-2 text-center">
                  { 
  (
    (Number.isFinite(Number(watch('cemento')) / Number(watch('tanda'))) ? (Number(watch('cemento')) / Number(watch('tanda')) || 0) : 0) +
    (Number.isFinite(Number(watch('agua')) / Number(watch('tanda'))) ? (Number(watch('agua')) / Number(watch('tanda')) || 0) : 0) +
    (Number.isFinite(Number(watch('arena')) / Number(watch('tanda'))) ? (Number(watch('arena')) / Number(watch('tanda')) || 0) : 0) +
    (Number.isFinite(Number(watch('arena2')) / Number(watch('tanda'))) ? (Number(watch('arena2')) / Number(watch('tanda')) || 0) : 0) +
    (Number.isFinite(Number(watch('piedra')) / Number(watch('tanda'))) ? (Number(watch('piedra')) / Number(watch('tanda')) || 0) : 0) +
    (Number.isFinite(Number(watch('piedra2')) / Number(watch('tanda'))) ? (Number(watch('piedra2')) / Number(watch('tanda')) || 0) : 0) +
    (Number.isFinite(Number(watch('n1200')) / Number(watch('tanda'))) ? (Number(watch('n1200')) / Number(watch('tanda')) || 0) : 0) +
    (Number.isFinite(Number(watch('rf25')) / Number(watch('tanda'))) ? (Number(watch('rf25')) / Number(watch('tanda')) || 0) : 0)
  ).toFixed(2)
}

                  </td>
                  <td className="border min-w-[150px] border-gray-300 px-4 py-2 text-center">
                    TOTAL
                  </td>
                  <td className="border min-w-[150px] max-w-[239px] border-gray-300 px-4 py-2 text-center">
                  {(
  (100 * (Number(watch('n1200')) / Number(watch('tanda')) || 0) / 
  (Number(watch('cemento')) / Number(watch('tanda')) || 1)) +
  (100 * (Number(watch('rf25')) / Number(watch('tanda')) || 0) /
  (Number(watch('cemento')) / Number(watch('tanda')) || 1))
).toFixed(2)}
                  </td>
                </tr>
            </tbody>
          </table>
        </div>

      </div>

      <br/>
      <br/>
      <h1 className="text-2xl md:text-4xl  mt-10 font-bold  text-gray-800 text-center">
      Desarrollo de Mantención
      </h1>
      <br/>
      <div className="border mx-auto rounded-lg max-w-7xl overflow-hidden shadow-md overflow-x-auto">
        <div className="bg-gray-200 text-center p-2 font-bold">
          <div>Mantención del Slump</div>
          {/* <div className="flex justify-between px-4">
            <span>Inicio = 0:00</span>
            <span>Término = 12:00 AM</span>
          </div> */}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-300">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Tiempo</th>
                <th className="border border-gray-300 px-4 py-2">Hora</th>
                <th className="border border-gray-300 px-4 py-2 w-80" colSpan={1}>Slump</th>
                <th className="border border-gray-300 px-4 py-2">TC</th>
                <th className="border border-gray-300 px-4 py-2">TA</th>
                <th className="border border-gray-300 px-4 py-2">Operador</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}
                >
                  <td className="border border-gray-300  py-2 text-center">
                    {row.tiempo}
                  </td>
                  <td className="border border-gray-300 min-w-[80px] mx-4 px-2 py-2 text-center">
                    {row.hora}
                  </td>
                  <td className={'border border-gray-300 min-w-[150px] text-center h-10'}>
                    <td
                      className={'w-40 md:w-60 text-center h-10'}
                    >
                      <KInputTable type='text' label="" placeholder='' reactHookForm={{ ...register(`slump${index}`), defaultValue: '' }} />
                    </td>
                    <td className=" w-10 md:w-20 text-center h-10">
                      Pulg.
                    </td>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {row.tc}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {row.ta}
                  </td>
                  <td className="border min-w-[200px]  border-gray-300 px-4 py-2 text-center">
                    {row.operador}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
      <div className="max-w-5xl px-5 mt-5 mx-auto flex flex-col sm:flex-row gap-5">
        <div className="w-full sm:w-2/4 ">
          <h2 className="text-xl font-bold">Comentarios:</h2>
          <KInputArea type='text' label="" placeholder=''
          reactHookForm={{ ...register('comment'), defaultValue: '' }} />
        </div>
        <div className="w-full sm:w-1/4 flex justify-center align-middle items-center">
          <KInputUpload
            label="Subir evidencia 1"
            accept="image/*"
            onFileChange={(f) => { (f != null) && setFile(f) }}
          />
        </div>
        <div className="w-full sm:w-1/4 flex justify-center align-middle items-center">
          <KInputUpload
            label="Subir evidencia 2"
            accept="image/*"
            onFileChange={(f) => { (f != null) && setFile1(f) }}
          />
        </div>
      </div>
      <button
        type="submit"
        className="px-6 py-3 bg-blue-500 text-white font-bold text-lg flex justify-center mx-auto mt-12 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
      >
        Generar Reporte
      </button>
      </form>
    </div>
    </div>
  )
}
