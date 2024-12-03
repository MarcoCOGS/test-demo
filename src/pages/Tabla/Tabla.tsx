import { useForm } from 'react-hook-form'
import { KInputTable } from 'src/components/KInput/KInputTable'
import jsPDF from 'jspdf'
import autoTable, { HAlignType, RowInput } from 'jspdf-autotable'
import { useEffect, useState } from 'react'
import logo from '../../assets/logo.jpg'
import { KInputArea } from 'src/components/KInput/KInputArea'
import { KInputUpload } from 'src/components/KInput/KInputUpload'
import Chart, { ChartTypeRegistry } from 'chart.js/auto'

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

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (formData: any) => {
    generatePDF(formData)
  }

  const readFileAsBase64 = async (file: File): Promise<string> => {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => { resolve(reader.result as string) }
      reader.onerror = (error) => { reject(error) }
      reader.readAsDataURL(file)
    })
  }

  const generatePDF = async (formData: any) => {
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

    const commentario = formData.comment
    const maxWidth = pageWidth - 20
    const fontSize = 10
    doc.setFontSize(fontSize)

    const lines = doc.splitTextToSize(commentario, maxWidth)
    const lineHeight = fontSize * 0.60 // Más compacto
    let currentY = (doc as any).lastAutoTable?.finalY + 10 || 10

    lines.forEach((line: string) => {
      if (currentY + lineHeight > pageHeight - 20) {
        doc.addPage()
        currentY = 10
      }
      doc.text(line, 10, currentY)
      currentY += lineHeight
    })

    doc.setFontSize(16)
    const title1 = 'PANEL FOTOGRÁFICO'
    const title1Width = doc.getTextWidth(title1)

    if (currentY + 20 > pageHeight) {
      doc.addPage()
      currentY = 10
    }

    doc.text(title1, (pageWidth - title1Width) / 2, currentY + 10)
    currentY += 20

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
        let height = originalHeight

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

        doc.addImage(imgData, 'JPEG', 10, currentY, width, height)
      } catch (error) {
        console.error('Error al cargar la imagen:', error)
      }
    }

    const pdfBlob = doc.output('blob')
    const pdfUrl = URL.createObjectURL(pdfBlob)
    window.open(pdfUrl, '_blank')
  }

  useEffect(() => {
    console.log(file)
  }, [file])

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

      <h1 className="text-2xl md:text-4xl  mt-10 font-bold  text-gray-800 text-center">
      Desarrollo de Mantención
    </h1>

    <div className="p-1 md:p-4 flex w-screen  justify-center px-1 md:px-8 ">
    <form action="" onSubmit={handleSubmit(onSubmit)} autoComplete="false" className="w-full">
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
                  <td className={'border border-gray-300 min-w-[150px] md:w-80 text-center h-10'}>
                    <td
                      className={'  w-40 md:w-60 text-center h-10'}
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
      <div className="max-w-4xl px-5 mt-5 mx-auto flex flex-col sm:flex-row gap-5">
        <div className="w-full sm:w-3/4 ">
          <h2 className="text-xl font-bold">Comentarios:</h2>
          <KInputArea type='text' label="" placeholder='' reactHookForm={{ ...register('comment'), defaultValue: '' }} />
        </div>
        <div className="w-full sm:w-1/4 flex justify-center align-middle items-center">
          <KInputUpload
            label="Subir evidencia"
            accept="image/*"
            onFileChange={(f) => { (f != null) && setFile(f) }}
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
