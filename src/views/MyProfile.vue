<template>
  <div class="text-center">
    <v-btn color="primary" @click="openPdf" variant="outlined" class="my-4"
      >Xem trên PDF Viewer</v-btn
    >
    <div :style="{ height: `${fileHeight}px` }">
      <div id="pdf-container"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileHeight: 0
    }
  },
  methods: {
    openPdf() {
      const pdfUrl = './cv.pdf';
      window.open(pdfUrl, '_blank');
    },
  },
  mounted() {
    // Đường dẫn đến file PDF
    const pdfUrl = './cv.pdf'

    // Tải và hiển thị PDF
    pdfjsLib.getDocument(pdfUrl).promise.then((pdfDoc) => {
      const numPages = pdfDoc.numPages
      const pdfContainer = document.getElementById('pdf-container')

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        pdfDoc.getPage(pageNum).then((page) => {
          const canvas = document.createElement('canvas')
          pdfContainer.appendChild(canvas)

          const context = canvas.getContext('2d')
          const viewport = page.getViewport({ scale: 1.5 })

          canvas.width = viewport.width
          canvas.height = viewport.height

          // Tùy chỉnh màu sắc của canvas hoặc thêm CSS vào canvas
          context.fillStyle = '#f0f0f0' // Màu nền
          context.fillRect(0, 0, canvas.width, canvas.height)

          // Hiển thị nội dung PDF lên canvas
          page.render({ canvasContext: context, viewport: viewport })
        })
      }
      setTimeout(() => {
        this.fileHeight = pdfContainer.clientHeight
      }, 1)
    })
  }
}
</script>
